import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Droplet, Flame, HeartPulse, Info, Lightbulb, Scale, Target, Users } from 'lucide-react';
import { getMetricExplanation } from '../../utils/resultExplanations.js';

const METRIC_ICONS = {
  bodyFat: Flame,
  muscleMass: Target,
  visceralFat: Activity,
  bodyWater: Droplet,
  bmr: HeartPulse,
  bmi: Scale
};

const GLOSSARY_IDS = {
  bodyFat: 'bodyFatPercentage',
  muscleMass: 'skeletalMuscleMass'
};

function PriorityExplanation({ icon: Icon, title, text }) {
  return (
    <div className="md:px-4 first:md:pl-0 last:md:pr-0">
      <div className="flex items-center gap-2 text-xs font-display font-extrabold text-surface-900 dark:text-white">
        <Icon className="h-4 w-4 text-brand-600 dark:text-brand-300" />
        {title}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-surface-600 dark:text-surface-300">{text}</p>
    </div>
  );
}

export default function PriorityList({ topPriorities = [], mainFocus = null }) {
  if (topPriorities.length === 0) return null;

  return (
    <section className="space-y-3 font-sans">
      <div className="mb-3">
        <h3 className="text-lg font-display font-extrabold tracking-tight text-surface-900 dark:text-white">Your Supporting Priorities</h3>
        <p className="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">These measurements add context to your Main Focus. A supporting priority does not automatically mean something is wrong.</p>
      </div>

      <div className="space-y-3">
        {topPriorities.map((priority, index) => {
          const PriorityIcon = METRIC_ICONS[priority.id] || Activity;
          const explanation = getMetricExplanation(priority, 'supporting', mainFocus);
          const tone = index === 0
            ? 'border-brand-300 bg-brand-50/70 shadow-subtle dark:border-brand-800 dark:bg-brand-950/30'
            : 'border-surface-200 bg-white shadow-card dark:border-surface-800 dark:bg-surface-900';

          return (
            <article key={priority.id || index} className={`card rounded-3xl border p-5 sm:p-6 ${tone}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 font-display font-bold text-surface-900 dark:text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-mono font-black text-brand-800 dark:bg-brand-900 dark:text-brand-200">{index + 1}</span>
                  <PriorityIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  <Link to={`/glossary?term=${GLOSSARY_IDS[priority.id] || priority.id}`} className="hover:underline">{priority.title}</Link>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-8 sm:pl-0">
                  <span className="text-sm font-mono font-bold text-brand-700 dark:text-brand-300 sm:text-base">{priority.value}</span>
                  <span className="rounded-lg border border-surface-200 bg-white/70 px-2.5 py-1 text-[10px] font-display font-bold text-surface-600 dark:border-surface-700 dark:bg-surface-900/70 dark:text-surface-300">{explanation.focusLabel}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 border-t border-surface-200/80 pt-4 dark:border-surface-800 md:grid-cols-3 md:divide-x md:divide-surface-200 dark:md:divide-surface-800">
                <PriorityExplanation icon={Info} title="What does this mean?" text={explanation.definition} />
                <PriorityExplanation icon={Lightbulb} title="Why is this a Supporting Priority?" text={explanation.why} />
                <PriorityExplanation icon={Users} title="Discuss this with your coach" text={explanation.coachPrompt} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
