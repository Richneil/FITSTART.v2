import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Droplet, Flame, HeartPulse, Info, Lightbulb, Scale,
  Sparkles, Target, TrendingUp, Users
} from 'lucide-react';
import { getMetricExplanation } from '../../utils/resultExplanations.js';

const METRIC_ICONS = {
  bodyFat: Flame,
  muscleMass: Target,
  visceralFat: Activity,
  bodyWater: Droplet,
  bmr: HeartPulse,
  bmi: Scale,
  waistHipRatio: Scale
};

const GLOSSARY_IDS = {
  bodyFat: 'bodyFatPercentage',
  muscleMass: 'skeletalMuscleMass',
  waistHipRatio: 'waistToHipRatio'
};

function ExplanationBlock({ icon: Icon, title, text }) {
  return (
    <div className="md:px-4 first:md:pl-0 last:md:pr-0">
      <div className="flex items-center gap-2 text-xs font-display font-extrabold text-surface-900 dark:text-white">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-950/60 dark:text-accent-300">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-surface-600 dark:text-surface-300">{text}</p>
    </div>
  );
}

export default function MainFocusCard({ mainFocus }) {
  if (!mainFocus) return null;

  const MainIcon = METRIC_ICONS[mainFocus.id] || Activity;
  const explanation = getMetricExplanation(mainFocus, 'main');

  return (
    <section className="card relative overflow-hidden rounded-3xl border-2 border-accent-300 bg-white p-5 shadow-card dark:border-accent-800 dark:bg-surface-900 sm:p-7">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-100/60 blur-3xl dark:bg-accent-950/30" />

      <div className="relative z-10 mb-2 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-[11px] font-display font-bold uppercase tracking-wider text-accent-800 dark:border-accent-800 dark:bg-accent-950/70 dark:text-accent-300">
          <Sparkles className="h-3.5 w-3.5 text-accent-500" /> Primary Focus Area
        </div>
        <span className="hidden items-center gap-1.5 rounded-xl border border-accent-300 bg-accent-50 px-3 py-1.5 text-[11px] font-display font-bold text-accent-800 dark:border-accent-800 dark:bg-accent-950/70 dark:text-accent-200 sm:inline-flex">
          <TrendingUp className="h-3.5 w-3.5" /> Most relevant to your goal
        </span>
      </div>

      <h2 className="relative z-10 mb-4 text-2xl font-display font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-3xl">Your Main Focus</h2>

      <div className="relative z-10 rounded-3xl border border-accent-200 bg-accent-50/50 p-5 shadow-subtle dark:border-accent-800/60 dark:bg-surface-800 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent-300 bg-accent-100 shadow-sm dark:border-accent-700 dark:bg-accent-900/60 sm:h-16 sm:w-16">
              <MainIcon className="h-7 w-7 text-accent-600 dark:text-accent-400 sm:h-8 sm:w-8" />
            </div>
            <div>
              <Link to={`/glossary?term=${GLOSSARY_IDS[mainFocus.id] || mainFocus.id}`} className="text-base font-display font-bold text-surface-900 hover:underline dark:text-white sm:text-lg">{mainFocus.title}</Link>
              <p className="text-2xl font-mono font-bold tracking-tight text-accent-600 dark:text-accent-400 sm:text-3xl">{mainFocus.value}</p>
              <span className="mt-1 block text-[11px] text-surface-500 dark:text-surface-400">FitMao report measurement</span>
            </div>
          </div>
          <span className="self-start rounded-xl border border-accent-300 bg-white/70 px-3 py-1.5 text-[11px] font-display font-bold text-accent-800 dark:border-accent-800 dark:bg-surface-900/70 dark:text-accent-200">{explanation.focusLabel}</span>
        </div>
      </div>

      <div className="relative z-10 mt-5 grid gap-4 md:grid-cols-3 md:divide-x md:divide-surface-200 dark:md:divide-surface-800">
        <ExplanationBlock icon={Info} title="What does this mean?" text={explanation.definition} />
        <ExplanationBlock icon={Lightbulb} title="Why is this your Main Focus?" text={explanation.why} />
        <ExplanationBlock icon={Users} title="Discuss this with your coach" text={explanation.coachPrompt} />
      </div>
    </section>
  );
}
