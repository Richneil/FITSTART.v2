import React, { useState } from 'react';
import { 
  X, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Layers,
  Flame,
  Target,
  Droplet,
  HeartPulse
} from 'lucide-react';

export default function ScanComparisonModal({ assessments = [], onClose, onAddFollowUpScan }) {
  const count = assessments.length;

  // If less than 2 assessments, show the informative popup modal
  if (count < 2) {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
        <div className="w-full max-w-sm bg-white dark:bg-surface-900 rounded-3xl p-6 text-center shadow-2xl relative animate-slide-up border border-surface-200 dark:border-surface-800">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-900 shadow-sm">
            <Layers className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-extrabold uppercase text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full inline-block mb-2">
            Comparison Notice
          </span>

          <h3 className="text-xl font-black text-surface-900 dark:text-white mb-2 tracking-tight">
            At Least 2 Tests Required
          </h3>

          <p className="text-surface-600 dark:text-surface-400 text-xs leading-relaxed mb-6">
            FitStart requires at least <strong>two body composition scans</strong> to evaluate your physiological changes, progress deltas, and recomposition trajectory.
          </p>

          <div className="p-3.5 bg-surface-50 dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 mb-5 text-left text-xs text-surface-700 dark:text-surface-300">
            <div className="flex justify-between items-center mb-1">
              <span className="text-surface-500 dark:text-surface-400 font-medium">Recorded Scans:</span>
              <span className="font-extrabold text-surface-900 dark:text-white">{count} of 2 required</span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(count / 2) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {onAddFollowUpScan && (
              <button
                type="button"
                onClick={onAddFollowUpScan}
                className="btn-primary w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-accent-300" /> Generate Follow-Up Scan Demo
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-full py-2.5 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If 2 or more assessments, render the full multi-test comparison report!
  const sorted = [...assessments].sort((a, b) => new Date(a.assessed_date || a.created_at) - new Date(b.assessed_date || b.created_at));
  
  const [baselineIdx, setBaselineIdx] = useState(0); // Oldest / baseline
  const [followUpIdx, setFollowUpIdx] = useState(sorted.length - 1); // Latest

  const baseline = sorted[baselineIdx] || sorted[0];
  const followUp = sorted[followUpIdx] || sorted[sorted.length - 1];

  const baseMetrics = baseline.fitMao_report_data || {};
  const nextMetrics = followUp.fitMao_report_data || {};

  // Helper to parse numeric values and calculate deltas
  const calcDelta = (key, unit = '') => {
    const rawA = String(baseMetrics[key] || '0').replace(/[^\d.-]/g, '');
    const rawB = String(nextMetrics[key] || '0').replace(/[^\d.-]/g, '');
    const a = parseFloat(rawA) || 0;
    const b = parseFloat(rawB) || 0;
    const diff = Number((b - a).toFixed(1));
    return {
      a: baseMetrics[key] || '—',
      b: nextMetrics[key] || '—',
      diff,
      diffFormatted: diff > 0 ? `+${diff}${unit}` : `${diff}${unit}`,
      isPositive: diff > 0,
      isZero: diff === 0
    };
  };

  const weightDelta = calcDelta('weight', ' kg');
  const fatDelta = calcDelta('bodyFatPercentage', '%');
  const muscleDelta = calcDelta('skeletalMuscleMass', ' kg');
  const visceralDelta = calcDelta('visceralFat', ' Levels');
  const waterDelta = calcDelta('bodyWater', ' L');
  const bmrDelta = calcDelta('bmr', ' kcal');

  // Qualitative Recomposition Verdict
  const fatDropped = fatDelta.diff < 0;
  const musclePreserved = muscleDelta.diff >= 0;

  let recompositionVerdict = {
    title: 'Balanced Progress Tracked',
    desc: 'Your body composition measurements are progressing between assessment dates.',
    color: 'bg-teal-50 border-teal-300 text-teal-900'
  };

  if (fatDropped && musclePreserved) {
    recompositionVerdict = {
      title: 'Optimal Recomposition Achieved! 🎉',
      desc: `Body Fat decreased by ${Math.abs(fatDelta.diff)}% while Skeletal Muscle Mass increased by ${muscleDelta.diff} kg. This represents the gold standard of healthy gym progress!`,
      color: 'bg-emerald-50 border-emerald-300 text-emerald-950'
    };
  } else if (fatDropped && !musclePreserved) {
    recompositionVerdict = {
      title: 'Fat Loss with Muscle Preservation Opportunity',
      desc: `Body Fat dropped by ${Math.abs(fatDelta.diff)}%, but muscle mass slightly reduced by ${Math.abs(muscleDelta.diff)} kg. Focus on adequate dietary protein to protect muscle tissue.`,
      color: 'bg-amber-50 border-amber-300 text-amber-950'
    };
  } else if (!fatDropped && musclePreserved) {
    recompositionVerdict = {
      title: 'Hypertrophy & Strength Growth 💪',
      desc: `Skeletal Muscle Mass increased by ${muscleDelta.diff} kg, elevating your resting daily metabolism.`,
      color: 'bg-indigo-50 border-indigo-300 text-indigo-950'
    };
  }

  const baseDate = new Date(baseline.assessed_date || baseline.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const nextDate = new Date(followUp.assessed_date || followUp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-3 sm:p-6 animate-fade-in font-sans">
      <div className="w-full max-w-lg bg-white dark:bg-surface-900 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto relative animate-slide-up flex flex-col border border-surface-200 dark:border-surface-800">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-surface-200 dark:border-surface-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" /> Longitudinal Progress Analysis
            </div>
            <h2 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">FitMao Scans Comparison</h2>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
              Evaluating physical recomposition deltas between recorded assessments.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scan Selector Bar */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-2 bg-surface-100 dark:bg-surface-800/80 rounded-2xl">
          <div className="p-2 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
            <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase block">Baseline Scan</span>
            <span className="text-xs font-black text-surface-900 dark:text-white block truncate">{baseDate}</span>
          </div>
          <div className="p-2 bg-white dark:bg-surface-900 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">Follow-Up Scan</span>
            <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 block truncate">{nextDate}</span>
          </div>
        </div>

        {/* Recomposition Verdict Banner */}
        <div className={`p-4 rounded-2xl border-2 mb-4 animate-fade-in ${recompositionVerdict.color}`}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-black text-sm tracking-tight">{recompositionVerdict.title}</h4>
          </div>
          <p className="text-xs font-medium leading-relaxed">
            {recompositionVerdict.desc}
          </p>
        </div>

        {/* Comparison Metrics Grid */}
        <div className="space-y-2.5 mb-5 flex-1 overflow-y-auto pr-1">
          
          {/* Weight */}
          <div className="p-3.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-surface-800 dark:text-surface-200 block">Total Weight</span>
              <span className="text-[11px] text-surface-400 dark:text-surface-500 font-mono">{weightDelta.a} → {weightDelta.b}</span>
            </div>
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1
              ${weightDelta.diff < 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : weightDelta.diff > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}>
              {weightDelta.diff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : weightDelta.diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              {weightDelta.diffFormatted}
            </div>
          </div>

          {/* Body Fat % */}
          <div className="p-3.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-surface-800 dark:text-surface-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-accent-500" /> Body Fat %
              </span>
              <span className="text-[11px] text-surface-400 dark:text-surface-500 font-mono">{fatDelta.a} → {fatDelta.b}</span>
            </div>
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1
              ${fatDelta.diff < 0 ? 'bg-emerald-500 text-white shadow-sm' : fatDelta.diff > 0 ? 'bg-amber-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}>
              {fatDelta.diff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : fatDelta.diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              {fatDelta.diffFormatted}
            </div>
          </div>

          {/* Skeletal Muscle Mass */}
          <div className="p-3.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-surface-800 dark:text-surface-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Skeletal Muscle Mass
              </span>
              <span className="text-[11px] text-surface-400 dark:text-surface-500 font-mono">{muscleDelta.a} → {muscleDelta.b}</span>
            </div>
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1
              ${muscleDelta.diff > 0 ? 'bg-emerald-500 text-white shadow-sm' : muscleDelta.diff < 0 ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}>
              {muscleDelta.diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : muscleDelta.diff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              {muscleDelta.diffFormatted}
            </div>
          </div>

          {/* Visceral Fat */}
          <div className="p-3.5 bg-surface-50 dark:bg-surface-800/80 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-surface-800 dark:text-surface-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-red-500" /> Visceral Fat Level
              </span>
              <span className="text-[11px] text-surface-400 dark:text-surface-500 font-mono">{visceralDelta.a} → {visceralDelta.b}</span>
            </div>
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1
              ${visceralDelta.diff < 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : visceralDelta.diff > 0 ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}>
              {visceralDelta.diff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : visceralDelta.diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              {visceralDelta.diffFormatted}
            </div>
          </div>

          {/* Body Water */}
          <div className="p-3.5 bg-surface-50 rounded-2xl border border-surface-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-surface-800 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-blue-500" /> Body Water
              </span>
              <span className="text-[11px] text-surface-400 font-mono">{waterDelta.a} → {waterDelta.b}</span>
            </div>
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1
              ${waterDelta.diff > 0 ? 'bg-blue-100 text-blue-800' : 'bg-surface-200 text-surface-700'}`}>
              {waterDelta.diffFormatted}
            </div>
          </div>

          {/* Basal Metabolic Rate */}
          <div className="p-3.5 bg-surface-50 rounded-2xl border border-surface-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-surface-800 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Basal Metabolic Rate (BMR)
              </span>
              <span className="text-[11px] text-surface-400 font-mono">{bmrDelta.a} → {bmrDelta.b}</span>
            </div>
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1
              ${bmrDelta.diff > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-200 text-surface-700'}`}>
              {bmrDelta.diffFormatted}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-200 flex justify-end">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-primary w-full sm:w-auto px-6 text-xs font-bold"
          >
            Done Reviewing Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
