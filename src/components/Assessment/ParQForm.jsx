import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, ShieldAlert, HeartPulse, Activity } from 'lucide-react';
import { parqTemplate } from '../../data/parqTemplate.js';

export default function ParQForm({ initialAnswers, onComplete, onBack, onRecordChange }) {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers || {
    hasHeartCondition: 'no',
    hasChestPainActivity: 'no',
    hasChestPainRest: 'no',
    hasDizziness: 'no',
    hasBoneJointProblem: 'no',
    hasMedications: 'no',
    hasOtherMedicalReason: 'no',
    goals: ['fat_loss'],
    goal: 'fat_loss',
    activityCategories: ['aerobic', 'strength'],
    otherActivity: '',
    availability: '3-4',
    sessionDuration: '45_60',
    dailyStyle: 'desk',
    nutritionPattern: 'balanced',
    waterIntake: 'moderate',
    barriers: 'time',
    guidanceStyle: 'trainer'
  });

  const section = parqTemplate.sections[currentSectionIdx];
  const totalSections = parqTemplate.sections.length;
  const progress = ((currentSectionIdx + 1) / totalSections) * 100;

  const handleSingleSelect = (field, value) => {
    const prevVal = answers[field];
    if (prevVal && prevVal !== value && onRecordChange) {
      onRecordChange(field, prevVal, value);
    }
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiToggle = (field, id) => {
    const currentList = answers[field] || [];
    let updated;
    if (currentList.includes(id)) {
      updated = currentList.filter(item => item !== id);
    } else {
      updated = [...currentList, id];
    }
    setAnswers(prev => {
      const next = { ...prev, [field]: updated };
      if (field === 'goals' && updated.length > 0) {
        next.goal = updated[0];
      }
      return next;
    });
  };

  const handleNext = () => {
    if (currentSectionIdx < totalSections - 1) {
      setCurrentSectionIdx(s => s + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentSectionIdx > 0) {
      setCurrentSectionIdx(s => s - 1);
    } else {
      onBack();
    }
  };

  // Check if any safety question is marked "yes"
  const hasSafetyAlert = ['hasHeartCondition', 'hasChestPainActivity', 'hasChestPainRest', 'hasDizziness', 'hasBoneJointProblem', 'hasMedications', 'hasOtherMedicalReason']
    .some(key => answers[key] === 'yes');

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 animate-slide-up max-w-md sm:max-w-lg mx-auto w-full pb-28 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button onClick={handlePrev} className="p-2 -ml-2 text-surface-500 hover:text-surface-900 rounded-full active:bg-surface-200">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-surface-200 h-2.5 rounded-full overflow-hidden">
          <div className="bg-brand-500 h-full transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-black text-surface-500">{currentSectionIdx + 1}/{totalSections}</span>
      </div>

      <div className="mb-5">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
          PAR-Q Section {currentSectionIdx + 1} of {totalSections}
        </span>
        <h2 className="text-2xl font-extrabold text-surface-900 tracking-tight">{section.title}</h2>
        <p className="text-xs text-surface-500 mt-1">{section.subtitle}</p>
      </div>

      {/* Safety Warning if Section 1 has Yes */}
      {section.id === 'safety' && hasSafetyAlert && (
        <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start gap-2 animate-fade-in">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Medical Notice:</strong> You indicated a potential medical or physical condition. FitStart will note this to prioritize joint-safe benchmarks and recommends consulting a doctor before rigorous training.
          </div>
        </div>
      )}

      {/* Dynamic Questions Rendering */}
      <div className="space-y-4 mb-6">
        
        {/* Section: Safety Screening (Yes/No Questions) */}
        {section.id === 'safety' && section.questions.map((q) => (
          <div key={q.id} className="p-3.5 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm">
            <p className="text-xs font-bold text-surface-800 dark:text-surface-200 mb-2.5 leading-snug">{q.question}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSingleSelect(q.field, 'no')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all
                  ${answers[q.field] === 'no' ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => handleSingleSelect(q.field, 'yes')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all
                  ${answers[q.field] === 'yes' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                Yes
              </button>
            </div>
          </div>
        ))}

        {/* Section: Goals (Multiselect) */}
        {section.id === 'goals' && (
          <div className="space-y-2.5">
            {section.options.map((opt) => {
              const isSelected = (answers.goals || []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleMultiToggle('goals', opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all
                    ${isSelected ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 shadow-sm' : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-600'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-sm ${isSelected ? 'text-brand-900 dark:text-brand-200' : 'text-surface-900 dark:text-white'}`}>{opt.label}</span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className={`text-xs ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-surface-500 dark:text-surface-400'}`}>{opt.desc}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Section: Activity Categories (Multiselect) */}
        {section.id === 'activity_profile' && (
          <div className="space-y-2.5">
            {section.options.map((opt) => {
              const isSelected = (answers.activityCategories || []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleMultiToggle('activityCategories', opt.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all
                    ${isSelected ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 shadow-sm' : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-600'}`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`font-bold text-sm ${isSelected ? 'text-brand-900 dark:text-brand-200' : 'text-surface-900 dark:text-white'}`}>{opt.label}</span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className={`text-xs ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-surface-500 dark:text-surface-400'}`}>{opt.desc}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Sections with questions array (Lifestyle, Nutrition, Obstacles) */}
        {section.questions && section.id !== 'safety' && section.questions.map((q) => (
          <div key={q.id} className="p-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-surface-800 dark:text-surface-200 leading-snug">{q.question}</label>
            <div className="space-y-1.5">
              {q.options.map((opt) => {
                const isSelected = answers[q.field] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSingleSelect(q.field, opt.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs
                      ${isSelected ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-900 dark:text-brand-200 font-bold shadow-sm' : 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />}
                    </div>
                    {opt.desc && (
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-brand-700 dark:text-brand-300 font-normal' : 'text-surface-500 dark:text-surface-400'}`}>
                        {opt.desc}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Touch-friendly 48px height) */}
      <div className="mt-auto pt-4 flex gap-3">
        <button
          type="button"
          onClick={handlePrev}
          className="btn-secondary w-1/3 py-3.5 text-xs font-bold min-h-[48px] flex items-center justify-center"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-1.5 text-xs font-black min-h-[48px] shadow-md"
        >
          {currentSectionIdx < totalSections - 1 ? 'Next Section' : 'Review & Confirm Goal'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
