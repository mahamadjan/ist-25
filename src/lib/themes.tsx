import { ReactNode } from 'react';
import { Zap, Sparkles, Flame, Star, Hexagon, Sprout, Droplets, Flower2 } from 'lucide-react';

export interface ThemeConfig {
  id: string;
  name: string;
  minPoints: number;
  cardClass: string;
  avatarRingClass?: string;
  avatarWrapperClass: string;
  badge?: ReactNode;
  effect?: ReactNode;
}

export const PROFILE_THEMES: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Стандартная',
    minPoints: 0,
    cardClass: 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700',
    avatarWrapperClass: 'bg-slate-200 dark:bg-slate-700 p-[2px]'
  },
  {
    id: 'forest',
    name: 'Лесной дух',
    minPoints: 50,
    cardClass: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800',
    avatarRingClass: 'discord-ring-novice',
    avatarWrapperClass: 'bg-white dark:bg-slate-800 p-[2px]',
    badge: <Sprout className="absolute -bottom-1 -right-1 w-5 h-5 text-emerald-500 fill-emerald-500 drop-shadow-md z-20" />
  },
  {
    id: 'ocean',
    name: 'Океан',
    minPoints: 100,
    cardClass: 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800',
    avatarRingClass: 'discord-ring-regular',
    avatarWrapperClass: 'bg-white dark:bg-slate-800 p-[2px]',
    badge: <Droplets className="absolute -bottom-1 -right-1 w-5 h-5 text-cyan-400 fill-cyan-400 drop-shadow-md z-20" />
  },
  {
    id: 'sakura',
    name: 'Сакура',
    minPoints: 150,
    cardClass: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800',
    avatarRingClass: 'discord-ring-sakura',
    avatarWrapperClass: 'bg-white dark:bg-slate-800 p-[2px]',
    badge: <Flower2 className="absolute -bottom-1 -right-1 w-5 h-5 text-pink-400 fill-pink-400 drop-shadow-md z-20 animate-spin-slow" />
  },
  {
    id: 'cyberpunk',
    name: 'Киберпанк',
    minPoints: 200,
    cardClass: 'bg-slate-900 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] text-white',
    avatarRingClass: 'discord-ring-cyberpunk',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Zap className="absolute -bottom-1 -right-1 w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md z-20" />
  },
  {
    id: 'gold',
    name: 'Золотая элита',
    minPoints: 250,
    cardClass: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700 shadow-[0_0_20px_rgba(250,204,21,0.2)]',
    avatarRingClass: 'discord-ring-expert',
    avatarWrapperClass: 'bg-white dark:bg-slate-800 p-[2px]',
    badge: <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-lg z-20 animate-pulse" />
  },
  {
    id: 'magma',
    name: 'Магма',
    minPoints: 300,
    cardClass: 'bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-950 border-red-400 dark:border-red-700 shadow-[0_0_20px_rgba(239,68,68,0.2)] text-slate-800 dark:text-white',
    avatarRingClass: 'discord-ring-magma',
    avatarWrapperClass: 'bg-white dark:bg-slate-800 p-[2px]',
    badge: <Flame className="absolute -bottom-2 -right-2 w-7 h-7 text-orange-500 fill-orange-500 drop-shadow-xl z-20 animate-bounce" />
  },
  {
    id: 'amethyst',
    name: 'Аметист',
    minPoints: 350,
    cardClass: 'bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/30 border-violet-300 dark:border-violet-700 shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    avatarRingClass: 'discord-ring-amethyst',
    avatarWrapperClass: 'bg-white dark:bg-slate-800 p-[2px]',
    badge: <Hexagon className="absolute -bottom-1 -right-1 w-5 h-5 text-violet-400 fill-violet-400 drop-shadow-md z-20 animate-spin-slow" />
  },
  {
    id: 'cosmic',
    name: 'Космос',
    minPoints: 400,
    cardClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] text-white',
    avatarRingClass: 'discord-ring-cosmic',
    avatarWrapperClass: 'bg-black p-[2px]',
    badge: <Star className="absolute -top-2 -right-1 w-5 h-5 text-blue-300 fill-blue-300 drop-shadow-xl z-20 animate-pulse" />
  },
  {
    id: 'legendary',
    name: 'Неоновый хаос',
    minPoints: 500,
    cardClass: 'bg-slate-900 border-slate-700 relative overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.4)] text-white ring-2 ring-fuchsia-500',
    avatarRingClass: 'discord-ring-legend',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Flame className="absolute -bottom-2 -right-2 w-7 h-7 text-fuchsia-400 fill-fuchsia-400 drop-shadow-xl z-20 animate-bounce" />,
    effect: <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-yellow-500 rounded-full blur-xl opacity-50 animate-pulse z-0" />
  }
];

export const getAvailableThemes = (points: number, isAdmin: boolean) => {
  if (isAdmin) return PROFILE_THEMES;
  return PROFILE_THEMES.filter(t => points >= t.minPoints);
};

export const getThemeConfig = (themeId: string | null | undefined, points: number, isAdmin: boolean) => {
  if (!themeId) return PROFILE_THEMES[0];
  const available = getAvailableThemes(points, isAdmin);
  const theme = available.find(t => t.id === themeId);
  return theme || PROFILE_THEMES[0];
};
