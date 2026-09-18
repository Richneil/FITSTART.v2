import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, BookOpen, ChevronDown, ChevronUp, FileText,
  Info, ScanLine, Settings2
} from 'lucide-react';
import { api } from '../../utils/api.js';
import { formatMetricValue } from '../../utils/resultExplanations.js';

function ReportPreview({ metrics }) {
  const rows = [
    ['Body Water', formatMetricValue(metrics.bodyWater, 'L')],
    ['Skeletal Muscle', formatMetricValue(metrics.skeletalMuscleMass, 'kg')],
    ['Body Fat Mass', formatMetricValue(metrics.fatMass, 'kg')],
    ['BMI', formatMetricValue(metrics.bmi)],
    ['Percent Body Fat', formatMetricValue(metrics.bodyFatPercentage, '%')],
    ['Visceral Fat', formatMetricValue(metrics.visceralFat, 'level')]
  ];

  return (
    <div role="img" aria-label="Preview of the scanned FitMao body composition report" className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-4 text-slate-900 shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b-4 border-blue-700 pb-3">
        <div>
          <strong className="block text-lg font-display font-extrabold text-blue-800 sm:text-2xl">Body Composition Analysis Report</strong>
          <span className="text-[10px] text-slate-500">{metrics.memberName || 'FitStart member'} · {metrics.testDate || 'Assessment date'}</span>
        </div>
        <strong className="shrink-0 text-xl font-display text-blue-700 sm:text-2xl">FitMao</strong>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px]">
        <div className="overflow-hidden rounded-xl border border-blue-100">
          <div className="bg-blue-700 px-3 py-2 text-xs font-display font-bold text-white">Body Composition Analysis</div>
          <div className="grid grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="border-b border-r border-blue-100 p-2.5 last:border-b-0">
                <span className="block text-[9px] font-bold uppercase tracking-wide text-blue-700">{label}</span>
                <strong className="mt-1 block font-mono text-xs">{value}</strong>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-50">
                  <div className="h-full w-2/3 rounded-full bg-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-blue-50 p-3 text-center">
            <span className="block text-[9px] font-bold uppercase tracking-wide text-blue-700">FitMao Score</span>
            <strong className="mt-1 block text-3xl font-display text-blue-900">{metrics.healthScore || '75'}</strong>
          </div>
          <div className="rounded-xl border border-blue-100 p-3">
            <span className="block text-[9px] font-bold uppercase tracking-wide text-blue-700">Body Type</span>
            <strong className="mt-1 block text-xs">{metrics.bodyType || 'FitMao classification'}</strong>
          </div>
          <div className="rounded-xl border border-blue-100 p-3">
            <span className="block text-[9px] font-bold uppercase tracking-wide text-blue-700">Target Weight</span>
            <strong className="mt-1 block font-mono text-xs">{formatMetricValue(metrics.targetWeight, 'kg')}</strong>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[['Weight', metrics.weight], ['SMM', metrics.skeletalMuscleMass], ['PBF', metrics.bodyFatPercentage]].map(([label, value], index) => (
          <div key={label} className="rounded-lg bg-slate-50 p-2">
            <span className="block text-[9px] font-bold text-slate-500">{label} history</span>
            <svg viewBox="0 0 100 28" className="mt-1 h-7 w-full" aria-hidden="true">
              <polyline points={index === 1 ? '4,18 25,16 48,8 72,14 96,11' : '4,19 25,17 48,20 72,11 96,13'} fill="none" stroke="#2563eb" strokeWidth="3" />
            </svg>
            <span className="block text-right text-[9px] font-mono">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricRow({ term, value, explanation, source = 'From FitMao' }) {
  return (
    <div className="grid gap-2 border-t border-surface-100 py-3 first:border-t-0 sm:grid-cols-[170px_100px_1fr] dark:border-surface-800">
      <div>
        <strong className="block text-xs font-display text-surface-900 dark:text-white">{term}</strong>
        <span className="mt-0.5 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">{source}</span>
      </div>
      <span className="text-xs font-mono font-bold text-surface-700 dark:text-surface-200">{value}</span>
      <p className="text-xs leading-relaxed text-surface-500 dark:text-surface-400">{explanation}</p>
    </div>
  );
}

function ExplanationCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-4 shadow-card dark:border-surface-800 dark:bg-surface-900 sm:p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300"><Icon className="h-4 w-4" /></span>
        <h2 className="font-display font-extrabold text-surface-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function FullFitMaoReport() {
  const { profileId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await api.getResults(profileId);
        setProfile(data.profile);
      } catch (err) {
        setError(err.message || 'Could not load the FitMao report.');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [profileId]);

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-200 border-t-brand-500" /></div>;
  }

  if (error || !profile) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <h1 className="mt-3 text-xl font-display font-bold">Report unavailable</h1>
        <p className="mt-2 text-sm text-surface-500">{error || 'The assessment could not be found.'}</p>
        <Link to={`/results/${profileId}`} className="btn-primary mt-5">Back to FitStart Results</Link>
      </div>
    );
  }

  const m = profile.fitMao_report_data || {};

  return (
    <main className="mx-auto min-h-screen max-w-6xl bg-surface-50 px-3 pb-28 pt-5 font-sans dark:bg-surface-950 sm:px-6 lg:px-8">
      <Link to={`/results/${profileId}`} className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-brand-700 hover:text-brand-800 dark:text-brand-300">
        <ArrowLeft className="h-4 w-4" /> Back to FitStart Results
      </Link>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-surface-900 dark:text-white">View More of the FitMao Report</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-500 dark:text-surface-400">Review the report preview and understand its other measurements in simple terms.</p>
        </div>
        <span className="inline-flex self-start items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[11px] font-display font-bold text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300"><BookOpen className="h-3.5 w-3.5" /> Educational interpretation</span>
      </div>

      <section className="mt-6 rounded-3xl border border-surface-200 bg-white p-4 shadow-card dark:border-surface-800 dark:bg-surface-900 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
          <div>
            <h2 className="font-display font-extrabold text-surface-900 dark:text-white">Your Scanned FitMao Report</h2>
            <p className="text-[11px] text-surface-500 dark:text-surface-400">Prototype report preview created from the confirmed assessment values</p>
          </div>
        </div>
        <div className="rounded-3xl bg-surface-900 p-3 dark:bg-black/30 sm:p-6"><ReportPreview metrics={m} /></div>
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-50 p-3 text-xs leading-relaxed text-surface-600 dark:bg-brand-950/30 dark:text-surface-300"><Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> The explanations below describe the terms shown in this report. They do not replace or recalculate the original FitMao values.</p>
      </section>

      <div className="mb-4 mt-8">
        <h2 className="text-2xl font-display font-extrabold text-surface-900 dark:text-white">Plain-English Explanation</h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">Read each section to understand what the displayed terms represent.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ExplanationCard title="Body Composition Analysis" icon={ScanLine}>
          <MetricRow term="Body Water" value={formatMetricValue(m.bodyWater, 'L')} explanation="The estimated total amount of water in your body." />
          <MetricRow term="Fat-Free Mass" value={formatMetricValue(m.fatFreeMass, 'kg')} explanation="Everything in your body except estimated stored fat." />
          <MetricRow term="Protein and Minerals" value={`${formatMetricValue(m.proteinMass, 'kg')} · ${formatMetricValue(m.boneMineralContent, 'kg')}`} explanation="Supporting device estimates used in the body-composition breakdown. Bone mineral content is not a diagnosis of bone health." />
        </ExplanationCard>

        <ExplanationCard title="Muscle–Fat Analysis" icon={ScanLine}>
          <MetricRow term="Weight" value={formatMetricValue(m.weight, 'kg')} explanation="Your total measured body weight at the time of the assessment." />
          <MetricRow term="Skeletal Muscle Mass" value={formatMetricValue(m.skeletalMuscleMass, 'kg')} explanation="The estimated muscles used for movement, posture and strength." />
          <MetricRow term="Body Fat Mass" value={formatMetricValue(m.fatMass, 'kg')} explanation="The estimated weight of fat in your body." />
        </ExplanationCard>

        <ExplanationCard title="Obesity Analysis" icon={ScanLine}>
          <MetricRow term="BMI" value={formatMetricValue(m.bmi)} explanation="A height-to-weight screening value that does not separate muscle from body fat." />
          <MetricRow term="Percent Body Fat" value={formatMetricValue(m.bodyFatPercentage, '%')} explanation="The estimated percentage of your body weight that is fat." />
        </ExplanationCard>

        <ExplanationCard title="Comprehensive Evaluation" icon={ScanLine}>
          <MetricRow term="Basal Metabolic Rate" value={formatMetricValue(m.bmr, 'kcal')} explanation="FitMao’s estimate of energy used at rest. It is not a calorie prescription." />
          <MetricRow term="Waist–Hip Ratio" value={formatMetricValue(m.waistToHipRatio)} explanation="A comparison of waist and hip measurements." />
          <MetricRow term="Visceral Fat Level" value={formatMetricValue(m.visceralFat, 'level')} explanation="FitMao’s estimate of fat stored around the abdominal organs." />
        </ExplanationCard>

        <ExplanationCard title="Segmental Assessment" icon={ScanLine}>
          <MetricRow term="Segmental Lean" value="Shown by body area" explanation="Shows how estimated lean mass is distributed across the arms, trunk and legs." />
          <MetricRow term="Segmental Fat" value="Shown by body area" explanation="Shows how estimated fat is distributed across those body areas." />
        </ExplanationCard>

        <ExplanationCard title="Body Composition History" icon={ScanLine}>
          <MetricRow term="Previous assessments" value="When available" explanation="Shows changes in Weight, Skeletal Muscle Mass and Percent Body Fat across earlier FitMao assessments." />
        </ExplanationCard>
      </div>

      <section className="mt-4 rounded-3xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
          <div className="w-full">
            <h2 className="font-display font-extrabold text-surface-900 dark:text-white">FitMao-Generated Estimates</h2>
            <p className="mt-1 text-xs leading-relaxed text-surface-600 dark:text-surface-300">These values are generated by the FitMao device. FitStart explains what they display but does not calculate them or treat them as recommendations from a coach.</p>
            <div className="mt-3 grid gap-x-5 md:grid-cols-2">
              <MetricRow term="Score" value={formatMetricValue(m.healthScore)} explanation="A device-generated overall score from FitMao." source="FitMao estimate" />
              <MetricRow term="Physiological Age" value={formatMetricValue(m.bodyAge)} explanation="A device comparison estimate—not your medical or actual age." source="FitMao estimate" />
              <MetricRow term="Body Type" value={formatMetricValue(m.bodyType)} explanation="A device-generated classification based on the report’s body-composition values." source="FitMao estimate" />
              <MetricRow term="Target Weight" value={formatMetricValue(m.targetWeight, 'kg')} explanation="A device-generated estimate, not a personal training or nutrition prescription." source="FitMao estimate" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
        <button type="button" onClick={() => setShowTechnical((value) => !value)} aria-expanded={showTechnical} className="flex w-full items-center justify-between gap-4 p-4 text-left">
          <span><strong className="block text-sm font-display text-surface-900 dark:text-white">Technical Terms</strong><span className="text-[11px] text-surface-500 dark:text-surface-400">ECF, ICF, Protein, Minerals and Impedance</span></span>
          {showTechnical ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showTechnical && <div className="border-t border-surface-100 p-4 text-xs leading-relaxed text-surface-500 dark:border-surface-800 dark:text-surface-400">These are supporting technical values used by the FitMao device. FitStart presents them for report literacy but does not use them alone to diagnose health or prescribe training.</div>}
      </section>

      <section className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-950/30">
        <h2 className="text-sm font-display font-extrabold text-surface-900 dark:text-white">How to use this page</h2>
        <p className="mt-1 text-xs leading-relaxed text-surface-600 dark:text-surface-300">Use these explanations to understand the report. Return to your FitStart Results to review your Main Focus and Supporting Priorities, then discuss them with a qualified trainer or coach.</p>
      </section>

      <Link to={`/results/${profileId}`} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-500 bg-white px-4 py-3 text-xs font-display font-extrabold text-brand-700 transition-colors hover:bg-brand-50 dark:bg-surface-900 dark:text-brand-300 dark:hover:bg-brand-950/30">
        <ArrowLeft className="h-4 w-4" /> Back to FitStart Results
      </Link>
    </main>
  );
}
