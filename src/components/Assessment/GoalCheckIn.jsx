import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

const GOAL_LABELS = {
  fat_loss: 'Lose Body Fat & Weight Management',
  muscle_gain: 'Build Muscle & Increase Strength',
  health_longevity: 'Cardiovascular & General Health',
  athletic_performance: 'Athletic Conditioning & Agility',
  posture_mobility: 'Posture, Joint Health & Mobility'
};

export default function GoalCheckIn({ currentGoal, signedIn = false, error = null, onConfirmYes, onConfirmNo }) {
  const goalText = GOAL_LABELS[currentGoal] || 'Your Primary Fitness Goal';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 animate-slide-up max-w-lg mx-auto w-full text-center font-sans">
      <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/70 rounded-3xl flex items-center justify-center mb-5 shadow-card border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 mx-auto">
        <Target className="w-8 h-8" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-[11px] font-display font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-2">
        Goal Verification
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-surface-900 dark:text-white mb-2 tracking-tight">
        Goal Check-In
      </h2>
      
      <p className="text-surface-500 dark:text-surface-400 text-xs sm:text-sm mb-6 max-w-sm leading-relaxed">
        Before FitStart evaluates your metrics and personalizes your starting point, let's verify your main objective:
      </p>

      <div className="card p-6 bg-white dark:bg-surface-900 border-2 border-brand-500/80 dark:border-brand-500/80 mb-6 shadow-card w-full text-center rounded-3xl">
        <span className="text-[10px] text-surface-400 dark:text-surface-500 font-display font-bold uppercase tracking-wider block mb-1.5">
          Your Selected Main Focus
        </span>
        <span className="text-lg sm:text-xl font-display font-extrabold text-brand-950 dark:text-white block">
          {goalText}
        </span>
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400 mb-6 font-medium">
        Is this the primary focus you want FitStart to prioritize in your assessment interpretation?
      </p>

      <div className="w-full space-y-3">
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
        <button 
          onClick={() => onConfirmYes(signedIn)}
          className="btn-primary w-full py-4 min-h-[48px] flex items-center justify-center gap-2 text-xs font-display font-extrabold shadow-lg cursor-pointer"
        >
          <span>{signedIn ? 'Analyze & Save to My Account' : 'Analyze My Results'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
        {signedIn && <button type="button" onClick={() => onConfirmYes(false)} className="w-full rounded-xl border border-surface-200 px-4 py-3 text-xs font-display font-bold text-surface-600 dark:border-surface-700 dark:text-surface-300">Analyze Without Saving</button>}
        {signedIn && <p className="text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">Choosing the first button gives FitStart permission to save this assessment in your history. You can still review results without saving.</p>}
        <button 
          onClick={onConfirmNo} 
          className="btn-secondary w-full py-3.5 min-h-[44px] text-xs font-display font-bold cursor-pointer"
        >
          Back to Edit Goals
        </button>
      </div>
    </div>
  );
}
