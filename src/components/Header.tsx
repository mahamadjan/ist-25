import { Leaf, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass-header px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/30">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            ИСТ-25
          </h1>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
            Расписание
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/admin" className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-emerald-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all active:scale-95 hidden md:block" title="Настройки">
          <Settings className="w-5 h-5" />
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all active:scale-95"
          title="Сменить тему"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
