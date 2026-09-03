import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadStep from './UploadStep.jsx';
import ParQForm from './ParQForm.jsx';
import GoalCheckIn from './GoalCheckIn.jsx';
import ProcessingScreen from './ProcessingScreen.jsx';
import { api } from '../../utils/api.js';

export default function AssessmentFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState('upload'); // 'upload', 'parq', 'checkin', 'processing'
  const [fitMaoData, setFitMaoData] = useState(null);
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

  const handleUploadDone = (data) => {
    setFitMaoData(data);
    setStep('parq');
  };

  const handleParQDone = (answers) => {
    setParqAnswers(answers);
    setStep('checkin');
  };

  const handleConfirmGoal = async () => {
    setStep('processing');
    try {
      // 1. Create Assessment profile in DB
      const created = await api.createAssessment({
        fitMao_report_data: fitMaoData,
        parq_answers: parqAnswers,
        assessed_date: new Date().toISOString()
      });

      const profileId = created.profile_id;

      // 2. Compute and store results in DB
      await api.calculateResults(profileId, { changeLog });

      // 3. Navigate to results page
      setTimeout(() => {
        navigate(`/results/${profileId}`);
      }, 1200);
    } catch (err) {
      alert(err.message || 'Failed to process assessment. Please try again.');
      setStep('checkin');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      {step === 'upload' && (
        <UploadStep
          onDataExtracted={handleUploadDone}
          onCancel={() => navigate('/dashboard')}
        />
      )}

      {step === 'parq' && (
        <ParQForm
          initialAnswers={parqAnswers}
          onComplete={handleParQDone}
          onBack={() => setStep('upload')}
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
