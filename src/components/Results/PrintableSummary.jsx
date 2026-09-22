import React from 'react';
import { createPortal } from 'react-dom';
import { Printer, ShieldCheck, Target, Users, X } from 'lucide-react';
import FitStartLogo from '../FitStartLogo.jsx';
import {
  formatMetricValue,
  formatVisceralFatValue,
  getMetricExplanation,
  getOverallInterpretation
} from '../../utils/resultExplanations.js';

function hasValue(value) {
  return value !== undefined && value !== null
    && !/^(?:|not shown|not available|n\/a|—|-)$/i.test(String(value).trim());
}

function parseNumeric(value) {
  if (!hasValue(value)) return null;
  const parsed = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(parsed) ? null : parsed;
}

function formatDate(value) {
  if (!value) return 'Not available';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatFitMaoChange(value, positiveLabel, negativeLabel) {
  const amount = parseNumeric(value);
  if (amount === null) return 'Not shown';
  if (amount === 0) return 'No change';
  return `${amount > 0 ? positiveLabel : negativeLabel} ${Math.abs(amount).toFixed(1)} kg`;
}

function formatComparisonValue(value, type, unit = '') {
  if (!hasValue(value)) return 'Not shown';
  if (type === 'visceral') return formatVisceralFatValue(value);
  return formatMetricValue(value, unit);
}

function buildComparison(previousMetrics = {}, currentMetrics = {}) {
  const fields = [
    ['Weight', 'weight', 'kg'],
    ['Percent Body Fat', 'bodyFatPercentage', '%'],
    ['Skeletal Muscle Mass', 'skeletalMuscleMass', 'kg'],
    ['Visceral Fat Level', 'visceralFat', '', 'visceral'],
    ['Body Water', 'bodyWater', 'L'],
    ['Basal Metabolic Rate', 'bmr', 'kcal']
  ];

  return fields.map(([label, key, unit, type]) => {
    const previousValue = previousMetrics[key];
    const currentValue = currentMetrics[key];
    const previousNumber = parseNumeric(previousValue);
    const currentNumber = parseNumeric(currentValue);
    const difference = previousNumber !== null && currentNumber !== null
      ? Number((currentNumber - previousNumber).toFixed(1))
      : null;
    const change = difference === null
      ? 'Not available'
      : difference === 0
        ? 'No change'
        : `${difference > 0 ? '+' : ''}${difference}${unit ? ` ${unit}` : ''}`;

    return {
      label,
      previous: formatComparisonValue(previousValue, type, unit),
      current: formatComparisonValue(currentValue, type, unit),
      change
    };
  });
}

function DataItem({ label, value, explanation, compact = false }) {
  return (
    <div className={`border-t border-surface-200 first:border-t-0 ${compact ? 'py-1.5' : 'py-2'}`}>
      <div className="flex items-start justify-between gap-3">
        <strong className="block text-[11px] font-display text-surface-900">{label}</strong>
        <strong className="shrink-0 text-right font-mono text-[11px] text-surface-800">{value}</strong>
      </div>
      {explanation && <p className="mt-1 text-[10px] leading-[1.35] text-surface-500">{explanation}</p>}
    </div>
  );
}

function PageHeader({ assessmentDate, page, compact = false }) {
  return (
    <div className={`${compact ? 'mb-3 pb-2' : 'mb-4 pb-3'} flex items-start justify-between gap-4 border-b-2 border-brand-400`}>
      <FitStartLogo onLight className="pdf-logo" />
      <div className="text-right">
        <strong className="block text-[9px] font-display text-surface-900">{assessmentDate}</strong>
        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[8px] font-bold text-brand-800">
          <ShieldCheck className="h-2.5 w-2.5" /> Educational summary
        </span>
        <span className="mt-1 block text-[7px] text-surface-400">Page {page} of 2</span>
      </div>
    </div>
  );
}

export default function PrintableSummary({
  profile,
  fitMao = {},
  mainFocus,
  topPriorities = [],
  parqAnswers = {},
  previousAssessment = null,
  user,
  onClose
}) {
  const assessmentDate = formatDate(fitMao.testDate || profile?.assessed_date || new Date());
  const memberName = fitMao.memberName
    || user?.fullName
    || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'FitStart member');
  const interpretation = getOverallInterpretation(mainFocus, topPriorities, parqAnswers);
  const mainExplanation = getMetricExplanation(mainFocus, 'main');
  const previousMetrics = previousAssessment?.fitMao_report_data || {};
  const comparison = buildComparison(previousMetrics, fitMao);
  const discussionOrder = [mainFocus, ...topPriorities].filter(Boolean).slice(0, 3);

  const referenceSections = [
    {
      title: 'Body Composition Analysis',
      items: [
        ['Body Water', formatMetricValue(fitMao.bodyWater, 'L'), 'The estimated total amount of water in your body.'],
        ['Fat-Free Mass', formatMetricValue(fitMao.fatFreeMass, 'kg'), 'Everything in your body except estimated stored fat.'],
        ['Protein', formatMetricValue(fitMao.proteinMass, 'kg'), 'A supporting estimate used in the body-composition breakdown.'],
        ['Minerals', formatMetricValue(fitMao.boneMineralContent, 'kg'), 'A device estimate; it is not a diagnosis of bone health.']
      ]
    },
    {
      title: 'Muscle-Fat Analysis',
      items: [
        ['Weight', formatMetricValue(fitMao.weight, 'kg'), 'Your total measured body weight at the time of assessment.'],
        ['Skeletal Muscle Mass', formatMetricValue(fitMao.skeletalMuscleMass, 'kg'), 'The estimated muscles used for movement, posture and strength.'],
        ['Body Fat Mass', formatMetricValue(fitMao.fatMass, 'kg'), 'The estimated weight of fat in your body.']
      ]
    },
    {
      title: 'Obesity Analysis',
      items: [
        ['BMI', formatMetricValue(fitMao.bmi), 'A height-to-weight screening value that does not separate muscle from body fat.'],
        ['Percent Body Fat', formatMetricValue(fitMao.bodyFatPercentage, '%'), 'The estimated percentage of your body weight that is fat.']
      ]
    },
    {
      title: 'Comprehensive Evaluation',
      items: [
        ['Basal Metabolic Rate', formatMetricValue(fitMao.bmr, 'kcal'), 'FitMao estimate of energy used at rest; it is not a calorie prescription.'],
        ['Waist-Hip Ratio', formatMetricValue(fitMao.waistToHipRatio), 'A comparison of waist and hip measurements.'],
        ['Visceral Fat Level', formatVisceralFatValue(fitMao.visceralFat), 'FitMao estimate of fat stored around the abdominal organs.']
      ]
    },
    {
      title: 'Segmental Assessment',
      items: [
        ['Segmental Lean', 'Not captured', 'When available on a FitMao report, this shows estimated lean mass across the arms, trunk and legs.'],
        ['Segmental Fat', 'Not captured', 'When available on a FitMao report, this shows estimated fat across those body areas.']
      ]
    },
    {
      title: 'Body Composition History',
      items: [
        ['Previous assessment', previousAssessment ? formatDate(previousAssessment.assessed_date || previousAssessment.created_at) : 'Not available', 'The comparison on Page 1 shows changes in supported measurements when an earlier assessment is available.']
      ]
    }
  ];

  const fitMaoEstimates = [
    ['Score', formatMetricValue(fitMao.healthScore), 'Device-generated overall score.'],
    ['Physiological Age', formatMetricValue(fitMao.bodyAge), 'Device comparison estimate, not your medical age.'],
    ['Body Type', formatMetricValue(fitMao.bodyType), 'Device-generated body-composition classification.'],
    ['Target Weight', formatMetricValue(fitMao.targetWeight, 'kg'), 'Device-generated estimate, not a prescription.'],
    ['Weight Control', formatFitMaoChange(fitMao.weightControl, 'Gain', 'Lose'), 'FitMao control estimate.'],
    ['Fat Control', formatFitMaoChange(fitMao.fatControl, 'Gain', 'Lose'), 'FitMao control estimate.'],
    ['Muscle Control', formatFitMaoChange(fitMao.muscleControl, 'Gain', 'Reduce'), 'FitMao control estimate.']
  ];

  return createPortal(
    <div className="print-overlay fixed inset-0 z-50 overflow-y-auto bg-black/85 p-2 font-sans sm:p-4">
      <div className="no-print fixed right-4 top-4 z-50 flex gap-2">
        <button type="button" onClick={() => window.print()} className="flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-300 px-4 py-2.5 text-xs font-display font-bold text-surface-950 shadow-lg transition-transform hover:bg-brand-200 active:scale-95">
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </button>
        <button type="button" onClick={onClose} className="cursor-pointer rounded-2xl bg-white p-2.5 text-surface-700 shadow-lg transition-transform hover:bg-surface-100 active:scale-95" title="Close preview">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="print-page mx-auto flex w-full max-w-3xl flex-col gap-4 text-surface-900">
        <article className="print-sheet rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <PageHeader assessmentDate={assessmentDate} page="1" />

          <div className="mb-4">
            <h1 className="text-xl font-display font-extrabold text-surface-950">Your FitStart Results</h1>
            <p className="mt-1 text-[9px] text-surface-500">A personalized starting point for your discussion with a qualified fitness professional.</p>
          </div>

          <section className="mb-3 grid grid-cols-3 gap-2 rounded-2xl border border-surface-200 bg-surface-50 p-3">
            <div><span className="block text-[7px] font-bold uppercase text-surface-400">Member</span><strong className="block truncate text-[10px] text-surface-900">{memberName}</strong></div>
            <div><span className="block text-[7px] font-bold uppercase text-surface-400">Assessment source</span><strong className="block text-[9px] text-surface-900">{fitMao.dataSource || 'Confirmed FitMao assessment'}</strong></div>
            <div><span className="block text-[7px] font-bold uppercase text-surface-400">Report purpose</span><strong className="block text-[9px] text-surface-900">Coach discussion guide</strong></div>
          </section>

          <section className="mb-3 rounded-2xl border border-brand-300 bg-brand-50/70 p-3.5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[8px] font-bold uppercase tracking-wide text-brand-800">Main Focus</span>
              <strong className="font-mono text-sm text-brand-800">{mainFocus?.value || 'Not shown'}</strong>
            </div>
            <h2 className="text-base font-display font-extrabold text-surface-950">{mainFocus?.title || 'Main Focus'}</h2>
            <p className="mt-1 text-[9px] leading-relaxed text-surface-600">{mainExplanation.definition}</p>
            <p className="mt-1.5 text-[9px] leading-relaxed text-surface-700"><strong>Why this was selected: </strong>{mainExplanation.why}</p>
          </section>

          <section className="mb-3">
            <h2 className="mb-1.5 text-[10px] font-display font-extrabold text-surface-950">Supporting Priorities</h2>
            <div className="grid grid-cols-2 gap-2">
              {topPriorities.slice(0, 2).map((priority, index) => {
                const explanation = getMetricExplanation(priority, 'supporting', mainFocus);
                return (
                  <div key={priority.id || index} className="rounded-2xl border border-surface-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-[10px] font-display text-surface-900">{priority.title}</strong>
                      <strong className="shrink-0 font-mono text-[10px] text-brand-700">{priority.value}</strong>
                    </div>
                    <p className="mt-1 text-[8px] leading-relaxed text-surface-500">{explanation.definition}</p>
                    <p className="mt-1 text-[8px] leading-relaxed text-surface-600"><strong>Why included: </strong>{explanation.why}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-3 rounded-2xl border border-surface-200 bg-surface-50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-display font-extrabold text-surface-950"><ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> What This Means for You</div>
            <p className="text-[8px] font-semibold leading-relaxed text-surface-600">{interpretation.basis}</p>
            <p className="mt-1.5 text-[9px] leading-relaxed text-surface-700">{interpretation.summary}</p>
          </section>

          <section className="mb-3 rounded-2xl border border-brand-200 p-3">
            <h2 className="flex items-center gap-1.5 text-[10px] font-display font-extrabold text-surface-950"><Users className="h-3.5 w-3.5 text-brand-600" /> Your Recommended Next Step</h2>
            <p className="mt-1 text-[8px] text-surface-500">Use this order to begin a conversation with a qualified trainer or coach.</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {discussionOrder.map((metric, index) => <div key={metric.id || index} className="rounded-xl bg-surface-50 p-2"><span className="text-[7px] font-bold text-brand-700">{index + 1}. {index === 0 ? 'Discuss first' : 'Supporting'}</span><strong className="mt-0.5 block text-[9px] text-surface-900">{metric.title}</strong></div>)}
            </div>
          </section>

          <section className="mb-3 rounded-2xl border border-surface-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-1.5 text-[10px] font-display font-extrabold text-surface-950"><Target className="h-3.5 w-3.5 text-brand-600" /> Changes Since the Previous Assessment</h2>
              {previousAssessment && <span className="text-[7px] text-surface-400">Compared with {formatDate(previousAssessment.assessed_date || previousAssessment.created_at)}</span>}
            </div>
            {previousAssessment ? (
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {comparison.map((item) => <div key={item.label} className="rounded-xl bg-surface-50 p-2"><strong className="block text-[8px] text-surface-900">{item.label}</strong><span className="mt-0.5 block text-[7px] text-surface-500">{item.previous} to {item.current}</span><span className="mt-0.5 block font-mono text-[8px] font-bold text-brand-700">{item.change}</span></div>)}
              </div>
            ) : (
              <p className="mt-2 rounded-xl bg-surface-50 p-2 text-[8px] text-surface-500">No previous assessment is available for comparison.</p>
            )}
          </section>

          <p className="rounded-xl bg-brand-50 p-2.5 text-[8px] leading-relaxed text-surface-600"><strong className="text-surface-900">Important guidance: </strong>{interpretation.guidance}</p>
        </article>

        <article className="print-sheet rounded-3xl bg-white p-5 shadow-2xl">
          <PageHeader assessmentDate={assessmentDate} page="2" compact />
          <div className="mb-2">
            <h1 className="text-lg font-display font-extrabold text-surface-950">Understanding Your Other FitMao Results</h1>
            <p className="mt-1 text-[9px] leading-relaxed text-surface-500">These values remain available for educational interpretation even when they were not selected as priorities.</p>
          </div>

          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {referenceSections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-surface-200 p-2.5">
                <h2 className="text-[11px] font-display font-extrabold text-surface-950">{section.title}</h2>
                <div className="mt-1">
                  {section.items.map(([label, value, explanation]) => <DataItem compact key={label} label={label} value={value} explanation={explanation} />)}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-2 rounded-2xl border border-brand-200 bg-brand-50/70 p-2.5">
            <h2 className="text-[11px] font-display font-extrabold text-surface-950">FitMao-Generated Estimates</h2>
            <p className="mt-1 text-[8px] leading-relaxed text-surface-600">FitStart explains what these device-generated values display but does not calculate them or treat them as recommendations from a coach.</p>
            <div className="mt-2 grid grid-cols-4 gap-x-3">
              {fitMaoEstimates.map(([label, value, explanation]) => <DataItem compact key={label} label={label} value={value} explanation={explanation} />)}
            </div>
          </section>

          <section className="mt-2 rounded-2xl border border-surface-200 bg-surface-50 p-2.5">
            <h2 className="text-[11px] font-display font-extrabold text-surface-950">How to use this report</h2>
            <p className="mt-1 text-[8px] leading-relaxed text-surface-600">Use these explanations to understand the displayed terms, then return to the Main Focus and Supporting Priorities on Page 1 when speaking with a qualified trainer or coach. FitStart does not replace professional judgment.</p>
          </section>

          <div className="mt-2 border-t border-surface-200 pt-2 text-center text-[7px] text-surface-400">FitStart v2.4 - Personalized FitMao Assessment Summary</div>
        </article>
      </div>
    </div>,
    document.body
  );
}
