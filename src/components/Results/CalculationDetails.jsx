import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';

const formatSaw = (value) => Number(value || 0).toFixed(1);

export default function CalculationDetails({ mainFocus, topPriorities = [], otherPriorities = [], calculation = {} }) {
  const [open, setOpen] = useState(false);
  const metrics = [mainFocus, ...topPriorities, ...otherPriorities].filter(Boolean);

  return (
    <section className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/60"
      >
        <span className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300">
            <Calculator className="h-4 w-4" />
          </span>
          <span>
            <strong className="block text-sm font-display text-surface-900 dark:text-white">View SAW Calculation Details</strong>
            <span className="mt-0.5 block text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">Criterion ratings, effective weights, and priority scores</span>
          </span>
        </span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>

      {open && (
        <div className="space-y-3 border-t border-surface-100 p-4 dark:border-surface-800">
          <p className="text-xs leading-relaxed text-surface-500 dark:text-surface-400">
            Proposed rule {calculation.ruleVersion || 'SAW'} assigns each available criterion a documented rating of 0, 0.5, or 1. Each rating is multiplied by its effective weight; the sum is displayed as a priority score out of 100. Raw FitMao units are never compared directly. This is relative decision support, not medical severity or a diagnosis.
          </p>
          {calculation.omittedCriteria?.length > 0 && <p className="text-xs text-amber-700 dark:text-amber-300">The same remaining criteria were reweighted for all eligible measurements. Omitted: {calculation.omittedCriteria.map((item) => `${item.label} (${item.reason})`).join('; ')}</p>}
          <div className="space-y-2">
            {metrics.map((metric, index) => (
              <div key={metric.id || index} className="rounded-2xl border border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-surface-400">Rank #{index + 1}</span>
                    <strong className="ml-2 text-xs font-display text-surface-900 dark:text-white">{metric.title}</strong>
                  </div>
                  <span className="rounded-lg bg-white px-2 py-1 text-[11px] font-mono font-bold text-brand-700 shadow-sm dark:bg-surface-900 dark:text-brand-300">{formatSaw(metric.finalScore ?? metric.currentScore)} / 100</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {(metric.steps || []).map((step) => <div key={step.criterionId} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-[10px] text-surface-600 dark:text-surface-300"><span>{step.category}</span><span>rating {step.rawRating}</span><span>× {(step.criterionWeight * 100).toFixed(1)}%</span><strong className="text-right text-surface-900 dark:text-white">{step.contribution.toFixed(1)} pts</strong></div>)}
                </div>
                {metric.tieBreak && <p className="mt-2 text-[10px] text-surface-500 dark:text-surface-400">{metric.tieBreak}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
