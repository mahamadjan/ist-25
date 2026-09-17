import { CalendarDays, Home, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Сегодня' },
    { to: '/week', icon: CalendarDays, label: 'Неделя' },
    { to: '/profile', icon: UserRound, label: 'Профиль' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav pb-safe z-50">
      <ul className="flex items-center justify-around p-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 relative',
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl -z-10 animate-in zoom-in duration-200" />
                  )}
                  <Icon className={cn("w-6 h-6 mb-1 transition-transform duration-300", isActive && "scale-110")} />
                  <span className={cn("text-[10px] font-bold transition-all duration-300", isActive ? "opacity-100" : "opacity-70")}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
