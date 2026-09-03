import express from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { scoreMetrics } from '../utils/scoreMetrics.js';

const router = express.Router();

// POST /results/:profileId - Calculate and store results
router.post('/:profileId', requireAuth, async (req, res) => {
  try {
    const profile = await db.getProfileById(req.params.profileId, req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Assessment profile not found.' });
    }

    const { changeLog } = req.body;
    const calculation = scoreMetrics(profile.fitMao_report_data, profile.parq_answers);

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
        quickWins: calculation.quickWins,
        firstSteps: calculation.firstSteps,
        becauseYouToldUs: calculation.becauseYouToldUs
      },
      profile
    });
  } catch (err) {
    console.error('[Results Calculate Error]:', err);
    return res.status(500).json({ error: 'Failed to calculate results.' });
  }
});

// GET /results/:profileId - Fetch stored results or calculate if missing
router.get('/:profileId', requireAuth, async (req, res) => {
  try {
    const profile = await db.getProfileById(req.params.profileId, req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Assessment profile not found.' });
    }

    let storedResult = await db.getResultByProfileId(profile.id);

    // Calculate dynamic helper fields (quickWins, firstSteps, becauseYouToldUs)
    const calculation = scoreMetrics(profile.fitMao_report_data, profile.parq_answers);

    if (!storedResult) {
      storedResult = await db.saveResult({
        profile_id: profile.id,
        scored_metrics: calculation.scoredMetrics,
        main_focus: calculation.mainFocus,
        top_priorities: calculation.topPriorities,
        change_log: []
      });
    }

    return res.json({
      result: {
        ...storedResult,
        otherPriorities: calculation.otherPriorities,
        quickWins: calculation.quickWins,
        firstSteps: calculation.firstSteps,
        becauseYouToldUs: calculation.becauseYouToldUs
      },
      profile
    });
  } catch (err) {
    console.error('[Results Fetch Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch assessment results.' });
  }
});

export default router;
