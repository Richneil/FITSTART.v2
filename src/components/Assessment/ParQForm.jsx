import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, ShieldAlert, HelpCircle, X, Sparkles, Target } from 'lucide-react';
import { parqTemplate } from '../../data/parqTemplate.js';

const TOOLTIP_DEFINITIONS = {
  safety: {
    title: 'Pre-Exercise Readiness (PAR-Q)',
    desc: 'These readiness questions help identify answers that may need professional guidance before starting more demanding exercise.'
  },
  goals: {
    title: 'Objective Prioritization',
    desc: 'Your primary goal and optional secondary goal help FitStart rank which supported report measurements to discuss first. A priority is not a diagnosis or action plan.'
  },
  activity_profile: {
    title: 'Activity Preference',
    desc: 'Your preferred activity provides context for a conversation with your coach. It does not change the measurement ranking.'
  },
  nutrition_hydration: {
    title: 'Nutrition and Hydration Context',
    desc: 'Your eating and hydration patterns provide context when FitStart explains Body Water and BMR.'
  }
};

export default function ParQForm({ initialAnswers, onComplete, onBack, onRecordChange }) {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Initialize with draft or passed answers
  const [answers, setAnswers] = useState(() => {
    if (initialAnswers) return initialAnswers;
    try {
      const saved = sessionStorage.getItem('fitstart_parq_draft');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      hasHeartCondition: 'no',
      hasChestPainActivity: 'no',
      hasChestPainRest: 'no',
      hasDizziness: 'no',
      hasBoneJointProblem: 'no',
      hasMedications: 'no',
      hasOtherMedicalReason: 'no',
      primaryGoal: 'fat_loss',
      secondaryGoal: 'muscle_gain',
      goals: ['fat_loss', 'muscle_gain'],
      goal: 'fat_loss',
      activityCategory: 'strength',
      activityCategories: ['strength'],
      availability: '3-4',
      sessionDuration: '45_60',
      dailyStyle: 'desk',
      nutritionPattern: 'balanced',
      waterIntake: 'moderate',
      barriers: 'time',
      guidanceStyle: 'trainer'
    };
  });

  // Auto-save form draft
  useEffect(() => {
    try {
      sessionStorage.setItem('fitstart_parq_draft', JSON.stringify(answers));
    } catch (_) {}
  }, [answers]);

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

  const handlePrimaryGoalSelect = (goalId) => {
    const prevVal = answers.primaryGoal;
    if (prevVal && prevVal !== goalId && onRecordChange) {
      onRecordChange('primaryGoal', prevVal, goalId);
    }
    setAnswers(prev => {
      let sec = prev.secondaryGoal;
      if (sec === goalId) {
        sec = 'none';
      }
      return {
        ...prev,
        primaryGoal: goalId,
        goal: goalId,
        secondaryGoal: sec,
        goals: [goalId, sec].filter(g => g && g !== 'none')
      };
    });
  };

  const handleSecondaryGoalSelect = (goalId) => {
    setAnswers(prev => ({
      ...prev,
      secondaryGoal: goalId,
      goals: [prev.primaryGoal, goalId].filter(g => g && g !== 'none')
    }));
  };

  const handleNext = () => {
    if (currentSectionIdx < totalSections - 1) {
      setCurrentSectionIdx(s => s + 1);
    } else {
      try {
        sessionStorage.removeItem('fitstart_parq_draft');
      } catch (_) {}
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
    <div className="min-h-screen flex flex-col p-4 sm:p-6 sm:py-8 animate-slide-up max-w-2xl mx-auto w-full pb-32 font-sans text-white">
      
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button 
          onClick={handlePrev} 
          className="p-2 -ml-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          title="Go Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-surface-200 dark:bg-surface-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-brand-500 h-full transition-all duration-300 rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="text-[11px] font-display font-bold text-surface-400 bg-surface-900 px-3 py-1.5 rounded-xl border border-white/10">
          Section {currentSectionIdx + 1} of {totalSections}
        </span>
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-300/10 border border-brand-300/30 text-[11px] font-display font-bold text-brand-300 uppercase tracking-wider mb-2.5">
            {currentSectionIdx === 0 ? 'PAR-Q' : `Section ${currentSectionIdx + 1} of ${totalSections}`}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
            {section.title}
          </h2>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {TOOLTIP_DEFINITIONS[section.id] && (
          <button
            type="button"
            onClick={() => setActiveTooltip(activeTooltip === section.id ? null : section.id)}
            className="p-2 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0 ml-2"
            title="Help / Term Definition"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Popover Help Tooltip */}
      {activeTooltip && TOOLTIP_DEFINITIONS[activeTooltip] && (
        <div className="mb-4 p-4 bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 rounded-2xl text-xs text-brand-950 dark:text-brand-200 relative animate-fade-in shadow-sm">
          <button
            onClick={() => setActiveTooltip(null)}
            className="absolute top-3 right-3 text-brand-500 hover:text-brand-800 dark:hover:text-brand-100 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
          <strong className="block font-display font-bold text-brand-900 dark:text-brand-100 text-xs mb-1">
            💡 {TOOLTIP_DEFINITIONS[activeTooltip].title}
          </strong>
          <p className="leading-relaxed mb-2">
            {TOOLTIP_DEFINITIONS[activeTooltip].desc}
          </p>
          <Link
            to="/glossary"
            target="_blank"
            className="inline-flex items-center gap-1 font-display font-bold text-brand-700 dark:text-brand-300 underline text-[11px]"
          >
            Learn more in the Fitness Glossary →
          </Link>
        </div>
      )}

      {/* Safety Warning if Section 1 has Yes */}
      {section.id === 'safety' && hasSafetyAlert && (
        <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-2xl text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2 animate-fade-in">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Safety notice:</strong> One of your answers may require professional guidance. Consider speaking with a qualified healthcare or fitness professional before starting more demanding exercise.
          </div>
        </div>
      )}

      {/* Dynamic Questions Rendering */}
      <div className="space-y-4 mb-6">
        
        {/* Section 1: Safety Screening (Yes/No Questions) */}
        {section.id === 'safety' && section.questions.map((q) => (
          <div key={q.id} className="p-3.5 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm">
            <p className="text-xs font-bold text-surface-800 dark:text-surface-200 mb-2.5 leading-snug">{q.question}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSingleSelect(q.field, 'no')}
                className={`py-2 px-3 rounded-xl text-xs font-display font-bold border transition-all
                  ${answers[q.field] === 'no' ? 'bg-brand-300 text-surface-950 border-brand-300 shadow-sm' : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => handleSingleSelect(q.field, 'yes')}
                className={`py-2 px-3 rounded-xl text-xs font-display font-bold border transition-all
                  ${answers[q.field] === 'yes' ? 'bg-brand-300 text-surface-950 border-brand-300 shadow-sm' : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                Yes
              </button>
            </div>
          </div>
        ))}

        {/* Section 2: Split Objectives (Primary & Secondary Goals) */}
        {section.id === 'goals' && (
          <div className="space-y-5">
            {/* Primary Goal (Single Select) */}
            <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-surface-100 dark:border-surface-800">
                <Target className="w-4 h-4 text-brand-400" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-surface-800 dark:text-surface-200">
                  1. Primary Objective (Pick 1 Main Focus)
                </span>
              </div>
              <div className="space-y-2">
                {section.options.map((opt) => {
                  const isSelected = answers.primaryGoal === opt.id;
                  return (
                    <button
                      key={`primary-${opt.id}`}
                      type="button"
                      onClick={() => handlePrimaryGoalSelect(opt.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all
                        ${isSelected ? 'bg-brand-300/10 border-brand-300/60 shadow-sm' : 'bg-surface-50 dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`font-display font-bold text-xs ${isSelected ? 'text-brand-200' : 'text-surface-900 dark:text-white'}`}>
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-brand-300 rounded-full flex items-center justify-center text-surface-950 shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className={`text-[11px] ${isSelected ? 'text-brand-300' : 'text-surface-500 dark:text-surface-400'}`}>
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Goal (Single Select) */}
            <div className="card p-4 sm:p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-surface-100 dark:border-surface-800">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-surface-800 dark:text-surface-200">
                  2. Secondary Objective (Optional Support Focus)
                </span>
              </div>
              <div className="space-y-2">
                {/* None Option */}
                <button
                  type="button"
                  onClick={() => handleSecondaryGoalSelect('none')}
                  className={`w-full text-left p-3 rounded-2xl border transition-all
                    ${answers.secondaryGoal === 'none' || !answers.secondaryGoal ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 shadow-sm' : 'bg-surface-50 dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-display font-bold text-xs text-surface-900 dark:text-white">
                      None / Focus Solely on Primary Goal
                    </span>
                    {(answers.secondaryGoal === 'none' || !answers.secondaryGoal) && (
                      <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    )}
                  </div>
                </button>

                {section.options
                  .filter(opt => opt.id !== answers.primaryGoal)
                  .map((opt) => {
                    const isSelected = answers.secondaryGoal === opt.id;
                    return (
                      <button
                        key={`secondary-${opt.id}`}
                        type="button"
                        onClick={() => handleSecondaryGoalSelect(opt.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all
                          ${isSelected ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 shadow-sm' : 'bg-surface-50 dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-display font-bold text-xs ${isSelected ? 'text-brand-900 dark:text-brand-200' : 'text-surface-900 dark:text-white'}`}>
                            {opt.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Activity Profile (Single Choice - Best Match) */}
        {section.id === 'activity_profile' && (
          <div className="space-y-2.5">
            {section.options.map((opt) => {
              const isSelected = (answers.activityCategory === opt.id) || (!answers.activityCategory && (answers.activityCategories || [])[0] === opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    handleSingleSelect('activityCategory', opt.id);
                    setAnswers(prev => ({
                      ...prev,
                      activityCategory: opt.id,
                      activityCategories: [opt.id]
                    }));
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer
                    ${isSelected ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-500 shadow-sm ring-2 ring-brand-500/20' : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 hover:border-brand-300'}`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`font-display font-bold text-xs ${isSelected ? 'text-brand-900 dark:text-brand-200' : 'text-surface-900 dark:text-white'}`}>{opt.label}</span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className={`text-[11px] ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-surface-500 dark:text-surface-400'}`}>{opt.desc}</p>
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
                      <span className="font-display font-medium">{opt.label}</span>
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
          className="btn-secondary w-1/3 py-3.5 text-xs font-display font-bold min-h-[48px] flex items-center justify-center"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-1.5 text-xs font-display font-bold min-h-[48px] shadow-md"
        >
          {currentSectionIdx < totalSections - 1 ? 'Next Section' : 'Review & Confirm Goal'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
