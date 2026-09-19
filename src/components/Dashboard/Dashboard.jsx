import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Plus,
  TrendingUp
} from 'lucide-react';
import { api, setPendingGuestAssessment } from '../../utils/api.js';
import {
  formatAssessmentDate,
  isReferenceAssessment,
  REFERENCE_ASSESSMENTS,
  REFERENCE_MEMBER
} from '../../data/memberExperience.js';

function metricValue(metrics, key, fallback = '—') {
  return metrics?.[key] || fallback;
}

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState(REFERENCE_ASSESSMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.getAssessments()
      .then((data) => {
        if (!active) return;
        const records = data.assessments || [];
        setAssessments(records.length ? records : REFERENCE_ASSESSMENTS);
      })
      .catch(() => {
        if (active) setAssessments(REFERENCE_ASSESSMENTS);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const sortedAssessments = useMemo(
    () => [...assessments].sort((a, b) => new Date(b.assessed_date || b.created_at) - new Date(a.assessed_date || a.created_at)),
    [assessments]
  );

  const latest = sortedAssessments[0] || REFERENCE_ASSESSMENTS[0];
  const latestMetrics = latest.fitMao_report_data || {};
  const firstName = user?.firstName || REFERENCE_MEMBER.firstName;
  const showingDemo = isReferenceAssessment(latest);

  const openResults = (assessment) => {
    if (isReferenceAssessment(assessment)) {
      setPendingGuestAssessment({
        profileId: 'guest',
        fitMao_report_data: assessment.fitMao_report_data,
        parq_answers: assessment.parq_answers,
        assessed_date: assessment.assessed_date,
        isGuest: true
      });
      navigate('/results/guest');
      return;
    }
    navigate(`/results/${assessment.id}`);
  };

  return (
    <main className="min-h-screen bg-surface-50 dark:bg-surface-950 px-4 sm:px-8 py-6 max-w-5xl mx-auto pb-28 animate-slide-up font-sans transition-colors duration-200">
      <section className="mb-6">
        <p className="text-xs font-display font-bold text-brand-700 dark:text-brand-300">Good day,</p>
        <h1 className="mt-0.5 text-2xl sm:text-3xl font-display font-extrabold text-surface-900 dark:text-white">
          {firstName}
        </h1>
        <p className="mt-1 flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          Last assessed <strong className="text-surface-800 dark:text-surface-200">{formatAssessmentDate(latest.assessed_date)}</strong>
          {showingDemo && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-display font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">Demo data</span>}
        </p>
      </section>

      <Link
        to="/assessment"
        className="mb-5 rounded-3xl bg-surface-900 border border-brand-300/25 p-5 text-white shadow-card flex items-center justify-between group"
      >
        <div>
          <strong className="block font-display text-base font-extrabold text-white">New Assessment</strong>
          <span className="mt-0.5 block text-xs text-brand-100">Upload a new FitMao result</span>
        </div>
        <span className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center group-hover:bg-white/20 group-active:scale-95 transition-all">
          <ArrowRight className="w-5 h-5" />
        </span>
      </Link>

      <section className="card bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl mb-5 shadow-card">
        <div className="px-5 py-4 flex items-center justify-between border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-sm font-display font-extrabold">Latest Assessment</h2>
          </div>
          <span className="text-[11px] text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 rounded-full px-2.5 py-1">
            {formatAssessmentDate(latest.assessed_date)}
          </span>
        </div>

        <div className="p-5">
          {loading && (
            <div className="mb-3 h-1 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
              <span className="block h-full w-1/2 animate-pulse rounded-full bg-brand-500" />
            </div>
          )}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              ['Muscle Mass', metricValue(latestMetrics, 'skeletalMuscleMass', '32.4 kg')],
              ['Body Fat %', metricValue(latestMetrics, 'bodyFatPercentage', '24.8%')],
              ['BMR', metricValue(latestMetrics, 'bmr', '1,620 kcal')]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-brand-100/70 dark:border-brand-900 bg-brand-50/70 dark:bg-brand-950/30 px-2 py-3 text-center">
                <span className="block text-[10px] text-surface-500 dark:text-surface-400">{label}</span>
                <strong className="mt-1 block text-sm font-mono text-surface-900 dark:text-white">{value}</strong>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
            <span>Goal:</span>
            <span className="rounded-full bg-brand-50 dark:bg-brand-950/50 px-2.5 py-1 font-display font-bold text-brand-700 dark:text-brand-300">
              {latest.goalLabel || 'Build Muscle'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openResults(latest)}
          className="w-full px-5 py-4 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between text-xs font-display font-bold text-brand-700 dark:text-brand-300 hover:bg-brand-50/60 dark:hover:bg-brand-950/20 transition-colors"
        >
          View full results <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      <section className="card bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-card">
        <div className="px-5 py-4 flex items-center gap-2 border-b border-surface-200 dark:border-surface-800">
          <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-sm font-display font-extrabold">Progress Timeline</h2>
        </div>

        <div>
          {sortedAssessments.slice(0, 2).map((assessment, index) => {
            const metrics = assessment.fitMao_report_data || {};
            return (
              <button
                key={assessment.id}
                type="button"
                onClick={() => openResults(assessment)}
                className="w-full px-5 py-4 flex items-center gap-3 text-left border-b border-surface-200 dark:border-surface-800 last:border-b-0 hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full border-2 border-brand-600 bg-brand-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-display text-surface-900 dark:text-white">{formatAssessmentDate(assessment.assessed_date)}</strong>
                    {index === 0 && (
                      <span className="rounded-full bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 text-[9px] font-bold uppercase text-brand-700 dark:text-brand-300">Current</span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
                    SMM {metricValue(metrics, 'skeletalMuscleMass')} · PBF {metricValue(metrics, 'bodyFatPercentage')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-400" />
              </button>
            );
          })}
        </div>

        <Link
          to="/history"
          className="px-5 py-4 flex items-center justify-between text-xs font-display font-bold text-brand-700 dark:text-brand-300 border-t border-surface-200 dark:border-surface-800 hover:bg-brand-50/60 dark:hover:bg-brand-950/20 transition-colors"
        >
          Full history <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:hidden">
        <Link to="/history" className="btn-secondary gap-2"><Clock3 className="w-4 h-4" /> History</Link>
        <Link to="/assessment" className="btn-primary gap-2"><Plus className="w-4 h-4" /> New scan</Link>
      </div>
    </main>
  );
}
