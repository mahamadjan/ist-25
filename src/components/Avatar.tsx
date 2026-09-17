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
  let customRing = null;

  switch (tier) {
    case 1:
      wrapperClass = 'bg-white dark:bg-slate-800 p-[2px]';
      customRing = <div className="discord-ring-novice z-0 pointer-events-none" />;
      break;
    case 2:
      wrapperClass = 'bg-white dark:bg-slate-800 p-[2px]';
      customRing = <div className="discord-ring-regular z-0 pointer-events-none" />;
      badge = <Zap className="absolute -bottom-1 -right-1 w-5 h-5 text-cyan-400 fill-cyan-400 drop-shadow-md z-20" />;
      break;
    case 3:
      wrapperClass = 'bg-white dark:bg-slate-800 p-[2px]';
      customRing = <div className="discord-ring-expert z-0 pointer-events-none" />;
      badge = <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 fill-yellow-300 drop-shadow-lg z-20 animate-pulse" />;
      break;
    case 4:
      wrapperClass = 'bg-white dark:bg-slate-800 p-[2px]';
      customRing = <div className="discord-ring-legend z-0 pointer-events-none" />;
      badge = <Flame className="absolute -bottom-2 -right-2 w-7 h-7 text-fuchsia-400 fill-fuchsia-400 drop-shadow-xl z-20 animate-bounce" />;
      effect = <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-yellow-500 rounded-full blur-xl opacity-50 animate-pulse z-0" />;
      break;
    default:
      wrapperClass = 'bg-slate-200 dark:bg-slate-700 p-[2px]';
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {effect}
      <div className={cn("rounded-full flex items-center justify-center relative z-10", wrapperClass, sizeClasses[size])}>
        {customRing}
        {url ? (
          <img 
            src={url} 
            alt={name} 
            className={cn("rounded-full object-cover border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-800 relative z-10", imgSizeClasses[size])} 
          />
        ) : (
          <div className={cn("rounded-full flex items-center justify-center font-black text-slate-400 dark:text-slate-500 border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 relative z-10", imgSizeClasses[size])}>
            {name ? name.charAt(0).toUpperCase() : <User className="w-1/2 h-1/2" />}
          </div>
        )}
        {badge}
      </div>
    </div>
  );
}
