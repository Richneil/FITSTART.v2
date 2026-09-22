// FitStart Simple Additive Weighting (SAW) Priority Engine
// Ranks confirmed FitMao body-composition metrics using normalized multi-criteria relevance.
//
// SAW formula (all criteria are benefit criteria):
//   r_ij = x_ij / max_i(x_ij)
//   V_i  = sum_j(w_j * r_ij)
//
// The metric with the highest V_i becomes Main Focus; the next two become Top Priorities.
// Criteria/weights are intentionally centralized so thesis validation can revise them without
// changing the scoring algorithm. Current values are prototype weights and should be validated
// through the study's literature/expert-validation method before being treated as final research weights.

export const SAW_CRITERIA = [
  { id: 'primaryGoal', label: 'Primary Goal', weight: 0.25 },
  { id: 'secondaryGoal', label: 'Secondary Goal', weight: 0.05 },
  { id: 'activityStyle', label: 'Activity Style', weight: 0.15 },
  { id: 'trainingAvailability', label: 'Training Availability', weight: 0.10 },
  { id: 'dailyLifestyle', label: 'Daily Lifestyle', weight: 0.05 },
  { id: 'nutritionPattern', label: 'Nutrition Pattern', weight: 0.10 },
  { id: 'hydration', label: 'Hydration', weight: 0.05 },
  { id: 'safetyHistory', label: 'Safety & History', weight: 0.05 },
  { id: 'fitMaoMeasurement', label: 'FitMao Measurement', weight: 0.20 }
];

const clampRating = (value) => Math.max(0, Math.min(4, Number(value) || 0));
const round = (value, places = 4) => Number(Number(value || 0).toFixed(places));

export function scoreMetrics(fitMaoData = {}, parqAnswers = {}) {
  const parseMeasurement = (value) => {
    if (value === undefined || value === null) return null;
    const parsed = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const hasValue = (value) => value !== undefined && value !== null
    && !/^(?:not shown|not available|n\/a|—|-)$/i.test(String(value).trim())
    && String(value).trim() !== '';

  const withUnit = (value, unit) => {
    if (!hasValue(value)) return 'Not available';
    return String(value).toLowerCase().includes(unit.toLowerCase()) ? String(value) : `${value} ${unit}`;
  };

  const rawBodyFat = parseMeasurement(fitMaoData.bodyFatPercentage);
  const rawVisceral = parseMeasurement(fitMaoData.visceralFat);
  const rawMuscle = parseMeasurement(fitMaoData.skeletalMuscleMass);

  const METRICS_DB = {
    bodyFat: {
      id: 'bodyFat',
      key: 'bodyFatPercentage',
      title: 'Body Fat %',
      value: rawBodyFat !== null ? `${rawBodyFat.toFixed(1)}%` : 'Not available',
      available: rawBodyFat !== null,
      desc: 'Shows how much of your total body weight is estimated to come from fat.'
    },
    muscleMass: {
      id: 'muscleMass',
      key: 'skeletalMuscleMass',
      title: 'Skeletal Muscle Mass',
      value: rawMuscle !== null ? `${rawMuscle.toFixed(1)} kg` : 'Not available',
      available: rawMuscle !== null,
      desc: 'Helps you follow changes in the muscles used for movement and strength.'
    },
    visceralFat: {
      id: 'visceralFat',
      key: 'visceralFat',
      title: 'Visceral Fat Level',
      value: rawVisceral !== null ? `${Number.isInteger(rawVisceral) ? rawVisceral : rawVisceral.toFixed(1)}` : 'Not available',
      available: rawVisceral !== null,
      desc: 'A device-estimated level representing fat stored around the abdominal organs.'
    },
    bodyWater: {
      id: 'bodyWater',
      key: 'bodyWater',
      title: 'Body Water',
      value: withUnit(fitMaoData.bodyWater, 'L'),
      available: hasValue(fitMaoData.bodyWater),
      desc: 'Shows FitMao’s estimate of the total amount of water in your body.'
    },
    bmr: {
      id: 'bmr',
      key: 'bmr',
      title: 'Basal Metabolic Rate',
      value: withUnit(fitMaoData.bmr, 'kcal'),
      available: hasValue(fitMaoData.bmr),
      desc: 'An estimate of the energy your body uses each day while at rest.'
    },
    bmi: {
      id: 'bmi',
      key: 'bmi',
      title: 'BMI',
      value: hasValue(fitMaoData.bmi) ? String(fitMaoData.bmi) : 'Not available',
      available: hasValue(fitMaoData.bmi),
      desc: 'A general weight-to-height screening value that is best read with other measurements.'
    }
  };

  let results = Object.values(METRICS_DB)
    .filter((metric) => metric.available)
    .map((metric, index) => ({
      ...metric,
      scoringMethod: 'SAW',
      baseScore: 0,
      currentScore: 0,
      finalScore: 0,
      sawPreference: 0,
      tieBreakIndex: index,
      ratings: Object.fromEntries(SAW_CRITERIA.map((criterion) => [criterion.id, 0])),
      ratingReasons: Object.fromEntries(SAW_CRITERIA.map((criterion) => [criterion.id, []])),
      steps: [],
      contributingFactors: [],
      reasons: []
    }));

  const getMetric = (id) => results.find((metric) => metric.id === id);

  // A SAW criterion is represented by ONE 0–4 rating for each alternative. If multiple
  // inputs affect the same criterion, keep the strongest supported relevance rating rather
  // than accumulating raw points. This is the key difference from the old scoring model.
  const setRating = (metricId, criterionId, rating, reason) => {
    const metric = getMetric(metricId);
    if (!metric) return;
    const nextRating = clampRating(rating);
    metric.ratings[criterionId] = Math.max(metric.ratings[criterionId] || 0, nextRating);
    if (reason && !metric.ratingReasons[criterionId].includes(reason)) {
      metric.ratingReasons[criterionId].push(reason);
    }
    if (reason && !metric.reasons.includes(reason)) metric.reasons.push(reason);
  };

  const primaryGoal = parqAnswers.primaryGoal
    || parqAnswers.goal
    || (Array.isArray(parqAnswers.goals) ? parqAnswers.goals[0] : 'fat_loss');
  const secondaryGoal = parqAnswers.secondaryGoal
    || (Array.isArray(parqAnswers.goals) && parqAnswers.goals[1] ? parqAnswers.goals[1] : null);
  const activity = parqAnswers.activityCategory
    || (Array.isArray(parqAnswers.activityCategories) ? parqAnswers.activityCategories[0] : parqAnswers.activity)
    || 'strength';

  const applyGoalRatings = (goal, criterionId, prefix) => {
    if (goal === 'fat_loss') {
      setRating('bodyFat', criterionId, 4, `${prefix}: body-fat reduction and recomposition`);
      setRating('visceralFat', criterionId, 3, `${prefix}: visceral-fat context for a fat-reduction goal`);
      setRating('bmr', criterionId, 2, `${prefix}: resting-energy context for a fat-reduction goal`);
    } else if (goal === 'muscle_gain') {
      setRating('muscleMass', criterionId, 4, `${prefix}: building muscle and functional strength`);
      setRating('bodyWater', criterionId, 3, `${prefix}: hydration context for muscle-focused progress`);
      setRating('bmr', criterionId, 2, `${prefix}: resting-energy context for muscle-focused progress`);
    } else if (goal === 'health_longevity' || goal === 'health') {
      setRating('visceralFat', criterionId, 4, `${prefix}: long-term cardiovascular and internal wellness`);
      setRating('bmi', criterionId, 2, `${prefix}: general height-and-weight screening context`);
      setRating('bodyFat', criterionId, 2, `${prefix}: overall body-composition context`);
    } else if (goal === 'athletic_performance' || goal === 'performance') {
      setRating('muscleMass', criterionId, 4, `${prefix}: athletic performance and muscular capacity`);
      setRating('bodyWater', criterionId, 3, `${prefix}: hydration context for performance and recovery`);
    } else if (goal === 'posture_mobility') {
      setRating('muscleMass', criterionId, 3, `${prefix}: postural stability and functional muscle context`);
      setRating('bodyWater', criterionId, 3, `${prefix}: hydration context for mobility and tissue function`);
    }
  };

  // C1/C2 — Goal relevance
  applyGoalRatings(primaryGoal, 'primaryGoal', 'Primary goal relevance');
  if (secondaryGoal && secondaryGoal !== 'none' && secondaryGoal !== primaryGoal) {
    applyGoalRatings(secondaryGoal, 'secondaryGoal', 'Secondary goal relevance');
  }

  // C3 — Activity style relevance
  if (activity === 'strength') {
    setRating('muscleMass', 'activityStyle', 3, 'Resistance and strength activity emphasizes skeletal muscle');
    setRating('bmr', 'activityStyle', 1, 'BMR provides supporting energy-use context for strength activity');
  } else if (activity === 'aerobic') {
    setRating('bodyFat', 'activityStyle', 3, 'Body Fat is relevant to body-composition change alongside aerobic activity');
    setRating('visceralFat', 'activityStyle', 2, 'Visceral Fat provides supporting body-composition context for aerobic activity');
  } else if (activity === 'cardio_conditioning') {
    setRating('visceralFat', 'activityStyle', 3, 'Cardio-conditioning goals make visceral-fat trends relevant to monitor');
    setRating('bodyWater', 'activityStyle', 2, 'Body Water provides hydration context for endurance activity');
  } else if (activity === 'athletic_agility' || activity === 'neuromotor') {
    setRating('muscleMass', 'activityStyle', 2, 'Agility and sports drills depend on functional muscle capacity');
    setRating('bodyWater', 'activityStyle', 2, 'High-intensity athletic activity makes hydration context relevant');
  } else if (activity === 'mobility_flexibility' || activity === 'flexibility') {
    setRating('bodyWater', 'activityStyle', 2, 'Mobility work makes hydration and tissue-function context relevant');
    setRating('muscleMass', 'activityStyle', 1, 'Postural and corrective work uses supporting muscle groups');
  }

  // C4 — Training availability relevance
  if (parqAnswers.availability === '1-2') {
    setRating('bodyFat', 'trainingAvailability', 2, 'Limited weekly training availability increases the relevance of body-composition monitoring');
    setRating('bmr', 'trainingAvailability', 2, 'Limited weekly training availability makes resting-energy context useful');
  } else if (parqAnswers.availability === '5+') {
    setRating('bodyWater', 'trainingAvailability', 2, 'Frequent training makes hydration and recovery context more relevant');
  }

  // C5 — Daily lifestyle relevance
  if (parqAnswers.dailyStyle === 'desk') {
    setRating('visceralFat', 'dailyLifestyle', 2, 'A mostly seated daily routine makes visceral-fat trends useful to monitor');
  }

  // C6 — Nutrition-pattern relevance
  if (parqAnswers.nutritionPattern === 'irregular') {
    setRating('bmr', 'nutritionPattern', 3, 'An irregular eating pattern makes resting-energy context useful');
    setRating('visceralFat', 'nutritionPattern', 1, 'Visceral Fat provides supporting context for the reported eating pattern');
  } else if (parqAnswers.nutritionPattern === 'low_calorie') {
    setRating('bmr', 'nutritionPattern', 3, 'A calorie-restricted pattern makes resting-energy context useful');
    setRating('muscleMass', 'nutritionPattern', 2, 'Muscle Mass is useful to monitor while body weight is changing');
  } else if (parqAnswers.nutritionPattern === 'dining_out') {
    setRating('bodyFat', 'nutritionPattern', 2, 'Frequent dining out makes body-composition monitoring relevant');
    setRating('visceralFat', 'nutritionPattern', 2, 'Visceral Fat adds supporting context for the reported eating pattern');
  } else if (parqAnswers.nutritionPattern === 'high_protein') {
    setRating('muscleMass', 'nutritionPattern', 2, 'A protein-conscious eating pattern makes Muscle Mass relevant to monitor');
  }

  // C7 — Hydration relevance
  if (parqAnswers.waterIntake === 'low') {
    setRating('bodyWater', 'hydration', 3, 'Reported low fluid intake makes Body Water particularly relevant');
  }

  // C8 — Safety/history relevance
  if (parqAnswers.barriers === 'injury' || parqAnswers.hasBoneJointProblem === 'yes') {
    setRating('muscleMass', 'safetyHistory', 2, 'Joint sensitivity or injury history makes functional muscle context useful for professional review');
  }

  // C9 — FitMao measurement relevance.
  // Every confirmed measurement receives rating 1 (present/usable). The two condition rules below
  // preserve the prototype's existing FitMao interpretation thresholds rather than inventing new ones.
  results.forEach((metric) => {
    setRating(metric.id, 'fitMaoMeasurement', 1, 'A confirmed FitMao measurement is available for this metric');
  });
  if (rawVisceral !== null && rawVisceral >= 10) {
    setRating('visceralFat', 'fitMaoMeasurement', 3, `Measured Visceral Fat Level (${rawVisceral}) meets the prototype's existing attention threshold`);
  }
  if (rawBodyFat !== null && rawBodyFat >= 25.0) {
    setRating('bodyFat', 'fitMaoMeasurement', 2, `Measured Body Fat (${rawBodyFat.toFixed(1)}%) meets the prototype's existing attention threshold`);
  }

  // SAW normalization: r_ij = x_ij / max_i(x_ij), because every criterion is a benefit
  // criterion where a larger rating means stronger relevance for prioritization.
  const criterionMax = Object.fromEntries(SAW_CRITERIA.map((criterion) => {
    const max = Math.max(0, ...results.map((metric) => metric.ratings[criterion.id] || 0));
    return [criterion.id, max];
  }));

  results.forEach((metric) => {
    let runningTotal = 0;

    metric.steps = SAW_CRITERIA.map((criterion) => {
      const rawRating = metric.ratings[criterion.id] || 0;
      const maxRating = criterionMax[criterion.id] || 0;
      const normalizedRating = maxRating > 0 ? rawRating / maxRating : 0;
      const contribution = criterion.weight * normalizedRating;
      runningTotal += contribution;

      const reasons = metric.ratingReasons[criterion.id] || [];
      const reason = reasons[0]
        || (rawRating > 0
          ? `${criterion.label} contributes to this metric's relevance.`
          : `${criterion.label} did not add relevance for this metric.`);

      return {
        category: criterion.label,
        criterionId: criterion.id,
        rawRating,
        maxRating,
        normalizedRating: round(normalizedRating),
        criterionWeight: criterion.weight,
        contribution: round(contribution),
        delta: `+${round(contribution)}`,
        deltaVal: round(contribution),
        reason,
        subtotal: round(runningTotal)
      };
    });

    metric.sawPreference = round(runningTotal);
    metric.currentScore = metric.sawPreference;
    metric.finalScore = metric.sawPreference;
    metric.contributingFactors = metric.steps
      .filter((step) => step.rawRating > 0)
      .map((step) => ({
        category: step.category,
        criterionId: step.criterionId,
        weight: step.criterionWeight,
        rating: step.rawRating,
        normalizedRating: step.normalizedRating,
        contribution: step.contribution,
        reason: step.reason
      }));
  });

  results.sort((a, b) => {
    const scoreDiff = b.finalScore - a.finalScore;
    if (Math.abs(scoreDiff) > 1e-9) return scoreDiff;
    return a.tieBreakIndex - b.tieBreakIndex;
  });

  const mainFocus = results[0] || null;
  const topPriorities = results.slice(1, 3);

  const userGoalLabel = primaryGoal === 'fat_loss' ? 'fat reduction & body recomposition'
    : primaryGoal === 'muscle_gain' ? 'muscle hypertrophy & strength'
    : primaryGoal === 'health_longevity' || primaryGoal === 'health' ? 'overall health & cardiovascular longevity'
    : primaryGoal === 'athletic_performance' || primaryGoal === 'performance' ? 'athletic conditioning & power'
    : primaryGoal === 'posture_mobility' ? 'posture correction & mobility' : 'fitness development';

  const userActLabel = activity === 'strength' ? 'resistance & strength training'
    : activity === 'aerobic' ? 'cardio & endurance training'
    : activity === 'cardio_conditioning' ? 'cardio conditioning'
    : activity === 'athletic_agility' ? 'athletic agility drills'
    : activity === 'mobility_flexibility' ? 'mobility and flexibility routines' : 'physical training';

  let becauseYouToldUs = mainFocus
    ? `FitStart applied Simple Additive Weighting to your confirmed FitMao measurements and assessment context. For ${userGoalLabel} with ${userActLabel}, ${mainFocus.title} received the highest normalized SAW preference score (${mainFocus.finalScore.toFixed(4)}), making it your Main Focus.`
    : 'FitStart could not rank the assessment because no supported FitMao measurements were available.';

  if (parqAnswers.otherActivity && String(parqAnswers.otherActivity).trim()) {
    becauseYouToldUs += `\n\n*(Note: You also mentioned "${parqAnswers.otherActivity.trim()}" — this free-text response is not assigned a SAW criterion rating and is left for professional review.)*`;
  }

  return {
    method: 'SAW',
    formula: 'V_i = Σ(w_j × r_ij), where r_ij = x_ij / max_i(x_ij)',
    criteria: SAW_CRITERIA,
    scoredMetrics: results,
    mainFocus,
    topPriorities,
    otherPriorities: results.slice(3),
    becauseYouToldUs
  };
}
