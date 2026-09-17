import { CalendarDays, Home, UserRound, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Сегодня' },
    { to: '/week', icon: CalendarDays, label: 'Неделя' },
    { to: '/leaderboard', icon: Trophy, label: 'Рейтинг' },
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
                  'flex flex-col items-center justify-center py-2 px-1 transition-all duration-300 relative',
                  isActive 
                    ? 'text-[#007AFF] dark:text-[#0a84ff]' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-6 h-6 mb-1 transition-transform duration-300", isActive && "scale-105")} />
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
