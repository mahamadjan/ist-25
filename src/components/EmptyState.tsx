import { Coffee } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center text-center mt-8 py-16 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4 shadow-inner">
        <Coffee className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Свободный день!
      </h3>
      <p className="text-sm text-slate-500 font-medium">
        На этот день пар нет, можно отдыхать 🎉
      </p>
    </div>
  );
}
