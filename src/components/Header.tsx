import { Leaf, Moon, Sun, UserRound } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass-header px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-[#007AFF] text-white p-2 rounded-xl shadow-sm">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-black dark:text-white leading-tight">
            ИСТ-25
          </h1>
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">
            Расписание
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/profile" className="p-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-gray-300 border border-black/5 dark:border-white/5 shadow-sm hover:opacity-80 transition-all active:scale-95 hidden md:block" title="Профиль">
          <UserRound className="w-5 h-5" />
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-gray-300 border border-black/5 dark:border-white/5 shadow-sm hover:opacity-80 transition-all active:scale-95"
          title="Сменить тему"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
