import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Clock3, Home, Plus, User } from 'lucide-react';

export default function BottomNav({ user }) {
  const location = useLocation();
  if (!user) return null;

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/history', label: 'History', icon: Clock3 },
    { to: '/assessment', label: 'Assess', icon: Plus },
    { to: '/glossary', label: 'Glossary', icon: BookOpen },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="bottom-dock fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-[470px] rounded-[26px] border border-white/10 bg-black/70 p-1.5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.38)] backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-black/70">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to === '/dashboard' && location.pathname.startsWith('/results'));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex min-h-[56px] flex-col items-center justify-center rounded-[20px] px-1 py-2 transition-all active:scale-95 ${
                isActive
                  ? 'border border-brand-300/30 bg-brand-300/10 text-brand-300 shadow-subtle'
                  : 'text-surface-400 hover:bg-white/60 hover:text-surface-800 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className={`mt-1 text-[9px] tracking-tight ${isActive ? 'font-display font-black' : 'font-medium'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
