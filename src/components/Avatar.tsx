import { User } from 'lucide-react';
import { cn } from '../lib/utils';
import { getThemeConfig } from '../lib/themes';

interface AvatarProps {
  url?: string | null;
  name: string;
  points: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAdmin?: boolean;
  themeId?: string | null;
}

export default function Avatar({ url, name, points, size = 'md', isAdmin = false, themeId }: AvatarProps) {
  const theme = getThemeConfig(themeId, points, isAdmin);

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

  return (
    <div className="relative inline-flex items-center justify-center">
      {theme.effect}
      <div className={cn("rounded-full flex items-center justify-center relative z-10", theme.avatarWrapperClass, sizeClasses[size])}>
        {theme.avatarRingClass && <div className={cn(theme.avatarRingClass, "z-0 pointer-events-none")} />}
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
        {theme.badge}
      </div>
    </div>
  );
}
