import React, { useState } from 'react';
import { QrCode, UploadCloud, FileText, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const SAMPLES = {
  standard: {
    id: 'standard',
    name: 'Sample 1: Standard Recomposition (Moderate Fat, Desk Routine)',
    data: {
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
    }
  },
  athlete: {
    id: 'athlete',
    name: 'Sample 2: Athletic Recomposition (High Muscle, Low Visceral Fat)',
    data: {
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
    }
  }
};

export default function UploadStep({ onDataExtracted, onCancel }) {
  const [selectedSample, setSelectedSample] = useState('standard');
  const [activeTab, setActiveTab] = useState('sample'); // 'sample', 'qr', 'manual'
  const [manualData, setManualData] = useState({ ...SAMPLES.standard.data });

  const handleContinue = () => {
    if (activeTab === 'sample') {
      onDataExtracted(SAMPLES[selectedSample].data);
    } else {
      onDataExtracted(manualData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 animate-slide-up max-w-md sm:max-w-lg mx-auto w-full pb-24 font-sans">
      <div className="mb-5">
        <span className="text-xs font-black text-brand-600 uppercase tracking-wider block mb-1">Step 1 of 4: FitMao Scan Ingestion</span>
        <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">Load Assessment Data</h1>
        <p className="text-xs text-surface-500 mt-1 leading-relaxed">
          Import your body composition numbers from the FitMao 3D scanner at KSYN Fitness.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-200 dark:bg-surface-800 p-1 rounded-2xl mb-6">
        <button
          onClick={() => setActiveTab('sample')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all
            ${activeTab === 'sample' ? 'bg-white dark:bg-surface-700 text-brand-800 dark:text-brand-300 shadow-sm' : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'}`}
        >
          Preset Scans
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all
            ${activeTab === 'qr' ? 'bg-white dark:bg-surface-700 text-brand-800 dark:text-brand-300 shadow-sm' : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'}`}
        >
          QR / Upload
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all
            ${activeTab === 'manual' ? 'bg-white dark:bg-surface-700 text-brand-800 dark:text-brand-300 shadow-sm' : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'}`}
        >
          Manual Edit
        </button>
      </div>

      {activeTab === 'sample' && (
        <div className="space-y-3 mb-6">
          {Object.values(SAMPLES).map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSample(s.id)}
              className={`card p-4 cursor-pointer border-2 transition-all text-left
                ${selectedSample === s.id ? 'bg-brand-50/60 dark:bg-brand-950/40 border-brand-500 shadow-sm' : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-sm text-surface-900 dark:text-white">{s.name}</span>
                {selectedSample === s.id && (
                  <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white/80 dark:bg-surface-800 p-2 rounded-xl border border-surface-100 dark:border-surface-700 font-mono">
                <div>
                  <span className="text-[10px] text-surface-400 dark:text-surface-500 block font-sans">Fat %</span>
                  <strong className="text-surface-900 dark:text-white">{s.data.bodyFatPercentage}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-surface-400 dark:text-surface-500 block font-sans">Muscle</span>
                  <strong className="text-surface-900 dark:text-white">{s.data.skeletalMuscleMass}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-surface-400 dark:text-surface-500 block font-sans">Visceral</span>
                  <strong className="text-surface-900 dark:text-white">{s.data.visceralFat}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'qr' && (
        <div className="card p-6 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-center mb-6 shadow-sm">
          <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-brand-100 dark:border-brand-900">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-surface-900 dark:text-white text-sm mb-1">Scan FitMao Kiosk QR Code</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">
            Point your camera at the FitMao screen QR code at KSYN Fitness, or select a sample scan.
          </p>
          <div className="p-4 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-2xl mb-3 bg-surface-50 dark:bg-surface-800 flex flex-col items-center justify-center gap-2">
            <UploadCloud className="w-6 h-6 text-surface-400" />
            <span className="text-xs font-bold text-surface-600 dark:text-surface-300">Simulate QR Scan</span>
            <button
              type="button"
              onClick={() => setActiveTab('sample')}
              className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Use verified sample data instead
            </button>
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 mb-6 space-y-3 shadow-sm">
          <h3 className="font-extrabold text-surface-900 dark:text-white text-sm pb-2 border-b border-surface-100 dark:border-surface-800">
            Direct Metric Inputs
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {Object.keys(manualData).slice(0, 6).map((key) => (
              <div key={key}>
                <label className="block text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase mb-1">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  value={manualData[key]}
                  onChange={(e) => setManualData({ ...manualData, [key]: e.target.value })}
                  className="w-full p-2.5 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 font-bold text-surface-900 dark:text-white focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary text-xs font-black py-4 flex items-center justify-center gap-2 shadow-md"
        >
          <span>Confirm FitMao Data & Continue to Survey</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2.5 text-xs text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 font-bold"
        >
          Cancel & Return to Dashboard
        </button>
      </div>
    </div>
  );
}
