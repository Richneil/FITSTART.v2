import React, { useState } from 'react';
import { Code2, Sparkles } from 'lucide-react';
import { DEMO_PRESETS, DEMO_TEST_PAYLOADS } from '../../data/demoAssessments.js';

export default function QRScanner({ onLoadPreset, onApplyRawPayload }) {
  const [showQrTester, setShowQrTester] = useState(false);
  const [rawQrString, setRawQrString] = useState('');

  const handleApply = (str) => {
    const payload = str !== undefined ? str : rawQrString;
    if (!payload.trim()) return;
    onApplyRawPayload(payload);
  };

  return (
    <div className="p-4 bg-surface-100 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-display font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider block">
          Clinical Scan Presets (Real-Time Profiles)
        </span>
        <button
          type="button"
          onClick={() => setShowQrTester(!showQrTester)}
          className="text-[11px] font-display font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" />
          {showQrTester ? 'Hide QR String Input' : 'Test Raw QR String'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {DEMO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onLoadPreset(preset.id)}
            className="p-2.5 bg-white dark:bg-surface-800 hover:bg-brand-50 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 rounded-2xl text-left transition-colors cursor-pointer"
          >
            <strong className="block text-xs font-display font-bold text-surface-900 dark:text-white leading-tight">
              {preset.label}
            </strong>
            <span className="text-[10px] text-surface-500 dark:text-surface-400 block truncate">
              {preset.name}
            </span>
            <span className={`text-[9px] font-mono ${preset.tagColor}`}>
              {preset.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Live QR String Tester Input */}
      {showQrTester && (
        <div className="pt-2 border-t border-surface-200 dark:border-surface-800 space-y-2 animate-fade-in">
          <span className="text-[10px] font-display font-bold text-surface-500 uppercase block">
            Paste Real-Time FitMao QR Code Payload / URL:
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://fitmao.com/scan?name=Elena+Reyes&pbf=21.4&smm=29.2&vfat=7&w=65.2&h=165"
              value={rawQrString}
              onChange={(e) => setRawQrString(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => handleApply()}
              className="px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-display font-bold shrink-0 cursor-pointer shadow-sm"
            >
              Decode Live QR
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1 items-center">
            <span className="text-[10px] text-surface-400">Quick Test Payloads:</span>
            {DEMO_TEST_PAYLOADS.map((demo, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-surface-300 dark:text-surface-600">•</span>}
                <button
                  type="button"
                  onClick={() => handleApply(demo.payload)}
                  className="text-[10px] text-brand-600 dark:text-brand-400 underline font-mono cursor-pointer hover:text-brand-700"
                >
                  {demo.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
