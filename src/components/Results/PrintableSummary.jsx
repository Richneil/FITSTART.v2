import React from 'react';
import { Activity, ArrowRight, Printer, ShieldCheck, Sparkles, Target, X } from 'lucide-react';

function formatFitMaoChange(value, positiveLabel, negativeLabel) {
  const amount = Number.parseFloat(String(value));
  if (Number.isNaN(amount)) return value || 'Not available';
  if (amount === 0) return 'No change';
  return `${amount > 0 ? positiveLabel : negativeLabel} ${Math.abs(amount).toFixed(1)} kg`;
}

function DataItem({ label, value, accent = false }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white px-2.5 py-2">
      <span className="block text-[8px] font-display font-bold uppercase tracking-wide text-surface-400">{label}</span>
      <strong className={`mt-0.5 block text-[11px] ${accent ? 'text-brand-700' : 'text-surface-900'}`}>{value}</strong>
    </div>
  );
}

export default function PrintableSummary({
  profile,
  fitMao = {},
  mainFocus,
  topPriorities = [],
  user,
  onClose
}) {
  const assessmentDate = fitMao.testDate || (profile?.assessed_date
    ? new Date(profile.assessed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const memberName = fitMao.memberName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Member');
  const fitMaoSnapshot = [
    ['Weight', fitMao.weight || 'Not available'],
    ['Body fat', fitMao.bodyFatPercentage || 'Not available'],
    ['Skeletal muscle', fitMao.skeletalMuscleMass || 'Not available'],
    ['Visceral fat', fitMao.visceralFat || 'Not available'],
    ['Resting calories (BMR)', fitMao.bmr || 'Not available'],
    ['Body mass index (BMI)', fitMao.bmi || 'Not available'],
    ['Body water', fitMao.bodyWater || 'Not available']
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-2 font-sans sm:p-4">
      <div className="no-print fixed right-4 top-4 z-50 flex gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-300 px-4 py-2.5 text-xs font-display font-bold text-surface-950 shadow-lg transition-transform hover:bg-brand-600 active:scale-95"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-2xl bg-white p-2.5 text-surface-700 shadow-lg transition-transform hover:bg-surface-100 active:scale-95"
          title="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="print-page my-auto w-full max-w-2xl rounded-3xl border border-surface-200 bg-white p-6 text-surface-900 shadow-2xl print:m-0 print:max-w-none print:border-none print:p-0 print:shadow-none sm:p-7">
        <div className="mb-3 flex items-start justify-between gap-4 border-b-2 border-brand-500 pb-3">
          <div>
            <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-brand-700">
              <Activity className="h-3.5 w-3.5" /> FitStart
            </div>
            <h1 className="text-xl font-display font-extrabold tracking-tight text-surface-900 sm:text-2xl">
              Personalized FitMao Assessment Summary
            </h1>
            <p className="text-[10px] font-medium text-surface-500">Your explainable, personalized fitness starting point</p>
          </div>
          <div className="shrink-0 text-right text-[9px]">
            <strong className="block font-mono text-surface-900">{assessmentDate}</strong>
            <span className="block text-surface-500">{fitMao.testTime || ''}</span>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-100 px-2 py-0.5 font-bold text-surface-700">
              <ShieldCheck className="h-2.5 w-2.5" /> Educational summary
            </span>
          </div>
        </div>

        <section className="mb-3 grid grid-cols-3 gap-2 rounded-2xl border border-surface-200 bg-surface-50 p-3">
          <div>
            <span className="block text-[8px] font-display font-bold uppercase text-surface-400">Member</span>
            <strong className="block truncate text-[11px] font-display text-surface-900">{memberName}</strong>
          </div>
          <div>
            <span className="block text-[8px] font-display font-bold uppercase text-surface-400">Report type</span>
            <strong className="block text-[11px] font-display text-surface-900">FitStart assessment</strong>
          </div>
          <div>
            <span className="block text-[8px] font-display font-bold uppercase text-surface-400">Assessment source</span>
            <strong className="block text-[10px] font-display text-surface-700">{fitMao.dataSource || 'Confirmed FitMao assessment'}</strong>
          </div>
        </section>

        <section className="mb-3 rounded-2xl border border-brand-300 bg-brand-50/80 p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-brand-800">
            <Sparkles className="h-3.5 w-3.5 text-accent-600" /> Your Personalized Starting Point
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-display font-extrabold text-brand-950 sm:text-lg">{mainFocus?.title || 'Main focus'}</h2>
              <strong className="mt-0.5 block font-mono text-xl text-brand-700">{mainFocus?.value || 'Not available'}</strong>
              {mainFocus?.desc && <p className="mt-1 text-[10px] leading-relaxed text-brand-900">{mainFocus.desc}</p>}
            </div>
            <span className="shrink-0 rounded-full border border-brand-200 bg-white px-2.5 py-1 text-[9px] font-display font-bold text-brand-700">Main focus</span>
          </div>
        </section>

        {topPriorities.length > 0 && (
          <section className="mb-3">
            <h3 className="mb-1.5 text-[11px] font-display font-bold text-surface-900">Your Other Priorities</h3>
            <div className="grid grid-cols-2 gap-2">
              {topPriorities.slice(0, 2).map((priority, index) => (
                <div key={priority.id || index} className="rounded-2xl border border-surface-200 bg-white p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-display font-bold text-surface-900">#{index + 2} {priority.title}</span>
                    <strong className="shrink-0 font-mono text-[10px] text-brand-700">{priority.value}</strong>
                  </div>
                  {priority.desc && <p className="mt-1 text-[9px] leading-relaxed text-surface-500">{priority.desc}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-3">
          <div className="rounded-2xl border border-surface-200 bg-white p-3">
            <h3 className="mb-2 text-[11px] font-display font-bold text-surface-900">FitMao Measurement Snapshot</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {fitMaoSnapshot.map(([label, value], index) => (
                <DataItem key={label} label={label} value={value} accent={index === 1 || index === 2} />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-3 rounded-2xl border border-surface-200 bg-surface-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-1 text-[11px] font-display font-bold text-surface-900">
              <Target className="h-3.5 w-3.5 text-accent-600" /> FitMao Estimates
            </h3>
            <span className="text-[8px] text-surface-500">Provided by FitMao, not generated by FitStart</span>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
            <DataItem label="Current weight" value={fitMao.weight || 'Not available'} />
            <ArrowRight className="h-4 w-4 text-brand-600" />
            <DataItem label="FitMao target" value={fitMao.targetWeight || 'Not available'} accent />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <DataItem label="Total change" value={formatFitMaoChange(fitMao.weightControl, 'Gain', 'Lose')} />
            <DataItem label="Fat change" value={formatFitMaoChange(fitMao.fatControl, 'Gain', 'Lose')} />
            <DataItem label="Muscle change" value={formatFitMaoChange(fitMao.muscleControl, 'Gain', 'Reduce')} accent />
          </div>
        </section>

        <section className="rounded-2xl border border-surface-200 bg-surface-50 p-2.5 text-[9px] leading-relaxed text-surface-600">
          <strong className="font-display text-surface-900">Educational note: </strong>
          FitStart helps explain and prioritize your FitMao results. It does not provide a diagnosis, treatment, workout plan, or replacement for qualified professional guidance.
        </section>

        <div className="mt-2 text-center text-[8px] font-mono text-surface-400">
          FitStart v2.4 • Personalized FitMao Assessment Summary
        </div>
      </div>
    </div>
  );
}
