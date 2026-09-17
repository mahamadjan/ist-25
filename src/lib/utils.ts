import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getLessonStatus(startTime: string, endTime: string) {
  const now = new Date();
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (now >= start && now <= end) {
    return 'ongoing'; // Сейчас идет
  }
  
  if (now < start) {
    const diffMs = start.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 60) {
      return `Через ${diffMins} мин`;
    }
  }

  if (now > end) {
    return 'completed'; // Завершено
  }

  return 'upcoming';
}
