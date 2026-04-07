import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Admin } from '../models/Admin';
import type { CookieOptions } from 'express';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
};

const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    // Cross-site cookies (Vercel frontend -> Render backend) require SameSite=None.
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, dob, gender, nationality } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      dob: dob ? new Date(dob) : undefined,
      gender,
      nationality,
      role: 'user',
      onboardingStep: 1,
    });

    await user.save();

    const token = generateToken(user.id, user.role);

<<<<<<< HEAD
    res.cookie('token', token, getAuthCookieOptions());
=======
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
>>>>>>> 37ef92fcf028864b95e7e9237984a4b7180b51b9

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingComplete: user.onboardingComplete,
        onboardingStep: user.onboardingStep,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    // 1. Check Admin first
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (isMatch) {
        const token = generateToken(admin.id, 'admin');
<<<<<<< HEAD
        res.cookie('token', token, getAuthCookieOptions());
=======
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        });
>>>>>>> 37ef92fcf028864b95e7e9237984a4b7180b51b9
        return res.json({
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin',
            onboardingComplete: true,
          },
        });
      }
    }

    // 2. Check User
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
<<<<<<< HEAD
    res.cookie('token', token, getAuthCookieOptions());
=======
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
>>>>>>> 37ef92fcf028864b95e7e9237984a4b7180b51b9

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingComplete: user.onboardingComplete,
        onboardingStep: user.onboardingStep,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  // Clear with the same attributes used when setting the cookie.
  res.clearCookie('token', getAuthCookieOptions());
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: any, res: Response) => {
  try {
    // Check Admin
    const admin = await Admin.findById(req.user.id).select('-passwordHash');
    if (admin) {
      return res.json({ ...admin.toObject(), id: admin.id });
    }

    // Check User
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ ...user.toObject(), id: user.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
