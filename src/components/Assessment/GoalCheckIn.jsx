import React from 'react';
import { Target, Check, ArrowRight } from 'lucide-react';

const GOAL_LABELS = {
  fat_loss: 'Lose Body Fat & Weight Management',
  muscle_gain: 'Build Muscle & Increase Strength',
  health_longevity: 'Cardiovascular & General Health',
  athletic_performance: 'Athletic Conditioning & Agility',
  posture_mobility: 'Posture, Joint Health & Mobility'
};

export default function GoalCheckIn({ currentGoal, onConfirmYes, onConfirmNo }) {
  const goalText = GOAL_LABELS[currentGoal] || 'Your Primary Fitness Goal';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 animate-slide-up max-w-md sm:max-w-lg mx-auto w-full text-center font-sans">
      <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/60 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 mx-auto">
        <Target className="w-8 h-8" />
      </div>

      <p className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Step 3 of 4: Verification</p>
      <h2 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-2 tracking-tight">Goal Check-In</h2>
      
      <p className="text-surface-600 dark:text-surface-400 text-xs sm:text-sm mb-6 max-w-xs leading-relaxed">
        Before FitStart evaluates your metrics and computes relevance points, let's verify your main objective:
      </p>

      <div className="card p-5 bg-white dark:bg-surface-900 border-2 border-brand-400 dark:border-brand-500 mb-6 shadow-sm w-full text-center rounded-3xl">
        <span className="text-[10px] text-surface-400 dark:text-surface-500 font-extrabold uppercase tracking-wider block mb-1">Your Selected Main Focus</span>
        <span className="text-base sm:text-lg font-black text-brand-950 dark:text-white block">{goalText}</span>
      </div>

      <p className="text-xs text-surface-500 dark:text-surface-400 mb-6 font-medium">
        Is this still the primary focus you want FitStart to prioritize in your report interpretation?
      </p>

      <div className="w-full space-y-3">
        <button onClick={onConfirmYes} className="btn-primary w-full py-3.5 min-h-[48px] flex items-center justify-center gap-2 text-xs font-black shadow-md">
          Yes, That's My Goal <Check className="w-5 h-5 stroke-[2.5]" />
        </button>
        <button onClick={onConfirmNo} className="btn-secondary w-full py-3 min-h-[44px] text-xs font-bold">
          No, Let Me Update It
        </button>
      </div>
    </div>
  );
}
