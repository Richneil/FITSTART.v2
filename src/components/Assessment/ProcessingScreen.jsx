import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ProcessingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-slide-up sm:max-w-md sm:mx-auto font-sans">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-surface-200 dark:border-surface-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-brand-500 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-extrabold text-surface-900 dark:text-white mb-2 tracking-tight">Evaluating FitMao Assessment</h2>
      <p className="text-surface-500 dark:text-surface-400 text-xs max-w-xs leading-relaxed">
        Applying deterministic rule-based relevance scoring and calculating weight breakdown waterfalls...
      </p>
    </div>
  );
}
