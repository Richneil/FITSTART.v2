import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Sun, Moon } from 'lucide-react';
import { api } from '../utils/api.js';
import { useTheme } from '../utils/theme.js';

export default function Nav({ user, onLogout }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogoutClick = () => {
    api.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 sticky top-0 z-30 px-4 sm:px-6 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] font-sans transition-colors duration-200">
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between">
        {/* Brand Logo & Gym Location */}
        <Link 
          to={user ? "/dashboard" : "/login"}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-teal-500 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
            FS
          </div>
          <div>
            <span className="font-black text-surface-900 dark:text-white text-sm tracking-tight block">FitStart</span>
            <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 block -mt-0.5">KSYN Fitness Alabang</span>
          </div>
        </Link>

        {/* Right Section: Theme Toggle + Member Status */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-xl transition-colors border border-surface-200 dark:border-surface-700"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center text-sm overflow-hidden shadow-inner">
                {user.avatar?.startsWith('data:') || user.avatar?.startsWith('http') ? (
                  <img src={user.avatar} alt="PFP" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.avatar || (user.firstName?.[0] || '🏋️')}</span>
                )}
              </div>
              <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
              <button
                onClick={handleLogoutClick}
                className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
