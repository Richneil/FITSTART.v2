// Proposed thesis prototype rules. Professional review and weight-sensitivity testing
// are required before these mappings are described as validated research rules.
export const SAW_RULE_VERSION = 'proposed-saw-1.0';
export const SAW_CRITERIA = Object.freeze([
  { id: 'resultReview', label: 'FitMao Result Review', weight: 0.45 },
  { id: 'primaryGoal', label: 'Primary Goal Alignment', weight: 0.35 },
  { id: 'secondaryGoal', label: 'Secondary Goal Alignment', weight: 0.10 },
  { id: 'corroboration', label: 'Corroborating Evidence', weight: 0.10 }
]);

// This order is the final fallback after C1, C2, and C4. It also needs expert review.
const ALTERNATIVES = Object.freeze([
  { id: 'bodyFat', key: 'bodyFatPercentage', title: 'Percent Body Fat', unit: '%', desc: 'The estimated share of body weight that is fat.' },
  { id: 'muscleMass', key: 'skeletalMuscleMass', title: 'Skeletal Muscle Mass', unit: 'kg', desc: 'The estimated muscles used for movement and strength.' },
  { id: 'visceralFat', key: 'visceralFat', title: 'Visceral Fat Level', unit: '', desc: 'A FitMao-generated level representing fat around the abdominal organs.' },
  { id: 'bmi', key: 'bmi', title: 'BMI', unit: '', desc: 'A weight-for-height index that does not distinguish muscle from fat.' },
  { id: 'bodyWater', key: 'bodyWater', title: 'Total Body Water', unit: 'L', desc: 'FitMao’s estimate of the total water in the body.' },
  { id: 'waistHipRatio', key: 'waistToHipRatio', title: 'Waist-to-Hip Ratio', unit: '', precision: 2, desc: 'A comparison of waist and hip measurements.' }
]);

// Each relationship is a proposed direct (1), partial (0.5), or absent (0) link.
// The thesis requires qualified fitness professionals to approve this matrix.
export const GOAL_ALIGNMENT = Object.freeze({
  fat_loss: { bodyFat: 1, muscleMass: 0.5, visceralFat: 1, bmi: 0.5, bodyWater: 0, waistHipRatio: 0.5 },
  muscle_gain: { bodyFat: 0.5, muscleMass: 1, visceralFat: 0, bmi: 0, bodyWater: 0.5, waistHipRatio: 0 },
  health_longevity: { bodyFat: 0.5, muscleMass: 0.5, visceralFat: 1, bmi: 0.5, bodyWater: 0.5, waistHipRatio: 0.5 },
  athletic_performance: { bodyFat: 0.5, muscleMass: 1, visceralFat: 0, bmi: 0, bodyWater: 0.5, waistHipRatio: 0 },
  posture_mobility: { bodyFat: 0, muscleMass: 1, visceralFat: 0, bmi: 0.5, bodyWater: 0.5, waistHipRatio: 0 }
});

const GOAL_ALIASES = { health: 'health_longevity', general_health: 'health_longevity', performance: 'athletic_performance', endurance: 'athletic_performance' };
const GOAL_LABELS = { fat_loss: 'fat loss', muscle_gain: 'muscle development', health_longevity: 'long-term fitness', athletic_performance: 'athletic performance', posture_mobility: 'posture and mobility' };

// A field may corroborate only the named alternative, and only when a reviewed
// input explicitly identifies it as qualifying evidence. Mere presence is not a vote.
export const SUPPORT_MAP = Object.freeze({
  bodyFat: ['fatMass', 'waistToHipRatio'],
  muscleMass: ['softLeanMass', 'segmentalLean', 'muscleControl'],
  visceralFat: ['waistToHipRatio', 'bodyFatPercentage'],
  bmi: ['weight', 'targetWeight', 'weightControl'],
  bodyWater: ['ecf', 'icf'],
  waistHipRatio: ['visceralFat', 'bodyFatPercentage']
});

const round = (value, places = 4) => Number(value.toFixed(places));
const normalizeGoal = (goal) => GOAL_ALIASES[goal] || goal;

function readNumber(value) {
  const number = readNumeric(value);
  return number !== null && number > 0 ? number : null;
}

function readNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const match = value.replaceAll(',', '').trim().match(/^(?:level\s*)?([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*(?:%|kg|l|kcal|cm)?$/i);
  const number = match ? Number(match[1]) : NaN;
  return Number.isFinite(number) ? number : null;
}

function formatValue(definition, number) {
  const rendered = Number.isInteger(number) ? String(number) : String(round(number, definition.precision ?? 1));
  return definition.unit ? `${rendered}${definition.unit === '%' ? '%' : ` ${definition.unit}`}` : rendered;
}

function readReviewRating(report, key) {
  const entry = report.referenceCategories?.[key];
  const category = typeof entry === 'string' ? entry : entry?.status;
  if (!category) return null;
  const normalized = category.toLowerCase().replaceAll(/[-_\s]+/g, '');
  if (['outside', 'outofrange', 'under', 'over'].includes(normalized)) return 1;
  if (['boundary', 'review', 'borderline'].includes(normalized)) return 0.5;
  if (['within', 'withinrange', 'normal'].includes(normalized)) return 0;
  return null;
}

function readSupportingFields(report, definition) {
  const supplied = report.corroboratingEvidence?.[definition.id];
  if (!Array.isArray(supplied)) return [];
  const allowed = SUPPORT_MAP[definition.id] || [];
  return [...new Set(supplied.filter((field) => allowed.includes(field)
    && readNumeric(report[field]) !== null
    && (!Array.isArray(report.confirmedFields) || report.confirmedFields.includes(field))))];
}

function createEmptyResult(reason, primaryGoal = null) {
  return {
    method: 'SAW', ruleVersion: SAW_RULE_VERSION, validationStatus: 'Proposed thesis prototype; expert review pending',
    formula: 'Pᵢ = Σ(wⱼ × Cᵢⱼ); displayed priority score = 100 × Pᵢ',
    criteria: [], omittedCriteria: [], scoredMetrics: [], mainFocus: null, topPriorities: [], otherPriorities: [],
    primaryGoal, becauseYouToldUs: reason, limitation: reason
  };
}

export function scoreMetrics(fitMaoData = {}, parqAnswers = {}) {
  const primaryGoal = normalizeGoal(parqAnswers.primaryGoal || parqAnswers.goal || parqAnswers.goals?.[0]);
  const rawSecondary = normalizeGoal(parqAnswers.secondaryGoal || parqAnswers.goals?.[1]);
  const secondaryGoal = rawSecondary && rawSecondary !== 'none' && rawSecondary !== primaryGoal ? rawSecondary : null;
  if (!GOAL_ALIGNMENT[primaryGoal]) {
    return createEmptyResult('Select a supported primary fitness goal before FitStart can rank measurements.');
  }
  if (fitMaoData.isConfirmed === false) {
    return createEmptyResult('Confirm the supported FitMao values before FitStart calculates priorities.', primaryGoal);
  }

  const metrics = ALTERNATIVES.flatMap((definition, order) => {
    const number = readNumber(fitMaoData[definition.key]);
    const fieldList = fitMaoData.confirmedFields;
    if (number === null || (Array.isArray(fieldList) && !fieldList.includes(definition.key))) return [];
    return [{ ...definition, value: formatValue(definition, number), numericValue: number, tieBreakIndex: order }];
  });
  if (metrics.length === 0) {
    return createEmptyResult('No supported, confirmed core measurements were available to rank.', primaryGoal);
  }

  const reviewRatings = metrics.map((metric) => readReviewRating(fitMaoData, metric.key));
  // A criterion is used only when every eligible alternative can be rated on the
  // same basis. This avoids silently treating an unknown report category as 0.
  const hasReview = reviewRatings.every((rating) => rating !== null);
  const hasCorroboration = metrics.every((metric) =>
    Array.isArray(fitMaoData.corroboratingEvidence?.[metric.id]));
  const omittedCriteria = SAW_CRITERIA.filter((criterion) =>
    (criterion.id === 'resultReview' && !hasReview)
    || (criterion.id === 'secondaryGoal' && !secondaryGoal)
    || (criterion.id === 'corroboration' && !hasCorroboration)
  ).map(({ id, label }) => ({ id, label, reason: id === 'secondaryGoal' ? 'No distinct secondary goal was selected.' : 'Comparable confirmed evidence was not available for every eligible measurement.' }));
  const active = SAW_CRITERIA.filter((criterion) => !omittedCriteria.some((item) => item.id === criterion.id));
  const weightSum = active.reduce((sum, criterion) => sum + criterion.weight, 0);
  const criteria = active.map((criterion) => ({ ...criterion, effectiveWeight: criterion.weight / weightSum }));

  const scoredMetrics = metrics.map((metric, index) => {
    const supportingFields = hasCorroboration ? readSupportingFields(fitMaoData, metric) : [];
    const ratings = {
      resultReview: reviewRatings[index],
      primaryGoal: GOAL_ALIGNMENT[primaryGoal][metric.id] ?? 0,
      secondaryGoal: secondaryGoal ? (GOAL_ALIGNMENT[secondaryGoal]?.[metric.id] ?? 0) : null,
      corroboration: supportingFields.length >= 2 ? 1 : supportingFields.length === 1 ? 0.5 : 0
    };
    let runningTotal = 0;
    const steps = criteria.map((criterion) => {
      const rating = ratings[criterion.id];
      const exactContribution = criterion.effectiveWeight * rating * 100;
      runningTotal += exactContribution;
      const reason = criterion.id === 'resultReview'
        ? `${fitMaoData.referenceCategoriesSource ? 'Illustrative prototype' : 'FitMao report'} review category: ${fitMaoData.referenceCategories[metric.key]?.status || fitMaoData.referenceCategories[metric.key]}.`
        : criterion.id === 'primaryGoal'
          ? `Proposed relationship to your primary ${GOAL_LABELS[primaryGoal]} goal.`
          : criterion.id === 'secondaryGoal'
            ? `Proposed relationship to your secondary ${GOAL_LABELS[secondaryGoal] || secondaryGoal} goal.`
            : supportingFields.length ? `Explicit supporting fields: ${supportingFields.join(', ')}.` : 'No qualifying distinct supporting field was supplied.';
      return {
        category: criterion.label, criterionId: criterion.id, rawRating: rating,
        normalizedRating: rating, criterionWeight: round(criterion.effectiveWeight, 6),
        contribution: round(exactContribution), reason, subtotal: round(runningTotal)
      };
    });
    const finalScore = round(runningTotal);
    return {
      ...metric, scoringMethod: 'SAW', ruleVersion: SAW_RULE_VERSION,
      baseScore: 0, currentScore: finalScore, finalScore, sawPreference: round(runningTotal / 100, 6),
      ratings, steps, contributingFactors: steps.map((step) => ({
        category: step.category, criterionId: step.criterionId, rating: step.rawRating,
        weight: step.criterionWeight, contribution: step.contribution, reason: step.reason
      })),
      supportingFields, tieBreak: null
    };
  });

  const tieOrder = ['resultReview', 'primaryGoal', 'corroboration'];
  scoredMetrics.sort((a, b) => {
    if (Math.abs(b.finalScore - a.finalScore) > 1e-9) return b.finalScore - a.finalScore;
    for (const id of tieOrder) {
      if (!criteria.some((criterion) => criterion.id === id)) continue;
      if (b.ratings[id] !== a.ratings[id]) return b.ratings[id] - a.ratings[id];
    }
    return a.tieBreakIndex - b.tieBreakIndex;
  });
  scoredMetrics.forEach((metric, index) => {
    const previous = scoredMetrics[index - 1];
    const next = scoredMetrics[index + 1];
    if ((previous && previous.finalScore === metric.finalScore) || (next && next.finalScore === metric.finalScore)) {
      metric.tieBreak = 'Equal scores: higher C1, then C2, then C4, then the proposed fixed alternative order.';
    }
  });

  const mainFocus = scoredMetrics[0];
  const availableCriteria = criteria.map((criterion) => criterion.label).join(', ');
  return {
    method: 'SAW', ruleVersion: SAW_RULE_VERSION, validationStatus: 'Proposed thesis prototype; expert review pending',
    formula: 'Pᵢ = Σ(wⱼ × Cᵢⱼ); displayed priority score = 100 × Pᵢ',
    criteria, omittedCriteria, scoredMetrics, mainFocus,
    topPriorities: scoredMetrics.slice(1, 3), otherPriorities: scoredMetrics.slice(3), primaryGoal, secondaryGoal,
    becauseYouToldUs: `${GOAL_LABELS[primaryGoal]} was your primary goal${secondaryGoal ? ` and ${GOAL_LABELS[secondaryGoal] || secondaryGoal} was your secondary goal` : ''}. Under the proposed ${SAW_RULE_VERSION} rules, ${mainFocus.title} ranked first using ${availableCriteria}. Review it with a qualified coach; this score is relative priority, not medical severity.`,
    limitation: omittedCriteria.length ? `The same remaining criteria were reweighted for all eligible measurements because ${omittedCriteria.map((item) => item.label).join(', ')} could not be applied.` : null
  };
}
