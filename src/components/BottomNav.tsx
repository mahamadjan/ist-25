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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-3xl backdrop-saturate-200 border-t border-black/10 dark:border-white/10 pb-safe z-50">
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
                  <Icon 
                    className={cn(
                      "w-6 h-6 mb-1", 
                      isActive ? "text-[#007AFF] dark:text-[#0a84ff]" : "text-[#999999]"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span 
                    className={cn(
                      "text-[10px] font-medium tracking-tight", 
                      isActive ? "text-[#007AFF] dark:text-[#0a84ff]" : "text-[#999999]"
                    )}
                  >
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
