import { Response } from 'express';
import { User } from '../models/User';
import { Preferences } from '../models/Preferences';
import { Education } from '../models/Education';
import { Documents } from '../models/Documents';
import { AuthRequest } from '../middleware/auth';

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const updateOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { step, data } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let result;

    switch (step) {
      case 2: // Preferences
        result = await Preferences.findOneAndUpdate(
          { userId },
          { userId, ...data },
          { new: true, upsert: true }
        );
        user.onboardingStep = Math.max(user.onboardingStep, 2);
        break;

      case 3: // Academic
        result = await Education.findOneAndUpdate(
          { userId },
          { userId, ...data },
          { new: true, upsert: true }
        );
        user.onboardingStep = Math.max(user.onboardingStep, 3);
        break;

      case 4: // Documents
        result = await Documents.findOneAndUpdate(
          { userId },
          { userId, ...data },
          { new: true, upsert: true }
        );
        user.onboardingStep = Math.max(user.onboardingStep, 4);
        break;

      case 5: // Finalize
        user.onboardingComplete = true;
        user.onboardingStep = 5;
        break;

      default:
        // Personal details (Step 1)
        if (data.phone) user.phone = data.phone;
        if (data.dob) user.dob = new Date(data.dob);
        if (data.nationality) user.nationality = data.nationality;
        if (data.name) user.name = data.name;
        break;
    }

    await user.save();

    res.json({
      message: 'Onboarding progress saved',
      step: user.onboardingStep,
      complete: user.onboardingComplete,
      result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * Returns a flat merged object for the current authenticated user.
 * Shape consumed by ProfileCard.tsx and the updated UserDashboard.
 */
export const getFullProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await buildUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/onboarding/profile — update the authenticated user's general profile fields.
 * Accepts a flat body with any mix of personal / preferences / education fields.
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Personal fields
    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.nationality !== undefined) user.nationality = data.nationality;
    if (data.dob !== undefined) user.dob = new Date(data.dob);
    await user.save();

    // Preferences fields
    if (data.domain !== undefined || data.preferredCountries !== undefined || data.preferredUniversities !== undefined) {
      const prefUpdate: Record<string, any> = { userId };
      if (data.domain !== undefined) prefUpdate.domain = data.domain;
      if (data.preferredCountries !== undefined) prefUpdate.preferredCountries = data.preferredCountries;
      if (data.preferredUniversities !== undefined) prefUpdate.preferredUniversities = data.preferredUniversities;
      await Preferences.findOneAndUpdate({ userId }, prefUpdate, { new: true, upsert: true });
    }

    // Education fields
    const eduFields = ['degree', 'specialization', 'college', 'cgpa', 'backlogs', 'testScores'];
    const eduUpdate: Record<string, any> = { userId };
    let hasEduUpdate = false;
    for (const f of eduFields) {
      if (data[f] !== undefined) {
        eduUpdate[f] = data[f];
        hasEduUpdate = true;
      }
    }
    if (hasEduUpdate) {
      await Education.findOneAndUpdate({ userId }, eduUpdate, { new: true, upsert: true });
    }

    const updatedProfile = await buildUserProfile(userId);
    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('name email phone nationality role onboardingStep onboardingComplete subscriptionStatus createdAt')
      .lean();

    const userIds = users.map((u) => u._id);

    const [allPrefs, allEdus] = await Promise.all([
      Preferences.find({ userId: { $in: userIds } }).lean(),
      Education.find({ userId: { $in: userIds } }).lean(),
    ]);

    const prefsMap = Object.fromEntries(allPrefs.map((p) => [p.userId.toString(), p]));
    const edusMap = Object.fromEntries(allEdus.map((e) => [e.userId.toString(), e]));

    const enriched = users.map((u) => {
      const id = u._id.toString();
      return {
        ...u,
        preferences: prefsMap[id] || null,
        education: edusMap[id] || null,
      };
    });

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const profile = await buildUserProfile(id);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function buildUserProfile(userId: string) {
  const user = await User.findById(userId).select('-passwordHash').lean();
  if (!user) return null;

  const [preferences, education, documents] = await Promise.all([
    Preferences.findOne({ userId }).lean(),
    Education.findOne({ userId }).lean(),
    Documents.findOne({ userId }).lean(),
  ]);

  // Return a flat merged object (what ProfileCard.tsx expects)
  return {
    // Personal
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    nationality: user.nationality,
    role: user.role,
    onboardingStep: user.onboardingStep,
    onboardingComplete: user.onboardingComplete,
    subscriptionStatus: user.subscriptionStatus,
    createdAt: user.createdAt,

    // Preferences
    domain: preferences?.domain,
    preferredCountries: preferences?.preferredCountries ?? [],
    preferredUniversities: preferences?.preferredUniversities ?? [],

    // Education
    ugDegree: education?.degree,
    specialization: education?.specialization,
    college: education?.college,
    cgpa: education?.cgpa,
    backlogs: education?.backlogs ?? 0,
    testScores: education?.testScores ?? {},

    // Documents
    resumeURL: documents?.resumeURL,
    transcriptURL: documents?.transcriptURL,
    sopURL: documents?.sopURL,
  };
}
