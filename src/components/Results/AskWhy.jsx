import React from 'react';
import { 
  X, 
  Sparkles, 
  Info
} from 'lucide-react';

const CATEGORY_COLORS = {
  'Baseline': 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700',
  'Primary Goal': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
  'Secondary Goal': 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800',
  'Activity Style': 'bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-200 border-brand-200 dark:border-brand-800',
  'Availability': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
  'Daily Lifestyle': 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
  'Nutrition Pattern': 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800',
  'Hydration': 'bg-cyan-50 dark:cyan-950/60 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800',
  'Safety & History': 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800',
  'BIA Scan Result': 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800'
};

export default function AskWhy({ metric, rankLabel, onClose }) {
  if (!metric) return null;

  const factors = metric.contributingFactors || [];
  const steps = metric.steps || [];
  const totalScore = metric.finalScore || metric.currentScore || metric.baseScore || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans animate-fade-in">
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative my-auto animate-scale-up space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-surface-100 dark:border-surface-800">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-display font-bold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Why this matters for you
            </div>
            <h2 className="text-xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
              Why Prioritize {metric.title}?
            </h2>
            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
              <span>{rankLabel || 'Personalized Focus'}</span>
              <span>•</span>
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400">Measured: {metric.value}</span>
              <span>•</span>
              <span className="font-mono font-bold bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded text-brand-700 dark:text-brand-300">
                Score: {totalScore} pts
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Rationale Summary */}
        <div className="p-3.5 bg-brand-50/60 dark:bg-brand-950/40 rounded-2xl border border-brand-200/80 dark:border-brand-800/60 text-xs text-brand-900 dark:text-brand-200 space-y-1">
          <div className="flex items-center gap-1.5 font-display font-bold text-[11px] uppercase tracking-wider text-brand-700 dark:text-brand-300">
            <Info className="w-3.5 h-3.5" /> What this measurement means
          </div>
          <p className="leading-relaxed font-medium">{metric.desc}</p>
        </div>

        {/* Contributing Factors Breakdown */}
        <div className="space-y-2">
          <span className="text-[11px] font-display font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider block">
            What influenced this priority
          </span>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {factors.length > 0 ? (
              factors.map((factor, idx) => {
                const badgeColor = CATEGORY_COLORS[factor.category] || CATEGORY_COLORS['Baseline'];
                return (
                  <div 
                    key={idx}
                    className="p-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/60 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeColor}`}>
                          {factor.category}
                        </span>
                      </div>
                      <p className="text-surface-800 dark:text-surface-200 text-xs leading-snug font-medium">
                        {factor.reason}
                      </p>
                    </div>

                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400 shrink-0 text-xs bg-white dark:bg-surface-800 px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-700 shadow-sm">
                      {factor.weight > 0 ? `+${factor.weight}` : factor.weight}
                    </span>
                  </div>
                );
              })
            ) : (
              steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/60 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-surface-100 text-surface-600">
                      Rule {idx + 1}
                    </span>
                    <p className="text-surface-800 dark:text-surface-200 text-xs leading-snug font-medium mt-1">
                      {step.reason}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400 shrink-0 text-xs">
                    {step.delta}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Final Calculation Summary */}
        <div className="p-3 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-surface-600 dark:text-surface-400 font-medium">
            Final relevance score:
          </span>
          <span className="font-mono font-black text-sm text-surface-900 dark:text-white">
            {totalScore} Points
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn-primary w-full py-3 text-xs font-display font-bold cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
