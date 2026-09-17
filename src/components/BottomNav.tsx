import { CalendarDays, Home, UserRound, Trophy } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: Home, label: 'Сегодня' },
    { to: '/week', icon: CalendarDays, label: 'Неделя' },
    { to: '/leaderboard', icon: Trophy, label: 'Рейтинг' },
    { to: '/profile', icon: UserRound, label: 'Профиль' },
  ];

  const activeIndex = navItems.findIndex(item => item.to === location.pathname);
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-3xl backdrop-saturate-200 border-t border-black/10 dark:border-white/10 pb-safe z-50 overflow-hidden">
      <div className="relative flex items-center justify-around p-2">
        
        {/* Жидкий скользящий индикатор (Liquid Glass Pill) */}
        <div 
          className="absolute top-2 bottom-2 w-1/4 p-1 z-0 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${currentIndex * 100}%)`, left: 0 }}
        >
          <div className="w-full h-full bg-black/5 dark:bg-white/10 rounded-2xl shadow-sm border border-black/5 dark:border-white/5" />
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1 list-none z-10">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-2 px-1 transition-all duration-300 relative',
                  isActive 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={cn(
                      "w-6 h-6 mb-1 transition-transform duration-300", 
                      isActive ? "text-black dark:text-white scale-110" : "text-[#999999]"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span 
                    className={cn(
                      "text-[10px] font-bold tracking-tight transition-all duration-300", 
                      isActive ? "text-black dark:text-white" : "text-[#999999]"
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </div>
    </nav>
  );
}
