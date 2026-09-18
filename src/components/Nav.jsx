import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Sun, 
  Moon, 
  Sliders, 
  PlusCircle, 
  BookOpen,
  LayoutDashboard,
  Clock3
} from 'lucide-react';
import { api } from '../utils/api.js';
import { useTheme } from '../utils/theme.js';
import SettingsModal from './Settings/SettingsModal.jsx';

export default function Nav({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogoutClick = () => {
    api.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const themeToggleButton = (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-9 h-9 shrink-0 flex items-center justify-center text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-xl transition-all border border-surface-200/80 dark:border-surface-700/80 cursor-pointer shadow-subtle"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
    </button>
  );

  return (
    <header className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/80 dark:border-surface-800/80 sticky top-0 z-30 px-4 sm:px-8 py-3 transition-colors duration-200 shadow-subtle">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Gym Location */}
        <Link 
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left group"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-brand-600 to-emerald-400 text-white rounded-xl flex items-center justify-center font-display font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            FS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-surface-900 dark:text-white text-base tracking-tight leading-none block">
                FitStart
              </span>
              <span className="text-[10px] font-mono font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded">
                v2.4
              </span>
            </div>
            <span className="text-[11px] font-medium text-surface-500 dark:text-surface-400 hidden sm:block mt-0.5">
              KSYN Fitness Alabang
            </span>
          </div>
        </Link>

        {/* Authenticated Desktop Navigation Links (Only for logged-in members) */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-surface-100/80 dark:bg-surface-800/60 p-1 rounded-2xl border border-surface-200/60 dark:border-surface-700/60">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
                  isActive || location.pathname.startsWith('/results')
                    ? 'bg-white dark:bg-surface-900 text-brand-700 dark:text-brand-300 shadow-subtle'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-surface-900 text-brand-700 dark:text-brand-300 shadow-subtle'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                }`
              }
            >
              <Clock3 className="w-3.5 h-3.5" />
              <span>History</span>
            </NavLink>

            <NavLink
              to="/assessment"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-surface-900 text-brand-700 dark:text-brand-300 shadow-subtle'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                }`
              }
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Assessment</span>
            </NavLink>

            <NavLink
              to="/glossary"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-surface-900 text-brand-700 dark:text-brand-300 shadow-subtle'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                }`
              }
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Glossary</span>
            </NavLink>
          </nav>
        )}

        {/* Public navigation / member controls */}
        {user ? (
          <div className="flex items-center gap-2">
            {themeToggleButton}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-surface-200 dark:border-surface-800">
              {/* Settings Modal Button for Members */}
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="w-9 h-9 flex items-center justify-center text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-xl transition-all border border-surface-200/80 dark:border-surface-700/80 cursor-pointer shadow-subtle"
                title="Application Settings"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 pr-2.5 rounded-xl bg-surface-100/80 hover:bg-surface-200/80 dark:bg-surface-800/80 dark:hover:bg-surface-700/80 border border-surface-200/80 dark:border-surface-700/80 transition-all shadow-subtle group"
                title="View Profile"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-500/10 dark:bg-brand-400/10 border border-brand-500/20 flex items-center justify-center text-sm overflow-hidden shrink-0">
                  {user.avatar?.startsWith('data:') || user.avatar?.startsWith('http') ? (
                    <img src={user.avatar} alt="PFP" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.avatar || (user.firstName?.[0] || '🏋️')}</span>
                  )}
                </div>
                <span className="hidden sm:inline-block text-xs font-display font-semibold text-surface-800 dark:text-surface-200 max-w-[90px] truncate">
                  {user.firstName || 'Member'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              </Link>

              <button
                onClick={handleLogoutClick}
                className="w-9 h-9 flex items-center justify-center text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <nav className="flex min-w-0 items-center gap-1 sm:gap-2" aria-label="Public navigation">
            {themeToggleButton}
            <Link
              to="/"
              className={`hidden md:inline-flex px-2.5 py-2 text-xs font-display font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'text-brand-700 dark:text-brand-300'
                  : 'text-surface-600 hover:text-surface-950 dark:text-surface-300 dark:hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/#contact"
              className="hidden lg:inline-flex px-2.5 py-2 text-xs font-display font-semibold text-surface-600 hover:text-surface-950 dark:text-surface-300 dark:hover:text-white transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/login"
              className="hidden sm:inline-flex px-2 py-2 text-xs font-display font-semibold text-surface-700 hover:text-surface-950 dark:text-surface-200 dark:hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="shrink-0 rounded-xl bg-brand-600 px-3 py-2 text-xs font-display font-bold text-white shadow-sm transition-all hover:bg-brand-500 active:scale-95 sm:px-4"
            >
              Register
            </Link>
          </nav>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
      />
    </header>
  );
}
