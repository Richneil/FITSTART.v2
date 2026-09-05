import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  BookOpen
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
        sampleReport = {
          memberName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Alex Rivera',
          gender: 'Male',
          age: '28 yrs',
          height: '175 cm',
          testDate: new Date().toISOString().split('T')[0],
          testTime: '11:15 AM',
          scannerDevice: 'FitMao 3D Scanner Pro',
          gymLocation: 'KSYN Fitness Alabang',
          healthScore: '83 / 100',
          bodyType: 'Developing Athletic',
          bodyAge: '27 yrs',
          weight: '75.5 kg',
          targetWeight: '72.0 kg',
          weightControl: '-3.5 kg',
          bodyFatPercentage: '21.8%',
          fatMass: '16.5 kg',
          fatFreeMass: '59.0 kg',
          skeletalMuscleMass: '33.0 kg',
          muscleMass: '56.2 kg',
          fatControl: '-3.5 kg',
          muscleControl: '+0.0 kg',
          bmi: '24.6',
          visceralFat: 'Level 8',
          bmr: '1,685 kcal',
          bodyWater: '44.1 L',
          bodyWaterRatio: '58.4%',
          proteinMass: '13.2 kg',
          boneMineralContent: '3.9 kg',
          waistToHipRatio: '0.84'
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
          memberName: 'Jordan Cruz',
          gender: 'Female',
          age: '25 yrs',
          height: '168 cm',
          testDate: new Date().toISOString().split('T')[0],
          testTime: '02:30 PM',
          scannerDevice: 'FitMao 3D Scanner Pro',
          gymLocation: 'KSYN Fitness Alabang',
          healthScore: '89 / 100',
          bodyType: 'Athletic Muscular',
          bodyAge: '22 yrs',
          weight: '71.5 kg',
          targetWeight: '76.0 kg',
          weightControl: '+4.5 kg',
          bodyFatPercentage: '14.8%',
          fatMass: '10.6 kg',
          fatFreeMass: '60.9 kg',
          skeletalMuscleMass: '34.8 kg',
          muscleMass: '57.8 kg',
          fatControl: '0.0 kg',
          muscleControl: '+4.5 kg',
          bmi: '22.8',
          visceralFat: 'Level 4',
          bmr: '1,820 kcal',
          bodyWater: '47.1 L',
          bodyWaterRatio: '65.8%',
          proteinMass: '14.2 kg',
          boneMineralContent: '4.1 kg',
          waistToHipRatio: '0.74'
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
          memberName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Alex Rivera',
          gender: 'Male',
          age: '28 yrs',
          height: '175 cm',
          testDate: '2026-08-15',
          testTime: '10:00 AM',
          scannerDevice: 'FitMao 3D Scanner Pro',
          gymLocation: 'KSYN Fitness Alabang',
          healthScore: '74 / 100',
          bodyType: 'Standard Overweight',
          bodyAge: '31 yrs',
          weight: '78.0 kg',
          targetWeight: '72.0 kg',
          weightControl: '-6.0 kg',
          bodyFatPercentage: '24.5%',
          fatMass: '19.1 kg',
          fatFreeMass: '58.9 kg',
          skeletalMuscleMass: '32.1 kg',
          muscleMass: '55.4 kg',
          fatControl: '-6.0 kg',
          muscleControl: '+0.0 kg',
          bmi: '25.4',
          visceralFat: 'Level 11',
          bmr: '1,650 kcal',
          bodyWater: '42.3 L',
          bodyWaterRatio: '54.2%',
          proteinMass: '12.8 kg',
          boneMineralContent: '3.8 kg',
          waistToHipRatio: '0.88'
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

  const latestScan = assessments[0];
  const latestMetrics = latestScan?.fitMao_report_data || {};

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 px-4 sm:px-8 py-6 max-w-5xl mx-auto pb-28 animate-slide-up font-sans transition-colors duration-200">
      
      {/* Welcome Hero Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950 text-white shadow-card mb-8 rounded-3xl relative overflow-hidden border border-brand-700/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400 rounded-full blur-3xl opacity-20 -translate-y-20 translate-x-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500 rounded-full blur-3xl opacity-15 translate-y-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-display font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> KSYN Fitness Member Portal
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
                Welcome back, {user?.firstName || 'Member'}! 👋
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
                Track your FitMao 3D scanner assessments, explore plain-language clinical interpretations, and stay aligned with your #1 fitness starting point.
              </p>
            </div>

            {/* Member Profile Avatar Card */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center text-3xl font-black text-white overflow-hidden shadow-inner p-1 backdrop-blur-md">
                {user?.avatar?.startsWith('data:') || user?.avatar?.startsWith('http') ? (
                  <img src={user.avatar} alt="PFP" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span>{user?.avatar || (user?.firstName?.[0] || '🏋️')}</span>
                )}
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">Membership</span>
                <span className="text-xs font-display font-bold text-white bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                  All-Access Active
                </span>
              </div>
            </div>
          </div>

          {/* Member Stats Highlights Bar */}
          <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-emerald-200 uppercase font-display font-bold block mb-0.5">Total Scans</span>
              <span className="text-2xl font-display font-black text-white">{assessments.length}</span>
            </div>
            
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-emerald-200 uppercase font-display font-bold block mb-0.5">Latest Health Score</span>
              <span className="text-xl font-display font-black text-emerald-300">
                {latestMetrics.healthScore ? latestMetrics.healthScore.split('/')[0] : '—'} <span className="text-xs font-normal text-emerald-200">/ 100</span>
              </span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-emerald-200 uppercase font-display font-bold block mb-0.5">Latest Body Fat</span>
              <span className="text-xl font-mono font-bold text-white">{latestMetrics.bodyFatPercentage || '—'}</span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-emerald-200 uppercase font-display font-bold block mb-0.5">Skeletal Muscle</span>
              <span className="text-xl font-mono font-bold text-emerald-300">{latestMetrics.skeletalMuscleMass || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
        <Link
          to="/assessment"
          className="p-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl shadow-subtle hover:shadow transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <strong className="block text-xs font-display font-bold leading-tight">Start New Assessment</strong>
            <span className="text-[11px] text-emerald-100 font-medium">Ingest FitMao slip & PAR-Q</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setShowCompareModal(true)}
          className="p-4 bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-900 dark:text-white border border-surface-200 dark:border-surface-800 rounded-2xl shadow-subtle hover:shadow transition-all flex items-center gap-3.5 group cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <strong className="block text-xs font-display font-bold leading-tight">Compare Scans & Deltas</strong>
            <span className="text-[11px] text-surface-500 dark:text-surface-400 font-medium">Track physical recomposition</span>
          </div>
        </button>

        <Link
          to="/glossary"
          className="p-4 bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-900 dark:text-white border border-surface-200 dark:border-surface-800 rounded-2xl shadow-subtle hover:shadow transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <strong className="block text-xs font-display font-bold leading-tight">Fitness Glossary</strong>
            <span className="text-[11px] text-surface-500 dark:text-surface-400 font-medium">ACSM clinical benchmarks</span>
          </div>
        </Link>
      </div>

      {/* Assessments List Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
            Assessment History
          </h2>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            Your recorded FitMao scans & personalized starting point interpretations
          </p>
        </div>
        <button
          onClick={fetchAssessments}
          className="p-2 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-all border border-surface-200 dark:border-surface-800 cursor-pointer shadow-subtle"
          title="Refresh assessments list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-4 border-surface-200 dark:border-surface-800 border-t-brand-500 rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-surface-400 dark:text-surface-500 font-semibold">Loading your scan records...</span>
        </div>
      ) : assessments.length === 0 ? (
        <div className="card p-8 sm:p-12 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-center shadow-card rounded-3xl max-w-lg mx-auto">
          <div className="w-16 h-16 bg-brand-500/10 dark:bg-brand-400/10 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-500/20">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="font-display font-extrabold text-surface-900 dark:text-white text-lg mb-1">
            No Assessments Recorded Yet
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Record your first FitMao 3D scan and PAR-Q survey to unlock personalized priority interpretations and decision support.
          </p>

          <div className="space-y-3">
            <Link to="/assessment" className="btn-primary">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Take Assessment Survey
            </Link>
            
            <div className="pt-3 text-[10px] text-surface-400 dark:text-surface-500 font-display font-bold uppercase tracking-wider">
              Or Load Sample Assessments:
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleCreateSample('standard')}
                className="py-2.5 px-3 bg-surface-50 dark:bg-surface-800 hover:bg-brand-50 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 rounded-xl text-xs font-display font-semibold text-surface-700 dark:text-surface-200 hover:text-brand-800 dark:hover:text-brand-300 transition-colors cursor-pointer"
              >
                Sample 1 (Fat Loss Focus)
              </button>
              <button
                onClick={() => handleCreateSample('athlete')}
                className="py-2.5 px-3 bg-surface-50 dark:bg-surface-800 hover:bg-brand-50 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 rounded-xl text-xs font-display font-semibold text-surface-700 dark:text-surface-200 hover:text-brand-800 dark:hover:text-brand-300 transition-colors cursor-pointer"
              >
                Sample 2 (Muscle Gain Focus)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map(item => (
              <AssessmentCard
                key={item.id}
                assessment={item}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Multi-scan Comparison Helper Banner */}
          {assessments.length === 1 && (
            <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl text-left animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-display font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Test the Multi-Scan Comparison Feature</span>
                </div>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-snug">
                  Generate a simulated follow-up scan (+6 weeks) to see side-by-side metric deltas and physical recomposition progress!
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCreateSample('followup')}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-display font-semibold transition-all shadow-subtle shrink-0 cursor-pointer"
              >
                + Add Simulated Follow-Up Scan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Compare Scans Modal */}
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
