import { Request, Response } from 'express';
import { User } from '../models/User';
import { Preferences } from '../models/Preferences';
import { Education } from '../models/Education';
import { Documents } from '../models/Documents';

export const updateOnboarding = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
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
        // Personal details (Step 1 or subsequent cleanup)
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

export const getFullProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const preferences = await Preferences.findOne({ userId });
    const education = await Education.findOne({ userId });
    const documents = await Documents.findOne({ userId });

    res.json({
      user,
      preferences: preferences || {},
      education: education || {},
      documents: documents || {},
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
