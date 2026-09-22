import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { scoreMetrics } from '../utils/scoreMetrics.js';
import { parqTemplate } from '../data/parqTemplate.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fitstart_thesis_super_secret_jwt_key_2026';

function getOptionalUserId(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id || null;
  } catch (_) {
    return null;
  }
}

// GET /assessments/parq-template - Return standardized PAR-Q structure
router.get('/parq-template', (req, res) => {
  return res.json(parqTemplate);
});

// POST /assessments - Create new assessment profile (supports both members and guests)
router.post('/', async (req, res) => {
  try {
    const { fitMao_report_data, parq_answers, assessed_date } = req.body;

    if (!fitMao_report_data || !parq_answers) {
      return res.status(400).json({ error: 'Both fitMao_report_data and parq_answers are required.' });
    }

    const userId = getOptionalUserId(req);

    const profile = await db.createProfile({
      user_id: userId,
      fitMao_report_data,
      parq_answers,
      assessed_date: assessed_date || new Date().toISOString()
    });

    return res.status(201).json({
      message: 'Assessment created successfully.',
      profile_id: profile.id,
      profile,
      isGuest: !userId
    });
  } catch (err) {
    console.error('[Assessment Create Error]:', err);
    return res.status(500).json({ error: 'Failed to create assessment profile.' });
  }
});

// GET /assessments - List all assessments for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const profiles = await db.getProfilesByUserId(req.user.id);
    return res.json({
      assessments: profiles
    });
  } catch (err) {
    console.error('[Assessment List Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch assessments.' });
  }
});

// GET /assessments/:id - Fetch specific assessment (supports both members and guests)
router.get('/:id', async (req, res) => {
  try {
    const userId = getOptionalUserId(req);
    const profile = await db.getProfileById(req.params.id, userId);
    if (!profile) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }
    return res.json({ profile });
  } catch (err) {
    console.error('[Assessment Fetch Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch assessment.' });
  }
});

// PUT /assessments/:id - Update PAR-Q answers
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { parq_answers, fitMao_report_data, changeLog } = req.body;
    const updated = await db.updateProfile(req.params.id, req.user.id, {
      parq_answers,
      fitMao_report_data
    });

    if (!updated) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    // Automatically recalculate and update results
    const results = scoreMetrics(updated.fitMao_report_data, updated.parq_answers);
    const savedResult = await db.saveResult({
      profile_id: updated.id,
      scored_metrics: results.scoredMetrics,
      main_focus: results.mainFocus,
      top_priorities: results.topPriorities,
      change_log: changeLog || []
    });

    return res.json({
      message: 'Assessment updated and results recalculated.',
      profile: updated,
      result: savedResult
    });
  } catch (err) {
    console.error('[Assessment Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update assessment.' });
  }
});

// DELETE /assessments/:id - Delete assessment
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteProfile(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }
    return res.json({ message: 'Assessment deleted successfully.' });
  } catch (err) {
    console.error('[Assessment Delete Error]:', err);
    return res.status(500).json({ error: 'Failed to delete assessment.' });
  }
});

export default router;
