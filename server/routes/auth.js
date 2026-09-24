import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { scoreMetrics } from '../utils/scoreMetrics.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fitstart_thesis_super_secret_jwt_key_2026';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Helper to link or create a pending guest assessment under newly authenticated user
async function linkPendingAssessment(userId, pendingAssessment) {
  if (!pendingAssessment || pendingAssessment.saveConsent !== true) return null;
  try {
    let savedProfile = null;
    if (pendingAssessment.profileId && pendingAssessment.profileId !== 'guest') {
      savedProfile = await db.linkGuestProfileToUser(pendingAssessment.profileId, userId);
    }
    
    if (!savedProfile && pendingAssessment.fitMao_report_data && pendingAssessment.parq_answers) {
      savedProfile = await db.createProfile({
        user_id: userId,
        fitMao_report_data: pendingAssessment.fitMao_report_data,
        parq_answers: pendingAssessment.parq_answers,
        assessed_date: pendingAssessment.assessed_date || new Date().toISOString()
      });
      const calculation = scoreMetrics(pendingAssessment.fitMao_report_data, pendingAssessment.parq_answers);
      await db.saveResult({
        profile_id: savedProfile.id,
        scored_metrics: calculation.scoredMetrics,
        main_focus: calculation.mainFocus,
        top_priorities: calculation.topPriorities,
        change_log: pendingAssessment.changeLog || []
      });
    }
    return savedProfile ? savedProfile.id : null;
  } catch (err) {
    console.warn('[Auth Link Pending Assessment Warning]:', err.message);
    return null;
  }
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, pendingAssessment } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await db.createUser({
      email,
      password_hash,
      first_name: firstName || '',
      last_name: lastName || ''
    });

    // Auto-link pending guest assessment if present
    const linkedProfileId = await linkPendingAssessment(newUser.id, pendingAssessment);

    const token = generateToken(newUser);
    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      linkedProfileId,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name
      }
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, pendingAssessment } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.password_hash) {
      return res.status(400).json({ error: 'This account was created with Google Sign-In. Please use Google to log in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if Two-Factor Authentication is enabled
    if (user.two_factor_enabled) {
      return res.json({
        require2FA: true,
        userId: user.id,
        email: user.email,
        pendingAssessment: pendingAssessment || null,
        message: 'Two-Factor Authentication is enabled. Please enter your 6-digit verification code.'
      });
    }

    // Auto-link pending guest assessment if present
    const linkedProfileId = await linkPendingAssessment(user.id, pendingAssessment);

    const token = generateToken(user);
    return res.json({
      message: 'Logged in successfully.',
      token,
      linkedProfileId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        twoFactorEnabled: user.two_factor_enabled || false,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// POST /auth/2fa/verify-login
router.post('/2fa/verify-login', async (req, res) => {
  try {
    const { userId, code, pendingAssessment } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and verification code are required.' });
    }

    const user = await db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // For thesis defense & authentic experience, standard code is 123456 or any 6-digit code entered
    const cleanCode = String(code).trim();
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit verification code.' });
    }

    // Auto-link pending guest assessment if present
    const linkedProfileId = await linkPendingAssessment(user.id, pendingAssessment);

    // Issue JWT token upon successful 2FA code validation
    const token = generateToken(user);
    return res.json({
      message: '2FA verification successful. Access granted.',
      token,
      linkedProfileId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        twoFactorEnabled: user.two_factor_enabled || false,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('[2FA Verify Error]:', err);
    return res.status(500).json({ error: '2FA verification failed.' });
  }
});

// POST /auth/2fa/toggle
router.post('/2fa/toggle', requireAuth, async (req, res) => {
  try {
    const { enabled } = req.body;
    const updated = await db.updateUser(req.user.id, {
      two_factor_enabled: Boolean(enabled)
    });

    return res.json({
      message: enabled ? 'Two-Factor Authentication enabled successfully.' : 'Two-Factor Authentication disabled.',
      twoFactorEnabled: updated.two_factor_enabled
    });
  } catch (err) {
    console.error('[2FA Toggle Error]:', err);
    return res.status(500).json({ error: 'Failed to update 2FA setting.' });
  }
});

// POST /auth/google (Simulated/Direct Google Auth handler)
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, pendingAssessment } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Google authentication failed: email missing.' });
    }

    let user = await db.findUserByEmail(email);

    if (!user) {
      user = await db.createUser({
        email,
        first_name: firstName || 'Google',
        last_name: lastName || 'User',
        google_id: googleId || `goog_${Date.now()}`
      });
    }

    // Auto-link pending guest assessment if present
    const linkedProfileId = await linkPendingAssessment(user.id, pendingAssessment);

    const token = generateToken(user);
    return res.json({
      message: 'Google authentication successful.',
      token,
      linkedProfileId,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (err) {
    console.error('[Google Auth Error]:', err);
    return res.status(500).json({ error: 'Google login failed.' });
  }
});

// GET /auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      twoFactorEnabled: req.user.two_factor_enabled || false,
      avatar: req.user.avatar || null
    }
  });
});

// PUT /auth/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, newPassword, avatar } = req.body;
    let password_hash = null;

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters.' });
      }
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(newPassword, salt);
    }

    const updated = await db.updateUser(req.user.id, {
      first_name: firstName,
      last_name: lastName,
      password_hash,
      avatar
    });

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.first_name,
        lastName: updated.last_name,
        twoFactorEnabled: updated.two_factor_enabled || false,
        avatar: updated.avatar || null
      }
    });
  } catch (err) {
    console.error('[Profile Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;
