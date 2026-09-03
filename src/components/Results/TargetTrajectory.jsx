import React from 'react';
import { Target, Calendar, Clock, TrendingDown, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

export default function TargetTrajectory({ rawMetrics = {}, mainFocus = {} }) {
  const fatControl = rawMetrics.fatControl || '-6.0 kg';
  const muscleControl = rawMetrics.muscleControl || '+0.0 kg';
  const targetWeight = rawMetrics.targetWeight || '72.0 kg';

  return (
    <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm space-y-4 rounded-3xl">
      <div className="flex justify-between items-start border-b border-surface-100 dark:border-surface-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800 uppercase tracking-wider block mb-1">
            Scanner Recomposition Targets
          </span>
          <h3 className="text-sm sm:text-base font-black text-surface-900 dark:text-white tracking-tight">Target Trajectory & Re-Scan Window</h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-surface-400 dark:text-surface-500 font-bold uppercase block">Target Weight</span>
          <span className="text-xs sm:text-sm font-black text-brand-800 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-lg border border-brand-200 dark:border-brand-800">{targetWeight}</span>
        </div>
      </div>

      {/* Target Control Breakdown from FitMao Scanner with vibrant accents */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-3.5 bg-orange-50/70 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-900/60 text-left">
          <div className="flex items-center gap-1.5 text-xs text-orange-700 dark:text-orange-400 font-bold mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Fat Control</span>
          </div>
          <span className="text-base sm:text-xl font-black text-orange-950 dark:text-orange-200">{fatControl}</span>
          <p className="text-[10px] text-orange-700 dark:text-orange-300 mt-1 leading-tight font-medium">
            Scanner-recommended fat reduction to reach optimal range.
          </p>
        </div>

        <div className="p-3 sm:p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 text-left">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Muscle Control</span>
          </div>
          <span className="text-base sm:text-xl font-black text-emerald-950 dark:text-emerald-200">{muscleControl}</span>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1 leading-tight font-medium">
            Muscle mass recommendation to preserve metabolic rate.
          </p>
        </div>
      </div>

      {/* Re-Assessment Timeline & Physiological Expectation */}
      <div className="p-3.5 bg-teal-50/80 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 text-left text-xs space-y-2">
        <div className="flex items-center justify-between font-bold text-teal-950 dark:text-teal-200">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Recommended Re-Assessment Window:</span>
          </span>
          <span className="bg-teal-600 dark:bg-teal-700 text-white px-2 py-0.5 rounded-md text-[11px] font-black shadow-sm">4–6 Weeks</span>
        </div>
        <p className="text-[11px] text-teal-900 dark:text-teal-100 leading-relaxed font-medium">
          Body composition changes occur via cellular protein synthesis and lipid oxidation over 28–42 days. Scanning earlier than 4 weeks may reflect normal hydration fluctuations rather than true tissue recomposition.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-surface-500 font-medium pt-0.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Sustainable milestone: 0.5%–1.0% body fat reduction or 0.2–0.4kg muscle growth per month.</span>
      </div>
    </div>
  );
}
