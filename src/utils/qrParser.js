// qrParser.js - Real-time QR & FitMao Slip Parser Utility
// Supports universal QR decoding using jsQR + canvas image processing with native BarcodeDetector fallback.
import jsQR from 'jsqr';

export function parseQrPayload(rawText) {
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

  // Preserve only fields actually present in the payload. Derived FitMao scores,
  // ranges, target values, and missing body-composition values must never be invented.
  const aliases = {
    memberName: ['memberName', 'name', 'client', 'user'], gender: ['gender', 'sex'],
    age: ['age'], height: ['height', 'ht', 'h'], weight: ['weight', 'wt', 'w'],
    bodyFatPercentage: ['bodyFatPercentage', 'bodyFat', 'pbf', 'fatPercentage', 'bfp'],
    skeletalMuscleMass: ['skeletalMuscleMass', 'smm', 'skeletalMuscle'],
    visceralFat: ['visceralFat', 'vfat', 'visceral'], bmi: ['bmi'],
    bodyWater: ['bodyWater', 'tbw'], waistToHipRatio: ['waistToHipRatio', 'whr'],
    fatMass: ['fatMass'], fatFreeMass: ['fatFreeMass'], muscleMass: ['muscleMass'],
    bmr: ['bmr'], bodyWaterRatio: ['bodyWaterRatio'], proteinMass: ['proteinMass'],
    boneMineralContent: ['boneMineralContent', 'bmc'], healthScore: ['healthScore', 'score'],
    bodyType: ['bodyType'], bodyAge: ['bodyAge'], targetWeight: ['targetWeight'],
    weightControl: ['weightControl'], fatControl: ['fatControl'], muscleControl: ['muscleControl'],
    testDate: ['testDate'], testTime: ['testTime'], scannerDevice: ['scannerDevice'], gymLocation: ['gymLocation']
  };
  const result = {};
  const parsedByLowercaseKey = Object.fromEntries(
    Object.entries(parsed).map(([key, value]) => [key.toLowerCase(), value])
  );
  for (const [field, names] of Object.entries(aliases)) {
    const found = names.find((name) => {
      const value = parsedByLowercaseKey[name.toLowerCase()];
      return value !== undefined && value !== null && String(value).trim() !== '';
    });
    if (found) result[field] = String(parsedByLowercaseKey[found.toLowerCase()]);
  }
  if (!['bodyFatPercentage', 'skeletalMuscleMass', 'visceralFat', 'bmi', 'bodyWater', 'waistToHipRatio']
    .some((key) => result[key] !== undefined)) return null;
  if (parsed.referenceCategories && typeof parsed.referenceCategories === 'object') {
    result.referenceCategories = parsed.referenceCategories;
  }
  result.isDecodedFromLiveQr = true;
  result.isConfirmed = false;
  return result;
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
