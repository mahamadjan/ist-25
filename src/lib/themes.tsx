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
    cardClass: 'bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 text-white theme-bg-slow border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    avatarRingClass: 'discord-ring-novice',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Sprout className="absolute -bottom-1 -right-1 w-5 h-5 text-emerald-500 fill-emerald-500 drop-shadow-md z-20" />
  },
  {
    id: 'ocean',
    name: 'Океан',
    minPoints: 100,
    cardClass: 'bg-gradient-to-r from-cyan-950 via-blue-900 to-cyan-950 text-white theme-bg-slow border-cyan-500/30 ring-1 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
    avatarRingClass: 'discord-ring-regular',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Droplets className="absolute -bottom-1 -right-1 w-5 h-5 text-cyan-400 fill-cyan-400 drop-shadow-md z-20" />
  },
  {
    id: 'sakura',
    name: 'Сакура',
    minPoints: 150,
    cardClass: 'bg-gradient-to-r from-rose-950 via-pink-900 to-rose-950 text-white theme-bg-slow border-pink-500/30 ring-1 ring-pink-500/20 shadow-[0_0_15px_rgba(244,114,182,0.1)]',
    avatarRingClass: 'discord-ring-sakura',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Flower2 className="absolute -bottom-1 -right-1 w-5 h-5 text-pink-400 fill-pink-400 drop-shadow-md z-20 animate-spin-slow" />
  },
  {
    id: 'cyberpunk',
    name: 'Киберпанк',
    minPoints: 200,
    cardClass: 'bg-gradient-to-r from-slate-900 via-fuchsia-950 to-slate-900 text-white theme-bg-animated border-fuchsia-500/50 ring-1 ring-cyan-500/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]',
    avatarRingClass: 'discord-ring-cyberpunk',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Zap className="absolute -bottom-1 -right-1 w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-md z-20" />
  },
  {
    id: 'gold',
    name: 'Золотая элита',
    minPoints: 250,
    cardClass: 'bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 text-white theme-bg-slow border-yellow-500/40 ring-1 ring-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.2)]',
    avatarRingClass: 'discord-ring-expert',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-lg z-20 animate-pulse" />
  },
  {
    id: 'magma',
    name: 'Магма',
    minPoints: 300,
    cardClass: 'bg-gradient-to-r from-red-950 via-orange-900 to-red-950 text-white theme-bg-animated border-orange-500/40 ring-1 ring-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    avatarRingClass: 'discord-ring-magma',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Flame className="absolute -bottom-2 -right-2 w-7 h-7 text-orange-500 fill-orange-500 drop-shadow-xl z-20 animate-bounce" />
  },
  {
    id: 'amethyst',
    name: 'Аметист',
    minPoints: 350,
    cardClass: 'bg-gradient-to-r from-violet-950 via-purple-900 to-violet-950 text-white theme-bg-slow border-violet-500/40 ring-1 ring-fuchsia-500/20 shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    avatarRingClass: 'discord-ring-amethyst',
    avatarWrapperClass: 'bg-slate-900 p-[2px]',
    badge: <Hexagon className="absolute -bottom-1 -right-1 w-5 h-5 text-violet-400 fill-violet-400 drop-shadow-md z-20 animate-spin-slow" />
  },
  {
    id: 'cosmic',
    name: 'Космос',
    minPoints: 400,
    cardClass: 'bg-gradient-to-tr from-indigo-950 via-slate-900 to-black text-white theme-bg-slow border-indigo-500/40 ring-1 ring-blue-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]',
    avatarRingClass: 'discord-ring-cosmic',
    avatarWrapperClass: 'bg-black p-[2px]',
    badge: <Star className="absolute -top-2 -right-1 w-5 h-5 text-blue-300 fill-blue-300 drop-shadow-xl z-20 animate-pulse" />
  },
  {
    id: 'legendary',
    name: 'Неоновый хаос',
    minPoints: 500,
    cardClass: 'bg-slate-900 border-transparent bg-clip-border relative before:absolute before:inset-0 before:p-[2px] before:bg-gradient-to-r before:from-fuchsia-500 before:via-cyan-500 before:to-yellow-500 before:-z-10 before:rounded-2xl before:theme-bg-animated shadow-[0_0_30px_rgba(217,70,239,0.4)] text-white',
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
