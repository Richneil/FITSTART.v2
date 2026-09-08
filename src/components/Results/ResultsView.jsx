import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Activity, 
  ArrowRight,
  ChevronDown,
  ChevronLeft, 
  ChevronUp,
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

function SupportingMetric({ label, value, explanation, accent = false }) {
  return (
    <div className={`rounded-xl border p-3 ${accent
      ? 'border-brand-200 bg-brand-50/60 dark:border-brand-800 dark:bg-brand-950/30'
      : 'border-surface-100 bg-surface-50 dark:border-surface-800 dark:bg-surface-800/50'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-display font-bold text-surface-800 dark:text-surface-200">{label}</span>
        <strong className={`shrink-0 font-mono text-xs ${accent ? 'text-brand-700 dark:text-brand-300' : 'text-surface-900 dark:text-white'}`}>
          {value}
        </strong>
      </div>
      {explanation && <p className="mt-1 text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">{explanation}</p>}
    </div>
  );
}

function ReportAccordion({ title, description, icon: Icon, isOpen, onToggle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/60"
      >
        <span className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-300">
            <Icon className="h-4 w-4" />
          </span>
          <span>
            <strong className="block text-sm font-display text-surface-900 dark:text-white">{title}</strong>
            <span className="mt-0.5 block text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">{description}</span>
          </span>
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>
      {isOpen && <div className="border-t border-surface-100 p-4 dark:border-surface-800">{children}</div>}
    </section>
  );
}

function formatFitMaoChange(value, positiveLabel, negativeLabel) {
  const amount = Number.parseFloat(String(value));
  if (Number.isNaN(amount)) return value || 'Not available';
  if (amount === 0) return 'No change';
  return `${amount > 0 ? positiveLabel : negativeLabel} ${Math.abs(amount).toFixed(1)} kg`;
}

export default function ResultsView({ user }) {
  const { profileId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  const [showRawReport, setShowRawReport] = useState(false);
  const [openReportSection, setOpenReportSection] = useState('composition');
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
    becauseYouToldUs
  } = resultsData;
  const rawMetrics = profile?.fitMao_report_data || {};
  const parqAnswers = profile?.parq_answers || {};
  const correctedCount = Array.isArray(rawMetrics.correctedFields) ? rawMetrics.correctedFields.length : 0;

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
            <Activity className="w-4 h-4" /> Your FitMao Assessment
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
            <Award className="w-4 h-4 text-emerald-600" /> FitMao Score: {rawMetrics?.healthScore || '74 / 100'}
          </span>
          <span className="block text-xs text-surface-400 dark:text-surface-500 font-mono">
            FitMao body type: {rawMetrics?.bodyType || 'Standard Overweight'}
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-1.5 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-xs text-surface-600 dark:border-brand-900 dark:bg-brand-950/30 dark:text-surface-300 sm:flex-row sm:items-center sm:justify-between">
          <span>
            <strong className="font-display text-surface-900 dark:text-white">Assessment source:</strong>{' '}
            {rawMetrics.dataSource || 'Confirmed FitMao assessment'}
          </span>
          {correctedCount > 0 && (
            <span className="font-display font-bold text-brand-700 dark:text-brand-300">{correctedCount} value{correctedCount === 1 ? '' : 's'} corrected during review</span>
          )}
        </div>

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

        {/* 5. Supporting FitMao measurements (collapsible) */}
        <div>
          <button
            onClick={() => setShowRawReport(!showRawReport)}
            aria-expanded={showRawReport}
            className="w-full p-4 bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-800 text-left text-surface-700 dark:text-surface-300 flex items-center justify-between gap-4 transition-colors shadow-sm cursor-pointer"
          >
            <span className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-300">
                <Activity className="w-4 h-4" />
              </span>
              <span>
                <strong className="block text-sm font-display text-surface-900 dark:text-white">Your Full FitMao Report</strong>
                <span className="mt-0.5 block text-[11px] font-normal leading-relaxed text-surface-500 dark:text-surface-400">
                  Additional measurements from your assessment
                </span>
              </span>
            </span>
            {showRawReport ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
          </button>

          {showRawReport && (
            <div className="mt-3 space-y-3 animate-slide-up">
              <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-xs leading-relaxed text-surface-600 dark:border-brand-900 dark:bg-brand-950/30 dark:text-surface-300">
                These values come from your FitMao assessment. They support your results, but FitStart only uses the measurements relevant to your personalized priorities.
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-surface-200 bg-white p-4 text-xs dark:border-surface-800 dark:bg-surface-900 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <strong className="block font-display text-surface-900 dark:text-white">About this assessment</strong>
                  <span className="mt-0.5 block text-[11px] text-surface-500 dark:text-surface-400">Recorded {rawMetrics.testDate || '2026-09-05'} {rawMetrics.testTime || ''}</span>
                </div>
                <span className="text-[11px] text-surface-500 dark:text-surface-400">Scanner: {rawMetrics.scannerDevice || 'FitMao 3D Pro'}</span>
              </div>

              <ReportAccordion
                title="Your Body Composition"
                description="See how your total weight is divided"
                icon={Scale}
                isOpen={openReportSection === 'composition'}
                onToggle={() => setOpenReportSection(openReportSection === 'composition' ? null : 'composition')}
              >
                <div className="rounded-2xl bg-surface-900 p-4 text-center text-white dark:bg-surface-950">
                  <span className="block text-[11px] font-display uppercase tracking-wider text-surface-300">Your total weight</span>
                  <strong className="mt-1 block text-2xl font-display">{rawMetrics.weight || '78.0 kg'}</strong>
                  <span className="mt-1 block text-[11px] text-surface-400">at the time of this assessment</span>
                </div>

                <div className="my-3 flex items-center gap-2 text-[11px] font-display font-bold text-surface-500 dark:text-surface-400">
                  <span className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
                  MADE UP OF
                  <span className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-accent-200 bg-accent-50/60 p-3 dark:border-accent-800 dark:bg-accent-950/30">
                    <span className="block text-xs font-display font-bold text-surface-800 dark:text-surface-200">Body fat</span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <strong className="font-mono text-lg text-accent-700 dark:text-accent-300">{rawMetrics.fatMass || '19.1 kg'}</strong>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-accent-700 dark:bg-surface-900 dark:text-accent-300">{rawMetrics.bodyFatPercentage || '24.5%'}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">The estimated fat portion of your total weight.</p>
                  </div>
                  <SupportingMetric label="Fat-free mass" value={rawMetrics.fatFreeMass || '58.9 kg'} explanation="Everything in your body except estimated body fat." />
                </div>

                <div className="mt-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-3 dark:border-brand-900 dark:bg-brand-950/20">
                  <strong className="block text-xs font-display text-surface-900 dark:text-white">Muscle details in your report</strong>
                  <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">FitMao shows both a broad muscle estimate and the muscles used for movement.</p>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <SupportingMetric label="Muscle mass" value={rawMetrics.muscleMass || '55.4 kg'} />
                    <SupportingMetric label="Skeletal muscle" value={rawMetrics.skeletalMuscleMass || '32.1 kg'} accent />
                  </div>
                </div>
              </ReportAccordion>

              <ReportAccordion
                title="FitMao Estimates"
                description="View the scanner’s reference weight and suggested changes"
                icon={Target}
                isOpen={openReportSection === 'estimates'}
                onToggle={() => setOpenReportSection(openReportSection === 'estimates' ? null : 'estimates')}
              >
                <p className="mb-3 text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">
                  These values are copied from your FitMao report. They are not created by FitStart.
                </p>
                <div className="flex items-center justify-center gap-3 rounded-2xl bg-surface-50 p-4 text-center dark:bg-surface-800/50">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-display uppercase text-surface-500">Current weight</span>
                    <strong className="mt-1 block font-mono text-lg text-surface-900 dark:text-white">{rawMetrics.weight || '78.0 kg'}</strong>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-300" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-display uppercase text-surface-500">FitMao target</span>
                    <strong className="mt-1 block font-mono text-lg text-brand-700 dark:text-brand-300">{rawMetrics.targetWeight || '72.0 kg'}</strong>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <SupportingMetric label="Total change" value={formatFitMaoChange(rawMetrics.weightControl || '-6.0 kg', 'Gain', 'Lose')} />
                  <SupportingMetric label="Fat change" value={formatFitMaoChange(rawMetrics.fatControl || '-6.0 kg', 'Gain', 'Lose')} />
                  <SupportingMetric label="Muscle change" value={formatFitMaoChange(rawMetrics.muscleControl || '0.0 kg', 'Gain', 'Reduce')} accent />
                </div>
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  These are FitMao estimates, not a personal workout or medical plan.
                </p>
              </ReportAccordion>

              <ReportAccordion
                title="Other Measurements"
                description="Additional details from your FitMao report"
                icon={HeartPulse}
                isOpen={openReportSection === 'other'}
                onToggle={() => setOpenReportSection(openReportSection === 'other' ? null : 'other')}
              >
                <div className="space-y-3">
                  <div className="rounded-2xl border border-surface-100 p-3 dark:border-surface-800">
                    <strong className="block text-xs font-display text-surface-900 dark:text-white">Energy and body size</strong>
                    <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">Estimates related to resting energy use and height compared with weight.</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <SupportingMetric label="Resting calories (BMR)" value={rawMetrics.bmr || '1,650 kcal'} />
                      <SupportingMetric label="Body mass index (BMI)" value={rawMetrics.bmi || '25.4'} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-surface-100 p-3 dark:border-surface-800">
                    <strong className="block text-xs font-display text-surface-900 dark:text-white">Fat distribution</strong>
                    <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">Measurements describing where body fat may be carried.</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <SupportingMetric label="Visceral fat level" value={rawMetrics.visceralFat || 'Level 11'} />
                      <SupportingMetric label="Waist-to-hip ratio" value={rawMetrics.waistToHipRatio || '0.88'} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-surface-100 p-3 dark:border-surface-800">
                    <strong className="block text-xs font-display text-surface-900 dark:text-white">Additional composition details</strong>
                    <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">Supporting estimates of water, protein, and bone minerals.</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <SupportingMetric label="Body water" value={rawMetrics.bodyWater || '42.3 L'} />
                      <SupportingMetric label="Protein mass" value={rawMetrics.proteinMass || '12.8 kg'} />
                      <SupportingMetric label="Bone minerals" value={rawMetrics.boneMineralContent || '3.8 kg'} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-surface-100 p-3 dark:border-surface-800">
                    <strong className="block text-xs font-display text-surface-900 dark:text-white">FitMao comparison</strong>
                    <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">Body age is a FitMao comparison estimate—not your actual or medical age.</p>
                    <div className="mt-2">
                      <SupportingMetric label="FitMao body age" value={rawMetrics.bodyAge || '31 yrs'} />
                    </div>
                  </div>
                </div>
              </ReportAccordion>
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
          mainFocus={mainFocus}
          topPriorities={topPriorities}
          becauseYouToldUs={becauseYouToldUs}
          user={profile?.user}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
