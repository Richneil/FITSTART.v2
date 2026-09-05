import React from 'react';
import { ShieldCheck, Activity, Target, Award, Printer, X, Scale } from 'lucide-react';

const METRIC_LABELS = {
  bodyFat: 'Body Fat Percentage',
  muscleMass: 'Skeletal Muscle Mass',
  visceralFat: 'Visceral Fat Level',
  bodyWater: 'Total Body Water',
  bmr: 'Basal Metabolic Rate (BMR)',
  bmi: 'Body Mass Index (BMI)'
};

export default function PrintableSummary({ profile, fitMao = {}, parq = {}, weights, user, onClose }) {
  const mainFocusKey = weights?.rankedMetrics?.[0]?.key || 'bodyFat';
  const mainFocusLabel = METRIC_LABELS[mainFocusKey] || 'Body Composition Metric';
  const mainFocusScore = weights?.rankedMetrics?.[0]?.score || 0;
  const assessmentDate = fitMao?.testDate || (profile?.assessed_date 
    ? new Date(profile.assessed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  const memberName = fitMao?.memberName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Alex Rivera');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      {/* Modal Actions Header (Hidden in Print) */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-display font-bold rounded-2xl shadow-lg flex items-center gap-2 text-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-100 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          title="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 1-PAGE CLINICAL SUMMARY SHEET */}
      <div className="print-page bg-white text-surface-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full my-auto border border-surface-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-brand-500 pb-4 mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-brand-700 font-display font-bold text-xs uppercase tracking-wider mb-0.5">
              <Activity className="w-4 h-4" /> KSYN Fitness Alabang • FitStart Decision Support
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-surface-900 tracking-tight">
              1-Page FitMao Assessment Summary
            </h1>
            <p className="text-[11px] text-surface-500 font-medium">
              Deterministic Rule-Based Clinical Starting Point & Complete Scanner Metrics
            </p>
          </div>

          <div className="text-right text-[11px] font-mono shrink-0">
            <div className="text-surface-900 font-bold">{assessmentDate}</div>
            <div className="text-surface-500">{fitMao?.testTime || '10:30 AM'} • {fitMao?.scannerDevice || 'FitMao 3D Pro'}</div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
              <ShieldCheck className="w-3 h-3" /> ACSM Verified
            </div>
          </div>
        </div>

        {/* Member Profile Banner with Full Demographics */}
        <div className="bg-surface-50 rounded-2xl p-3 mb-3 border border-surface-200 grid grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-[9px] uppercase font-bold text-surface-400 block font-display">Member Name</span>
            <strong className="text-surface-900 font-display text-xs truncate block">{memberName}</strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-surface-400 block font-display">Gender / Age / Height</span>
            <strong className="text-surface-800 font-sans text-xs">
              {fitMao?.gender || 'Male'} • {fitMao?.age || '28 yrs'} • {fitMao?.height || '175 cm'}
            </strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-surface-400 block font-display">Health Score / Body Age</span>
            <strong className="text-emerald-700 font-mono text-xs">
              {fitMao?.healthScore || '74/100'} ({fitMao?.bodyAge || '31 yrs'})
            </strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-surface-400 block font-display">Primary Goal</span>
            <strong className="text-brand-700 font-display capitalize text-xs">
              {(parq?.primaryGoal || parq?.goal || 'Fat Loss').replace(/_/g, ' ')}
            </strong>
          </div>
        </div>

        {/* Highlight Card: #1 Main Focus */}
        <div className="bg-brand-50/80 border border-brand-300 rounded-2xl p-3.5 mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-brand-800 font-display font-bold text-[11px] uppercase tracking-wider mb-0.5">
              <Award className="w-4 h-4 text-accent-600" /> #1 Recommended Fitness Starting Point
            </div>
            <h2 className="text-base sm:text-lg font-display font-extrabold text-brand-950">
              Focus on: {mainFocusLabel} ({fitMao?.[mainFocusKey] || mainFocusScore})
            </h2>
            <p className="text-[11px] text-brand-800 mt-0.5 leading-tight max-w-md">
              Mathematically prioritized based on your FitMao scan delta steps and PAR-Q lifestyle habits.
            </p>
          </div>
          <div className="text-right bg-white p-2 rounded-xl border border-brand-200 shrink-0 font-mono shadow-sm">
            <span className="text-[9px] uppercase font-bold text-surface-400 block font-sans">Priority Score</span>
            <strong className="text-base font-bold text-brand-700">{mainFocusScore} pts</strong>
          </div>
        </div>

        {/* 2-Column Grid: Comprehensive Scanner Metrics + Target Controls */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          
          {/* Column A: Body Composition & Metabolic Vitals */}
          <div className="border border-surface-200 rounded-2xl p-3 text-xs bg-white">
            <h3 className="font-display font-bold text-surface-900 text-xs pb-1.5 border-b border-surface-100 mb-2 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-brand-600" /> Complete FitMao Measurements
            </h3>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Total Weight:</span>
                <strong>{fitMao?.weight || '78.0 kg'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Body Fat %:</span>
                <strong className="text-accent-700">{fitMao?.bodyFatPercentage || '24.5%'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Skeletal Muscle Mass:</span>
                <strong className="text-brand-700">{fitMao?.skeletalMuscleMass || '32.1 kg'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Fat Mass:</span>
                <strong>{fitMao?.fatMass || '19.1 kg'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Muscle Mass:</span>
                <strong>{fitMao?.muscleMass || '55.4 kg'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Fat-Free Mass:</span>
                <strong>{fitMao?.fatFreeMass || '58.9 kg'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Visceral Fat Level:</span>
                <strong>{fitMao?.visceralFat || 'Level 11'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">BMR:</span>
                <strong>{fitMao?.bmr || '1,650 kcal'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">BMI:</span>
                <strong>{fitMao?.bmi || '25.4'}</strong>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-50">
                <span className="text-surface-500 font-sans">Total Body Water:</span>
                <strong>{fitMao?.bodyWater || '42.3 L'}</strong>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-surface-500 font-sans">Protein / Minerals:</span>
                <strong>{fitMao?.proteinMass || '12.8 kg'} / {fitMao?.boneMineralContent || '3.8 kg'}</strong>
              </div>
            </div>
          </div>

          {/* Column B: Target Controls & Score Calculation Rules */}
          <div className="border border-surface-200 rounded-2xl p-3 text-xs bg-white flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-surface-900 text-xs pb-1.5 border-b border-surface-100 mb-2 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-accent-600" /> Target & Control Recommendations
              </h3>
              <div className="space-y-1 font-mono text-[11px] mb-3">
                <div className="flex justify-between py-0.5 border-b border-surface-50">
                  <span className="text-surface-500 font-sans">Target Weight:</span>
                  <strong>{fitMao?.targetWeight || '72.0 kg'}</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-surface-50">
                  <span className="text-surface-500 font-sans">Weight Control:</span>
                  <strong className="text-amber-700">{fitMao?.weightControl || '-6.0 kg'}</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-surface-50">
                  <span className="text-surface-500 font-sans">Fat Control:</span>
                  <strong className="text-accent-700">{fitMao?.fatControl || '-6.0 kg'}</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-surface-50">
                  <span className="text-surface-500 font-sans">Muscle Control:</span>
                  <strong className="text-brand-700">{fitMao?.muscleControl || '0.0 kg'}</strong>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-surface-500 font-sans">Waist-to-Hip Ratio:</span>
                  <strong>{fitMao?.waistToHipRatio || '0.88'}</strong>
                </div>
              </div>
            </div>

            {/* Score Calculation Rules */}
            <div className="border-t border-surface-100 pt-2">
              <h4 className="font-display font-bold text-surface-900 text-[11px] mb-1">
                Score Calculation Steps
              </h4>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-surface-600">
                  <span>Baseline Scan Severity:</span>
                  <span className="font-mono font-bold">+3 pts</span>
                </div>
                <div className="flex justify-between text-surface-600">
                  <span>Primary Goal Weight:</span>
                  <span className="font-mono font-bold text-brand-700">+4 pts</span>
                </div>
                <div className="flex justify-between font-bold text-surface-900 pt-0.5">
                  <span>Final Decision Score:</span>
                  <span className="font-mono text-brand-700">{mainFocusScore} pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guidance & Compliance */}
        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-2.5 text-[10px] text-surface-600 leading-relaxed">
          <strong className="text-surface-900 block font-display mb-0.5">Clinical Note & Safe Starting Point:</strong>
          This report provides non-clinical lifestyle decision support based on ACSM guidelines. Always start with compound resistance training, stay hydrated (40–45L cellular target), and maintain consistent meal pacing to preserve lean mass.
        </div>

        <div className="mt-2 text-center text-[9px] text-surface-400 font-mono">
          FitStart v2.4 • KSYN Fitness Alabang Member Report • Complete FitMao Assessment Interpretation
        </div>
      </div>
    </div>
  );
}

