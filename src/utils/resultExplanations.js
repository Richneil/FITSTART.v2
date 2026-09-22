const METRIC_COPY = {
  bodyFat: {
    definition: 'This is FitMao’s estimate of how much of your total body weight comes from fat.',
    context: 'your overall body-composition picture',
    coachPrompt: 'Ask how this measurement relates to your goal and how often it should be reassessed.'
  },
  muscleMass: {
    definition: 'This is FitMao’s estimate of the muscles used for movement, strength, posture and physical performance.',
    context: 'strength, movement and performance',
    coachPrompt: 'Ask how this measurement relates to your performance goal, what training suits your experience and when it should be reassessed.'
  },
  visceralFat: {
    definition: 'This is a FitMao device-estimated level representing fat stored around the abdominal organs.',
    context: 'your broader body-composition picture',
    coachPrompt: 'Ask how training and daily habits can help you monitor this measurement over time.'
  },
  bodyWater: {
    definition: 'This is FitMao’s estimate of the total amount of water in your body.',
    context: 'exercise readiness, recovery and your broader body composition',
    coachPrompt: 'Ask whether this measurement should be monitored and how to prepare consistently before future assessments.'
  },
  bmr: {
    definition: 'This is FitMao’s estimate of the energy your body uses while at rest. It is not a daily calorie prescription.',
    context: 'resting energy-use information',
    coachPrompt: 'Ask how this estimate should be considered alongside your activity level and goals.'
  },
  bmi: {
    definition: 'This is a height-to-weight screening value. It does not separate muscle from body fat.',
    context: 'a general height-and-weight comparison',
    coachPrompt: 'Ask how this value should be read together with your other body-composition measurements.'
  }
};

const CATEGORY_LABELS = {
  'Primary Goal': 'your primary goal',
  'Secondary Goal': 'your secondary goal',
  'Activity Style': 'your preferred workout focus',
  Availability: 'your weekly availability',
  'Daily Lifestyle': 'your daily routine',
  'Nutrition Pattern': 'your eating-pattern answer',
  Hydration: 'your water-intake answer',
  'Safety & History': 'your safety and history answers',
  'BIA Scan Result': 'your confirmed FitMao measurement'
};

const GOAL_LABELS = {
  fat_loss: 'reducing body fat and managing weight',
  muscle_gain: 'building muscle and increasing strength',
  health_longevity: 'supporting long-term fitness and wellness',
  health: 'supporting long-term fitness and wellness',
  athletic_performance: 'improving athletic performance',
  posture_mobility: 'improving posture and mobility',
  general_health: 'improving general fitness and wellness',
  performance: 'improving athletic performance',
  endurance: 'improving cardiovascular endurance'
};

function joinNatural(items) {
  if (items.length === 0) return 'your confirmed assessment information';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

export function getMetricExplanation(metric, role = 'supporting', mainFocus = null) {
  const copy = METRIC_COPY[metric?.id] || {
    definition: metric?.desc || 'This is a measurement displayed in your FitMao report.',
    context: 'your overall assessment',
    coachPrompt: 'Ask your coach how this measurement relates to your selected goal.'
  };

  const evidence = [...new Set((metric?.contributingFactors || [])
    .map((factor) => CATEGORY_LABELS[factor.category])
    .filter(Boolean))]
    .slice(0, 3);
  const evidenceText = joinNatural(evidence);

  if (role === 'main') {
    return {
      ...copy,
      why: `FitStart selected ${metric?.title || 'this measurement'} as your Main Focus because it had the strongest connection to ${evidenceText}. This does not automatically mean the result is unhealthy; it is the most relevant measurement to discuss first for the goals and preferences you selected.`,
      focusLabel: 'Start here and monitor'
    };
  }

  return {
    ...copy,
    why: `FitStart included ${metric?.title || 'this measurement'} because it adds ${copy.context} alongside ${mainFocus?.title || 'your Main Focus'}. Its relevance came from ${evidenceText}. It is supporting rather than primary because ${mainFocus?.title || 'the Main Focus'} had the stronger overall connection to your answers.`,
    focusLabel: 'Understand and monitor'
  };
}

export function formatMetricValue(value, unit = '') {
  if (value === undefined || value === null || /^(?:|not shown|not available|n\/a|—|-)$/i.test(String(value).trim())) return 'Not shown';
  const text = String(value);
  if (!unit || text.toLowerCase().includes(unit.toLowerCase())) return text;
  return `${text} ${unit}`;
}

export function formatVisceralFatValue(value) {
  if (value === undefined || value === null || value === '') return 'Not shown';
  const numeric = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) return String(value).replace(/^level\s*/i, '').trim() || 'Not shown';
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
}

export function getOverallInterpretation(mainFocus, topPriorities = [], parqAnswers = {}) {
  const primaryGoal = parqAnswers.primaryGoal
    || parqAnswers.goal
    || (Array.isArray(parqAnswers.goals) ? parqAnswers.goals[0] : null);
  const goalLabel = GOAL_LABELS[primaryGoal] || 'your selected fitness goal';
  const supporting = topPriorities.filter(Boolean).slice(0, 2);
  const supportingSummary = supporting.length === 2
    ? `${supporting[0].title} (${supporting[0].value}) and ${supporting[1].title} (${supporting[1].value}) provide supporting context and help show how the prioritized measurements relate to one another.`
    : supporting.length === 1
      ? `${supporting[0].title} (${supporting[0].value}) provides supporting context for that focus.`
      : 'No additional supporting priority was available from the confirmed measurements.';

  return {
    basis: 'This explanation is based on your confirmed FitMao measurements and the fitness goals you selected.',
    summary: mainFocus
      ? `For your goal of ${goalLabel}, FitStart identified ${mainFocus.title} (${mainFocus.value}) as the measurement to review first. ${supportingSummary} Being selected as a priority does not necessarily mean that something is wrong; these results provide a clearer starting point for a conversation with your coach.`
      : 'FitStart could not identify a Main Focus because no supported FitMao measurements were available. Review the report with a qualified coach before drawing conclusions.',
    guidance: 'FitStart provides educational interpretation only. It does not provide a medical diagnosis or prescribe a workout, training method, exercise intensity, frequency, technique, diet, calorie target, or nutrition strategy. A qualified fitness professional should consider your complete condition, needs, and goals before determining the appropriate exercise and nutrition plan.'
  };
}
