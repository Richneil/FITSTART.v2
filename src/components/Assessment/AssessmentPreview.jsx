import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Info,
  RefreshCw
} from 'lucide-react';

const PERSONALIZED_FIELDS = [
  { key: 'bodyFatPercentage', label: 'Body Fat', unit: '%', help: 'Estimated percentage of body weight from fat.' },
  { key: 'skeletalMuscleMass', label: 'Skeletal Muscle', unit: 'kg', help: 'Estimated muscle used for movement and strength.' },
  { key: 'visceralFat', label: 'Visceral Fat Level', unit: 'level', help: 'Device-estimated fat stored around the abdominal organs.' },
  { key: 'bodyWater', label: 'Body Water', unit: 'L', help: 'Estimated total body water.' },
  { key: 'bmi', label: 'BMI', unit: '', help: 'Weight-to-height screening value.' },
  { key: 'waistToHipRatio', label: 'Waist-to-Hip Ratio', unit: '', help: 'Compares waist and hip measurements.' }
];

const SUPPORTING_FIELDS = [
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'fatMass', label: 'Body Fat Mass', unit: 'kg' },
  { key: 'fatFreeMass', label: 'Fat-Free Mass', unit: 'kg' },
  { key: 'muscleMass', label: 'Total Muscle Mass', unit: 'kg' },
  { key: 'bodyWaterRatio', label: 'Body Water Ratio', unit: '%' },
  { key: 'proteinMass', label: 'Protein Mass', unit: 'kg' },
  { key: 'boneMineralContent', label: 'Bone Mineral Content', unit: 'kg' },
  { key: 'bmr', label: 'BMR', unit: 'kcal' },
  { key: 'targetWeight', label: 'Target Weight', unit: 'kg' },
  { key: 'weightControl', label: 'Weight Control', unit: 'kg' },
  { key: 'fatControl', label: 'Fat Control', unit: 'kg' },
  { key: 'muscleControl', label: 'Muscle Control', unit: 'kg' }
];

function cleanValue(value, unit) {
  if (value === undefined || value === null) return '';
  let output = String(value).trim();
  if (unit === 'level') output = output.replace(/^level\s*/i, '');
  if (unit) output = output.replace(new RegExp(`\\s*${unit}$`, 'i'), '');
  return output.trim();
}

export default function AssessmentPreview({ extractedData, onRescan, onConfirm }) {
  const [values, setValues] = useState(() => ({ ...extractedData }));
  const [editedFields, setEditedFields] = useState([]);
  const [showSupporting, setShowSupporting] = useState(false);

  const sourceLabel = extractedData?._inputSource === 'fitmao_qr'
    ? 'Read from the FitMao QR code'
    : extractedData?._inputSource === 'uploaded_qr'
      ? 'Read from the uploaded FitMao image'
      : 'Demo assessment data for testing';

  const missingPriorityFields = useMemo(
    () => PERSONALIZED_FIELDS.filter((field) => !cleanValue(values[field.key], field.unit)),
    [values]
  );

  const updateValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setEditedFields((current) => current.includes(key) ? current : [...current, key]);
  };

  const handleConfirm = () => {
    onConfirm({
      ...values,
      _correctedFields: editedFields,
      _inputSource: extractedData?._inputSource || 'demo'
    });
  };

  const renderMetricInput = (field, emphasized = false) => (
    <label
      key={field.key}
      className={`block rounded-2xl border p-3 ${emphasized
        ? 'border-brand-200 bg-brand-50/60 dark:border-brand-800 dark:bg-brand-950/30'
        : 'border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/60'}`}
    >
      <span className="flex items-center justify-between gap-2 text-[11px] text-surface-500 dark:text-surface-400">
        <span>{field.label}</span>
        {editedFields.includes(field.key) && (
          <span className="text-[9px] font-display font-bold text-brand-700 dark:text-brand-300">Corrected</span>
        )}
      </span>
      <span className="mt-1 flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={cleanValue(values[field.key], field.unit)}
          onChange={(event) => updateValue(field.key, event.target.value)}
          className="min-w-0 flex-1 bg-transparent font-mono text-base font-bold text-surface-900 outline-none dark:text-white"
          aria-label={field.label}
        />
        {field.unit && field.unit !== 'level' && (
          <span className="text-[11px] font-medium text-surface-400">{field.unit}</span>
        )}
      </span>
      {field.help && <span className="mt-1 block text-[10px] leading-snug text-surface-400">{field.help}</span>}
    </label>
  );

  return (
    <div className="space-y-4 animate-fade-in font-sans">
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-950/40">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
          <div className="min-w-0 flex-1">
            <strong className="block text-sm font-display text-surface-900 dark:text-white">Review your FitMao results</strong>
            <p className="mt-1 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
              {sourceLabel}. Check the important measurements below and correct a value only if it does not match your report.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-display font-bold">
              <span className="rounded-full bg-white px-2.5 py-1 text-brand-700 dark:bg-surface-900 dark:text-brand-300">FitMao report</span>
              {editedFields.length > 0 && (
                <span className="rounded-full bg-white px-2.5 py-1 text-surface-600 dark:bg-surface-900 dark:text-surface-300">
                  {editedFields.length} corrected
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onRescan}
            className="shrink-0 rounded-xl border border-brand-200 bg-white p-2 text-brand-700 dark:border-brand-800 dark:bg-surface-900 dark:text-brand-300"
            aria-label="Scan another report"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <section className="card p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-display font-extrabold">Member and assessment</h2>
            <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">Used to identify this assessment in your history.</p>
          </div>
          <Edit3 className="h-4 w-4 shrink-0 text-surface-400" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2">
            <span className="mb-1 block text-[10px] text-surface-500">Member name</span>
            <input value={values.memberName || ''} onChange={(event) => updateValue('memberName', event.target.value)} className="input-field py-2.5 text-xs" />
          </label>
          <label>
            <span className="mb-1 block text-[10px] text-surface-500">Age</span>
            <input inputMode="numeric" value={cleanValue(values.age, 'yrs')} onChange={(event) => updateValue('age', event.target.value)} className="input-field py-2.5 text-xs" />
          </label>
          <label>
            <span className="mb-1 block text-[10px] text-surface-500">Height (cm)</span>
            <input inputMode="decimal" value={cleanValue(values.height, 'cm')} onChange={(event) => updateValue('height', event.target.value)} className="input-field py-2.5 text-xs" />
          </label>
          <label>
            <span className="mb-1 block text-[10px] text-surface-500">Sex</span>
            <select value={values.gender || ''} onChange={(event) => updateValue('gender', event.target.value)} className="input-field py-2.5 text-xs">
              <option value="">Not provided</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[10px] text-surface-500">Assessment date</span>
            <input type="date" value={values.testDate || ''} onChange={(event) => updateValue('testDate', event.target.value)} className="input-field py-2.5 text-xs" />
          </label>
        </div>
      </section>

      <section className="card p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-display font-extrabold">Measurements used for personalization</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-surface-500 dark:text-surface-400">
            FitStart combines these confirmed measurements with your answers to identify your starting priorities.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {PERSONALIZED_FIELDS.map((field) => renderMetricInput(field, true))}
        </div>
        {missingPriorityFields.length > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Missing measurements will not be used when FitStart ranks your priorities.</span>
          </div>
        )}
      </section>

      <section className="card">
        <button
          type="button"
          onClick={() => setShowSupporting((current) => !current)}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
          aria-expanded={showSupporting}
        >
          <span>
            <strong className="block text-sm font-display">Supporting FitMao information</strong>
            <span className="mt-0.5 block text-[11px] text-surface-500 dark:text-surface-400">Available for interpretation, but not all fields affect your ranking.</span>
          </span>
          {showSupporting ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showSupporting && (
          <div className="grid grid-cols-2 gap-2.5 border-t border-surface-200 p-4 dark:border-surface-800 sm:grid-cols-3">
            {SUPPORTING_FIELDS.map((field) => renderMetricInput(field))}
          </div>
        )}
      </section>

      <button type="button" onClick={handleConfirm} className="btn-primary py-4 text-xs">
        Confirm FitMao Data & Continue <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
}
