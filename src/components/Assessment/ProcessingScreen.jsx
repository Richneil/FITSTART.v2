import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  'Analyzing your assessment data...',
  'Connecting your results with your goals and activity...',
  'Determining prioritized starting metrics...',
  'Generating your personalized starting point... Ready!'
];

export default function ProcessingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-slide-up sm:max-w-md sm:mx-auto font-sans">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-surface-200 dark:border-surface-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-brand-500 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-display font-extrabold text-surface-900 dark:text-white mb-2 tracking-tight">
        Personalizing Your Results
      </h2>
      <p className="text-brand-700 dark:text-brand-300 font-display font-bold text-xs max-w-xs leading-relaxed transition-all duration-300 min-h-[32px] flex items-center justify-center">
        {MESSAGES[msgIdx]}
      </p>
    </div>
  );
}
