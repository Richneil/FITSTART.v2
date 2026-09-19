import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Clock3, LayoutDashboard, LogOut, Moon, PlusCircle, Sliders, Sun } from 'lucide-react';
import { api } from '../utils/api.js';
import { useTheme } from '../utils/theme.js';
import SettingsModal from './Settings/SettingsModal.jsx';
import FitStartLogo from './FitStartLogo.jsx';

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
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-white/70 text-surface-600 shadow-subtle backdrop-blur transition-all hover:bg-white hover:text-surface-950 dark:border-white/10 dark:bg-black/25 dark:text-surface-300 dark:hover:bg-black/40 dark:hover:text-white"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? <Sun className="h-4 w-4 text-brand-300" /> : <Moon className="h-4 w-4" />}
    </button>
  );

  const desktopLink = ({ isActive }) =>
    `flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-display font-bold transition-all ${
      isActive
        ? 'border border-brand-300/30 bg-brand-300/10 text-brand-300 shadow-subtle'
        : 'text-surface-500 hover:bg-white/65 hover:text-surface-950 dark:text-surface-400 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/65 px-3.5 py-3 shadow-[0_12px_40px_-22px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-black/65 sm:px-5">
        <Link to={user ? '/dashboard' : '/'} className="min-w-0 transition-opacity hover:opacity-85">
          <FitStartLogo />
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur md:flex dark:border-white/10 dark:bg-white/5">
            <NavLink to="/dashboard" className={({ isActive }) => desktopLink({ isActive: isActive || location.pathname.startsWith('/results') })}>
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </NavLink>
            <NavLink to="/history" className={desktopLink}>
              <Clock3 className="h-3.5 w-3.5" /> History
            </NavLink>
            <NavLink to="/assessment" className={desktopLink}>
              <PlusCircle className="h-3.5 w-3.5" /> Assessment
            </NavLink>
            <NavLink to="/glossary" className={desktopLink}>
              <BookOpen className="h-3.5 w-3.5" /> Glossary
            </NavLink>
          </nav>
        )}

        {user ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {themeToggleButton}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-black/5 bg-white/70 text-surface-600 shadow-subtle backdrop-blur transition-all hover:bg-white hover:text-surface-950 sm:flex dark:border-white/10 dark:bg-black/25 dark:text-surface-300 dark:hover:bg-black/40 dark:hover:text-white"
              title="Application settings"
            >
              <Sliders className="h-4 w-4" />
            </button>
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white/70 p-1 pr-2.5 shadow-subtle backdrop-blur transition-all hover:bg-white dark:border-white/10 dark:bg-black/25 dark:hover:bg-black/40"
              title="View profile"
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-brand-300 text-xs font-black text-surface-950">
                {user.avatar?.startsWith('data:') || user.avatar?.startsWith('http') ? (
                  <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  user.firstName?.[0] || 'F'
                )}
              </span>
              <span className="hidden max-w-[90px] truncate text-xs font-display font-bold text-surface-800 dark:text-surface-100 sm:block">{user.firstName || 'Member'}</span>
            </Link>
            <button onClick={handleLogoutClick} className="hidden h-9 w-9 items-center justify-center rounded-xl text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:flex dark:hover:bg-red-950/30" title="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <nav className="flex min-w-0 items-center gap-1.5 sm:gap-2" aria-label="Public navigation">
            {themeToggleButton}
            <Link to="/login" className="hidden rounded-xl px-3 py-2 text-xs font-display font-bold text-surface-600 transition-colors hover:text-surface-950 dark:text-surface-300 dark:hover:text-white sm:inline-flex">Login</Link>
            <Link to="/signup" className="shrink-0 rounded-xl bg-brand-300 px-4 py-2.5 text-xs font-display font-black text-surface-950 shadow-sm transition-all hover:bg-brand-200 active:scale-95">Register</Link>
          </nav>
        )}
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} user={user} />
    </header>
  );
}
