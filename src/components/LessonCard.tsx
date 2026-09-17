import { MapPin, User } from 'lucide-react';
import { getLessonStatus, cn } from '../lib/utils';
import { Database } from '../types/supabase';
import { useEffect, useState } from 'react';

type Lesson = Database['public']['Tables']['schedule']['Row'];

interface LessonCardProps {
  lesson: Lesson;
  isToday?: boolean;
  index?: number;
}

export default function LessonCard({ lesson, isToday = false, index = 0 }: LessonCardProps) {
  const [status, setStatus] = useState<'ongoing' | 'completed' | 'upcoming' | string>('upcoming');

  useEffect(() => {
    if (!isToday) return;
    const updateStatus = () => setStatus(getLessonStatus(lesson.start_time, lesson.end_time));
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [lesson, isToday]);

  const staggerClass = `stagger-${Math.min(index + 1, 5)}`;

  return (
    <div className={cn(
      "glass-card p-5 mb-5 transition-all duration-300 animate-lesson-card relative overflow-hidden group",
      staggerClass,
      isToday && status === 'ongoing' && "ring-2 ring-emerald-400 shadow-[0_8px_30px_rgba(16,185,129,0.2)] transform scale-[1.02]",
      isToday && status === 'completed' && "opacity-50 grayscale hover:grayscale-0"
    )}>
      
      {/* Мягкое фоновое свечение для текущей пары */}
      {isToday && status === 'ongoing' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-black text-lg border border-emerald-100 dark:border-emerald-800/50">
            {lesson.lesson_number}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {lesson.start_time.slice(0, 5)}
            </span>
            <span className="text-xs font-medium text-slate-400">
              до {lesson.end_time.slice(0, 5)}
            </span>
          </div>
        </div>
        
        {isToday && status === 'ongoing' && (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-emerald-500 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-emerald-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            Идёт сейчас
          </span>
        )}
        
        {isToday && status.startsWith('Через') && (
          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        )}

        {isToday && status === 'completed' && (
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Завершено
          </span>
        )}
      </div>

      <h3 className="text-[18px] font-black mb-4 text-slate-800 dark:text-white leading-tight">
        {lesson.subject}
      </h3>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-700">
            <User className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-semibold">{lesson.teacher}</span>
        </div>
        
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-700">
            <MapPin className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="font-semibold">{lesson.room}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg uppercase tracking-wide">
          {lesson.lesson_type}
        </span>
        {lesson.description && (
          <span className="text-[11px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg max-w-[150px] truncate">
            {lesson.description}
          </span>
        )}
      </div>
    </div>
  );
}
