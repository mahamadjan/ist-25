import { cn } from '../lib/utils';
import { format, addDays, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  currentDay: number;
}

export default function DaySelector({ selectedDay, onSelectDay, currentDay }: DaySelectorProps) {
  const days = [1, 2, 3, 4, 5, 6, 7];
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });

  return (
    <div className="flex justify-between items-center gap-2 mb-6 overflow-x-auto hide-scrollbar px-1 py-2">
      {days.map((day) => {
        const dateForDay = addDays(startOfCurrentWeek, day - 1);
        const dayName = format(dateForDay, 'EEEEEE', { locale: ru }).toUpperCase();
        const dateNum = format(dateForDay, 'd');
        
        const isSelected = selectedDay === day;
        const isCurrent = currentDay === day;

        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={cn(
              "relative flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-300 min-w-[48px] border",
              isSelected 
                ? "bg-gradient-to-b from-[#4facfe] to-[#007AFF] text-white border-transparent shadow-[0_4px_15px_rgba(0,122,255,0.4)] transform -translate-y-1" 
                : "bg-white dark:bg-slate-800 border-blue-50 dark:border-slate-700 shadow-sm text-slate-500 hover:border-blue-200",
              !isSelected && isCurrent && "text-[#007AFF] dark:text-[#4facfe] border-blue-200"
            )}
          >
            <span className={cn("text-[10px] font-bold mb-1 tracking-wide", isSelected ? "opacity-90" : "opacity-70")}>
              {dayName}
            </span>
            <span className="text-[15px] font-black">
              {dateNum}
            </span>
            
            {/* Точка для текущего дня */}
            {isCurrent && !isSelected && (
              <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#007AFF] rounded-full shadow-[0_0_8px_rgba(0,122,255,0.8)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
