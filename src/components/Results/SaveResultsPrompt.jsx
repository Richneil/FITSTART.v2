import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  UserPlus, 
  LogIn, 
  BookmarkCheck
} from 'lucide-react';

export default function SaveResultsPrompt({ user, onSave, saving = false, onContinueAsGuest }) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="p-4 bg-surface-100 dark:bg-surface-850 border border-surface-200 dark:border-surface-800 rounded-3xl text-center text-xs text-surface-600 dark:text-surface-400 font-medium animate-fade-in font-sans">
        <span>This unsaved result remains available only during this browser session.</span>
      </div>
    );
  }

  const handleGuestChoice = () => {
    setDismissed(true);
    if (onContinueAsGuest) onContinueAsGuest();
  };

  return (
    <div className="card p-6 sm:p-8 bg-white dark:bg-surface-900 border border-brand-200 dark:border-brand-900/60 rounded-3xl shadow-card font-sans space-y-5">
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto space-y-2">
        <div className="w-12 h-12 bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 rounded-2xl flex items-center justify-center mx-auto border border-brand-300 dark:border-brand-800">
          <BookmarkCheck className="w-6 h-6 stroke-[2.2]" />
        </div>
        <span className="text-[11px] font-display font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 block">
          Optional Step
        </span>
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-surface-900 dark:text-white tracking-tight">
          Want to keep your FitStart results?
        </h3>
        <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
          {user ? 'You are viewing this result without saving it. Choose to keep it in your member history.' : 'Create a free account to save this assessment and revisit your personalized interpretation later.'}
        </p>
      </div>

      {/* Value Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto text-xs text-surface-700 dark:text-surface-300">
        <div className="p-3 bg-white/90 dark:bg-surface-800/70 rounded-2xl border border-surface-200/80 dark:border-surface-700/60 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-surface-800 dark:text-brand-300 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="font-medium text-surface-900 dark:text-white">Save this assessment</span>
        </div>

        <div className="p-3 bg-white/90 dark:bg-surface-800/70 rounded-2xl border border-surface-200/80 dark:border-surface-700/60 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-surface-800 dark:text-brand-300 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="font-medium text-surface-900 dark:text-white">Revisit your results later</span>
        </div>

        <div className="p-3 bg-white/90 dark:bg-surface-800/70 rounded-2xl border border-surface-200/80 dark:border-surface-700/60 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-surface-800 dark:text-brand-300 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="font-medium text-surface-900 dark:text-white">Compare future assessments</span>
        </div>

        <div className="p-3 bg-white/90 dark:bg-surface-800/70 rounded-2xl border border-surface-200/80 dark:border-surface-700/60 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-surface-800 dark:text-brand-300 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="font-medium text-surface-900 dark:text-white">Keep your FitStart history</span>
        </div>
      </div>

      {/* 3 Optional Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
        {user ? <button type="button" onClick={onSave} disabled={saving} className="btn-primary w-full py-3.5 px-5 text-xs font-display font-extrabold">{saving ? 'Saving...' : 'Save This Assessment to My Account'}</button> : <>
        <button
          type="button"
          onClick={() => navigate('/signup?reason=save_assessment')}
          className="btn-primary w-full sm:w-auto flex-1 py-3.5 px-5 text-xs font-display font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Create Account
        </button>

        <button
          type="button"
          onClick={() => navigate('/login?reason=save_assessment')}
          className="btn-secondary w-full sm:w-auto flex-1 py-3.5 px-4 text-xs font-display font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogIn className="w-4 h-4" /> Sign In
        </button>
        </>}

        <button
          type="button"
          onClick={handleGuestChoice}
          className="w-full sm:w-auto py-3 px-4 text-xs font-display font-bold text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {user ? 'Keep Unsaved' : 'Continue as Guest'}
        </button>
      </div>
    </div>
  );
}
