import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { scoreMetrics } from '../utils/scoreMetrics.js';

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

// POST /results/:profileId - Calculate and store a consenting member's result.
router.post('/:profileId', async (req, res) => {
  try {
    const userId = getOptionalUserId(req);
    const profile = await db.getProfileById(req.params.profileId, userId);
    if (!profile) {
      return res.status(404).json({ error: 'Assessment profile not found.' });
    }

    const { changeLog } = req.body;
    const calculation = scoreMetrics(profile.fitMao_report_data, profile.parq_answers);
    if (!calculation.mainFocus) {
      return res.status(422).json({ error: calculation.limitation });
    }

    const saved = await db.saveResult({
      profile_id: profile.id,
      scored_metrics: calculation.scoredMetrics,
      main_focus: calculation.mainFocus,
      top_priorities: calculation.topPriorities,
      change_log: changeLog || []
    });

    return res.json({
      message: 'Results calculated and stored successfully.',
      result: {
        ...saved,
        otherPriorities: calculation.otherPriorities,
        becauseYouToldUs: calculation.becauseYouToldUs
      },
      profile,
      isGuest: !userId
    });
  } catch (err) {
    console.error('[Results Calculate Error]:', err);
    return res.status(500).json({ error: 'Failed to calculate results.' });
  }
});

// GET /results/:profileId - Fetch a member's saved result without rewriting its original ranking.
router.get('/:profileId', async (req, res) => {
  try {
    const userId = getOptionalUserId(req);
    const profile = await db.getProfileById(req.params.profileId, userId);
    if (!profile) {
      return res.status(404).json({ error: 'Assessment profile not found.' });
    }

    const storedResult = await db.getResultByProfileId(profile.id);

    // Rebuild the plain-language explanation from the confirmed assessment and survey.
    const calculation = scoreMetrics(profile.fitMao_report_data, profile.parq_answers);

    return res.json({
      result: {
        ...(storedResult || {
          profile_id: profile.id,
          scored_metrics: calculation.scoredMetrics,
          main_focus: calculation.mainFocus,
          top_priorities: calculation.topPriorities,
          change_log: []
        }),
        savedRuleVersion: storedResult?.main_focus?.ruleVersion || (storedResult ? 'legacy-or-unversioned' : null),
        otherPriorities: calculation.otherPriorities,
        becauseYouToldUs: calculation.becauseYouToldUs
      },
      profile,
      isGuest: !userId
    });
  } catch (err) {
    console.error('[Results Fetch Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch assessment results.' });
  }
});

export default router;
