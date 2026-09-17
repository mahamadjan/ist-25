import { User, Sparkles, Flame, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface AvatarProps {
  url?: string | null;
  name: string;
  points: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAdmin?: boolean;
}

export default function Avatar({ url, name, points, size = 'md', isAdmin = false }: AvatarProps) {
  let tier = 0;
  if (isAdmin || points >= 500) tier = 4; // Легенда (всегда у админа)
  else if (points >= 250) tier = 3; // Эксперт
  else if (points >= 100) tier = 2; // Продвинутый
  else if (points >= 50) tier = 1; // Любитель

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  const imgSizeClasses = {
    sm: 'w-[36px] h-[36px] text-sm',
    md: 'w-[56px] h-[56px] text-xl',
    lg: 'w-[72px] h-[72px] text-3xl',
    xl: 'w-[102px] h-[102px] text-5xl'
  };

  let wrapperClass = '';
  let badge = null;
  let effect = null;

  switch (tier) {
    case 1:
      wrapperClass = 'bg-gradient-to-tr from-green-400 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] p-[2px]';
      break;
    case 2:
      wrapperClass = 'bg-gradient-to-tr from-blue-400 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] p-[3px]';
      badge = <Zap className="absolute -bottom-1 -right-1 w-5 h-5 text-cyan-400 fill-cyan-400 drop-shadow-md z-20" />;
      break;
    case 3:
      wrapperClass = 'bg-gradient-to-tr from-yellow-300 via-amber-500 to-orange-500 shadow-[0_0_25px_rgba(245,158,11,0.6)] p-[4px]';
      badge = <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 fill-yellow-300 drop-shadow-lg z-20 animate-pulse" />;
      break;
    case 4:
      wrapperClass = 'bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-indigo-500 shadow-[0_0_30px_rgba(168,85,247,0.8)] p-[4px]';
      badge = <Flame className="absolute -bottom-2 -right-2 w-7 h-7 text-fuchsia-400 fill-fuchsia-400 drop-shadow-xl z-20 animate-bounce" />;
      effect = <div className="absolute -inset-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full blur-md opacity-60 animate-pulse z-0" />;
      break;
    default:
      wrapperClass = 'bg-slate-200 dark:bg-slate-700 p-[2px]';
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {effect}
      <div className={cn("rounded-full flex items-center justify-center relative z-10", wrapperClass, sizeClasses[size])}>
        {url ? (
          <img 
            src={url} 
            alt={name} 
            className={cn("rounded-full object-cover border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-800", imgSizeClasses[size])} 
          />
        ) : (
          <div className={cn("rounded-full flex items-center justify-center font-black text-slate-400 dark:text-slate-500 border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800", imgSizeClasses[size])}>
            {name ? name.charAt(0).toUpperCase() : <User className="w-1/2 h-1/2" />}
          </div>
        )}
        {badge}
      </div>
    </div>
  );
}
