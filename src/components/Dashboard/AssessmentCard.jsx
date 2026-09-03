import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Trash2, Activity, Target, Flame, HeartPulse } from 'lucide-react';

export default function AssessmentCard({ assessment, onDelete }) {
  const dateFormatted = assessment.assessed_date 
    ? new Date(assessment.assessed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent Scan';

  const metrics = assessment.fitMao_report_data || {};
  const mainFocus = assessment.main_focus;

  return (
    <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all rounded-3xl">
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-surface-100 dark:border-surface-800">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-surface-400 dark:text-surface-500 mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{dateFormatted}</span>
          </div>
          <h3 className="font-extrabold text-surface-900 dark:text-white text-sm sm:text-base">FitMao 3D Assessment</h3>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(assessment.id)}
            className="p-2 text-surface-400 dark:text-surface-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
            title="Delete this scan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Metric benchmark snapshot */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-surface-50 dark:bg-surface-800/70 rounded-2xl mb-3 text-center">
        <div>
          <span className="text-[10px] text-surface-400 dark:text-surface-500 font-bold uppercase block">Weight</span>
          <span className="text-xs sm:text-sm font-black text-surface-900 dark:text-white">{metrics.weight || '—'}</span>
        </div>
        <div className="border-x border-surface-200 dark:border-surface-700 px-1">
          <span className="text-[10px] text-accent-600 dark:text-accent-400 font-bold uppercase block">Body Fat</span>
          <span className="text-xs sm:text-sm font-black text-accent-600 dark:text-accent-400">{metrics.bodyFatPercentage || '—'}</span>
        </div>
        <div>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase block">Muscle</span>
          <span className="text-xs sm:text-sm font-black text-brand-700 dark:text-brand-300">{metrics.skeletalMuscleMass || '—'}</span>
        </div>
      </div>

      {/* Main Focus banner if present */}
      {mainFocus && (
        <div className="flex items-center justify-between p-2.5 bg-accent-50/80 dark:bg-accent-950/50 border border-accent-200/80 dark:border-accent-800/60 rounded-xl mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
            <span className="font-bold text-surface-800 dark:text-surface-200 text-[11px]">Primary Focus:</span>
          </div>
          <span className="font-black text-accent-700 dark:text-accent-400 text-xs">{mainFocus.title} ({mainFocus.value})</span>
        </div>
      )}

      <Link
        to={`/results/${assessment.id}`}
        className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
      >
        View Interpreted Results <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
