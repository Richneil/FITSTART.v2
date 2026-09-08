import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, ChevronRight, GitCompareArrows } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScanComparisonModal from './ScanComparisonModal.jsx';
import { api, setPendingGuestAssessment } from '../../utils/api.js';
import {
  formatAssessmentDate,
  isReferenceAssessment,
  REFERENCE_ASSESSMENTS
} from '../../data/memberExperience.js';

function delta(current, previous, key) {
  const currentValue = parseFloat(String(current?.[key] || '').replace(/[^\d.-]/g, ''));
  const previousValue = parseFloat(String(previous?.[key] || '').replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue)) return null;
  return Number((currentValue - previousValue).toFixed(1));
}

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState(REFERENCE_ASSESSMENTS);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    let active = true;
    api.getAssessments()
      .then((data) => {
        const records = data.assessments || [];
        if (active && records.length) setAssessments(records);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      active = false;
    };
  }, []);

  const sorted = useMemo(
    () => [...assessments].sort((a, b) => new Date(b.assessed_date || b.created_at) - new Date(a.assessed_date || a.created_at)),
    [assessments]
  );
  const latestMetrics = sorted[0]?.fitMao_report_data || {};
  const previousMetrics = sorted[1]?.fitMao_report_data || {};

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
    <main className="min-h-screen bg-surface-50 dark:bg-surface-950 px-4 sm:px-8 py-6 max-w-4xl mx-auto pb-28 animate-slide-up">
      <header className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 flex items-center justify-center text-surface-600 dark:text-surface-300 shadow-subtle"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold">Assessment History</h1>
          <p className="text-xs text-surface-500 dark:text-surface-400">{sorted.length} assessments recorded</p>
        </div>
      </header>

      <button
        type="button"
        onClick={() => setShowComparison(true)}
        className="card w-full mb-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl p-4 flex items-center gap-3 text-left hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
      >
        <span className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 flex items-center justify-center">
          <GitCompareArrows className="w-5 h-5" />
        </span>
        <span className="flex-1">
          <strong className="block text-sm font-display">Compare Assessments</strong>
          <span className="block text-xs text-surface-500 dark:text-surface-400">Side-by-side metric comparison</span>
        </span>
        <ChevronRight className="w-4 h-4 text-surface-400" />
      </button>

      <section className="relative space-y-4 before:absolute before:left-[18px] before:top-6 before:bottom-6 before:w-px before:bg-surface-200 dark:before:bg-surface-800">
        {sorted.map((assessment, index) => {
          const metrics = assessment.fitMao_report_data || {};
          const isCurrent = index === 0;
          const muscleDelta = isCurrent ? delta(latestMetrics, previousMetrics, 'skeletalMuscleMass') : null;
          const fatDelta = isCurrent ? delta(latestMetrics, previousMetrics, 'bodyFatPercentage') : null;
          return (
            <article key={assessment.id} className="relative pl-9">
              <span className={`absolute left-[13px] top-6 w-3 h-3 rounded-full border-2 border-brand-600 z-10 ${isCurrent ? 'bg-brand-600' : 'bg-white dark:bg-surface-950'}`} />
              <div className="card bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-card">
                <div className="p-4 flex items-center justify-between border-b border-surface-200 dark:border-surface-800">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <strong className="text-sm font-display">{formatAssessmentDate(assessment.assessed_date)}</strong>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-display font-extrabold uppercase ${isCurrent ? 'bg-brand-600 text-white' : 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'}`}>
                    {isCurrent ? 'Current' : 'Previous'}
                  </span>
                </div>

                <div className="p-4">
                  <p className="mb-3 text-xs text-surface-500 dark:text-surface-400">
                    Goal: <strong className="text-surface-900 dark:text-white">{assessment.goalLabel || (isCurrent ? 'Build Muscle' : 'Lose Body Fat')}</strong>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['Muscle Mass', metrics.skeletalMuscleMass || '—', muscleDelta, 'kg'],
                      ['Body Fat %', metrics.bodyFatPercentage || '—', fatDelta, '%'],
                      ['Fat Mass', metrics.fatMass || '—', null, 'kg']
                    ].map(([label, value, metricDelta, unit]) => (
                      <div key={label} className="rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100/80 dark:border-brand-900 p-3 text-center">
                        <span className="block text-[9px] text-surface-500 dark:text-surface-400">{label}</span>
                        <strong className="mt-1 block text-sm font-mono">{value}</strong>
                        {metricDelta !== null && (
                          <span className={`mt-1 block text-[10px] font-mono font-bold ${label === 'Body Fat %' ? 'text-rose-600 dark:text-rose-400' : 'text-brand-700 dark:text-brand-300'}`}>
                            {metricDelta > 0 ? '+' : ''}{metricDelta} {unit}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openResults(assessment)}
                  className="w-full px-4 py-4 flex items-center justify-between border-t border-surface-200 dark:border-surface-800 text-xs font-display font-bold text-brand-700 dark:text-brand-300 hover:bg-brand-50/60 dark:hover:bg-brand-950/20"
                >
                  View full results <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {showComparison && (
        <ScanComparisonModal assessments={sorted} onClose={() => setShowComparison(false)} />
      )}
    </main>
  );
}
