import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import LessonCard from '../components/LessonCard';
import SkeletonLoading from '../components/SkeletonLoading';

type Lesson = Database['public']['Tables']['schedule']['Row'];

const DAYS = [
  { id: 1, name: 'ПОНЕДЕЛЬНИК' },
  { id: 2, name: 'ВТОРНИК' },
  { id: 3, name: 'СРЕДА' },
  { id: 4, name: 'ЧЕТВЕРГ' },
  { id: 5, name: 'ПЯТНИЦА' },
  { id: 6, name: 'СУББОТА' },
  { id: 7, name: 'ВОСКРЕСЕНЬЕ' },
];

export default function WeekPage() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<Record<number, Lesson[]>>({});

  useEffect(() => {
    const fetchWeekSchedule = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('schedule')
          .select('*')
          .order('day_of_week', { ascending: true })
          .order('lesson_number', { ascending: true });

        if (error) throw error;

        const grouped = (data || []).reduce((acc, lesson) => {
          if (!acc[lesson.day_of_week]) acc[lesson.day_of_week] = [];
          acc[lesson.day_of_week].push(lesson);
          return acc;
        }, {} as Record<number, Lesson[]>);

        setSchedule(grouped);
      } catch (err) {
        console.error('Error fetching week schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekSchedule();
  }, []);

  return (
    <div className="pb-8">
      <h2 className="text-3xl font-black mb-8 px-1 tracking-tight text-slate-800 dark:text-white">
        Вся неделя
      </h2>
      
      {loading ? (
        <SkeletonLoading />
      ) : (
        <div className="space-y-10">
          {DAYS.map((day) => {
            const dayLessons = schedule[day.id] || [];
            
            if (dayLessons.length === 0) return null;
            
            return (
              <div key={day.id} className="animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xs font-black text-emerald-500 dark:text-emerald-400 mb-4 px-2 tracking-[0.2em]">
                  {day.name}
                </h3>
                <div className="space-y-4">
                  {dayLessons.map((lesson, index) => (
                    <LessonCard key={lesson.id} lesson={lesson} isToday={false} index={index} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {Object.keys(schedule).length === 0 && (
            <div className="text-center py-16 text-slate-500 glass-card">
              Расписание на неделю пусто.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
