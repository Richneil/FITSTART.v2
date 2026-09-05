// qrParser.js - Real-time QR & FitMao Slip Parser Utility
// Supports universal QR decoding using jsQR + canvas image processing with native BarcodeDetector fallback.
import jsQR from 'jsqr';

export function parseQrPayload(rawText, baseDefaults = {}) {
  if (!rawText || typeof rawText !== 'string') return null;

  let parsed = {};

  // 1. Try JSON Parsing
  try {
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      parsed = JSON.parse(trimmed);
    }
  } catch (_) {}

  // 2. Try URL Query Parameter Parsing
  if (Object.keys(parsed).length === 0 && (rawText.includes('?') || rawText.startsWith('http://') || rawText.startsWith('https://') || rawText.includes('fitmao'))) {
    try {
      const urlStr = rawText.startsWith('http') ? rawText : `https://fitmao.local/?${rawText.replace(/^.*\?/, '')}`;
      const url = new URL(urlStr);
      const params = Object.fromEntries(url.searchParams.entries());
      if (Object.keys(params).length > 0) {
        parsed = params;
      }
    } catch (_) {}
  }

  // 3. Try Key-Value / Line-by-Line Regex Parsing
  if (Object.keys(parsed).length === 0) {
    const lines = rawText.split(/[\r\n,;|]+/);
    for (const line of lines) {
      const match = line.match(/^\s*([^:=]+)\s*[:=]\s*(.+)\s*$/i);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim();
        parsed[key] = val;
      }
    }
  }

  if (Object.keys(parsed).length === 0) {
    return null;
  }

  // Normalize field aliases from various FitMao / InBody scan formats
  const cleanNumber = (val, fallback) => {
    if (val === undefined || val === null) return fallback;
    const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? fallback : num;
  };

  const memberName = parsed.memberName || parsed.name || parsed.client || parsed.user || baseDefaults.memberName || 'Alex Rivera';
  const gender = parsed.gender || parsed.sex || baseDefaults.gender || 'Male';
  const age = cleanNumber(parsed.age || parsed.bodyAge, cleanNumber(baseDefaults.age, 28));
  const height = cleanNumber(parsed.height || parsed.ht || parsed.h, cleanNumber(baseDefaults.height, 175));
  const weight = cleanNumber(parsed.weight || parsed.wt || parsed.w, cleanNumber(baseDefaults.weight, 78.0));
  const bodyFatPercentage = cleanNumber(parsed.bodyFatPercentage || parsed.bodyFat || parsed.pbf || parsed.fatPercentage || parsed.bfp, cleanNumber(baseDefaults.bodyFatPercentage, 24.5));
  const skeletalMuscleMass = cleanNumber(parsed.skeletalMuscleMass || parsed.smm || parsed.skeletalMuscle, cleanNumber(baseDefaults.skeletalMuscleMass, 32.1));
  const visceralFat = Math.round(cleanNumber(parsed.visceralFat || parsed.vfat || parsed.visceral, cleanNumber(baseDefaults.visceralFat, 11)));
  
  // Calculate or extract derived metrics
  const bmi = cleanNumber(parsed.bmi, (weight / Math.pow(height / 100, 2)).toFixed(1));
  const fatMass = cleanNumber(parsed.fatMass, (weight * (bodyFatPercentage / 100)).toFixed(1));
  const fatFreeMass = cleanNumber(parsed.fatFreeMass, (weight * (1 - bodyFatPercentage / 100)).toFixed(1));
  const muscleMass = cleanNumber(parsed.muscleMass, (weight * 0.71).toFixed(1));
  const bmr = Math.round(cleanNumber(parsed.bmr, 10 * weight + 6.25 * height - 5 * age + (gender === 'Male' ? 5 : -161)));
  const bodyWater = cleanNumber(parsed.bodyWater || parsed.tbw, (fatFreeMass * 0.73).toFixed(1));
  const bodyWaterRatio = cleanNumber(parsed.bodyWaterRatio, ((bodyWater / weight) * 100).toFixed(1));
  const proteinMass = cleanNumber(parsed.proteinMass, (weight * 0.164).toFixed(1));
  const boneMineralContent = cleanNumber(parsed.boneMineralContent || parsed.bmc, (weight * 0.048).toFixed(1));
  const waistToHipRatio = parsed.waistToHipRatio || parsed.whr || (gender === 'Male' ? '0.88' : '0.74');
  
  // Health Score calculation
  let healthScore = cleanNumber(parsed.healthScore || parsed.score, null);
  if (!healthScore) {
    healthScore = Math.max(50, Math.min(98, Math.round(100 - (bodyFatPercentage > 20 ? (bodyFatPercentage - 18) * 1.8 : (15 - bodyFatPercentage) * 1.5) - (visceralFat > 9 ? (visceralFat - 9) * 2 : 0))));
  }

  // Target and Control Values
  const targetWeight = cleanNumber(parsed.targetWeight, (height > 100 ? (height - 100) * 0.9 : weight).toFixed(1));
  const diffWeight = (weight - targetWeight).toFixed(1);
  const weightControl = parsed.weightControl || (diffWeight > 0 ? `-${diffWeight}` : `+${Math.abs(diffWeight)}`);
  const fatControl = parsed.fatControl || (bodyFatPercentage > 20 ? `-${((bodyFatPercentage - 18) * 0.5).toFixed(1)}` : '0.0');
  const muscleControl = parsed.muscleControl || (skeletalMuscleMass < 30 ? '+2.0' : '0.0');
  
  let bodyType = parsed.bodyType;
  if (!bodyType) {
    if (bodyFatPercentage < 16 && skeletalMuscleMass > 33) bodyType = 'Athletic Muscular';
    else if (bodyFatPercentage > 24) bodyType = 'Standard Overweight';
    else if (bodyFatPercentage > 20) bodyType = 'Hidden Obese';
    else bodyType = 'Balanced Standard';
  }

  const bodyAge = String(cleanNumber(parsed.bodyAge, age + (bodyFatPercentage > 22 ? 3 : -3)));

  return {
    memberName: String(memberName),
    gender: String(gender),
    age: String(age),
    height: String(height),
    testDate: parsed.testDate || new Date().toISOString().split('T')[0],
    testTime: parsed.testTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    scannerDevice: parsed.scannerDevice || 'FitMao 3D Scanner Pro',
    gymLocation: parsed.gymLocation || 'KSYN Fitness Alabang',
    healthScore: String(healthScore),
    bodyType: String(bodyType),
    bodyAge,
    weight: String(weight),
    targetWeight: String(targetWeight),
    weightControl: String(weightControl),
    bodyFatPercentage: String(bodyFatPercentage),
    fatMass: String(fatMass),
    fatFreeMass: String(fatFreeMass),
    skeletalMuscleMass: String(skeletalMuscleMass),
    muscleMass: String(muscleMass),
    fatControl: String(fatControl),
    muscleControl: String(muscleControl),
    bmi: String(bmi),
    visceralFat: String(visceralFat),
    bmr: String(bmr),
    bodyWater: String(bodyWater),
    bodyWaterRatio: String(bodyWaterRatio),
    proteinMass: String(proteinMass),
    boneMineralContent: String(boneMineralContent),
    waistToHipRatio: String(waistToHipRatio),
    isDecodedFromLiveQr: true
  };
}

/**
 * Universal QR code decoding from Image Element, Canvas, or Blob
 * Uses jsQR on canvas ImageData with multi-pass contrast adjustments and BarcodeDetector fallback.
 */
export async function decodeQrFromImage(source) {
  if (typeof window === 'undefined' || !source) return null;

  try {
    let canvas;
    let ctx;

    if (source instanceof HTMLCanvasElement) {
      canvas = source;
      ctx = canvas.getContext('2d', { willReadFrequently: true });
    } else {
      // Create offscreen canvas for image or video
      canvas = document.createElement('canvas');
      const width = source.naturalWidth || source.videoWidth || source.width || 640;
      const height = source.naturalHeight || source.videoHeight || source.height || 480;
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(source, 0, 0, width, height);
    }

    if (!ctx) return null;

    // 1. Pass 1: Raw Image Data via jsQR
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });
    if (code && code.data) {
      return code.data;
    }

    // 2. Pass 2: Grayscale & Contrast Boost for photographed QR codes
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const gray = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
      // High contrast binarization threshold
      const val = gray > 128 ? 255 : 0;
      d[i] = val;
      d[i + 1] = val;
      d[i + 2] = val;
    }
    const codeContrast = jsQR(d, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });
    if (codeContrast && codeContrast.data) {
      return codeContrast.data;
    }

    // 3. Pass 3: Try native BarcodeDetector if available
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'data_matrix'] });
        const barcodes = await barcodeDetector.detect(canvas);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          return barcodes[0].rawValue;
        }
      } catch (_) {}
    }
  } catch (err) {
    console.warn('QR image decoding error:', err);
  }

  return null;
}
