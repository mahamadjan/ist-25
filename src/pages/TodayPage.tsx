import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import DaySelector from '../components/DaySelector';
import LessonCard from '../components/LessonCard';
import EmptyState from '../components/EmptyState';
import SkeletonLoading from '../components/SkeletonLoading';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Lesson = Database['public']['Tables']['schedule']['Row'];

export default function TodayPage() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<Lesson[]>([]);
  
  const currentDayOfWeek = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  }, []);
  
  const [selectedDay, setSelectedDay] = useState<number>(currentDayOfWeek);

  const fetchSchedule = async (day: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedule')
        .select('*')
        .eq('day_of_week', day)
        .order('lesson_number', { ascending: true });
        
      if (error) throw error;
      setSchedule(data || []);
    } catch (err) {
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(selectedDay);
  }, [selectedDay]);

  const isViewingToday = selectedDay === currentDayOfWeek;

  const displayTitle = isViewingToday 
    ? 'Сегодня' 
    : format(new Date().setDate(new Date().getDate() - currentDayOfWeek + selectedDay), 'EEEE', { locale: ru });
    
  const displayDate = isViewingToday
    ? format(new Date(), 'd MMMM', { locale: ru })
    : format(new Date().setDate(new Date().getDate() - currentDayOfWeek + selectedDay), 'd MMMM', { locale: ru });

  return (
    <div className="pb-4">
      <div className="mb-6 px-1 flex flex-col md:flex-row md:items-end justify-between gap-1">
        <h2 className="text-3xl font-black capitalize tracking-tight text-slate-800 dark:text-white">
          {displayTitle}
        </h2>
        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wide">{displayDate}</p>
      </div>

      <DaySelector 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay} 
        currentDay={currentDayOfWeek}
      />

      <div className="mt-2 pb-8">
        {loading ? (
          <SkeletonLoading />
        ) : schedule.length > 0 ? (
          schedule.map((lesson, index) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              isToday={isViewingToday} 
              index={index}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
