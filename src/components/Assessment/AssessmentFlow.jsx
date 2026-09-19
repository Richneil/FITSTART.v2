import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckCircle2, Clock3, ShieldCheck, Target } from 'lucide-react';
import ParQForm from './ParQForm.jsx';
import GoalCheckIn from './GoalCheckIn.jsx';
import ProcessingScreen from './ProcessingScreen.jsx';
import UploadStep from './UploadStep.jsx';
import { api, setPendingGuestAssessment } from '../../utils/api.js';
import { REFERENCE_ASSESSMENTS } from '../../data/memberExperience.js';

export default function AssessmentFlow({ user }) {
  const navigate = useNavigate();

  const [step, setStep] = useState('capture'); // 'capture', 'intro', 'parq', 'checkin', 'processing'
  const [fitMaoData] = useState(() => ({
    ...REFERENCE_ASSESSMENTS[0].fitMao_report_data,
    dataSource: 'Prototype FitMao assessment data',
    correctedFields: []
  }));
  const [parqAnswers, setParqAnswers] = useState(null);
  const [changeLog, setChangeLog] = useState([]);

  const handleRecordChange = (field, from, to) => {
    setChangeLog(prev => [
      ...prev,
      {
        field,
        from: String(from),
        to: String(to),
        timestamp: Date.now()
      }
    ]);
  };

  const handleParQDone = (answers) => {
    setParqAnswers(answers);
    setStep('checkin');
  };

  const handleConfirmGoal = async () => {
    setStep('processing');
    const assessedDate = fitMaoData?.testDate
      ? new Date(`${fitMaoData.testDate}T09:00:00`).toISOString()
      : new Date().toISOString();
    try {
      // 1. Create Assessment profile in DB or guest session
      const created = await api.createAssessment({
        fitMao_report_data: fitMaoData,
        parq_answers: parqAnswers,
        assessed_date: assessedDate
      });

      const profileId = created.profile_id || 'guest';

      // Store in guest session state for account linking prompt
      setPendingGuestAssessment({
        profileId,
        fitMao_report_data: fitMaoData,
        parq_answers: parqAnswers,
        assessed_date: assessedDate,
        changeLog,
        isGuest: !user
      });

      // 2. Compute results
      await api.calculateResults(profileId, { changeLog });

      // 3. Navigate to results page
      setTimeout(() => {
        navigate(`/results/${profileId}`);
      }, 1200);
    } catch (err) {
      console.warn('Proceeding with guest local calculation:', err.message);
      setPendingGuestAssessment({
        profileId: 'guest',
        fitMao_report_data: fitMaoData,
        parq_answers: parqAnswers,
        assessed_date: assessedDate,
        changeLog,
        isGuest: !user
      });
      setTimeout(() => {
        navigate('/results/guest');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 font-sans transition-colors duration-200">
      {step === 'capture' && (
        <UploadStep
          prototypeMode
          onDataExtracted={() => setStep('parq')}
          onCancel={() => user ? navigate('/dashboard') : navigate('/')}
        />
      )}

      {step === 'intro' && (
        <main className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-slide-up">
          <button
            type="button"
            onClick={() => user ? navigate('/dashboard') : navigate('/')}
            className="w-10 h-10 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 flex items-center justify-center text-surface-600 dark:text-surface-300 shadow-subtle mb-6"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <section className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold leading-tight text-surface-900 dark:text-white">
              Let’s find your <span className="text-brand-600 dark:text-brand-400">starting point</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-surface-500 dark:text-surface-400 max-w-xl">
              For this prototype, FitStart uses a prepared FitMao assessment and the existing assessment flow to identify which measurements are most relevant to your starting point.
            </p>
          </section>

          <div className="mb-7 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 px-4 py-3 flex items-center gap-2 text-xs font-display font-bold text-surface-800 dark:text-surface-200">
            <Clock3 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            About 3–5 minutes to complete
          </div>

          <div className="mb-7 rounded-3xl border border-brand-200 bg-brand-50/70 p-4 dark:border-brand-800 dark:bg-brand-950/30">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 dark:bg-surface-900 dark:text-brand-300">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div>
                <strong className="block text-sm font-display text-surface-900 dark:text-white">Prototype FitMao assessment is ready</strong>
                <p className="mt-1 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
                  Raymund Santos’s sample FitMao measurements will be used during testing. Continue through the guided assessment steps.
                </p>
              </div>
            </div>
          </div>

          <h2 className="mb-3 text-[11px] font-display font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">What we’ll cover</h2>
          <div className="space-y-3">
            {[
              [ShieldCheck, 'Guided assessment', 'Complete each section at your own pace'],
              [Target, 'Tell us about yourself', 'Choose your goals, activity style, schedule, and common challenges']
            ].map(([Icon, title, description]) => (
              <div key={title} className="card p-4 bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 flex items-center gap-4">
                <span className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <strong className="block text-sm font-display text-surface-900 dark:text-white">{title}</strong>
                  <span className="mt-0.5 block text-xs text-surface-500 dark:text-surface-400">{description}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-start gap-2 text-xs leading-relaxed text-surface-500 dark:text-surface-400">
            <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0 text-brand-600 dark:text-brand-400" />
            <p>You can complete the assessment as a guest. Sign in when you want to keep the result in your member history and compare it later.</p>
          </div>

          <button type="button" onClick={() => setStep('parq')} className="btn-primary mt-7 min-h-[52px]">
            Continue Assessment
          </button>
        </main>
      )}

      {step === 'parq' && (
        <ParQForm
          initialAnswers={parqAnswers}
          onComplete={handleParQDone}
          onBack={() => setStep('capture')}
          onRecordChange={handleRecordChange}
        />
      )}

      {step === 'checkin' && (
        <GoalCheckIn
          currentGoal={parqAnswers?.goal || (parqAnswers?.goals && parqAnswers.goals[0]) || 'fat_loss'}
          onConfirmYes={handleConfirmGoal}
          onConfirmNo={() => setStep('parq')}
        />
      )}

      {step === 'processing' && <ProcessingScreen />}
    </div>
  );
}
