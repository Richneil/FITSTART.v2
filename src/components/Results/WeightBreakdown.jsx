import React, { useState } from 'react';
import { Calculator, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const format = (value, places = 1) => Number(value || 0).toFixed(places);

export default function WeightBreakdown({ metric }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!metric || !metric.steps) return null;

  return (
    <div className="mt-3 pt-3 border-t border-surface-200/60 dark:border-surface-700/60">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs font-display font-bold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200 transition-colors py-1 group cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          {isOpen ? 'Hide SAW calculation' : 'How this SAW priority was calculated'}
        </span>
        <span className="text-[10px] font-mono bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-200 px-2 py-0.5 rounded-md font-bold group-hover:bg-brand-200 transition-colors">
          {format(metric.finalScore ?? metric.currentScore)} / 100 {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 p-3.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 animate-slide-up text-left">
          <div className="mb-3 rounded-xl border border-surface-200 bg-white/70 p-2.5 text-[11px] leading-relaxed text-surface-600 dark:border-surface-700 dark:bg-surface-900/50 dark:text-surface-300">
            <strong className="text-surface-900 dark:text-white">Proposed SAW formula:</strong> score = 100 × Σ(effective weight × standardized 0–1 rating). Raw FitMao units are not divided by one another.
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 pb-2 mb-2.5 border-b border-surface-200 dark:border-surface-700 text-[11px] font-display font-bold text-surface-700 dark:text-surface-300">
            <span>Criterion calculation</span>
            <span>Contribution</span>
          </div>

          <div className="space-y-2 text-xs">
            {metric.steps.map((step, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-surface-200/70 bg-white/60 p-2.5 text-surface-700 dark:border-surface-700/70 dark:bg-surface-900/30 dark:text-surface-300">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">{step.category}</span>
                    <span className="rounded-md bg-surface-100 px-1.5 py-0.5 font-mono text-[9px] text-surface-700 dark:bg-surface-700 dark:text-surface-200">rating {step.rawRating} / 1</span>
                    <span className="rounded-md bg-brand-100 px-1.5 py-0.5 font-mono text-[9px] text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">w {(step.criterionWeight * 100).toFixed(0)}%</span>
                  </div>
                  <p className="mt-1 leading-snug text-surface-600 dark:text-surface-400">{step.reason}</p>
                  <p className="mt-1 font-mono text-[10px] text-surface-500 dark:text-surface-500">{format(step.rawRating, 1)} × {format(step.criterionWeight * 100, 1)}% × 100</p>
                </div>
                <span className="self-center font-mono font-bold text-surface-900 dark:text-white">+{format(step.contribution)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-surface-200 dark:border-surface-700 flex justify-between items-center text-xs font-display font-bold text-brand-900 dark:text-brand-200">
            <span className="flex items-center gap-1">
              Relative priority score
              <Link to="/glossary" title="Scoring methodology in Glossary" className="text-surface-400 hover:text-brand-600">
                <HelpCircle className="w-3 h-3" />
              </Link>
            </span>
            <span className="font-mono text-xs bg-brand-500 text-black px-2.5 py-0.5 rounded-lg shadow-sm">
              {format(metric.finalScore ?? metric.currentScore)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
