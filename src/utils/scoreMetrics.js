// Shared Scoring & Relevance Engine for FitStart
// Computes deterministic, explainable priorities from FitMao body composition and PAR-Q context

export function scoreMetrics(fitMaoData = {}, parqAnswers = {}) {
  const bodyFatVal = parseFloat(fitMaoData.bodyFatPercentage) || 24.5;
  const visceralVal = parseInt(String(fitMaoData.visceralFat || '10').replace(/\D/g, '')) || 10;
  const muscleVal = parseFloat(fitMaoData.skeletalMuscleMass) || 32.0;

  const METRICS_DB = {
    bodyFat: { 
      id: 'bodyFat',
      key: 'bodyFatPercentage',
      title: 'Body Fat %', 
      value: fitMaoData.bodyFatPercentage || '24.5%', 
      baseScore: 3,
      desc: 'Tracking body fat reveals true physical recomposition and fat reduction beyond the bathroom scale.' 
    },
    muscleMass: { 
      id: 'muscleMass',
      key: 'skeletalMuscleMass',
      title: 'Skeletal Muscle Mass', 
      value: fitMaoData.skeletalMuscleMass || '32.1 kg', 
      baseScore: 3,
      desc: 'Preserving and building muscle boosts your resting metabolism and protects posture and joint integrity.' 
    },
    visceralFat: { 
      id: 'visceralFat',
      key: 'visceralFat',
      title: 'Visceral Fat', 
      value: fitMaoData.visceralFat || 'Level 11', 
      baseScore: 2,
      desc: 'Internal organ fat level. Keeping this within healthy ranges is the cornerstone of cardiovascular health.' 
    },
    bodyWater: { 
      id: 'bodyWater',
      key: 'bodyWater',
      title: 'Body Water', 
      value: fitMaoData.bodyWater || '42.3 L', 
      baseScore: 2,
      desc: 'Key indicator of cellular hydration, workout stamina, and recovery efficiency after exercise.' 
    },
    bmr: { 
      id: 'bmr',
      key: 'bmr',
      title: 'Basal Metabolic Rate', 
      value: fitMaoData.bmr || '1,650 kcal', 
      baseScore: 2,
      desc: 'Your baseline daily calorie burn at rest, serving as the floor for sustainable energy balance.' 
    },
    bmi: { 
      id: 'bmi',
      key: 'bmi',
      title: 'BMI', 
      value: fitMaoData.bmi || '25.4', 
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
        { delta: `+${item.baseScore}`, deltaVal: item.baseScore, reason: 'Initial baseline relevance score', subtotal: item.baseScore }
      ],
      reasons: []
    };
  });

  const getMetric = (id) => results.find(m => m.id === id);

  const applyRule = (id, delta, reason) => {
    const m = getMetric(id);
    if (m) {
      m.currentScore += delta;
      m.steps.push({
        delta: delta > 0 ? `+${delta}` : `${delta}`,
        deltaVal: delta,
        reason,
        subtotal: m.currentScore
      });
      if (reason && !m.reasons.includes(reason)) {
        m.reasons.push(reason);
      }
    }
  };

  const goals = Array.isArray(parqAnswers.goals) ? parqAnswers.goals : [parqAnswers.goal].filter(Boolean);

  // 1. Goal Relevance
  if (goals.includes('fat_loss') || parqAnswers.goal === 'fat_loss') {
    applyRule('bodyFat', 4, 'Your primary goal includes reducing body fat');
    applyRule('visceralFat', 3, 'Reducing body fat directly reduces internal visceral organ fat');
    applyRule('bmr', 2, 'Understanding your BMR prevents counterproductive crash dieting');
  }
  if (goals.includes('muscle_gain') || parqAnswers.goal === 'muscle_gain') {
    applyRule('muscleMass', 4, 'Your primary goal includes building muscle and strength');
    applyRule('bodyWater', 3, 'Muscle tissue is 70%+ water, making cellular hydration critical for growth');
    applyRule('bmr', 2, 'Muscle hypertrophy increases your daily resting calorie expenditure');
  }
  if (goals.includes('health_longevity') || parqAnswers.goal === 'health') {
    applyRule('visceralFat', 4, 'You prioritize cardiovascular and internal organ wellness');
    applyRule('bmi', 2, 'Tracking baseline body parameters provides general health screening');
    applyRule('bodyFat', 2, 'Maintaining healthy body composition reduces chronic lifestyle risks');
  }
  if (goals.includes('athletic_performance') || parqAnswers.goal === 'performance') {
    applyRule('muscleMass', 3, 'Athletic performance demands functional muscular power');
    applyRule('bodyWater', 3, 'Optimal body water ensures peak stamina and thermoregulation');
  }

  // 2. Activities (ACSM)
  const acts = parqAnswers.activityCategories || [];
  if (acts.includes('strength')) {
    applyRule('muscleMass', 3, 'Your training incorporates resistance exercise');
    applyRule('bmr', 1, 'Resistance training elevates basal metabolic rate and recovery expenditure');
  }
  if (acts.includes('aerobic') || acts.includes('cardio_conditioning')) {
    applyRule('bodyFat', 2, 'Cardiovascular activity supports fat oxidation');
    applyRule('visceralFat', 2, 'Aerobic exercise directly mobilizes internal visceral fat');
  }
  if (acts.includes('athletic_agility') || acts.includes('neuromotor')) {
    applyRule('muscleMass', 2, 'Athletic agility drills demand functional muscular coordination');
    applyRule('bodyWater', 2, 'High-intensity athletic drills demand proper cellular hydration');
  }
  if (acts.includes('mobility_flexibility') || acts.includes('flexibility')) {
    applyRule('bodyWater', 2, 'Joint mobility and posture routines rely on cellular hydration and recovery');
  }

  // 3. Availability & Lifestyle
  if (parqAnswers.availability === '1-2') {
    applyRule('bodyFat', 2, 'With 1–2 training days per week, nutritional body-fat tracking is crucial');
    applyRule('bmr', 2, 'Maximizing limited gym frequency requires aligning nutrition with BMR');
  } else if (parqAnswers.availability === '5+') {
    applyRule('bodyWater', 2, 'Frequent 5+ day schedules demand strict hydration and recovery tracking');
  }

  if (parqAnswers.dailyStyle === 'desk') {
    applyRule('visceralFat', 2, 'A sedentary desk lifestyle correlates with higher visceral fat storage');
  }

  // 4. Nutrition & Hydration
  if (parqAnswers.nutritionPattern === 'irregular') {
    applyRule('bmr', 3, 'Irregular meal timing makes understanding your BMR floor essential to avoid under-eating');
    applyRule('visceralFat', 1, 'Inconsistent meal schedules can destabilize metabolic regulation');
  } else if (parqAnswers.nutritionPattern === 'low_calorie') {
    applyRule('bmr', 3, 'Aggressive calorie deficits make your BMR your non-negotiable floor to protect metabolism');
    applyRule('muscleMass', 2, 'During caloric restriction, preserving skeletal muscle mass is vital');
  } else if (parqAnswers.nutritionPattern === 'dining_out') {
    applyRule('bodyFat', 2, 'Frequent dining out makes tracking body composition more reliable than scale weight');
    applyRule('visceralFat', 2, 'Higher convenience dining often correlates with elevated visceral fat storage');
  } else if (parqAnswers.nutritionPattern === 'high_protein') {
    applyRule('muscleMass', 2, 'Your protein-conscious diet directly supports skeletal muscle recovery and synthesis');
  }

  if (parqAnswers.waterIntake === 'low') {
    applyRule('bodyWater', 3, 'Your reported low fluid intake makes tracking body water and hydration an immediate priority');
  }

  // 5. Barriers
  if (parqAnswers.barriers === 'injury' || parqAnswers.hasBoneJointProblem === 'yes') {
    applyRule('muscleMass', 2, 'Joint sensitivity or past injury requires joint-protective muscle support');
  }

  // 6. Grounded Assessment Measurements
  if (visceralVal >= 10) {
    applyRule('visceralFat', 3, `Your measured Visceral Fat (${fitMaoData.visceralFat}) is elevated and deserves focused attention`);
  }
  if (bodyFatVal >= 25.0) {
    applyRule('bodyFat', 2, `Your measured Body Fat (${fitMaoData.bodyFatPercentage}) is currently your largest recomposition opportunity`);
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
    quickWins.push({ id: 'bmr_floor', text: `Check your BMR (${fitMaoData.bmr || '1,650 kcal'}) to ensure you never eat below your metabolic floor`, completed: false });
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

  const reasonsText = mainFocus.reasons.join(' and ');
  let becauseYouToldUs = `We are prioritizing ${mainFocus.title} (${mainFocus.value}) because ${reasonsText || 'it represents your greatest initial opportunity'}. Tracking this metric gives you the clearest picture of your starting condition and initial progress.`;

  if (parqAnswers.otherActivity && String(parqAnswers.otherActivity).trim()) {
    becauseYouToldUs += `\n\n(Note: You also mentioned "${parqAnswers.otherActivity.trim()}" — we do not have a hardcoded scoring rule for this specific activity, but it has been noted for context.)`;
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
