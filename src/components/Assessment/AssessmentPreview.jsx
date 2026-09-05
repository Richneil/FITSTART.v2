import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  User, 
  Lock, 
  Scale, 
  HeartPulse, 
  ArrowRight 
} from 'lucide-react';

export default function AssessmentPreview({ extractedData, onRescan, onConfirm }) {
  const isLiveDecoded = extractedData?.isDecodedFromLiveQr;

  return (
    <div className="space-y-5 animate-fade-in font-sans">
      {/* Verified & Locked Scanner Notification Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
        <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-display font-bold">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-bold leading-tight text-sm">
              {isLiveDecoded ? '✓ Live Real-Time QR Decoded' : 'FitMao QR Code Verified'}
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-normal">
              {isLiveDecoded 
                ? `Extracted live scanner values for ${extractedData.memberName}. Manual edit is locked.` 
                : 'All scanner metrics locked from QR output to ensure authenticity.'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onRescan}
          className="text-xs font-display font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-surface-800 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-surface-700 flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-subtle cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-scan
        </button>
      </div>

      {/* 1. Member Information & Scanner Header Card */}
      <div className="card p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-card space-y-4 rounded-3xl">
        <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-800">
          <span className="text-xs font-display font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Member Demographics & Scanner Details
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-surface-500 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-lg border border-surface-200 dark:border-surface-700">
            <Lock className="w-3 h-3 text-surface-400" /> Read-Only
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="col-span-2 p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl flex items-center justify-between border border-surface-100 dark:border-surface-700/50">
            <div>
              <span className="text-[10px] font-display font-bold text-surface-400 uppercase tracking-wider block">Member Name</span>
              <strong className="text-surface-900 dark:text-white font-sans text-sm sm:text-base">{extractedData.memberName || 'Alex Rivera'}</strong>
            </div>
            <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-xl font-bold border border-emerald-200 dark:border-emerald-800">
              Score: {extractedData.healthScore || '74'} / 100
            </span>
          </div>

          <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl border border-surface-100 dark:border-surface-700/50">
            <span className="text-[10px] font-display font-bold text-surface-400 uppercase tracking-wider block">Gender / Sex</span>
            <strong className="text-surface-900 dark:text-white font-sans text-sm">{extractedData.gender || 'Male'}</strong>
          </div>

          <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl border border-surface-100 dark:border-surface-700/50">
            <span className="text-[10px] font-display font-bold text-surface-400 uppercase tracking-wider block">Age / Body Age</span>
            <strong className="text-surface-900 dark:text-white font-sans text-sm">
              {extractedData.age || '28'} yrs <span className="text-surface-400 text-xs font-normal">({extractedData.bodyAge || '31'} bio)</span>
            </strong>
          </div>

          <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl border border-surface-100 dark:border-surface-700/50">
            <span className="text-[10px] font-display font-bold text-surface-400 uppercase tracking-wider block">Height</span>
            <strong className="text-surface-900 dark:text-white font-mono text-sm">{extractedData.height || '175'} cm</strong>
          </div>

          <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl border border-surface-100 dark:border-surface-700/50">
            <span className="text-[10px] font-display font-bold text-surface-400 uppercase tracking-wider block">Body Type</span>
            <strong className="text-surface-900 dark:text-white font-sans text-xs">{extractedData.bodyType || 'Standard Overweight'}</strong>
          </div>

          <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl col-span-2 sm:col-span-2 flex items-center justify-between text-xs border border-surface-100 dark:border-surface-700/50">
            <div>
              <span className="text-[10px] font-display font-bold text-surface-400 uppercase tracking-wider block">Scanner & Location</span>
              <span className="text-surface-700 dark:text-surface-300 font-medium">
                {extractedData.scannerDevice || 'FitMao 3D Scanner Pro'} • {extractedData.gymLocation || 'KSYN Fitness Alabang'}
              </span>
            </div>
            <div className="text-right font-mono text-surface-500 text-[11px]">
              {extractedData.testDate || '2026-09-05'} {extractedData.testTime || '10:30 AM'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Body Composition & Muscle/Fat Control Card */}
      <div className="card p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-card space-y-4 rounded-3xl">
        <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-800">
          <span className="text-xs font-display font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Body Composition & Target Controls
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-surface-500 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-lg border border-surface-200 dark:border-surface-700">
            <Lock className="w-3 h-3 text-surface-400" /> FitMao BIA
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Weight */}
          <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl flex flex-col justify-between border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Total Weight</span>
            <strong className="font-mono text-surface-900 dark:text-white text-base mt-1">{extractedData.weight} kg</strong>
          </div>

          {/* Target Weight */}
          <div className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-2xl flex flex-col justify-between border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Target Weight</span>
            <strong className="font-mono text-surface-900 dark:text-white text-base mt-1">{extractedData.targetWeight} kg</strong>
          </div>

          {/* Body Fat % */}
          <div className="p-3 bg-accent-50/70 dark:bg-accent-950/40 rounded-2xl border border-accent-200 dark:border-accent-800/60 flex flex-col justify-between">
            <span className="text-accent-800 dark:text-accent-300 font-bold text-[11px]">Body Fat %</span>
            <strong className="font-mono text-accent-700 dark:text-accent-300 text-base mt-1">{extractedData.bodyFatPercentage}%</strong>
          </div>

          {/* Skeletal Muscle */}
          <div className="p-3 bg-brand-50/70 dark:bg-brand-950/40 rounded-2xl border border-brand-200 dark:border-brand-800/60 flex flex-col justify-between">
            <span className="text-brand-800 dark:text-brand-300 font-bold text-[11px]">Skeletal Muscle</span>
            <strong className="font-mono text-brand-700 dark:text-brand-300 text-base mt-1">{extractedData.skeletalMuscleMass} kg</strong>
          </div>

          {/* Fat Mass */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Fat Mass:</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.fatMass} kg</strong>
          </div>

          {/* Fat-Free Mass */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Fat-Free Mass:</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.fatFreeMass} kg</strong>
          </div>

          {/* Total Muscle */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Muscle Mass:</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.muscleMass} kg</strong>
          </div>

          {/* Weight Control */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Weight Control:</span>
            <strong className="font-mono text-amber-700 dark:text-amber-400">{extractedData.weightControl} kg</strong>
          </div>

          {/* Fat Control */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Fat Control:</span>
            <strong className="font-mono text-accent-600 dark:text-accent-400">{extractedData.fatControl} kg</strong>
          </div>

          {/* Muscle Control */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Muscle Control:</span>
            <strong className="font-mono text-brand-600 dark:text-brand-400">{extractedData.muscleControl} kg</strong>
          </div>
        </div>
      </div>

      {/* 3. Health & Metabolic Evaluation Card */}
      <div className="card p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-card space-y-4 rounded-3xl">
        <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-800">
          <span className="text-xs font-display font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Metabolic & Health Indices
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-surface-500 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-lg border border-surface-200 dark:border-surface-700">
            <Lock className="w-3 h-3 text-surface-400" /> ACSM Standards
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Visceral Fat */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Visceral Fat:</span>
            <strong className="font-mono text-surface-900 dark:text-white">Level {extractedData.visceralFat}</strong>
          </div>

          {/* BMR */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">BMR:</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.bmr} kcal</strong>
          </div>

          {/* BMI */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">BMI:</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.bmi}</strong>
          </div>

          {/* Body Water */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Body Water:</span>
            <strong className="font-mono text-surface-900 dark:text-white">
              {extractedData.bodyWater} L ({extractedData.bodyWaterRatio}%)
            </strong>
          </div>

          {/* Protein Content */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Protein Content:</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.proteinMass} kg</strong>
          </div>

          {/* Bone Minerals */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Bone Minerals:</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.boneMineralContent} kg</strong>
          </div>

          {/* Waist-to-Hip Ratio */}
          <div className="p-2.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl flex justify-between items-center col-span-2 sm:col-span-3 border border-surface-100 dark:border-surface-700/50">
            <span className="text-surface-500 dark:text-surface-400 text-[11px]">Waist-to-Hip Ratio (WHR):</span>
            <strong className="font-mono text-surface-900 dark:text-white">{extractedData.waistToHipRatio}</strong>
          </div>
        </div>
      </div>

      {/* Confirmation CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onConfirm}
          className="btn-primary w-full py-4 text-xs font-display font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <span>Confirm & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
