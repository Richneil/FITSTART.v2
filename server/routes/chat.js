import express from 'express';
import { db } from '../config/database.js';
import { GLOSSARY_TERMS } from '../data/glossary.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, profileId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    let assessmentData = context?.assessmentData || {};
    let answers = context?.answers || {};
    let scoredMetrics = context?.scoredMetrics || [];

    // If profileId is passed, load directly from database for defense verification
    if (profileId) {
      try {
        const foundProfile = localDb.user_profiles?.find(p => p.id === Number(profileId));
        if (foundProfile) {
          assessmentData = foundProfile.fitMao_report_data || assessmentData;
          answers = foundProfile.parq_answers || answers;
        }
      } catch (err) {
        console.warn('[Chat] Could not load profile by id:', err.message);
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return explainable grounded fallback response
      const q = message.toLowerCase();
      let reply = '';

      if (q.includes('calculate') || q.includes('score') || q.includes('math') || q.includes('points')) {
        reply = `Based on your results, FitStart uses Simple Additive Weighting (SAW). Each available metric receives criterion ratings, those ratings are normalized against the other available metrics, multiplied by the criterion weights, and added to produce the final SAW preference score used for ranking.`;
      } else if (q.includes('diet') || q.includes('food') || q.includes('nutrition') || q.includes('meal')) {
        reply = `Based on your survey context, your daily eating patterns directly affect your Basal Metabolic Rate (BMR) and cellular hydration. For sustainable recomposition, avoid eating below your BMR to protect your muscle mass.`;
      } else if (q.includes('visceral')) {
        reply = `Based on your results, Visceral Fat indicates fat stored around vital abdominal organs. Healthy levels are 1–9. Aerobic exercise, whole food nutrition, and active movement are the most effective ways to lower it.`;
      } else if (q.includes('bmr')) {
        reply = `Based on your results, your BMR is the energy your body needs simply to stay alive at rest. You should never cut calories below your BMR floor.`;
      } else if (q.includes('muscle') || q.includes('skeletal')) {
        reply = `Based on your results, Skeletal Muscle Mass protects posture, joints, and resting metabolic rate. Resistance training and adequate dietary protein support its maintenance.`;
      } else {
        reply = `Based on your results, tracking body composition provides a more accurate view of fitness progress than scale weight alone. Speak with a KSYN Fitness coach to tailor exercise form!`;
      }

      return res.json({ reply });
    }

    // Call Anthropic API with dual grounding (Member Data + Glossary)
    const systemPrompt = `You are FitStart AI, an explainable decision-support assistant at KSYN Fitness Alabang.
You assist members in understanding their FitMao 3D Body Scanner results.

You are grounded in TWO specific data sources:
1. Member Personal Assessment & PAR-Q Data:
${JSON.stringify({ assessmentData, answers, scoredMetrics }, null, 2)}

2. Fitness Knowledge Base & Glossary:
${JSON.stringify(GLOSSARY_TERMS, null, 2)}

RULES:
- When answering from personal assessment data, preface with "Based on your results...".
- When answering general fitness definitions from the glossary, preface with "Generally speaking...".
- You are an educational decision-support tool, NOT a workout generator, nutritionist, or medical doctor.
- Keep responses concise (2-4 sentences max), friendly, and easy to understand.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "I was unable to analyze your query.";
    return res.json({ reply });

  } catch (err) {
    console.error('[Chat API Error]:', err);
    return res.status(500).json({ 
      reply: 'Based on your results, tracking body composition helps evaluate true recomposition. You can discuss personalized exercise form with a KSYN Fitness trainer.' 
    });
  }
});

export default router;
