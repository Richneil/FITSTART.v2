import test from 'node:test';
import assert from 'node:assert/strict';
import { SAW_CRITERIA, SAW_RULE_VERSION, scoreMetrics as scoreClient } from '../src/utils/scoreMetrics.js';
import { scoreMetrics as scoreServer } from '../server/utils/scoreMetrics.js';
import { formatVisceralFatValue, getMetricExplanation, getOverallInterpretation } from '../src/utils/resultExplanations.js';
import { parseQrPayload } from '../src/utils/qrParser.js';

const report = {
  bodyFatPercentage: '28%', skeletalMuscleMass: '29.7 kg', visceralFat: 'Level 12',
  bmi: '23.4', bodyWater: '38 L', waistToHipRatio: '0.88',
  fatMass: '17 kg', fatControl: '-2 kg', muscleControl: '+1 kg',
  referenceCategories: {
    bodyFatPercentage: 'outside', skeletalMuscleMass: 'boundary', visceralFat: 'outside',
    bmi: 'within', bodyWater: 'boundary', waistToHipRatio: 'within'
  },
  corroboratingEvidence: {
    bodyFat: ['fatMass', 'waistToHipRatio'], muscleMass: ['muscleControl'],
    visceralFat: ['bodyFatPercentage'], bmi: [], bodyWater: [], waistHipRatio: []
  }
};

test('the proposed model has exactly four criteria and six eligible alternatives', () => {
  assert.deepEqual(SAW_CRITERIA.map(({ id }) => id), ['resultReview', 'primaryGoal', 'secondaryGoal', 'corroboration']);
  assert.deepEqual(SAW_CRITERIA.map(({ weight }) => weight), [0.45, 0.35, 0.10, 0.10]);
  assert.equal(SAW_CRITERIA.reduce((sum, item) => sum + item.weight, 0), 1);
  const result = scoreClient(report, { primaryGoal: 'fat_loss', secondaryGoal: 'muscle_gain' });
  assert.equal(result.ruleVersion, SAW_RULE_VERSION);
  assert.deepEqual(result.scoredMetrics.map(({ id }) => id).sort(),
    ['bodyFat', 'muscleMass', 'visceralFat', 'bmi', 'bodyWater', 'waistHipRatio'].sort());
  assert.equal(result.scoredMetrics.some(({ id }) => id === 'bmr'), false);
  assert.ok(result.scoredMetrics.every(({ finalScore }) => finalScore >= 0 && finalScore <= 100));
});

test('a controlled worked example yields 95 points without raw-unit normalization', () => {
  const result = scoreClient(report, { primaryGoal: 'fat_loss', secondaryGoal: 'muscle_gain' });
  const bodyFat = result.scoredMetrics.find(({ id }) => id === 'bodyFat');
  assert.deepEqual(bodyFat.ratings, { resultReview: 1, primaryGoal: 1, secondaryGoal: 0.5, corroboration: 1 });
  assert.equal(bodyFat.finalScore, 95);
  assert.equal(bodyFat.steps.reduce((sum, step) => sum + step.contribution, 0), 95);
  assert.equal(result.mainFocus.id, 'bodyFat');
  assert.equal(result.criteria.length, 4);
});

test('no secondary goal removes C3 and rescales the remaining weights', () => {
  const result = scoreClient(report, { primaryGoal: 'fat_loss' });
  assert.equal(result.criteria.some(({ id }) => id === 'secondaryGoal'), false);
  assert.equal(result.criteria.find(({ id }) => id === 'resultReview').effectiveWeight, 0.5);
  assert.ok(Math.abs(result.criteria.find(({ id }) => id === 'primaryGoal').effectiveWeight - 0.35 / 0.9) < 1e-9);
  assert.ok(Math.abs(result.criteria.reduce((sum, item) => sum + item.effectiveWeight, 0) - 1) < 1e-9);
});

test('missing categories and evidence are omitted for everyone, never guessed from values', () => {
  const unclassified = { ...report };
  delete unclassified.referenceCategories;
  delete unclassified.corroboratingEvidence;
  const result = scoreClient(unclassified, { primaryGoal: 'fat_loss' });
  assert.deepEqual(result.criteria.map(({ id }) => id), ['primaryGoal']);
  assert.deepEqual(result.omittedCriteria.map(({ id }) => id), ['resultReview', 'secondaryGoal', 'corroboration']);
  assert.match(result.limitation, /reweighted/);
});

test('derived fat-control values cannot add a second corroborating vote', () => {
  const result = scoreClient({
    ...report,
    corroboratingEvidence: { ...report.corroboratingEvidence, bodyFat: ['fatMass', 'fatControl'] }
  }, { primaryGoal: 'fat_loss', secondaryGoal: 'muscle_gain' });
  assert.equal(result.scoredMetrics.find(({ id }) => id === 'bodyFat').ratings.corroboration, 0.5);
});

test('invalid, missing, and unconfirmed core values never become priorities', () => {
  const result = scoreClient({ bodyFatPercentage: '28%', visceralFat: 'Not shown' }, { primaryGoal: 'fat_loss' });
  assert.deepEqual(result.scoredMetrics.map(({ id }) => id), ['bodyFat']);
  assert.equal(result.topPriorities.length, 0);
  assert.equal(scoreClient({ bodyFatPercentage: '28%', isConfirmed: false }, { primaryGoal: 'fat_loss' }).mainFocus, null);
  assert.equal(scoreClient(report, {}).mainFocus, null);
  assert.equal(scoreClient({ ...report, confirmedFields: ['bmi'] }, { primaryGoal: 'fat_loss' }).scoredMetrics.length, 1);
  assert.equal(scoreClient({ bmi: 'about 23' }, { primaryGoal: 'fat_loss' }).mainFocus, null);
});

test('decimal FitMao measurements keep meaningful display precision', () => {
  const result = scoreClient(report, { primaryGoal: 'fat_loss' });
  assert.equal(result.scoredMetrics.find(({ id }) => id === 'waistHipRatio').value, '0.88');
});

test('QR parsing does not invent missing FitMao values or validate the scan itself', () => {
  const parsed = parseQrPayload('PBF=23.7%;WHR=0.84');
  assert.equal(parsed.bodyFatPercentage, '23.7%');
  assert.equal(parsed.waistToHipRatio, '0.84');
  assert.equal(parsed.skeletalMuscleMass, undefined);
  assert.equal(parsed.isConfirmed, false);
  assert.equal(parseQrPayload('name=Sample'), null);
});

test('activity, readiness, nutrition, and availability never change scores', () => {
  const goals = { primaryGoal: 'muscle_gain', secondaryGoal: 'fat_loss' };
  const first = scoreClient(report, goals);
  const second = scoreClient(report, {
    ...goals, activityCategory: 'aerobic', availability: '1-2', dailyStyle: 'desk',
    nutritionPattern: 'irregular', waterIntake: 'low', hasBoneJointProblem: 'yes', barriers: 'injury'
  });
  assert.deepEqual(second.scoredMetrics.map(({ id, finalScore }) => [id, finalScore]),
    first.scoredMetrics.map(({ id, finalScore }) => [id, finalScore]));
});

test('ties use C1, C2, C4, then fixed alternative order', () => {
  const tied = scoreClient({ bmi: '23', waistToHipRatio: '0.84' }, { primaryGoal: 'muscle_gain' });
  assert.deepEqual(tied.scoredMetrics.map(({ id }) => id), ['bmi', 'waistHipRatio']);
  assert.match(tied.scoredMetrics[0].tieBreak, /Equal scores/);
});

test('client and server share exactly the same calculation', () => {
  const answers = { primaryGoal: 'fat_loss', secondaryGoal: 'muscle_gain', waterIntake: 'low' };
  assert.deepEqual(scoreServer(report, answers), scoreClient(report, answers));
});

test('results explain priorities and show the FitMao visceral level, not a percentage', () => {
  const result = scoreClient(report, { primaryGoal: 'fat_loss', secondaryGoal: 'muscle_gain' });
  const visceral = result.scoredMetrics.find(({ id }) => id === 'visceralFat');
  assert.equal(visceral.title, 'Visceral Fat Level');
  assert.equal(visceral.value, '12');
  assert.equal(formatVisceralFatValue('Level 6.6'), '6.6');
  assert.match(getMetricExplanation(result.mainFocus, 'main').why, /ranked highest/);
  assert.match(getMetricExplanation(visceral, 'supporting', result.mainFocus).why, /weighted score/);
  assert.match(getOverallInterpretation(result.mainFocus, [visceral], { primaryGoal: 'fat_loss' }).guidance, /does not provide a medical diagnosis/);
});
