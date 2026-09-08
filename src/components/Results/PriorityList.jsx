import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Flame, 
  Target, 
  Droplet, 
  HeartPulse, 
  Scale, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import WeightBreakdown from './WeightBreakdown.jsx';
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

export default function PriorityList({ topPriorities = [], otherPriorities = [] }) {
  const [activeMetricForWhy, setActiveMetricForWhy] = useState(null);
  const [activeMetricRank, setActiveMetricRank] = useState('');
  const [showOtherPriorities, setShowOtherPriorities] = useState(false);

  const handleOpenWhy = (metric, rank) => {
    setActiveMetricForWhy(metric);
    setActiveMetricRank(rank);
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="font-display font-extrabold text-surface-900 dark:text-white text-lg tracking-tight">
          Top Priorities
        </h3>
        <span className="text-xs text-surface-500 dark:text-surface-400 font-semibold">
          Ranked by relevance score
        </span>
      </div>

      <div className="space-y-3">
        {topPriorities.map((p, i) => {
          const bgClass = i === 0 
            ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800 shadow-subtle' 
            : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 shadow-card';
          const PriorityIcon = METRIC_ICONS[p.id] || Activity;
          const rankNumber = i + 2;

          return (
            <div key={p.id || i} className={`card p-5 flex flex-col gap-1.5 border rounded-3xl ${bgClass}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-bold text-surface-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="text-xs font-mono font-black bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 w-5 h-5 rounded-full flex items-center justify-center">
                    {rankNumber}
                  </span>
                  <PriorityIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <Link to={`/glossary?term=${GLOSSARY_IDS[p.id] || p.id}`} className="hover:underline">
                    {p.title}
                  </Link>
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-700 dark:text-brand-300 text-sm sm:text-base">
                    {p.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenWhy(p, `Rank #${rankNumber} Priority`)}
                    className="p-1 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    title={`Ask why ${p.title} was prioritized`}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed font-medium pl-7">
                {p.desc}
              </p>
              
              {/* Step math for top priority */}
              <WeightBreakdown metric={p} />
            </div>
          );
        })}
      </div>

      {/* Expandable Other Priorities Section */}
      {otherPriorities && otherPriorities.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowOtherPriorities(!showOtherPriorities)}
            className="w-full py-2.5 px-3 bg-surface-100 dark:bg-surface-850 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-xl text-xs font-display font-bold text-surface-600 dark:text-surface-400 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>{showOtherPriorities ? 'Hide Baseline Monitored Metrics' : `View ${otherPriorities.length} Baseline Monitored Metrics`}</span>
            {showOtherPriorities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOtherPriorities && (
            <div className="mt-2 space-y-2 animate-fade-in">
              {otherPriorities.map((op, idx) => {
                const OtherIcon = METRIC_ICONS[op.id] || Activity;
                const rankNum = topPriorities.length + idx + 2;
                return (
                  <div 
                    key={op.id || idx}
                    className="p-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-surface-400">
                        #{rankNum}
                      </span>
                      <OtherIcon className="w-3.5 h-3.5 text-surface-500" />
                      <span className="font-display font-bold text-surface-800 dark:text-surface-200">
                        {op.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-surface-600 dark:text-surface-400 font-semibold">
                        {op.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenWhy(op, `Rank #${rankNum} Monitored Metric`)}
                        className="p-1 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                        title="Ask Why"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeMetricForWhy && (
        <AskWhy
          metric={activeMetricForWhy}
          rankLabel={activeMetricRank}
          onClose={() => setActiveMetricForWhy(null)}
        />
      )}
    </div>
  );
}
