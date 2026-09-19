import React from 'react';
import { Info, Target, Activity, Calendar, Sparkles } from 'lucide-react';

const GOAL_NAMES = {
  fat_loss: 'Fat Reduction & Recomposition',
  muscle_gain: 'Muscle Growth & Functional Strength',
  health_longevity: 'Cardiovascular & Overall Health',
  athletic_performance: 'Athletic Performance & Agility',
  posture_mobility: 'Posture, Joint Health & Mobility'
};

const ACTIVITY_NAMES = {
  strength: 'Resistance & Strength Training',
  aerobic: 'Cardio & Aerobic Training',
  cardio_conditioning: 'Endurance Conditioning',
  athletic_agility: 'Sports & Agility Drills',
  mobility_flexibility: 'Mobility & Posture Routines'
};

const AVAILABILITY_LABELS = {
  '1-2': '1–2 days / week',
  '3-4': '3–4 days / week',
  '5+': '5+ days / week'
};

export default function BecauseYouToldUs({ text, mainFocus, parqAnswers = {} }) {
  const goalKey = parqAnswers.primaryGoal || parqAnswers.goal || (Array.isArray(parqAnswers.goals) ? parqAnswers.goals[0] : null);
  const actKey = parqAnswers.activityCategory || (Array.isArray(parqAnswers.activityCategories) ? parqAnswers.activityCategories[0] : null) || 'strength';
  const availKey = parqAnswers.availability;

  const goalLabel = GOAL_NAMES[goalKey] || (goalKey ? String(goalKey).replace(/_/g, ' ') : 'Fat Reduction & Recomposition');
  const actLabel = ACTIVITY_NAMES[actKey] || (actKey ? String(actKey).replace(/_/g, ' ') : 'General Physical Activity');
  const availLabel = AVAILABILITY_LABELS[availKey] || (availKey ? `${availKey} days / week` : '3–4 days / week');

  const content = text || `Because you indicated your primary goal is ${goalLabel} and your main activity is ${actLabel}, FitStart prioritized ${mainFocus?.title || 'this metric'} (${mainFocus?.value || ''}) as your #1 starting focus.`;

  return (
    <div className="card p-5 sm:p-6 bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/70 rounded-3xl shadow-subtle font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-200/80 dark:border-brand-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-brand-950 dark:text-brand-100 text-xs sm:text-sm uppercase tracking-wider">
              Why FitStart Chose These Results
            </h3>
            <span className="text-[11px] text-brand-700 dark:text-brand-300 font-medium">
              How your confirmed measurement and answers shaped the priority order
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-white dark:bg-surface-900 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800 shadow-subtle">
          <Sparkles className="w-3 h-3 text-brand-500" /> Your context
        </span>
      </div>

      {/* Structured Context Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 bg-white/80 dark:bg-surface-900/80 rounded-2xl border border-brand-200/60 dark:border-brand-800/40">
          <span className="text-[10px] font-display font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
            <Target className="w-3 h-3 text-accent-500" /> Primary Goal
          </span>
          <strong className="text-surface-900 dark:text-white font-sans text-xs sm:text-[13px] block">
            {goalLabel}
          </strong>
        </div>

        <div className="p-3 bg-white/80 dark:bg-surface-900/80 rounded-2xl border border-brand-200/60 dark:border-brand-800/40">
          <span className="text-[10px] font-display font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
            <Activity className="w-3 h-3 text-brand-500" /> Workout Focus
          </span>
          <strong className="text-surface-900 dark:text-white font-sans text-xs sm:text-[13px] block">
            {actLabel}
          </strong>
        </div>

        <div className="p-3 bg-white/80 dark:bg-surface-900/80 rounded-2xl border border-brand-200/60 dark:border-brand-800/40">
          <span className="text-[10px] font-display font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-400" /> Availability
          </span>
          <strong className="text-surface-900 dark:text-white font-sans text-xs sm:text-[13px] block">
            {availLabel}
          </strong>
        </div>
      </div>

      {/* Dynamic Explanation */}
      <div className="p-3.5 bg-white/90 dark:bg-surface-900/90 rounded-2xl border border-brand-200/60 dark:border-brand-800/40 text-xs sm:text-sm text-surface-800 dark:text-surface-200 leading-relaxed font-medium">
        <p className="whitespace-pre-wrap">{content}</p>
        <p className="mt-3 border-t border-brand-100 pt-3 text-[11px] text-surface-500 dark:border-brand-900 dark:text-surface-400">
          These priorities describe relevance to your selected goals. They are not a diagnosis or a judgment that something is wrong.
        </p>
      </div>
    </div>
  );
}
