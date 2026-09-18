import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Activity, AlertCircle, ArrowRight, Award, BookmarkCheck, Calendar,
  ChevronLeft, Download, Dumbbell, FileSearch, LayoutDashboard, PlusCircle,
  Sparkles, Target, Users
} from 'lucide-react';
import MainFocusCard from './MainFocusCard.jsx';
import BecauseYouToldUs from './BecauseYouToldUs.jsx';
import PriorityList from './PriorityList.jsx';
import CalculationDetails from './CalculationDetails.jsx';
import SaveResultsPrompt from './SaveResultsPrompt.jsx';
import PrintableSummary from './PrintableSummary.jsx';
import { api } from '../../utils/api.js';
import { scoreMetrics } from '../../utils/scoreMetrics.js';

const GOAL_NAMES = {
  fat_loss: 'Fat Reduction & Recomposition',
  muscle_gain: 'Muscle Growth & Functional Strength',
  health_longevity: 'Cardiovascular & Overall Health',
  health: 'Cardiovascular & Overall Health',
  athletic_performance: 'Athletic Performance & Agility',
  performance: 'Athletic Performance & Agility',
  posture_mobility: 'Posture, Joint Health & Mobility'
};

const ACTIVITY_NAMES = {
  strength: 'Resistance & Strength Training',
  aerobic: 'Cardio & Aerobic Training',
  cardio_conditioning: 'Endurance Conditioning',
  athletic_agility: 'Sports & Agility Drills',
  neuromotor: 'Sports & Agility Drills',
  mobility_flexibility: 'Mobility & Posture Routines',
  flexibility: 'Mobility & Posture Routines'
};

const AVAILABILITY_LABELS = {
  '1-2': '1–2 days / week',
  '3-4': '3–4 days / week',
  '5+': '5+ days / week'
};

function readable(value, fallback) {
  if (!value) return fallback;
  return String(value).replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AssessmentSummary({ parqAnswers, source }) {
  const goalKey = parqAnswers.primaryGoal || parqAnswers.goal || parqAnswers.goals?.[0];
  const activityKey = parqAnswers.activityCategory || parqAnswers.activityCategories?.[0] || parqAnswers.activity || 'strength';
  const availabilityKey = parqAnswers.availability;
  const items = [
    { icon: Target, label: 'Primary Goal', value: GOAL_NAMES[goalKey] || readable(goalKey, 'General Fitness') },
    { icon: Dumbbell, label: 'Workout Focus', value: ACTIVITY_NAMES[activityKey] || readable(activityKey, 'General Physical Activity') },
    { icon: Calendar, label: 'Availability', value: AVAILABILITY_LABELS[availabilityKey] || readable(availabilityKey, '3–4 days / week') }
  ];

  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-4 shadow-card dark:border-surface-800 dark:bg-surface-900 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="h-5 w-5 text-brand-600 dark:text-brand-300" />
          <h2 className="font-display font-extrabold text-surface-900 dark:text-white">Your Assessment Summary</h2>
        </div>
        <span className="self-start rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-[10px] font-display font-bold text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300">Based on FitMao + your answers</span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800/60">
            <span className="flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300"><Icon className="h-3.5 w-3.5" /> {label}</span>
            <strong className="mt-1 block text-xs font-display text-surface-900 dark:text-white">{value}</strong>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-surface-400">Assessment source: {source || 'Confirmed FitMao assessment'}</p>
    </section>
  );
}

function RecommendedNextStep({ mainFocus, topPriorities, isGuest, onDownload }) {
  const discussionOrder = [mainFocus, ...topPriorities].filter(Boolean);
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300"><Users className="h-5 w-5" /></span>
        <div>
          <h2 className="font-display font-extrabold text-surface-900 dark:text-white">Your Recommended Next Step</h2>
          <p className="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">Use this order to begin a conversation with a qualified trainer or coach. FitStart does not create an exercise or nutrition prescription.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {discussionOrder.map((metric, index) => (
          <div key={metric.id || index} className="flex items-center gap-3 rounded-2xl bg-surface-50 p-3 dark:bg-surface-800/60">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-mono font-black text-white">{index + 1}</span>
            <div>
              <strong className="block text-xs font-display text-surface-900 dark:text-white">{metric.title}</strong>
              <span className="text-[10px] text-surface-500 dark:text-surface-400">{index === 0 ? 'Discuss this focus first' : 'Supporting measurement to discuss'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link to={isGuest ? '/signup?reason=save_assessment' : '/dashboard'} className="btn-primary flex items-center justify-center gap-2 py-3 text-xs font-display font-bold"><BookmarkCheck className="h-4 w-4" /> {isGuest ? 'Save Results' : 'View Saved Results'}</Link>
        <button type="button" onClick={onDownload} className="btn-secondary flex items-center justify-center gap-2 py-3 text-xs font-display font-bold"><Download className="h-4 w-4" /> Download Summary</button>
      </div>
    </section>
  );
}

function FullReportLink({ profileId }) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900 sm:p-6">
      <div className="grid items-center gap-5 md:grid-cols-[150px_1fr_auto]">
        <div className="rounded-2xl bg-surface-100 p-3 dark:bg-surface-800">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <div className="h-2 w-20 rounded bg-blue-700" />
            <div className="mt-2 grid grid-cols-3 gap-1">{Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-5 rounded bg-blue-50" />)}</div>
            <div className="mt-2 h-1.5 rounded bg-blue-200" />
            <div className="mt-1 h-1.5 w-3/4 rounded bg-blue-100" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2"><FileSearch className="h-5 w-5 text-brand-600 dark:text-brand-300" /><h2 className="font-display font-extrabold text-surface-900 dark:text-white">Understanding Your Other FitMao Results</h2></div>
          <p className="mt-2 text-xs leading-relaxed text-surface-500 dark:text-surface-400">Your FitMao report contains other measurements that were not selected as priorities. View their displayed values and plain-English explanations on a separate reference page.</p>
          <p className="mt-2 text-[10px] text-surface-400">Includes body composition, segmental assessment, device-generated estimates and history.</p>
        </div>
        <Link to={`/results/${profileId}/fitmao-report`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-500 px-4 py-3 text-xs font-display font-extrabold text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950/30">View More of the FitMao Report <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

function SourceGuide() {
  const sources = [
    ['FitMao', 'Provides measurements and device-generated estimates.'],
    ['FitStart', 'Explains and prioritizes the results.'],
    ['Fitness Coach', 'Creates the personalized training or nutrition plan.']
  ];
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900">
      <h2 className="font-display font-extrabold text-surface-900 dark:text-white">Know where each result comes from</h2>
      <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">Each part of the result has a specific source and purpose.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {sources.map(([title, text]) => <div key={title} className="rounded-2xl bg-surface-50 p-3 dark:bg-surface-800/60"><strong className="text-xs font-display text-surface-900 dark:text-white">{title}</strong><p className="mt-1 text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">{text}</p></div>)}
      </div>
      <p className="mt-4 border-t border-surface-100 pt-3 text-center text-[10px] text-surface-400 dark:border-surface-800">FitStart is an educational interpretation tool and does not provide a medical diagnosis.</p>
    </section>
  );
}

export default function ResultsView({ user }) {
  const { profileId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resultsData, setResultsData] = useState(null);
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
    return <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center"><div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-surface-200 border-t-brand-500" /><p className="text-xs font-display font-semibold text-surface-500">Loading your personalized interpretation...</p></div>;
  }

  if (error || !resultsData) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <h2 className="mt-3 text-xl font-display font-bold text-surface-900 dark:text-white">Results Unavailable</h2>
        <p className="mt-2 text-xs text-surface-500">{error || 'Could not find the requested record.'}</p>
        <Link to={user ? '/dashboard' : '/assessment'} className="btn-primary mt-5 text-xs">{user ? 'Return to Dashboard' : 'Start Assessment'}</Link>
      </div>
    );
  }

  const isGuest = !user || profile?.user_id === null || resultsData?.isGuest || profileId === 'guest';
  const rawMetrics = profile?.fitMao_report_data || {};
  const parqAnswers = profile?.parq_answers || {};
  const currentCalculation = scoreMetrics(rawMetrics, parqAnswers);
  const mainFocus = currentCalculation.mainFocus || resultsData.main_focus;
  const topPriorities = currentCalculation.topPriorities || resultsData.top_priorities || [];
  const otherPriorities = currentCalculation.otherPriorities || resultsData.otherPriorities || [];
  const becauseYouToldUs = currentCalculation.becauseYouToldUs || resultsData.becauseYouToldUs;

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl bg-surface-50 px-3 pb-28 font-sans dark:bg-surface-950 sm:px-6 lg:px-8">
      <div className="sticky top-0 z-30 mb-5 flex items-center justify-between rounded-b-2xl border-b border-surface-200 bg-white/95 px-4 py-3.5 shadow-subtle backdrop-blur-md dark:border-surface-800 dark:bg-surface-900/95 sm:px-6 sm:py-4">
        {user ? <Link to="/dashboard" className="flex items-center gap-1.5 text-xs font-display font-bold text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"><ChevronLeft className="h-4 w-4" /> Dashboard</Link> : <span className="flex items-center gap-2 text-xs font-display font-bold"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Personalized Assessment Report</span>}
        <button type="button" onClick={() => setShowPrintModal(true)} className="flex items-center gap-1.5 rounded-xl border border-surface-200 bg-surface-100 px-3.5 py-2 text-xs font-display font-bold text-surface-700 transition-colors hover:bg-surface-200 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-200 dark:hover:bg-surface-700"><Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" /> Export PDF</button>
      </div>

      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl">Your FitStart Results</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-display font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><Award className="h-3.5 w-3.5" /> Assessment complete</span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-surface-500 dark:text-surface-400">Understand which FitMao measurements are most relevant to your goals before speaking with a fitness professional.</p>
        <p className="mt-2 text-[11px] text-surface-400"><Activity className="mr-1 inline h-3.5 w-3.5" /> {rawMetrics.memberName || 'FitStart member'} · {rawMetrics.testDate || profile?.assessed_date?.split('T')[0] || 'Assessment date'}</p>
      </header>

      <div className="space-y-5">
        <AssessmentSummary parqAnswers={parqAnswers} source={rawMetrics.dataSource} />
        <MainFocusCard mainFocus={mainFocus} />
        <PriorityList topPriorities={topPriorities} mainFocus={mainFocus} />
        <BecauseYouToldUs text={becauseYouToldUs} mainFocus={mainFocus} parqAnswers={parqAnswers} />
        <RecommendedNextStep mainFocus={mainFocus} topPriorities={topPriorities} isGuest={isGuest} onDownload={() => setShowPrintModal(true)} />
        <FullReportLink profileId={profileId} />
        <SourceGuide />

        {isGuest ? (
          <SaveResultsPrompt onContinueAsGuest={() => {}} />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <Link to="/assessment" className="btn-primary flex items-center justify-center gap-2 py-3.5 text-xs font-display font-bold"><PlusCircle className="h-4 w-4" /> Start New Assessment</Link>
            <Link to="/dashboard" className="btn-secondary flex items-center justify-center gap-2 py-3.5 text-xs font-display font-bold"><LayoutDashboard className="h-4 w-4" /> Return to Member Dashboard</Link>
          </div>
        )}

        <CalculationDetails mainFocus={mainFocus} topPriorities={topPriorities} otherPriorities={otherPriorities} />
      </div>

      {showPrintModal && <PrintableSummary profile={profile} fitMao={rawMetrics} parq={parqAnswers} mainFocus={mainFocus} topPriorities={topPriorities} becauseYouToldUs={becauseYouToldUs} user={profile?.user} onClose={() => setShowPrintModal(false)} />}
    </main>
  );
}
