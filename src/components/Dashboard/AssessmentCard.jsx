import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Trash2 } from 'lucide-react';

export default function AssessmentCard({ assessment, onDelete }) {
  const dateFormatted = assessment.assessed_date 
    ? new Date(assessment.assessed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent Scan';

  const metrics = assessment.fitMao_report_data || {};
  const mainFocus = assessment.main_focus;

  return (
    <div className="card p-5 bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-600/80 hover:shadow-card transition-all duration-200 rounded-3xl flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3 pb-3 border-b border-surface-100 dark:border-surface-800">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-display font-semibold text-surface-400 dark:text-surface-500 mb-0.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{dateFormatted}</span>
            </div>
            <h3 className="font-display font-extrabold text-surface-900 dark:text-white text-base">
              FitMao 3D Assessment
            </h3>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(assessment.id)}
              className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
              title="Delete this scan record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Metric Snapshot Bar */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-surface-50 dark:bg-surface-800/60 rounded-2xl mb-3 text-center border border-surface-200/60 dark:border-surface-700/60">
          <div>
            <span className="text-[10px] text-surface-500 dark:text-surface-400 font-display font-semibold uppercase block">Weight</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-surface-900 dark:text-white">{metrics.weight || '—'}</span>
          </div>
          <div className="border-x border-surface-200 dark:border-surface-700 px-1">
            <span className="text-[10px] text-accent-600 dark:text-accent-400 font-display font-semibold uppercase block">Body Fat</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-accent-600 dark:text-accent-400">{metrics.bodyFatPercentage || '—'}</span>
          </div>
          <div>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-display font-semibold uppercase block">Muscle</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-brand-700 dark:text-brand-300">{metrics.skeletalMuscleMass || '—'}</span>
          </div>
        </div>

        {/* Main Focus banner if present */}
        {mainFocus && (
          <div className="flex items-center justify-between p-2.5 bg-accent-50/70 dark:bg-accent-950/40 border border-accent-200/80 dark:border-accent-800/60 rounded-xl mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span>
              <span className="font-display font-semibold text-surface-700 dark:text-surface-300 text-[11px]">Primary Focus:</span>
            </div>
            <span className="font-display font-bold text-accent-700 dark:text-accent-300 text-xs">
              {mainFocus.title} ({mainFocus.value})
            </span>
          </div>
        )}
      </div>

      <Link
        to={`/results/${assessment.id}`}
        className="btn-primary py-3 text-xs flex items-center justify-center gap-1.5 mt-auto"
      >
        View Interpreted Results <ArrowRight className="w-4 h-4 ml-0.5" />
      </Link>
    </div>
  );
}
