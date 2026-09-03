import React from 'react';
import { X, Columns, Sparkles, AlertTriangle } from 'lucide-react';

export default function OldVsNew({ rawMetrics = {}, mainFocus = {}, topPriorities = [], onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-white dark:bg-surface-900 rounded-3xl p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto relative animate-slide-up flex flex-col border border-surface-200 dark:border-surface-800">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-surface-200 dark:border-surface-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
              <Columns className="w-4 h-4" /> Thesis Sub-Question 5 Demonstration
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-surface-900 dark:text-white tracking-tight">The Old Way vs. The FitStart Way</h2>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Comparing unprocessed raw assessment data against personalized decision-support output.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Side-by-Side View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 flex-1">
          
          {/* Left: Raw FitMao Output */}
          <div className="bg-surface-100 dark:bg-surface-800/80 p-4 rounded-2xl border border-surface-300/80 dark:border-surface-700 flex flex-col">
            <div className="mb-3 pb-2 border-b border-surface-300 dark:border-surface-700 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider block">Existing Method</span>
                <h3 className="text-xs sm:text-sm font-extrabold text-surface-800 dark:text-surface-200">Unprocessed FitMao Report</h3>
              </div>
              <span className="text-[10px] bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 px-2 py-0.5 rounded font-mono">Flat List</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono flex-1 overflow-y-auto max-h-[260px] sm:max-h-[340px] pr-1">
              {Object.entries(rawMetrics).map(([key, val]) => (
                <div key={key} className="p-2 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 flex justify-between items-center text-surface-700 dark:text-surface-300">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-bold text-surface-900 dark:text-white">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-surface-300 dark:border-surface-700 text-[11px] text-surface-500 dark:text-surface-400 leading-tight">
              ⚠️ <em>All 10+ numbers displayed with equal weight. No explanation of what matters first or why.</em>
            </div>
          </div>

          {/* Right: FitStart Summary */}
          <div className="bg-teal-50/80 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200 dark:border-teal-800/70 flex flex-col">
            <div className="mb-3 pb-2 border-b border-teal-200 dark:border-teal-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">FitStart System</span>
                <h3 className="text-xs sm:text-sm font-black text-teal-950 dark:text-teal-200">Explainable Starting Point</h3>
              </div>
              <span className="text-[10px] bg-teal-600 dark:bg-teal-700 text-white px-2 py-0.5 rounded font-bold">Rule-Scored</span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[260px] sm:max-h-[340px] pr-1">
              {/* Highlighted Main Focus Card */}
              {mainFocus && (
                <div className="p-3 bg-white dark:bg-surface-900 rounded-2xl border-2 border-accent-400 dark:border-accent-500 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-extrabold text-accent-600 dark:text-accent-400 uppercase">★ Main Focus (#1 Priority)</span>
                    <span className="text-xs font-black text-accent-700 dark:text-accent-300">{mainFocus.value}</span>
                  </div>
                  <div className="font-black text-surface-900 dark:text-white text-sm">{mainFocus.title}</div>
                  <p className="text-[11px] text-surface-600 dark:text-surface-400 mt-1 leading-snug">
                    {mainFocus.reasons?.[0] || 'Prioritized based on your declared goals'}
                  </p>
                </div>
              )}

              {/* Top Priorities */}
              {topPriorities.map((tp, idx) => (
                <div key={tp.id || idx} className="p-2.5 bg-white dark:bg-surface-900 rounded-xl border border-teal-200 dark:border-teal-800 text-xs">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-surface-900 dark:text-white">#{idx + 2} {tp.title}</span>
                    <span className="font-bold text-teal-800 dark:text-teal-300">{tp.value}</span>
                  </div>
                  <p className="text-[10px] text-surface-500 dark:text-surface-400 leading-snug">{tp.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-teal-200 dark:border-teal-800 text-[11px] text-teal-950 dark:text-teal-200 leading-tight font-medium">
              ✨ <em>Identical assessment data transformed into context-aware, explainable next steps.</em>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-surface-200 dark:border-surface-800 flex justify-end">
          <button 
            onClick={onClose} 
            className="btn-primary w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs font-bold"
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
