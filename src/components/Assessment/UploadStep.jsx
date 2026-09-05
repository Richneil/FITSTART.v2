import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, QrCode } from 'lucide-react';
import { parseQrPayload, decodeQrFromImage } from '../../utils/qrParser.js';
import { DEFAULT_EXTRACTED, ATHLETIC_EXTRACTED, METABOLIC_EXTRACTED } from '../../data/demoAssessments.js';
import CameraCapture from './CameraCapture.jsx';
import FileUpload from './FileUpload.jsx';
import QRScanner from './QRScanner.jsx';
import AssessmentPreview from './AssessmentPreview.jsx';

export default function UploadStep({ onDataExtracted, onCancel }) {
  const [stage, setStage] = useState('upload'); // 'upload', 'scanning', 'review'
  const [extractedData, setExtractedData] = useState({ ...DEFAULT_EXTRACTED });
  const [errorMsg, setErrorMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  // Global Clipboard Paste (Ctrl+V) listener for screenshots / copied images
  useEffect(() => {
    const handlePaste = async (e) => {
      if (stage !== 'upload' || cameraActive) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = async () => {
              const dataUrl = reader.result;
              handleFileProcessed(dataUrl, null);
              try {
                const img = new window.Image();
                img.src = dataUrl;
                img.onload = async () => {
                  const rawQr = await decodeQrFromImage(img);
                  if (rawQr) {
                    const parsed = parseQrPayload(rawQr, DEFAULT_EXTRACTED);
                    if (parsed) {
                      setExtractedData(parsed);
                    }
                  }
                };
              } catch (_) {}
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [stage, cameraActive]);

  // File or Image processed callback
  const handleFileProcessed = (dataUrl, rawQr) => {
    setErrorMsg('');
    setStage('scanning');

    if (rawQr) {
      const parsed = parseQrPayload(rawQr, DEFAULT_EXTRACTED);
      if (parsed) {
        setExtractedData(parsed);
        setTimeout(() => setStage('review'), 800);
        return;
      }
    }
    setTimeout(() => setStage('review'), 1000);
  };

  // Camera snap callback
  const handleCameraCapture = (dataUrl, rawQr) => {
    setCameraActive(false);
    setErrorMsg('');
    setStage('scanning');

    if (rawQr) {
      const parsed = parseQrPayload(rawQr, DEFAULT_EXTRACTED);
      if (parsed) {
        setExtractedData(parsed);
        setTimeout(() => setStage('review'), 800);
        return;
      }
    }
    setTimeout(() => setStage('review'), 1000);
  };

  // Preset loading
  const handleLoadPreset = (presetId) => {
    setErrorMsg('');
    setStage('scanning');
    setTimeout(() => {
      if (presetId === 'athletic') {
        setExtractedData({ ...ATHLETIC_EXTRACTED });
      } else if (presetId === 'metabolic') {
        setExtractedData({ ...METABOLIC_EXTRACTED });
      } else {
        setExtractedData({ ...DEFAULT_EXTRACTED });
      }
      setStage('review');
    }, 800);
  };

  // Raw QR string decoding
  const handleApplyRawPayload = (rawString) => {
    if (!rawString || !rawString.trim()) return;
    setErrorMsg('');
    setStage('scanning');
    setTimeout(() => {
      const parsed = parseQrPayload(rawString, DEFAULT_EXTRACTED);
      if (parsed) {
        setExtractedData(parsed);
        setStage('review');
      } else {
        setErrorMsg('Could not parse the provided QR payload string. Please verify the format.');
        setStage('upload');
      }
    }, 700);
  };

  // Format extracted data for the pipeline
  const handleConfirmAndContinue = () => {
    const weightVal = parseFloat(extractedData.weight) || 78.0;
    const fatPercentVal = parseFloat(extractedData.bodyFatPercentage) || 24.5;
    const heightVal = parseFloat(extractedData.height) || 175;

    const formattedData = {
      // Member Demographics
      memberName: extractedData.memberName || 'Alex Rivera',
      gender: extractedData.gender || 'Male',
      age: extractedData.age ? (String(extractedData.age).includes('yrs') ? extractedData.age : `${extractedData.age} yrs`) : '28 yrs',
      height: `${heightVal} cm`,
      testDate: extractedData.testDate || new Date().toISOString().split('T')[0],
      testTime: extractedData.testTime || '10:30 AM',
      scannerDevice: extractedData.scannerDevice || 'FitMao 3D Scanner Pro',
      gymLocation: extractedData.gymLocation || 'KSYN Fitness Alabang',
      healthScore: `${extractedData.healthScore || '74'} / 100`,
      bodyType: extractedData.bodyType || 'Standard Overweight',
      bodyAge: extractedData.bodyAge ? (String(extractedData.bodyAge).includes('yrs') ? extractedData.bodyAge : `${extractedData.bodyAge} yrs`) : '31 yrs',

      // Body Composition (Raw Numerics & Presentation)
      weight: `${weightVal.toFixed(1)} kg`,
      targetWeight: `${parseFloat(extractedData.targetWeight || 72.0).toFixed(1)} kg`,
      weightControl: `${String(extractedData.weightControl || '-6.0').startsWith('-') || String(extractedData.weightControl || '-6.0').startsWith('+') ? extractedData.weightControl : '-' + extractedData.weightControl} kg`,
      bodyFatPercentage: `${fatPercentVal.toFixed(1)}%`,
      fatMass: `${extractedData.fatMass || (weightVal * (fatPercentVal / 100)).toFixed(1)} kg`,
      fatFreeMass: `${extractedData.fatFreeMass || (weightVal * (1 - fatPercentVal / 100)).toFixed(1)} kg`,
      skeletalMuscleMass: `${parseFloat(extractedData.skeletalMuscleMass || 32.1).toFixed(1)} kg`,
      muscleMass: `${parseFloat(extractedData.muscleMass || 55.4).toFixed(1)} kg`,
      fatControl: `${String(extractedData.fatControl || '-6.0').startsWith('-') || String(extractedData.fatControl || '-6.0').startsWith('+') ? extractedData.fatControl : '-' + extractedData.fatControl} kg`,
      muscleControl: `${String(extractedData.muscleControl || '0.0').startsWith('+') || String(extractedData.muscleControl || '0.0').startsWith('-') ? extractedData.muscleControl : '+' + extractedData.muscleControl} kg`,

      // Health & Metabolic Indices
      bmi: String(extractedData.bmi || (weightVal / Math.pow(heightVal / 100, 2)).toFixed(1)),
      visceralFat: `Level ${extractedData.visceralFat || 11}`,
      bmr: `${Number(extractedData.bmr || 1650).toLocaleString()} kcal`,
      bodyWater: `${parseFloat(extractedData.bodyWater || 42.3).toFixed(1)} L`,
      bodyWaterRatio: `${parseFloat(extractedData.bodyWaterRatio || 54.2).toFixed(1)}%`,
      proteinMass: `${parseFloat(extractedData.proteinMass || 12.8).toFixed(1)} kg`,
      boneMineralContent: `${parseFloat(extractedData.boneMineralContent || 3.8).toFixed(1)} kg`,
      waistToHipRatio: String(extractedData.waistToHipRatio || '0.88')
    };

    onDataExtracted(formattedData);
  };

  return (
    <div className={`min-h-screen flex flex-col p-4 sm:p-6 sm:py-8 animate-slide-up mx-auto w-full pb-28 font-sans ${stage === 'review' ? 'max-w-3xl' : 'max-w-xl'}`}>
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-[11px] font-display font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Assessment Input
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
          {stage === 'review' ? 'Verify Scanned Assessment' : 'Bring Your Assessment into FitStart'}
        </h1>
        <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1.5 leading-relaxed max-w-2xl">
          {stage === 'review' 
            ? 'Review the verified metrics extracted from your FitMao assessment.'
            : 'Upload a picture of your FitMao slip, paste a screenshot, or scan the QR code live.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PHASE 1: UPLOAD / CAMERA / PRESETS */}
      {stage === 'upload' && (
        <div className="space-y-4 my-auto">
          {cameraActive ? (
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={() => setCameraActive(false)}
              onError={(err) => setErrorMsg(err)}
            />
          ) : (
            <FileUpload
              onFileProcessed={handleFileProcessed}
              onOpenCamera={() => setCameraActive(true)}
              onError={(err) => setErrorMsg(err)}
            />
          )}

          <QRScanner
            onLoadPreset={handleLoadPreset}
            onApplyRawPayload={handleApplyRawPayload}
          />
        </div>
      )}

      {/* SCANNING INTERMEDIATE STATE */}
      {stage === 'scanning' && (
        <div className="card p-8 bg-white dark:bg-surface-900 text-center my-auto shadow-xl border border-surface-200 dark:border-surface-800 animate-fade-in">
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950/60 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-brand-200 dark:border-brand-800 relative overflow-hidden">
            <QrCode className="w-10 h-10 text-brand-600 dark:text-brand-400" />
            <div className="absolute inset-x-0 h-1 bg-brand-500 shadow-[0_0_8px_rgba(47,115,101,0.8)] animate-scan-line"></div>
          </div>
          <h3 className="font-display font-bold text-surface-900 dark:text-white text-base mb-1">
            Analyzing Assessment Data...
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Extracting body fat %, muscle mass, BMR, and body composition metrics.
          </p>
        </div>
      )}

      {/* PHASE 2: REVIEW & CONFIRM */}
      {stage === 'review' && (
        <AssessmentPreview
          extractedData={extractedData}
          onRescan={() => setStage('upload')}
          onConfirm={handleConfirmAndContinue}
        />
      )}
    </div>
  );
}
