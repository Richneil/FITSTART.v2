// Shared Scoring & Relevance Engine for FitStart (Server)
// Computes deterministic, explainable priorities from FitMao body composition and PAR-Q context.
// Maintains a transparent explanation trace (contributing factors) for every scored metric.

export function scoreMetrics(fitMaoData = {}, parqAnswers = {}) {
  // Extract numeric values safely without hallucinating defaults if absent
  const rawBodyFat = fitMaoData.bodyFatPercentage !== undefined && fitMaoData.bodyFatPercentage !== null
    ? parseFloat(String(fitMaoData.bodyFatPercentage).replace(/[^0-9.]/g, ''))
    : null;

  const rawVisceral = fitMaoData.visceralFat !== undefined && fitMaoData.visceralFat !== null
    ? parseInt(String(fitMaoData.visceralFat).replace(/\D/g, ''), 10)
    : null;

  const rawMuscle = fitMaoData.skeletalMuscleMass !== undefined && fitMaoData.skeletalMuscleMass !== null
    ? parseFloat(String(fitMaoData.skeletalMuscleMass).replace(/[^0-9.]/g, ''))
    : null;

  const METRICS_DB = {
    bodyFat: { 
      id: 'bodyFat',
      key: 'bodyFatPercentage',
      title: 'Body Fat %', 
      value: rawBodyFat !== null ? `${rawBodyFat.toFixed(1)}%` : (fitMaoData.bodyFatPercentage || '24.5%'), 
      baseScore: 3,
      desc: 'Tracking body fat reveals true physical recomposition and fat reduction beyond the bathroom scale.' 
    },
    muscleMass: { 
      id: 'muscleMass',
      key: 'skeletalMuscleMass',
      title: 'Skeletal Muscle Mass', 
      value: rawMuscle !== null ? `${rawMuscle.toFixed(1)} kg` : (fitMaoData.skeletalMuscleMass || '32.1 kg'), 
      baseScore: 3,
      desc: 'Preserving and building muscle boosts your resting metabolism and protects posture and joint integrity.' 
    },
    visceralFat: { 
      id: 'visceralFat',
      key: 'visceralFat',
      title: 'Visceral Fat', 
      value: rawVisceral !== null ? `Level ${rawVisceral}` : (fitMaoData.visceralFat || 'Level 11'), 
      baseScore: 2,
      desc: 'Internal organ fat level. Keeping this within healthy ranges is the cornerstone of cardiovascular health.' 
    },
    bodyWater: { 
      id: 'bodyWater',
      key: 'bodyWater',
      title: 'Body Water', 
      value: fitMaoData.bodyWater ? (String(fitMaoData.bodyWater).includes('L') ? fitMaoData.bodyWater : `${fitMaoData.bodyWater} L`) : '42.3 L', 
      baseScore: 2,
      desc: 'Key indicator of cellular hydration, workout stamina, and recovery efficiency after exercise.' 
    },
    bmr: { 
      id: 'bmr',
      key: 'bmr',
      title: 'Basal Metabolic Rate', 
      value: fitMaoData.bmr ? (String(fitMaoData.bmr).includes('kcal') ? fitMaoData.bmr : `${fitMaoData.bmr} kcal`) : '1,650 kcal', 
      baseScore: 2,
      desc: 'Your baseline daily calorie burn at rest, serving as the floor for sustainable energy balance.' 
    },
    bmi: { 
      id: 'bmi',
      key: 'bmi',
      title: 'BMI', 
      value: fitMaoData.bmi ? String(fitMaoData.bmi) : '25.4', 
      baseScore: 1,
      desc: 'General weight-to-height ratio indicator, best viewed in tandem with body fat percentage.' 
    }
  };

  let results = Object.keys(METRICS_DB).map(key => {
    const item = METRICS_DB[key];
    return {
      ...item,
      currentScore: item.baseScore,
      steps: [
        { 
          delta: `+${item.baseScore}`, 
          deltaVal: item.baseScore, 
          category: 'Baseline',
          reason: 'Baseline clinical relevance score', 
          subtotal: item.baseScore 
        }
      ],
      contributingFactors: [
        {
          category: 'Baseline',
          weight: item.baseScore,
          reason: 'Standard baseline weight for introductory body composition evaluation'
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
    applyRule('visceralFat', 3, 'Primary Goal', 'Reducing overall body fat directly reduces internal visceral organ fat');
    applyRule('bmr', 2, 'Primary Goal', 'Understanding your BMR prevents counterproductive crash dieting');
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
    applyRule('bmr', 1, 'Activity Style', 'Resistance training elevates basal metabolic rate and calorie burning');
  } else if (act === 'aerobic') {
    applyRule('bodyFat', 3, 'Activity Style', 'Cardiovascular cardio directly supports calorie deficit and fat oxidation');
    applyRule('visceralFat', 2, 'Activity Style', 'Aerobic exercise directly mobilizes internal visceral organ fat');
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
    applyRule('visceralFat', 2, 'Daily Lifestyle', 'A sedentary desk lifestyle correlates with higher visceral fat storage');
  }

  // 4. Nutrition & Hydration
  if (parqAnswers.nutritionPattern === 'irregular') {
    applyRule('bmr', 3, 'Nutrition Pattern', 'Irregular meal timing makes understanding your BMR floor essential to avoid under-eating');
    applyRule('visceralFat', 1, 'Nutrition Pattern', 'Inconsistent meal schedules can destabilize metabolic regulation');
  } else if (parqAnswers.nutritionPattern === 'low_calorie') {
    applyRule('bmr', 3, 'Nutrition Pattern', 'Aggressive calorie deficits make your BMR your non-negotiable floor to protect metabolism');
    applyRule('muscleMass', 2, 'Nutrition Pattern', 'During caloric restriction, preserving skeletal muscle mass is vital');
  } else if (parqAnswers.nutritionPattern === 'dining_out') {
    applyRule('bodyFat', 2, 'Nutrition Pattern', 'Frequent dining out makes tracking body composition more reliable than scale weight');
    applyRule('visceralFat', 2, 'Nutrition Pattern', 'Higher convenience dining often correlates with elevated visceral fat storage');
  } else if (parqAnswers.nutritionPattern === 'high_protein') {
    applyRule('muscleMass', 2, 'Nutrition Pattern', 'Your protein-conscious diet directly supports skeletal muscle recovery and synthesis');
  }

  if (parqAnswers.waterIntake === 'low') {
    applyRule('bodyWater', 3, 'Hydration', 'Your reported low fluid intake makes tracking body water and hydration an immediate priority');
  }

  // 5. Physical Barriers / Safety
  if (parqAnswers.barriers === 'injury' || parqAnswers.hasBoneJointProblem === 'yes') {
    applyRule('muscleMass', 2, 'Safety & History', 'Joint sensitivity or past injury requires joint-protective muscle support');
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

  const mainFocus = results[0];
  const topPriorities = [results[1], results[2]];

  const quickWins = [];
  if (parqAnswers.availability === '1-2') {
    quickWins.push({ id: 'schedule', text: 'Block out your 1–2 workout slots on your calendar this week', completed: false });
  } else {
    quickWins.push({ id: 'schedule', text: 'Pick your fixed weekly workout days to build consistency', completed: false });
  }

  if (parqAnswers.nutritionPattern === 'irregular' || parqAnswers.nutritionPattern === 'low_calorie') {
    quickWins.push({ id: 'bmr_floor', text: `Check your BMR (${METRICS_DB.bmr.value}) to ensure you never eat below your metabolic floor`, completed: false });
  } else if (parqAnswers.waterIntake === 'low') {
    quickWins.push({ id: 'water_glass', text: 'Drink 500ml of water upon waking up tomorrow morning', completed: false });
  } else if (mainFocus.id === 'muscleMass') {
    quickWins.push({ id: 'protein_habit', text: 'Include a palm-sized portion of protein with your next two meals', completed: false });
  } else {
    quickWins.push({ id: 'walk_habit', text: 'Take a 15-minute brisk recovery walk today to jumpstart habit building', completed: false });
  }

  const firstSteps = [
    { num: '01', title: 'Review Your Starting Numbers', desc: `Focus on your ${mainFocus.title} baseline (${mainFocus.value}) as your primary benchmark.` },
    { num: '02', title: 'Schedule Your Guided Walkthrough', desc: 'Meet with a KSYN Fitness coach to walk through the gym floor and review movement form.' },
    { num: '03', title: 'Re-assess in 4–6 Weeks', desc: 'Book your follow-up FitMao scan on the kiosk to track your progress.' }
  ];

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

  let becauseYouToldUs = `You indicated your primary goal is **${userGoalLabel}**, with an activity focus on **${userActLabel}**. Based on this context combined with your FitMao assessment (${mainFocus.title}: ${mainFocus.value}), FitStart prioritizes **${mainFocus.title}** as your starting anchor. Tracking this metric gives you the clearest picture of initial progress without getting overwhelmed.`;

  if (parqAnswers.otherActivity && String(parqAnswers.otherActivity).trim()) {
    becauseYouToldUs += `\n\n*(Note: You also mentioned "${parqAnswers.otherActivity.trim()}" — while not part of the standard scoring matrix, your coaches will factor this into your programming.)*`;
  }

  return {
    scoredMetrics: results,
    mainFocus,
    topPriorities,
    otherPriorities: results.slice(3),
    quickWins,
    firstSteps,
    becauseYouToldUs
  };
}
