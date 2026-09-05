import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Activity, 
  ChevronLeft, 
  Sparkles, 
  AlertCircle,
  Award, 
  Scale, 
  Target, 
  HeartPulse,
  PlusCircle,
  LayoutDashboard
} from 'lucide-react';
import MainFocusCard from './MainFocusCard.jsx';
import BecauseYouToldUs from './BecauseYouToldUs.jsx';
import PriorityList from './PriorityList.jsx';
import SaveResultsPrompt from './SaveResultsPrompt.jsx';
import PrintableSummary from './PrintableSummary.jsx';
import { api } from '../../utils/api.js';

export default function ResultsView({ user }) {
  const { profileId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  const [showRawReport, setShowRawReport] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

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
  }, [profileId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-10 h-10 border-4 border-surface-200 border-t-brand-500 rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-surface-500 font-display font-semibold">Loading your personalized interpretation...</p>
      </div>
    );
  }

  if (error || !resultsData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto font-sans">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white mb-1">Results Unavailable</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400 mb-6">{error || 'Could not find the requested record.'}</p>
        <Link to={user ? "/dashboard" : "/assessment"} className="btn-primary text-xs">
          {user ? "Return to Dashboard" : "Start Assessment"}
        </Link>
      </div>
    );
  }

  const isGuest = !user || profile?.user_id === null || resultsData?.isGuest || profileId === 'guest';
  const { 
    main_focus: mainFocus, 
    top_priorities: topPriorities = [], 
    otherPriorities = [],
    becauseYouToldUs, 
    weights 
  } = resultsData;
  const rawMetrics = profile?.fitMao_report_data || {};
  const parqAnswers = profile?.parq_answers || {};

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-28 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 relative font-sans animate-slide-up transition-colors duration-200">
      
      {/* Top Action Toolbar */}
      <div className="py-3.5 sm:py-4 border-b border-surface-200 dark:border-surface-800 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shadow-subtle rounded-b-2xl mb-5 px-4 sm:px-6">
        {user ? (
          <Link to="/dashboard" className="flex items-center gap-1.5 text-xs font-display font-bold text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white p-1">
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-display font-bold text-surface-800 dark:text-surface-200">
              Personalized Assessment Report
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Export PDF Button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="text-xs font-display font-bold text-surface-700 dark:text-surface-200 hover:text-brand-600 dark:hover:text-brand-400 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 px-3.5 py-2 rounded-xl border border-surface-200 dark:border-surface-700 flex items-center gap-1.5 transition-colors shadow-subtle cursor-pointer"
            title="Export 1-Page PDF Summary"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Export PDF
          </button>
        </div>
      </div>

      {/* 1. FitMao Assessment Profile Header Card */}
      <div className="card p-5 sm:p-6 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans mb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-display font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" /> FitMao Assessment Profile
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
            {rawMetrics?.memberName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Alex Rivera')}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-surface-500 dark:text-surface-400 text-xs">
            <span className="font-medium">{rawMetrics?.gender || 'Male'} • {rawMetrics?.age || '28 yrs'}</span>
            <span>•</span>
            <span className="font-mono">{rawMetrics?.height || '175 cm'}</span>
            <span>•</span>
            <span className="font-mono">{rawMetrics?.testDate || profile?.assessed_date?.split('T')[0] || '2026-09-05'} {rawMetrics?.testTime || ''}</span>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-100 dark:border-surface-800">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-300 font-display font-extrabold text-xs shadow-subtle">
            <Award className="w-4 h-4 text-emerald-600" /> Score: {rawMetrics?.healthScore || '74 / 100'}
          </span>
          <span className="block text-xs text-surface-400 dark:text-surface-500 font-mono">
            {rawMetrics?.bodyType || 'Standard Overweight'}
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* 2. Main Focus Hero Section (with Ask Why & Waterfall math) */}
        <MainFocusCard mainFocus={mainFocus} />

        {/* 3. Top Priorities (with individual Ask Why triggers) */}
        <PriorityList topPriorities={topPriorities} otherPriorities={otherPriorities} />

        {/* 4. Dynamic "Because You Told Us" Decision Support */}
        <BecauseYouToldUs 
          text={becauseYouToldUs} 
          mainFocus={mainFocus} 
          parqAnswers={parqAnswers} 
        />

        {/* 5. Complete Raw FitMao Scanner Metrics (Collapsible) */}
        <div>
          <button
            onClick={() => setShowRawReport(!showRawReport)}
            className="w-full py-3.5 px-4 bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-800 text-xs font-display font-bold text-surface-700 dark:text-surface-300 flex items-center justify-between transition-colors shadow-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600" />
              <span>{showRawReport ? 'Hide Complete Assessment Metrics' : `View Complete Assessment Metrics (${Object.keys(rawMetrics).length} Data Points)`}</span>
            </span>
            <span>{showRawReport ? '▲' : '▼'}</span>
          </button>

          {showRawReport && (
            <div className="mt-3 space-y-3 animate-slide-up">
              {/* Section 1: Member Demographics & Test Details */}
              <div className="card p-3.5 bg-white dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800 rounded-2xl">
                <h4 className="text-[11px] font-display font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-surface-100 dark:border-surface-800">
                  <Activity className="w-3.5 h-3.5 text-brand-600" /> Member Information & Test Session
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <span className="text-[10px] text-surface-400 uppercase block font-medium">Member Name</span>
                    <strong className="text-surface-900 dark:text-white font-sans">{rawMetrics.memberName || 'Alex Rivera'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <span className="text-[10px] text-surface-400 uppercase block font-medium">Gender / Age</span>
                    <strong className="text-surface-900 dark:text-white font-sans">{rawMetrics.gender || 'Male'} • {rawMetrics.age || '28 yrs'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <span className="text-[10px] text-surface-400 uppercase block font-medium">Height</span>
                    <strong className="text-surface-900 dark:text-white font-mono">{rawMetrics.height || '175 cm'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <span className="text-[10px] text-surface-400 uppercase block font-medium">Body Age</span>
                    <strong className="text-surface-900 dark:text-white font-mono">{rawMetrics.bodyAge || '31 yrs'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <span className="text-[10px] text-surface-400 uppercase block font-medium">Scan Date & Time</span>
                    <strong className="text-surface-900 dark:text-white font-mono text-[11px]">{rawMetrics.testDate || '2026-09-05'} {rawMetrics.testTime || '10:30 AM'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <span className="text-[10px] text-surface-400 uppercase block font-medium">Scanner Device</span>
                    <strong className="text-surface-900 dark:text-white text-[11px] font-sans">{rawMetrics.scannerDevice || 'FitMao 3D Pro'}</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Body Composition Analysis */}
              <div className="card p-3.5 bg-white dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800 rounded-2xl">
                <h4 className="text-[11px] font-display font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-surface-100 dark:border-surface-800">
                  <Scale className="w-3.5 h-3.5 text-brand-600" /> Body Composition Analysis
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Total Weight</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.weight || '78.0 kg'}</strong>
                  </div>
                  <div className="p-2 bg-accent-50/60 dark:bg-accent-950/40 rounded-xl flex justify-between items-center border border-accent-200/60 dark:border-accent-800/50">
                    <span className="text-accent-800 dark:text-accent-300 font-bold">Body Fat %</span>
                    <strong className="font-mono text-accent-700 dark:text-accent-300">{rawMetrics.bodyFatPercentage || '24.5%'}</strong>
                  </div>
                  <div className="p-2 bg-brand-50/60 dark:bg-brand-950/40 rounded-xl flex justify-between items-center border border-brand-200/60 dark:border-brand-800/50">
                    <span className="text-brand-800 dark:text-brand-300 font-bold">Skeletal Muscle</span>
                    <strong className="font-mono text-brand-700 dark:text-brand-300">{rawMetrics.skeletalMuscleMass || '32.1 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Fat Mass</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.fatMass || '19.1 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Muscle Mass</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.muscleMass || '55.4 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Fat-Free Mass</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.fatFreeMass || '58.9 kg'}</strong>
                  </div>
                </div>
              </div>

              {/* Section 3: Target Control Recommendations */}
              <div className="card p-3.5 bg-white dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800 rounded-2xl">
                <h4 className="text-[11px] font-display font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-surface-100 dark:border-surface-800">
                  <Target className="w-3.5 h-3.5 text-accent-600" /> Target & Control Recommendations
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Target Weight</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.targetWeight || '72.0 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Weight Control</span>
                    <strong className="font-mono text-amber-700 dark:text-amber-400">{rawMetrics.weightControl || '-6.0 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Fat Control</span>
                    <strong className="font-mono text-accent-600 dark:text-accent-400">{rawMetrics.fatControl || '-6.0 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Muscle Control</span>
                    <strong className="font-mono text-brand-600 dark:text-brand-400">{rawMetrics.muscleControl || '0.0 kg'}</strong>
                  </div>
                </div>
              </div>

              {/* Section 4: Metabolic & Health Evaluation */}
              <div className="card p-3.5 bg-white dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800 rounded-2xl">
                <h4 className="text-[11px] font-display font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-surface-100 dark:border-surface-800">
                  <HeartPulse className="w-3.5 h-3.5 text-red-500" /> Metabolic & Health Indices
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Visceral Fat</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.visceralFat || 'Level 11'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">BMR</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.bmr || '1,650 kcal'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">BMI</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.bmi || '25.4'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Body Water</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.bodyWater || '42.3 L'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Protein Content</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.proteinMass || '12.8 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Bone Minerals</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.boneMineralContent || '3.8 kg'}</strong>
                  </div>
                  <div className="p-2 bg-surface-50 dark:bg-surface-800/50 rounded-xl flex justify-between items-center col-span-2">
                    <span className="text-surface-600 dark:text-surface-400">Waist-to-Hip Ratio (WHR)</span>
                    <strong className="font-mono text-surface-900 dark:text-white">{rawMetrics.waistToHipRatio || '0.88'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 8. End of Results: Optional Save Card for Guests / Member Actions */}
        {isGuest ? (
          <div className="pt-2">
            <SaveResultsPrompt onContinueAsGuest={() => {}} />
          </div>
        ) : (
          <div className="space-y-2.5 pt-4">
            <Link
              to="/assessment"
              className="btn-primary w-full py-4 text-xs font-display font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" /> Start New Assessment
            </Link>

            <Link
              to="/dashboard"
              className="btn-secondary w-full py-3.5 text-xs font-display font-bold flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Return to Member Dashboard
            </Link>
          </div>
        )}
      </div>

      {/* 1-Page PDF Printable Modal */}
      {showPrintModal && (
        <PrintableSummary
          profile={profile}
          fitMao={rawMetrics}
          parq={profile?.parq_answers}
          weights={weights}
          user={profile?.user}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
