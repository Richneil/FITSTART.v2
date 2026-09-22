import React from 'react';
import { BookOpenCheck, ShieldCheck } from 'lucide-react';
import { getOverallInterpretation } from '../../utils/resultExplanations.js';

export default function OverallInterpretation({ mainFocus, topPriorities = [], parqAnswers = {} }) {
  const interpretation = getOverallInterpretation(mainFocus, topPriorities, parqAnswers);

  return (
    <section className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card dark:border-surface-800 dark:bg-surface-900">
      <div className="border-b border-surface-200 bg-surface-50 px-5 py-4 dark:border-surface-800 dark:bg-surface-800/60 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <BookOpenCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display font-extrabold text-surface-900 dark:text-white">What This Means for You</h2>
              <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">A combined explanation of your three priorities</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-display font-bold text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Educational interpretation
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <p className="rounded-2xl border border-brand-200 bg-brand-50/70 p-3 text-xs leading-relaxed text-surface-700 dark:border-brand-900 dark:bg-brand-950/30 dark:text-surface-300">
          {interpretation.basis}
        </p>

        <div>
          <h3 className="text-sm font-display font-extrabold text-surface-900 dark:text-white">Overall interpretation</h3>
          <p className="mt-2 text-sm leading-6 text-surface-600 dark:text-surface-300">{interpretation.summary}</p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
          <h3 className="text-xs font-display font-extrabold text-surface-900 dark:text-white">Important guidance</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-surface-600 dark:text-surface-300">{interpretation.guidance}</p>
        </div>
      </div>
    </section>
  );
}
