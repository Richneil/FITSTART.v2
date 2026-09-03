import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BookOpen, User } from 'lucide-react';

export default function BottomNav({ user }) {
  const location = useLocation();

  // If user is not logged in and not on glossary, don't show the bottom nav bar
  if (!user && location.pathname !== '/glossary') {
    return null;
  }

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: LayoutDashboard
    },
    {
      to: '/assessment',
      label: 'New Scan',
      icon: PlusCircle,
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-t border-surface-200/90 dark:border-surface-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] font-sans transition-colors duration-200">
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to === '/dashboard' && location.pathname.startsWith('/results'));

          if (item.highlight) {
            return (
              <NavLink
                key={item.to}
                to={user ? item.to : '/login'}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-surface-900 group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-brand-800 dark:text-brand-300 mt-1">
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={user ? item.to : item.to === '/glossary' ? '/glossary' : '/login'}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all min-w-[64px] min-h-[46px] group active:scale-95
                ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-brand-700 dark:text-brand-300' : 'font-semibold text-surface-500 dark:text-surface-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 mt-0.5 animate-fade-in" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
