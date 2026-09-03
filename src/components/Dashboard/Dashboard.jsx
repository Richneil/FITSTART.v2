import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Activity, 
  Award, 
  User, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  TrendingUp,
  ArrowRight,
  Flame,
  Scale
} from 'lucide-react';
import AssessmentCard from './AssessmentCard.jsx';
import ScanComparisonModal from './ScanComparisonModal.jsx';
import { api } from '../../utils/api.js';

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssessments();
      setAssessments(data.assessments || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this assessment record?')) {
      try {
        await api.deleteAssessment(id);
        setAssessments(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete assessment.');
      }
    }
  };

  // Helper to generate sample assessments for defense testing
  const handleCreateSample = async (sampleType) => {
    try {
      const isFollowUp = sampleType === 'followup';
      const isAthlete = sampleType === 'athlete';

      let sampleReport;
      let sampleParq;

      if (isFollowUp) {
        // Generates an improved 6-week follow-up scan for Alex Rivera!
        sampleReport = {
          weight: '75.5 kg',
          targetWeight: '72.0 kg',
          bodyFatPercentage: '21.8%',
          skeletalMuscleMass: '33.0 kg',
          bmi: '24.6',
          bodyWater: '44.1 L',
          visceralFat: 'Level 8',
          bmr: '1,685 kcal',
          fatControl: '-3.5 kg',
          muscleControl: '+0.0 kg'
        };
        sampleParq = {
          goal: 'fat_loss',
          goals: ['fat_loss'],
          activityCategories: ['aerobic', 'strength'],
          availability: '3-4',
          nutritionPattern: 'high_protein',
          waterIntake: 'optimal',
          barriers: 'none'
        };
      } else if (isAthlete) {
        sampleReport = {
          weight: '71.5 kg',
          targetWeight: '76.0 kg',
          bodyFatPercentage: '14.8%',
          skeletalMuscleMass: '34.8 kg',
          bmi: '22.8',
          bodyWater: '47.1 L',
          visceralFat: 'Level 4',
          bmr: '1,820 kcal',
          fatControl: '+0.0 kg',
          muscleControl: '+4.5 kg'
        };
        sampleParq = {
          goal: 'muscle_gain',
          goals: ['muscle_gain', 'athletic_performance'],
          activityCategories: ['strength', 'sport'],
          availability: '5+',
          nutritionPattern: 'high_protein',
          waterIntake: 'optimal',
          barriers: 'injury'
        };
      } else {
        sampleReport = {
          weight: '78.0 kg',
          targetWeight: '72.0 kg',
          bodyFatPercentage: '24.5%',
          skeletalMuscleMass: '32.1 kg',
          bmi: '25.4',
          bodyWater: '42.3 L',
          visceralFat: 'Level 11',
          bmr: '1,650 kcal',
          fatControl: '-6.0 kg',
          muscleControl: '+0.0 kg'
        };
        sampleParq = {
          goal: 'fat_loss',
          goals: ['fat_loss'],
          activityCategories: ['aerobic'],
          availability: '1-2',
          nutritionPattern: 'irregular',
          waterIntake: 'low',
          barriers: 'time'
        };
      }

      const created = await api.createAssessment({
        fitMao_report_data: sampleReport,
        parq_answers: sampleParq,
        assessed_date: isFollowUp ? new Date(Date.now() + 35 * 86400000).toISOString() : new Date().toISOString()
      });

      await api.calculateResults(created.profile_id);
      await fetchAssessments();
      
      if (isFollowUp) {
        setShowCompareModal(true);
      } else {
        navigate(`/results/${created.profile_id}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to create sample assessment.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-4 sm:p-6 max-w-md sm:max-w-lg mx-auto sm:border-x sm:border-surface-200 dark:sm:border-surface-800 sm:shadow-xl pb-28 animate-slide-up font-sans transition-colors duration-200">
      
      {/* Welcome Banner with PFP */}
      <div className="card p-5 sm:p-6 bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 text-white shadow-xl mb-5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500 rounded-full blur-3xl opacity-30 -translate-y-12 translate-x-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-teal-300 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" /> KSYN Fitness Member Portal
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                Welcome, {user?.firstName || 'Member'}!
              </h1>
              <p className="text-teal-100 text-xs mt-0.5 leading-relaxed truncate">
                {user?.email} • Alabang Branch
              </p>
            </div>

            {/* PFP Avatar Display */}
            <div className="w-13 h-13 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center text-xl font-black text-white shrink-0 overflow-hidden shadow-inner p-1">
              {user?.avatar?.startsWith('data:') || user?.avatar?.startsWith('http') ? (
                <img src={user.avatar} alt="PFP" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-2xl">{user?.avatar || (user?.firstName?.[0] || '🏋️')}</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-teal-200 uppercase font-bold block">Recorded Scans</span>
              <span className="text-2xl font-black text-white">{assessments.length}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-teal-200 uppercase font-bold block">Gym Membership</span>
              <span className="text-xs font-black text-teal-300">All-Access Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Scans & Progress Action */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowCompareModal(true)}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all min-h-[48px]"
        >
          <Layers className="w-4 h-4 text-indigo-200" /> Compare Scans & Track Progress
        </button>
      </div>

      {/* Assessments List Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-surface-900 dark:text-white tracking-tight">Assessment History</h2>
          <p className="text-[11px] text-surface-500 dark:text-surface-400">Your FitMao scans & personalized starting points</p>
        </div>
        <button
          onClick={fetchAssessments}
          className="p-2 text-surface-400 dark:text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-colors"
          title="Refresh assessments list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-4 border-surface-200 dark:border-surface-800 border-t-brand-500 rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-surface-400 dark:text-surface-500 font-semibold">Loading your scan records...</span>
        </div>
      ) : assessments.length === 0 ? (
        <div className="card p-7 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-center shadow-sm rounded-3xl">
          <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-brand-100 dark:border-brand-900 shadow-inner">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-surface-900 dark:text-white text-base mb-1">No Assessments Recorded</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-5 max-w-xs mx-auto leading-relaxed">
            Record your first FitMao scan and PAR-Q survey to unlock personalized priority interpretations.
          </p>

          <div className="space-y-2">
            <Link to="/assessment" className="btn-primary text-xs w-full py-3">
              Take Assessment Survey
            </Link>
            
            <div className="pt-2 text-[10px] text-surface-400 dark:text-surface-500 font-bold uppercase tracking-wider">
              Or Quick Test Scans:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCreateSample('standard')}
                className="py-2.5 px-3 bg-surface-50 dark:bg-surface-800 hover:bg-brand-50 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 rounded-xl text-xs font-bold text-surface-700 dark:text-surface-200 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
              >
                Sample 1 (Fat Loss)
              </button>
              <button
                onClick={() => handleCreateSample('athlete')}
                className="py-2.5 px-3 bg-surface-50 dark:bg-surface-800 hover:bg-brand-50 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 rounded-xl text-xs font-bold text-surface-700 dark:text-surface-200 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
              >
                Sample 2 (Muscle)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map(item => (
            <AssessmentCard
              key={item.id}
              assessment={item}
              onDelete={handleDelete}
            />
          ))}

          {/* Quick Demo Follow-Up Button to easily test the 2-scan comparison */}
          {assessments.length === 1 && (
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-left animate-fade-in">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Want to test the Multi-Scan Comparison feature?</span>
              </div>
              <p className="text-[11px] text-indigo-700 leading-snug mb-2.5">
                Generate a simulated follow-up scan (+6 weeks) to see side-by-side metric deltas and recomposition progress!
              </p>
              <button
                type="button"
                onClick={() => handleCreateSample('followup')}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                + Add Simulated Follow-Up Scan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Compare Scans Modal / Popup */}
      {showCompareModal && (
        <ScanComparisonModal
          assessments={assessments}
          onClose={() => setShowCompareModal(false)}
          onAddFollowUpScan={() => {
            setShowCompareModal(false);
            handleCreateSample('followup');
          }}
        />
      )}
    </div>
  );
}
