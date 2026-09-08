import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Camera, ChevronRight, Image, QrCode, AlertCircle, Zap } from 'lucide-react';
import { parseQrPayload, decodeQrFromImage } from '../../utils/qrParser.js';
import { DEFAULT_EXTRACTED } from '../../data/demoAssessments.js';
import CameraCapture from './CameraCapture.jsx';
import AssessmentPreview from './AssessmentPreview.jsx';

const REFERENCE_RAW = {
  ...DEFAULT_EXTRACTED,
  memberName: 'Raymund Santos',
  age: 23,
  bodyAge: 22,
  height: 170,
  testDate: '2026-09-05',
  gymLocation: 'FitZone Batangas',
  healthScore: 84,
  bodyType: 'Athletic Standard',
  weight: 63.7,
  targetWeight: 63.5,
  weightControl: -0.2,
  bodyFatPercentage: 24.8,
  fatMass: 15.8,
  fatFreeMass: 47.9,
  skeletalMuscleMass: 32.4,
  muscleMass: 45.8,
  fatControl: -0.8,
  muscleControl: 0.6,
  bmi: 22,
  visceralFat: 7,
  bmr: 1620,
  bodyWater: 34.9,
  bodyWaterRatio: 54.8,
  proteinMass: 10.4,
  boneMineralContent: 3.1,
  waistToHipRatio: 0.82
};

export default function UploadStep({ onDataExtracted, onCancel }) {
  const fileInputRef = useRef(null);
  const [stage, setStage] = useState('upload');
  const [extractedData, setExtractedData] = useState({ ...DEFAULT_EXTRACTED });
  const [errorMsg, setErrorMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const handleFileProcessed = (_dataUrl, rawQr, inputSource = 'uploaded_qr') => {
    setErrorMsg('');

    setStage('scanning');
    const parsed = rawQr ? parseQrPayload(rawQr, REFERENCE_RAW) : null;
    setExtractedData(parsed
      ? { ...parsed, _inputSource: inputSource }
      : { ...REFERENCE_RAW, _inputSource: 'demo' });
    if (!rawQr) {
      setErrorMsg('No embedded QR code was detected. We loaded the demo values so you can review or correct them before continuing.');
    }
    setTimeout(() => setStage('review'), 800);
  };

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose a photo or screenshot in an image format.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = async () => handleFileProcessed(reader.result, await decodeQrFromImage(image));
      image.onerror = () => setErrorMsg('That image could not be read. Please choose another file.');
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleDemoData = () => {
    setErrorMsg('');
    setExtractedData({ ...REFERENCE_RAW, _inputSource: 'demo' });
    setStage('scanning');
    setTimeout(() => setStage('review'), 500);
  };

  const handleInputChoice = (choice) => {
    if (choice === 'upload') {
      fileInputRef.current?.click();
      return;
    }
    setCameraActive(true);
  };

  const handleCameraCapture = (dataUrl, rawQr) => {
    setCameraActive(false);
    handleFileProcessed(dataUrl, rawQr, 'fitmao_qr');
  };

  useEffect(() => {
    const handlePaste = (event) => {
      if (stage !== 'upload' || cameraActive) return;

      const imageItem = Array.from(event.clipboardData?.items || [])
        .find((item) => item.type.startsWith('image/'));
      const file = imageItem?.getAsFile();
      if (!file) return;

      event.preventDefault();
      const reader = new FileReader();
      reader.onload = () => {
        const image = new window.Image();
        image.onload = async () => {
          const rawQr = await decodeQrFromImage(image);
          handleFileProcessed(reader.result, rawQr);
        };
        image.onerror = () => setErrorMsg('That pasted image could not be read. Try another image.');
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [stage, cameraActive]);

  const handleConfirmAndContinue = (reviewedData = extractedData) => {
    const weightVal = parseFloat(reviewedData.weight) || 78.0;
    const fatPercentVal = parseFloat(reviewedData.bodyFatPercentage) || 24.5;
    const heightVal = parseFloat(reviewedData.height) || 175;
    const signedKilograms = (value, fallback) => {
      const numericValue = parseFloat(String(value ?? fallback).replace(/[^\d.-]/g, ''));
      const safeValue = Number.isFinite(numericValue) ? numericValue : fallback;
      return `${safeValue > 0 ? '+' : ''}${safeValue.toFixed(1)} kg`;
    };

    const formattedData = {
      memberName: reviewedData.memberName || 'Alex Rivera',
      gender: reviewedData.gender || 'Male',
      age: reviewedData.age
        ? (String(reviewedData.age).includes('yrs') ? reviewedData.age : `${reviewedData.age} yrs`)
        : '28 yrs',
      height: `${heightVal} cm`,
      testDate: reviewedData.testDate || new Date().toISOString().split('T')[0],
      testTime: reviewedData.testTime || '10:30 AM',
      scannerDevice: reviewedData.scannerDevice || 'FitMao 3D Scanner Pro',
      gymLocation: reviewedData.gymLocation || 'KSYN Fitness Alabang',
      healthScore: `${reviewedData.healthScore || '74'} / 100`,
      bodyType: reviewedData.bodyType || 'Standard Overweight',
      bodyAge: reviewedData.bodyAge
        ? (String(reviewedData.bodyAge).includes('yrs') ? reviewedData.bodyAge : `${reviewedData.bodyAge} yrs`)
        : '31 yrs',
      weight: `${weightVal.toFixed(1)} kg`,
      targetWeight: `${parseFloat(reviewedData.targetWeight || 72.0).toFixed(1)} kg`,
      weightControl: signedKilograms(reviewedData.weightControl, -6),
      bodyFatPercentage: `${fatPercentVal.toFixed(1)}%`,
      fatMass: `${reviewedData.fatMass || (weightVal * (fatPercentVal / 100)).toFixed(1)} kg`,
      fatFreeMass: `${reviewedData.fatFreeMass || (weightVal * (1 - fatPercentVal / 100)).toFixed(1)} kg`,
      skeletalMuscleMass: `${parseFloat(reviewedData.skeletalMuscleMass || 32.1).toFixed(1)} kg`,
      muscleMass: `${parseFloat(reviewedData.muscleMass || 55.4).toFixed(1)} kg`,
      fatControl: signedKilograms(reviewedData.fatControl, -6),
      muscleControl: signedKilograms(reviewedData.muscleControl, 0),
      bmi: String(reviewedData.bmi || (weightVal / Math.pow(heightVal / 100, 2)).toFixed(1)),
      visceralFat: `Level ${reviewedData.visceralFat || 11}`,
      bmr: `${Number(reviewedData.bmr || 1650).toLocaleString()} kcal`,
      bodyWater: `${parseFloat(reviewedData.bodyWater || 42.3).toFixed(1)} L`,
      bodyWaterRatio: `${parseFloat(reviewedData.bodyWaterRatio || 54.2).toFixed(1)}%`,
      proteinMass: `${parseFloat(reviewedData.proteinMass || 12.8).toFixed(1)} kg`,
      boneMineralContent: `${parseFloat(reviewedData.boneMineralContent || 3.8).toFixed(1)} kg`,
      waistToHipRatio: String(reviewedData.waistToHipRatio || '0.88'),
      dataSource: reviewedData._inputSource === 'demo' ? 'Demo assessment data' : 'FitMao QR code',
      correctedFields: reviewedData._correctedFields || []
    };

    onDataExtracted(formattedData);
  };

  return (
    <div className={`min-h-screen flex flex-col p-4 sm:p-6 sm:py-8 animate-slide-up mx-auto w-full pb-28 font-sans ${stage === 'review' ? 'max-w-3xl' : 'max-w-xl'}`}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button type="button" onClick={onCancel} className="w-10 h-10 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 flex items-center justify-center text-surface-600 dark:text-surface-300 shadow-subtle" aria-label="Back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="block text-[10px] text-surface-500 dark:text-surface-400">Step 1 of 3</span>
            <strong className="block text-xs font-display text-surface-900 dark:text-white">Your FitMao Results</strong>
          </div>
        </div>
        <div className="h-1 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden mb-6">
          <span className="block h-full w-1/3 rounded-full bg-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
          {stage === 'review' ? 'Verify Scanned Assessment' : 'Add your FitMao data'}
        </h1>
        <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1.5 leading-relaxed max-w-2xl">
          {stage === 'review'
            ? 'Review the verified metrics extracted from your FitMao assessment.'
            : 'FitStart needs your body composition report to personalize your results. Choose how you’d like to share it.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {stage === 'upload' && (
        <div className="space-y-3">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelection} />
          {cameraActive ? (
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={() => setCameraActive(false)}
              onError={(error) => setErrorMsg(error)}
            />
          ) : (
            <>
              {[
                [QrCode, 'Scan QR Code', 'Scan the QR code on your FitMao printout', 'Fastest', 'scan'],
                [Image, 'Upload a Screenshot', 'Choose an image that clearly includes the FitMao QR code', null, 'upload'],
                [Camera, 'Take a Photo', 'Photograph the QR code on your printed FitMao report', null, 'photo']
              ].map(([Icon, title, description, badge, choice]) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => handleInputChoice(choice)}
                  className="card w-full p-4 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl flex items-center gap-4 text-left hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                >
                  <span className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <strong className="text-sm font-display text-surface-900 dark:text-white">{title}</strong>
                      {badge && <span className="rounded-full bg-brand-600 text-white px-2 py-0.5 text-[9px] font-display font-bold">{badge}</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-surface-500 dark:text-surface-400">{description}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-surface-400" />
                </button>
              ))}
            </>
          )}

          {!cameraActive && (
            <button
              type="button"
              onClick={handleDemoData}
              className="w-full mt-5 rounded-3xl border border-brand-100 dark:border-brand-900 bg-brand-50/70 dark:bg-brand-950/30 p-4 text-left flex items-start gap-3 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
            >
              <Zap className="w-4 h-4 text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
              <span>
                <strong className="block text-xs font-display text-surface-900 dark:text-white">Using demo data</strong>
                <span className="mt-1 block text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">
                  For this prototype, FitStart will use Raymund’s FitMao results from September 5, 2026. Tap here to continue.
                </span>
              </span>
            </button>
          )}
        </div>
      )}

      {stage === 'scanning' && (
        <div className="card p-8 bg-white dark:bg-surface-900 text-center my-auto shadow-xl border border-surface-200 dark:border-surface-800 animate-fade-in">
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950/60 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-brand-200 dark:border-brand-800 relative overflow-hidden">
            <QrCode className="w-10 h-10 text-brand-600 dark:text-brand-400" />
            <div className="absolute inset-x-0 h-1 bg-brand-500 shadow-[0_0_8px_rgba(47,115,101,0.8)] animate-scan-line" />
          </div>
          <h3 className="font-display font-bold text-surface-900 dark:text-white text-base mb-1">
            Analyzing Assessment Data...
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Reading the QR code and organizing the available FitMao measurements.
          </p>
        </div>
      )}

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
