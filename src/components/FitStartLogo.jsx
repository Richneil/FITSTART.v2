import React from 'react';

export default function FitStartLogo({ compact = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} aria-label="FitStart">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-surface-900 text-white shadow-subtle">
        <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-surface-950 bg-brand-300" />
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path d="M7 22V10h9.2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 16h7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M19 10h6M22 7v6" fill="none" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 22c2.8-1.1 4.8-3.2 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block font-display text-base font-black leading-none tracking-tight text-white">FitStart</span>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-surface-400">Assess · Understand · Start</span>
        </span>
      )}
    </div>
  );
}
