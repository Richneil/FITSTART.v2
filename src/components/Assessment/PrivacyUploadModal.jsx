import React from 'react';
import { FileHeart, LockKeyhole, ShieldCheck, X } from 'lucide-react';

export default function PrivacyUploadModal({ open, acknowledged, onAcknowledgedChange, onCancel, onContinue }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="privacy-upload-title">
      <div className="w-full max-w-lg animate-scale-up rounded-[28px] border border-white/10 bg-surface-900/95 p-5 text-white shadow-[0_30px_80px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-300/25 bg-brand-300/10 text-brand-300">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-display font-bold uppercase tracking-[0.18em] text-brand-300">Data privacy</p>
              <h2 id="privacy-upload-title" className="mt-1 text-xl font-display font-black tracking-tight text-white sm:text-2xl">Before You Upload</h2>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-surface-400 transition hover:bg-white/5 hover:text-white" aria-label="Close privacy notice">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-surface-300">
          Your FitMao report contains personal fitness and body-composition information. Please review how FitStart uses this information before continuing.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
            <FileHeart className="h-4 w-4 text-brand-300" />
            <h3 className="mt-2 text-[11px] font-display font-bold uppercase tracking-wide text-white">What information?</h3>
            <p className="mt-1 text-[11px] leading-5 text-surface-400">Your FitMao report and related fitness assessment information.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
            <ShieldCheck className="h-4 w-4 text-brand-300" />
            <h3 className="mt-2 text-[11px] font-display font-bold uppercase tracking-wide text-white">Why use it?</h3>
            <p className="mt-1 text-[11px] leading-5 text-surface-400">To interpret assessment results and generate personalized fitness priorities.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
            <LockKeyhole className="h-4 w-4 text-brand-300" />
            <h3 className="mt-2 text-[11px] font-display font-bold uppercase tracking-wide text-white">How is it used?</h3>
            <p className="mt-1 text-[11px] leading-5 text-surface-400">Only for FitStart's assessment and result-interpretation process.</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-brand-300/20 bg-brand-300/[0.06] p-3.5 text-[11px] leading-5 text-surface-300">
          <strong className="text-white">Important:</strong> FitStart is a decision-support and educational system. It does not provide a medical diagnosis or replace professional advice.
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-3.5 transition hover:border-brand-300/30">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => onAcknowledgedChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-yellow-300"
          />
          <span className="text-xs leading-5 text-surface-200">I understand how my FitMao report will be used by FitStart.</span>
        </label>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} className="min-h-[48px] rounded-2xl border border-white/15 bg-transparent px-4 text-xs font-display font-bold text-white transition hover:bg-white/5">
            Cancel
          </button>
          <button type="button" onClick={onContinue} disabled={!acknowledged} className="min-h-[48px] rounded-2xl bg-brand-300 px-4 text-xs font-display font-black text-surface-950 transition hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-35">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
