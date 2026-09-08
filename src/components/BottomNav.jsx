import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Clock3, Plus, BookOpen, User } from 'lucide-react';

export default function BottomNav({ user }) {
  const location = useLocation();

  // Guest-First Architecture: Unauthenticated guests have no member bottom dock
  if (!user) {
    return null;
  }

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: Home
    },
    {
      to: '/history',
      label: 'History',
      icon: Clock3
    },
    {
      to: '/assessment',
      label: 'New Assessment',
      icon: Plus,
      highlight: true
    },
    {
      to: '/glossary',
      label: 'Glossary',
      icon: BookOpen
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-surface-900/90 backdrop-blur-lg border-t border-surface-200/80 dark:border-surface-800/80 shadow-card dark:shadow-card-dark font-sans transition-colors duration-200">
      <div className="max-w-md mx-auto grid grid-cols-5 items-end px-2 py-2 safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to === '/dashboard' && location.pathname.startsWith('/results'));

          if (item.highlight) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center -mt-6 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-surface-900 group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-display font-bold text-brand-700 dark:text-brand-300 mt-1">
                  New Scan
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all group active:scale-95
                ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] scale-105' : 'stroke-[1.75]'}`} />
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-display font-bold text-brand-700 dark:text-brand-300' : 'font-medium text-surface-500 dark:text-surface-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-brand-500 dark:bg-brand-400 mt-0.5 animate-fade-in" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
