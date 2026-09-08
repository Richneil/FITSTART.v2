import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  HelpCircle, 
  Activity, 
  Flame, 
  Target, 
  Droplet, 
  HeartPulse, 
  Scale 
} from 'lucide-react';
import AskWhy from './AskWhy.jsx';

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

export default function MainFocusCard({ mainFocus }) {
  const [showAskWhy, setShowAskWhy] = useState(false);

  if (!mainFocus) return null;

  const MainIcon = METRIC_ICONS[mainFocus.id] || Activity;

  return (
    <>
      <div className="card p-5 sm:p-7 bg-white dark:bg-surface-900 rounded-3xl shadow-card border border-surface-200 dark:border-surface-800 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-100/60 dark:bg-accent-950/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 dark:bg-accent-950/70 border border-accent-200 dark:border-accent-800 text-[11px] font-display font-bold text-accent-800 dark:text-accent-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" /> Primary Focus Area
          </div>

          {/* Ask Why Trigger Button */}
          <button
            type="button"
            onClick={() => setShowAskWhy(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent-100 dark:bg-accent-950 hover:bg-accent-200 text-accent-800 dark:text-accent-200 text-xs font-display font-extrabold rounded-xl border border-accent-300 dark:border-accent-800 transition-colors shadow-subtle cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400" />
            <span>Ask Why</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-surface-900 dark:text-white mb-4 relative z-10 tracking-tight">
          Your Main Focus
        </h1>
        
        <div className="bg-gradient-to-br from-accent-50/90 dark:from-accent-950/50 to-orange-50/50 dark:to-surface-800/80 p-5 sm:p-6 rounded-3xl border border-accent-200 dark:border-accent-800/60 relative z-10 shadow-subtle">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 dark:bg-accent-900/60 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-accent-300 dark:border-accent-700">
              <MainIcon className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <Link 
                to={`/glossary?term=${GLOSSARY_IDS[mainFocus.id] || mainFocus.id}`}
                className="text-base sm:text-lg font-display font-bold text-surface-900 dark:text-white hover:underline flex items-center gap-1"
              >
                {mainFocus.title}
              </Link>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-accent-600 dark:text-accent-400 tracking-tight">
                {mainFocus.value}
              </p>
            </div>
          </div>

          {mainFocus.desc && (
            <p className="text-xs sm:text-sm text-surface-700 dark:text-surface-300 leading-relaxed font-medium">
              {mainFocus.desc}
            </p>
          )}
        </div>
      </div>

      {showAskWhy && (
        <AskWhy
          metric={mainFocus}
          rankLabel="Rank #1 Priority"
          onClose={() => setShowAskWhy(false)}
        />
      )}
    </>
  );
}
