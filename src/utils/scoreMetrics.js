// Shared Scoring & Relevance Engine for FitStart
// Computes deterministic, explainable priorities from FitMao body composition and PAR-Q context.
// Maintains a transparent explanation trace (contributing factors) for every scored metric.

export function scoreMetrics(fitMaoData = {}, parqAnswers = {}) {
  // Read only measurements that exist in the confirmed FitMao record.
  const rawBodyFat = fitMaoData.bodyFatPercentage !== undefined && fitMaoData.bodyFatPercentage !== null
    ? parseFloat(String(fitMaoData.bodyFatPercentage).replace(/[^0-9.]/g, ''))
    : null;

  const rawVisceral = fitMaoData.visceralFat !== undefined && fitMaoData.visceralFat !== null
    ? parseInt(String(fitMaoData.visceralFat).replace(/\D/g, ''), 10)
    : null;

  const rawMuscle = fitMaoData.skeletalMuscleMass !== undefined && fitMaoData.skeletalMuscleMass !== null
    ? parseFloat(String(fitMaoData.skeletalMuscleMass).replace(/[^0-9.]/g, ''))
    : null;

  const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';
  const withUnit = (value, unit) => {
    if (!hasValue(value)) return 'Not available';
    return String(value).toLowerCase().includes(unit.toLowerCase()) ? String(value) : `${value} ${unit}`;
  };

  const METRICS_DB = {
    bodyFat: { 
      id: 'bodyFat',
      key: 'bodyFatPercentage',
      title: 'Body Fat %', 
      value: rawBodyFat !== null ? `${rawBodyFat.toFixed(1)}%` : 'Not available',
      available: rawBodyFat !== null,
      baseScore: 3,
      desc: 'Shows how much of your total body weight is estimated to come from fat.'
    },
    muscleMass: { 
      id: 'muscleMass',
      key: 'skeletalMuscleMass',
      title: 'Skeletal Muscle Mass', 
      value: rawMuscle !== null ? `${rawMuscle.toFixed(1)} kg` : 'Not available',
      available: rawMuscle !== null,
      baseScore: 3,
      desc: 'Helps you follow changes in the muscles used for movement and strength.'
    },
    visceralFat: { 
      id: 'visceralFat',
      key: 'visceralFat',
      title: 'Visceral Fat', 
      value: rawVisceral !== null ? `Level ${rawVisceral}` : 'Not available',
      available: rawVisceral !== null,
      baseScore: 2,
      desc: 'A device-estimated level representing fat stored around the abdominal organs.'
    },
    bodyWater: { 
      id: 'bodyWater',
      key: 'bodyWater',
      title: 'Body Water', 
      value: withUnit(fitMaoData.bodyWater, 'L'),
      available: hasValue(fitMaoData.bodyWater),
      baseScore: 2,
      desc: 'Shows FitMao’s estimate of the total amount of water in your body.'
    },
    bmr: { 
      id: 'bmr',
      key: 'bmr',
      title: 'Basal Metabolic Rate', 
      value: withUnit(fitMaoData.bmr, 'kcal'),
      available: hasValue(fitMaoData.bmr),
      baseScore: 2,
      desc: 'An estimate of the energy your body uses each day while at rest.'
    },
    bmi: { 
      id: 'bmi',
      key: 'bmi',
      title: 'BMI', 
      value: hasValue(fitMaoData.bmi) ? String(fitMaoData.bmi) : 'Not available',
      available: hasValue(fitMaoData.bmi),
      baseScore: 1,
      desc: 'A general weight-to-height screening value that is best read with other measurements.'
    }
  };

  let results = Object.keys(METRICS_DB).filter((key) => METRICS_DB[key].available).map(key => {
    const item = METRICS_DB[key];
    return {
      ...item,
      currentScore: item.baseScore,
      steps: [
        { 
          delta: `+${item.baseScore}`, 
          deltaVal: item.baseScore, 
          category: 'Baseline',
          reason: 'Starting relevance for body-composition interpretation',
          subtotal: item.baseScore 
        }
      ],
      contributingFactors: [
        {
          category: 'Baseline',
          weight: item.baseScore,
          reason: 'Starting weight used consistently for every available measurement'
        }
      ],
      reasons: []
    };
  });

  const getMetric = (id) => results.find(m => m.id === id);

  const applyRule = (id, delta, category, reason) => {
    const m = getMetric(id);
    if (m) {
      m.currentScore += delta;
      m.steps.push({
        delta: delta > 0 ? `+${delta}` : `${delta}`,
        deltaVal: delta,
        category,
        reason,
        subtotal: m.currentScore
      });
      m.contributingFactors.push({
        category,
        weight: delta,
        reason
      });
      if (reason && !m.reasons.includes(reason)) {
        m.reasons.push(reason);
      }
    }
  };

  const primaryGoal = parqAnswers.primaryGoal || parqAnswers.goal || (Array.isArray(parqAnswers.goals) ? parqAnswers.goals[0] : 'fat_loss');
  const secondaryGoal = parqAnswers.secondaryGoal || (Array.isArray(parqAnswers.goals) && parqAnswers.goals[1] ? parqAnswers.goals[1] : null);

  // 1. Primary Goal Relevance (+4 / +3 / +2 points)
  if (primaryGoal === 'fat_loss') {
    applyRule('bodyFat', 4, 'Primary Goal', 'Your declared primary goal is fat reduction & body recomposition');
    applyRule('visceralFat', 3, 'Primary Goal', 'Visceral Fat provides additional context for a fat-reduction goal');
    applyRule('bmr', 2, 'Primary Goal', 'BMR provides background information about your estimated resting energy use');
  } else if (primaryGoal === 'muscle_gain') {
    applyRule('muscleMass', 4, 'Primary Goal', 'Your declared primary goal is building muscle and functional strength');
    applyRule('bodyWater', 3, 'Primary Goal', 'Muscle tissue is 70%+ water, making cellular hydration critical for growth');
    applyRule('bmr', 2, 'Primary Goal', 'Muscle hypertrophy increases your daily resting calorie expenditure');
  } else if (primaryGoal === 'health_longevity' || primaryGoal === 'health') {
    applyRule('visceralFat', 4, 'Primary Goal', 'Your primary priority is cardiovascular and internal organ longevity');
    applyRule('bmi', 2, 'Primary Goal', 'Tracking baseline body parameters provides general health screening');
    applyRule('bodyFat', 2, 'Primary Goal', 'Maintaining healthy body composition reduces chronic lifestyle risks');
  } else if (primaryGoal === 'athletic_performance' || primaryGoal === 'performance') {
    applyRule('muscleMass', 4, 'Primary Goal', 'Your primary goal is athletic performance and explosive muscular power');
    applyRule('bodyWater', 3, 'Primary Goal', 'Optimal body water ensures peak stamina and thermoregulation');
  } else if (primaryGoal === 'posture_mobility') {
    applyRule('muscleMass', 3, 'Primary Goal', 'Posture correction requires stabilizing skeletal muscle balance');
    applyRule('bodyWater', 3, 'Primary Goal', 'Joint and tissue mobility relies on cellular hydration');
  }

  // 1B. Secondary Goal Relevance (+2 points)
  if (secondaryGoal && secondaryGoal !== 'none' && secondaryGoal !== primaryGoal) {
    if (secondaryGoal === 'fat_loss') {
      applyRule('bodyFat', 2, 'Secondary Goal', 'Secondary objective: Body fat reduction support');
    } else if (secondaryGoal === 'muscle_gain') {
      applyRule('muscleMass', 2, 'Secondary Goal', 'Secondary objective: Muscle hypertrophy & strength');
    } else if (secondaryGoal === 'health_longevity' || secondaryGoal === 'health') {
      applyRule('visceralFat', 2, 'Secondary Goal', 'Secondary objective: Cardiovascular & internal wellness');
    } else if (secondaryGoal === 'athletic_performance' || secondaryGoal === 'performance') {
      applyRule('bodyWater', 2, 'Secondary Goal', 'Secondary objective: Athletic hydration & stamina');
    } else if (secondaryGoal === 'posture_mobility') {
      applyRule('muscleMass', 2, 'Secondary Goal', 'Secondary objective: Postural stability');
    }
  }

  // 2. Activity Preference
  const act = parqAnswers.activityCategory || (Array.isArray(parqAnswers.activityCategories) ? parqAnswers.activityCategories[0] : parqAnswers.activity) || 'strength';
  
  if (act === 'strength') {
    applyRule('muscleMass', 3, 'Activity Style', 'Your chosen workout style is resistance and strength training');
    applyRule('bmr', 1, 'Activity Style', 'BMR adds energy-use context to a strength-training goal');
  } else if (act === 'aerobic') {
    applyRule('bodyFat', 3, 'Activity Style', 'Body Fat is relevant when following changes alongside regular cardio activity');
    applyRule('visceralFat', 2, 'Activity Style', 'Visceral Fat provides additional body-composition context for cardio activity');
  } else if (act === 'cardio_conditioning') {
    applyRule('visceralFat', 3, 'Activity Style', 'Endurance cardio conditioning targets heart stamina and visceral health');
    applyRule('bodyWater', 2, 'Activity Style', 'Stamina training places high demands on cellular hydration');
  } else if (act === 'athletic_agility' || act === 'neuromotor') {
    applyRule('muscleMass', 2, 'Activity Style', 'Agility and sports drills demand functional muscle coordination');
    applyRule('bodyWater', 2, 'Activity Style', 'High-intensity athletic training demands proper hydration');
  } else if (act === 'mobility_flexibility' || act === 'flexibility') {
    applyRule('bodyWater', 2, 'Activity Style', 'Joint mobility and posture routines rely on hydration and tissue elasticity');
    applyRule('muscleMass', 1, 'Activity Style', 'Corrective posture work stabilizes postural muscle groups');
  }

  // 3. Availability & Lifestyle
  if (parqAnswers.availability === '1-2') {
    applyRule('bodyFat', 2, 'Availability', 'With 1–2 training days per week, nutritional body-fat tracking is crucial');
    applyRule('bmr', 2, 'Availability', 'Maximizing limited gym frequency requires aligning nutrition with BMR');
  } else if (parqAnswers.availability === '5+') {
    applyRule('bodyWater', 2, 'Availability', 'Frequent 5+ day schedules demand strict hydration and recovery tracking');
  }

  if (parqAnswers.dailyStyle === 'desk') {
    applyRule('visceralFat', 2, 'Daily Lifestyle', 'You reported spending much of the day seated, making this a useful measurement to monitor');
  }

  // 4. Nutrition & Hydration
  if (parqAnswers.nutritionPattern === 'irregular') {
    applyRule('bmr', 3, 'Nutrition Pattern', 'You reported an irregular eating schedule, so BMR provides useful energy-use context');
    applyRule('visceralFat', 1, 'Nutrition Pattern', 'Visceral Fat provides supporting context for the eating pattern you reported');
  } else if (parqAnswers.nutritionPattern === 'low_calorie') {
    applyRule('bmr', 3, 'Nutrition Pattern', 'You reported restricting calories, so BMR provides useful energy-use context');
    applyRule('muscleMass', 2, 'Nutrition Pattern', 'Skeletal Muscle Mass is useful to monitor while body weight is changing');
  } else if (parqAnswers.nutritionPattern === 'dining_out') {
    applyRule('bodyFat', 2, 'Nutrition Pattern', 'Frequent dining out makes tracking body composition more reliable than scale weight');
    applyRule('visceralFat', 2, 'Nutrition Pattern', 'Visceral Fat provides supporting context for the eating pattern you reported');
  } else if (parqAnswers.nutritionPattern === 'high_protein') {
    applyRule('muscleMass', 2, 'Nutrition Pattern', 'Your protein-conscious eating pattern makes Skeletal Muscle Mass relevant to monitor');
  }

  if (parqAnswers.waterIntake === 'low') {
    applyRule('bodyWater', 3, 'Hydration', 'Your reported low fluid intake makes tracking body water and hydration an immediate priority');
  }

  // 5. Physical Barriers / Safety
  if (parqAnswers.barriers === 'injury' || parqAnswers.hasBoneJointProblem === 'yes') {
    applyRule('muscleMass', 2, 'Safety & History', 'You reported joint sensitivity or a past injury, so this measurement may be useful to discuss with a professional');
  }

  // 6. Grounded Assessment Measurements
  if (rawVisceral !== null && rawVisceral >= 10) {
    applyRule('visceralFat', 3, 'BIA Scan Result', `Your measured Visceral Fat (Level ${rawVisceral}) is elevated and deserves focused attention`);
  }
  if (rawBodyFat !== null && rawBodyFat >= 25.0) {
    applyRule('bodyFat', 2, 'BIA Scan Result', `Your measured Body Fat (${rawBodyFat.toFixed(1)}%) represents your largest recomposition opportunity`);
  }

  results.forEach(m => {
    m.finalScore = m.currentScore;
  });

  results.sort((a, b) => b.finalScore - a.finalScore);

  const mainFocus = results[0] || null;
  const topPriorities = results.slice(1, 3);

  // Dynamic Because You Told Us builder
  const userGoalLabel = primaryGoal === 'fat_loss' ? 'fat reduction & body recomposition'
    : primaryGoal === 'muscle_gain' ? 'muscle hypertrophy & strength'
    : primaryGoal === 'health_longevity' || primaryGoal === 'health' ? 'overall health & cardiovascular longevity'
    : primaryGoal === 'athletic_performance' || primaryGoal === 'performance' ? 'athletic conditioning & power'
    : primaryGoal === 'posture_mobility' ? 'posture correction & mobility' : 'fitness development';

  const userActLabel = act === 'strength' ? 'resistance & strength training'
    : act === 'aerobic' ? 'cardio & endurance training'
    : act === 'cardio_conditioning' ? 'cardio conditioning'
    : act === 'athletic_agility' ? 'athletic agility drills'
    : act === 'mobility_flexibility' ? 'mobility and flexibility routines' : 'physical training';

  let becauseYouToldUs = mainFocus
    ? `You selected ${userGoalLabel} as your main goal and ${userActLabel} as your activity style. FitStart combined these answers with your confirmed FitMao measurement (${mainFocus.title}: ${mainFocus.value}), making ${mainFocus.title} your most relevant starting point.`
    : 'FitStart could not rank the assessment because no supported FitMao measurements were available.';

  if (parqAnswers.otherActivity && String(parqAnswers.otherActivity).trim()) {
    becauseYouToldUs += `\n\n*(Note: You also mentioned "${parqAnswers.otherActivity.trim()}" — while not part of the standard scoring matrix, your coaches will factor this into your programming.)*`;
  }

  return {
    scoredMetrics: results,
    mainFocus,
    topPriorities,
    otherPriorities: results.slice(3),
    becauseYouToldUs
  };
}
