import React from 'react';
import { Sun, Moon, ShieldCheck, Check, X, Sliders } from 'lucide-react';
import { useTheme } from '../../utils/theme.js';

export default function SettingsModal({ isOpen, onClose, user, onToggle2FA, twoFactorLoading }) {
  const { setTheme, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="w-full max-w-sm bg-white dark:bg-surface-900 rounded-3xl p-6 shadow-2xl relative animate-scale-up border border-surface-200 dark:border-surface-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-display font-extrabold text-surface-900 dark:text-white">
                Application Settings
              </h2>
              <p className="text-[10px] text-surface-500 font-medium">Preferences & Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Theme / Appearance Section */}
          <div>
            <label className="block text-xs font-display font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2">
              Appearance & Color Theme
            </label>
            
            <div className="grid grid-cols-2 gap-2.5">
              {/* Light Mode Card */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer
                  ${!isDark ? 'bg-brand-50/70 border-brand-500 shadow-sm ring-2 ring-brand-500/20' : 'bg-surface-50 dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                    <Sun className="w-4 h-4" />
                  </div>
                  {!isDark && (
                    <div className="w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <strong className="block text-xs font-display font-bold text-surface-900 dark:text-white">Light Mode</strong>
                <span className="text-[10px] text-surface-500">Crisp high-contrast</span>
              </button>

              {/* Dark Mode Card */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer
                  ${isDark ? 'bg-brand-950/40 border-brand-500 shadow-sm ring-2 ring-brand-500/20' : 'bg-surface-50 dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center shadow-inner border border-indigo-800">
                    <Moon className="w-4 h-4" />
                  </div>
                  {isDark && (
                    <div className="w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <strong className="block text-xs font-display font-bold text-surface-900 dark:text-white">Dark Mode</strong>
                <span className="text-[10px] text-surface-500">OLED slate dark</span>
              </button>
            </div>
          </div>

          {/* Account Security (2FA) */}
          {user && onToggle2FA && (
            <div className="p-3.5 bg-surface-50 dark:bg-surface-800/60 rounded-2xl border border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <div>
                  <strong className="block text-xs font-display font-bold text-surface-900 dark:text-white">
                    Two-Factor Auth (2FA)
                  </strong>
                  <span className="text-[10px] text-surface-500 dark:text-surface-400">
                    {user?.twoFactorEnabled ? 'Enabled (Active Protection)' : 'Disabled'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={twoFactorLoading}
                onClick={onToggle2FA}
                className={`text-[11px] font-display font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer
                  ${user?.twoFactorEnabled ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900' : 'bg-brand-500 text-white border-brand-500 hover:bg-brand-600'}`}
              >
                {twoFactorLoading ? 'Updating...' : user?.twoFactorEnabled ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          )}

          {/* About / Clinical Compliance */}
          <div className="p-3 bg-surface-100 dark:bg-surface-800 rounded-2xl text-[10px] text-surface-500 dark:text-surface-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>FitStart Core:</span>
              <span className="font-bold text-surface-800 dark:text-surface-200">v2.4 (Thesis Final)</span>
            </div>
            <div className="flex justify-between">
              <span>Scoring Rules:</span>
              <span className="font-bold text-surface-800 dark:text-surface-200">Documented rule-based</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-bold text-surface-800 dark:text-surface-200">KSYN Fitness Alabang</span>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary w-full py-3 text-xs font-display font-bold"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
