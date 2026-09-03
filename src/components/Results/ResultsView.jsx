import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ChevronLeft, 
  Columns, 
  Sparkles, 
  Info, 
  Check, 
  ArrowRight, 
  AlertCircle,
  X,
  Flame,
  Target,
  Droplet,
  HeartPulse,
  Scale
} from 'lucide-react';
import WeightBreakdown from './WeightBreakdown.jsx';
import OldVsNew from './OldVsNew.jsx';
import TargetTrajectory from './TargetTrajectory.jsx';
import { api } from '../../utils/api.js';

const METRIC_ICONS = {
  bodyFat: Flame,
  muscleMass: Target,
  visceralFat: Activity,
  bodyWater: Droplet,
  bmr: HeartPulse,
  bmi: Scale
};

export default function ResultsView() {
  const { profileId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  const [showComparison, setShowComparison] = useState(false);
  const [showRawReport, setShowRawReport] = useState(false);
  const [dismissedChangeLog, setDismissedChangeLog] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getResults(profileId);
        setProfile(data.profile);
        setResultsData(data.result);
      } catch (err) {
        setError(err.message || 'Failed to load assessment results.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-10 h-10 border-4 border-surface-200 border-t-brand-500 rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-surface-500 font-semibold">Loading your personalized interpretation...</p>
      </div>
    );
  }

  if (error || !resultsData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto font-sans">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 mb-1">Results Unavailable</h2>
        <p className="text-xs text-surface-500 mb-6">{error || 'Could not find the requested record.'}</p>
        <Link to="/dashboard" className="btn-primary text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { main_focus: mainFocus, top_priorities: topPriorities = [], change_log: changeLog = [], becauseYouToldUs } = resultsData;
  const rawMetrics = profile?.fitMao_report_data || {};

  const MainIcon = METRIC_ICONS[mainFocus?.id] || Activity;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-28 max-w-md sm:max-w-lg mx-auto sm:border-x sm:border-surface-200 dark:sm:border-surface-800 sm:shadow-xl relative font-sans animate-slide-up transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <div className="p-3.5 sm:p-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-xs font-bold text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white p-1">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
        <button
          onClick={() => setShowComparison(true)}
          className="text-xs font-extrabold text-brand-800 dark:text-brand-300 hover:text-brand-900 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Columns className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> See the Difference
        </button>
      </div>

      {/* Change Note Alert Banner */}
      {changeLog.length > 0 && !dismissedChangeLog && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900 px-4 py-3 text-amber-900 dark:text-amber-200 text-xs flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong>Answer updated:</strong> You modified your survey answers during review. FitStart prioritized these results using your final selection.
            </div>
          </div>
          <button onClick={() => setDismissedChangeLog(true)} className="text-amber-500 hover:text-amber-900 dark:hover:text-amber-100 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Focus Hero Section (Warm Terracotta & Sunburst Accent) */}
      <div className="bg-white dark:bg-surface-900 p-5 sm:p-6 pt-5 rounded-b-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-b border-surface-200 dark:border-surface-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-100 dark:bg-accent-950/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-70"></div>
        
        <div className="flex items-center gap-1.5 text-accent-700 dark:text-accent-400 text-xs font-extrabold uppercase tracking-wider mb-2 relative z-10">
          <Sparkles className="w-4 h-4 text-accent-500" /> Personalized Starting Point
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white mb-4 relative z-10 tracking-tight">Your Main Focus</h1>
        
        <div className="bg-gradient-to-br from-accent-50/90 dark:from-accent-950/50 to-orange-50/50 dark:to-surface-800/80 p-4 sm:p-5 rounded-3xl border border-accent-200 dark:border-accent-800/60 relative z-10 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 dark:bg-accent-900/60 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-accent-300 dark:border-accent-700">
              <MainIcon className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-surface-900 dark:text-white">{mainFocus?.title}</h2>
              <p className="text-2xl sm:text-3xl font-black text-accent-600 dark:text-accent-400 tracking-tight">{mainFocus?.value}</p>
            </div>
          </div>

          {/* Metric Calculation Waterfall Math (Weight Breakdown) */}
          <WeightBreakdown metric={mainFocus} />
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        
        {/* Section: Because You Told Us (Explainable Decision Support) */}
        <div className="card p-4 sm:p-5 bg-teal-50/70 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/70 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <h3 className="font-extrabold text-teal-950 dark:text-teal-200 text-xs uppercase tracking-wider">Because You Told Us...</h3>
          </div>
          <p className="text-teal-950 dark:text-teal-100 text-xs leading-relaxed font-medium whitespace-pre-wrap">
            {becauseYouToldUs || `We are prioritizing ${mainFocus?.title} (${mainFocus?.value}) based on your declared goals and assessment measurements.`}
          </p>
        </div>

        {/* Section: Top Priorities */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <h3 className="font-extrabold text-surface-900 dark:text-white text-lg tracking-tight">Top Priorities</h3>
            <span className="text-xs text-surface-500 dark:text-surface-400 font-semibold">Ranked by relevance</span>
          </div>
          <div className="space-y-3">
            {topPriorities.map((p, i) => {
              const bgClass = i === 0 
                ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800 shadow-sm' 
                : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 shadow-sm';
              return (
                <div key={p.id || i} className={`card p-4 flex flex-col gap-1 border rounded-2xl ${bgClass}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-surface-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                      <span className="text-xs font-black bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 w-5 h-5 rounded-full flex items-center justify-center">
                        {i + 2}
                      </span>
                      {p.title}
                    </span>
                    <span className="font-black text-brand-700 dark:text-brand-300 text-sm sm:text-base">{p.value}</span>
                  </div>
                  <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed font-medium pl-7">{p.desc}</p>
                  
                  {/* Step math for top priority */}
                  <WeightBreakdown metric={p} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature: Recomposition Benchmarks & Target Trajectory */}
        <TargetTrajectory rawMetrics={rawMetrics} mainFocus={mainFocus} />

        {/* Raw FitMao Report Toggle */}
        <div>
          <button
            onClick={() => setShowRawReport(!showRawReport)}
            className="w-full py-3.5 px-4 bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-800 text-xs font-bold text-surface-700 dark:text-surface-300 flex items-center justify-between transition-colors shadow-sm"
          >
            <span>{showRawReport ? 'Hide Raw FitMao Scanner Metrics' : `View Full Raw FitMao Report (${Object.keys(rawMetrics).length} Metrics)`}</span>
            <span>{showRawReport ? '▲' : '▼'}</span>
          </button>

          {showRawReport && (
            <div className="mt-3 card overflow-hidden bg-white dark:bg-surface-900 shadow-sm divide-y divide-surface-100 dark:divide-surface-800 animate-slide-up rounded-2xl">
              {Object.entries(rawMetrics).map(([key, value]) => (
                <div key={key} className="p-3 flex justify-between items-center text-xs">
                  <span className="text-surface-600 dark:text-surface-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-black text-surface-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center pt-3">
          <Link
            to="/dashboard"
            className="btn-secondary w-full py-3 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            ← Return to Member Dashboard
          </Link>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal (Old vs New) */}
      {showComparison && (
        <OldVsNew
          rawMetrics={rawMetrics}
          mainFocus={mainFocus}
          topPriorities={topPriorities}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
