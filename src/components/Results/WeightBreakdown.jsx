import React, { useState } from 'react';
import { Calculator, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          {isOpen ? 'Hide calculation details' : 'How this priority was calculated'}
        </span>
        <span className="text-[10px] font-mono bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-200 px-2 py-0.5 rounded-md font-bold group-hover:bg-brand-200 transition-colors">
          Score: {metric.finalScore || metric.currentScore} pts {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 p-3.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 animate-slide-up text-left">
          <div className="flex justify-between items-center pb-2 mb-2.5 border-b border-surface-200 dark:border-surface-700 text-[11px] font-display font-bold text-surface-700 dark:text-surface-300">
            <span>Reason included</span>
            <span>Score</span>
          </div>

          <div className="space-y-2 text-xs">
            {metric.steps.map((step, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-surface-700 dark:text-surface-300">
                <div className="flex items-start gap-2 flex-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0
                    ${idx === 0 ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200' : 'bg-brand-100 dark:bg-brand-900/70 text-brand-800 dark:text-brand-200 border border-brand-200 dark:border-brand-800'}`}>
                    {idx === 0 ? `Base: ${step.delta}` : step.delta}
                  </span>
                  <span className="text-surface-600 dark:text-surface-400 leading-snug">{step.reason}</span>
                </div>
                <span className="font-mono font-bold text-surface-900 dark:text-white text-xs shrink-0 mt-0.5">
                  = {step.subtotal} pts
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-surface-200 dark:border-surface-700 flex justify-between items-center text-xs font-display font-bold text-brand-900 dark:text-brand-200">
            <span className="flex items-center gap-1">
              Final relevance score
              <Link to="/glossary" title="Scoring methodology in Glossary" className="text-surface-400 hover:text-brand-600">
                <HelpCircle className="w-3 h-3" />
              </Link>
            </span>
            <span className="font-mono text-xs bg-brand-500 text-white px-2.5 py-0.5 rounded-lg shadow-sm">
              {metric.finalScore || metric.currentScore} Points
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
