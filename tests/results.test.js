import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreMetrics as scoreClientMetrics } from '../src/utils/scoreMetrics.js';
import { scoreMetrics as scoreServerMetrics } from '../server/utils/scoreMetrics.js';
import {
  formatVisceralFatValue,
  getMetricExplanation,
  getOverallInterpretation
} from '../src/utils/resultExplanations.js';

const mainFocus = { id: 'bodyFat', title: 'Body Fat %', value: '23.7%' };
const musclePriority = { id: 'muscleMass', title: 'Skeletal Muscle Mass', value: '29.7 kg' };
const visceralPriority = { id: 'visceralFat', title: 'Visceral Fat Level', value: '6.6' };

test('client and server show the FitMao visceral value without a repeated level label', () => {
  const report = { bodyFatPercentage: '23.7%', skeletalMuscleMass: '29.7 kg', visceralFat: 'Level 6.6' };
  for (const scoreMetrics of [scoreClientMetrics, scoreServerMetrics]) {
    const metric = scoreMetrics(report, { primaryGoal: 'fat_loss' }).scoredMetrics
      .find((item) => item.id === 'visceralFat');
    assert.equal(metric.title, 'Visceral Fat Level');
    assert.equal(metric.value, '6.6');
  }
  assert.equal(formatVisceralFatValue('Level 4'), '4');
});

test('missing visceral measurements are not invented as priorities', () => {
  for (const scoreMetrics of [scoreClientMetrics, scoreServerMetrics]) {
    const metrics = scoreMetrics({ bodyFatPercentage: '23.7%' }, { primaryGoal: 'fat_loss' });
    assert.equal(metrics.scoredMetrics.some((item) => item.id === 'visceralFat'), false);
    const placeholders = scoreMetrics({ visceralFat: 'Not shown', bodyFatPercentage: 'N/A', bodyWater: 'Not available', bmr: '—' }, { primaryGoal: 'fat_loss' });
    assert.equal(placeholders.scoredMetrics.length, 0);
  }
});

test('unified interpretation connects the main focus and two supporting priorities', () => {
  const result = getOverallInterpretation(mainFocus, [visceralPriority, musclePriority], { primaryGoal: 'fat_loss' });
  assert.match(result.summary, /Body Fat % \(23\.7%\)/);
  assert.match(result.summary, /Visceral Fat Level \(6\.6\) and Skeletal Muscle Mass \(29\.7 kg\) provide/);
  assert.match(result.guidance, /does not provide a medical diagnosis or prescribe a workout/);
});

test('unified interpretation remains grammatical when fewer priorities are available', () => {
  const one = getOverallInterpretation(mainFocus, [musclePriority], { primaryGoal: 'muscle_gain' });
  assert.match(one.summary, /Skeletal Muscle Mass \(29\.7 kg\) provides supporting context/);
  const none = getOverallInterpretation(mainFocus, [], { primaryGoal: 'posture_mobility' });
  assert.match(none.summary, /No additional supporting priority was available/);
  const empty = getOverallInterpretation(null, [], {});
  assert.match(empty.summary, /could not identify a Main Focus/);
  assert.doesNotThrow(() => getMetricExplanation(null, 'main'));
});

test('SAW criteria weights sum to 1 and legacy base points are removed', async () => {
  const { SAW_CRITERIA } = await import('../src/utils/scoreMetrics.js');
  const totalWeight = SAW_CRITERIA.reduce((sum, criterion) => sum + criterion.weight, 0);
  assert.ok(Math.abs(totalWeight - 1) < 1e-9);

  const report = {
    bodyFatPercentage: '28%',
    skeletalMuscleMass: '29.7 kg',
    visceralFat: 'Level 12',
    bodyWater: '38 L',
    bmr: '1480 kcal',
    bmi: '23.4'
  };
  const result = scoreClientMetrics(report, { primaryGoal: 'fat_loss', activityCategory: 'aerobic' });
  assert.equal(result.method, 'SAW');
  assert.ok(result.scoredMetrics.every((metric) => metric.baseScore === 0));
  assert.ok(result.scoredMetrics.every((metric) => metric.scoringMethod === 'SAW'));
  assert.ok(result.scoredMetrics.every((metric) => metric.finalScore >= 0 && metric.finalScore <= 1));
});

test('SAW preference score equals the sum of weighted normalized criterion contributions', () => {
  const report = {
    bodyFatPercentage: '28%',
    skeletalMuscleMass: '29.7 kg',
    visceralFat: 'Level 12',
    bodyWater: '38 L',
    bmr: '1480 kcal',
    bmi: '23.4'
  };
  const result = scoreClientMetrics(report, {
    primaryGoal: 'fat_loss',
    secondaryGoal: 'health_longevity',
    activityCategory: 'aerobic',
    availability: '1-2',
    dailyStyle: 'desk',
    nutritionPattern: 'dining_out',
    waterIntake: 'low'
  });

  for (const metric of result.scoredMetrics) {
    const sum = metric.steps.reduce((total, step) => total + step.contribution, 0);
    assert.ok(Math.abs(sum - metric.finalScore) < 0.0001);
    for (const step of metric.steps) {
      assert.ok(step.normalizedRating >= 0 && step.normalizedRating <= 1);
    }
  }
});

test('client and server produce the same SAW ranking', () => {
  const report = {
    bodyFatPercentage: '31.2%',
    skeletalMuscleMass: '33 kg',
    visceralFat: 'Level 15',
    bodyWater: '42 L',
    bmr: '1720 kcal',
    bmi: '27.9'
  };
  const answers = {
    primaryGoal: 'fat_loss',
    activityCategory: 'aerobic',
    dailyStyle: 'desk',
    nutritionPattern: 'dining_out'
  };
  const client = scoreClientMetrics(report, answers);
  const server = scoreServerMetrics(report, answers);
  assert.deepEqual(
    client.scoredMetrics.map((metric) => [metric.id, metric.finalScore]),
    server.scoredMetrics.map((metric) => [metric.id, metric.finalScore])
  );
});
