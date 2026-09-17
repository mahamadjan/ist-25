import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Database } from '../types/supabase';
import { cn } from '../lib/utils';
import Avatar from '../components/Avatar';
import { getThemeConfig } from '../lib/themes';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function LeaderboardPage() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setCurrentUserId(data.session?.user.id || null));
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false });
    
    if (data) setStudents(data);
    setLoading(false);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-slate-400 font-bold w-6 text-center">{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Trophy className="w-12 h-12 text-slate-300 animate-bounce mb-4" />
        <p className="text-slate-500 font-medium">Загрузка рейтинга...</p>
      </div>
    );
  }

  const handleUpdatePoints = async (userId: string, currentPoints: number, change: number) => {
    const newPoints = Math.max(0, currentPoints + change);
    // Optimistic update
    setStudents(students.map(s => s.id === userId ? { ...s, points: newPoints } : s));
    
    await supabase.from('profiles').update({ points: newPoints }).eq('id', userId);
    // Re-fetch to guarantee correct order
    fetchLeaderboard();
  };

  const currentUser = students.find(s => s.id === currentUserId);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="animate-in fade-in duration-300 pb-20 px-2 max-w-lg mx-auto">
      <div className="text-center mb-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-2 relative z-10 drop-shadow-md" />
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Рейтинг</h1>
        <p className="text-slate-500 font-medium text-sm">Топ студентов по посещаемости</p>
      </div>

      <div className="space-y-4">
        {students.map((student, index) => {
          const isMe = student.id === currentUserId;
          const theme = getThemeConfig(student.theme_id, student.points || 0, student.role === 'admin');
          return (
            <div 
              key={student.id} 
              className={cn(
                "p-4 rounded-2xl flex items-center gap-4 transition-all border relative overflow-hidden group",
                theme.cardClass,
                isMe && "ring-2 ring-white/50 shadow-lg transform scale-[1.02]"
              )}
            >
              {theme.cardEffect}
              
              <div className="flex items-center justify-center w-8 relative z-10">
                {getRankBadge(index)}
              </div>
              
              <div className="relative z-10">
                <Avatar 
                  url={student.avatar_url} 
                  name={student.full_name} 
                  points={student.points || 0} 
                  size="md" 
                  isAdmin={student.role === 'admin'} 
                  themeId={student.theme_id}
                />
              </div>
              
              <div className="flex-1 min-w-0 ml-2 relative z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold leading-tight">
                    {student.full_name}
                  </h3>
                  {isMe && (
                    <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Вы
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium opacity-70">
                  {student.role === 'admin' ? 'Староста' : 'Студент'}
                </div>
              </div>
              
              <div className="text-right relative z-10 flex flex-col items-end justify-center">
                <div className="text-xl font-black drop-shadow-sm">{student.points || 0}</div>
                <div className="text-[10px] uppercase font-bold opacity-70 tracking-wider">Очков</div>
                
                {isAdmin && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex flex-col gap-1 bg-black/50 backdrop-blur-md p-1 rounded-xl">
                    <button 
                      onClick={() => handleUpdatePoints(student.id, student.points || 0, 10)}
                      className="w-8 h-8 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-bold shadow-lg active:scale-95 transition-all"
                      title="Добавить 10 очков"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handleUpdatePoints(student.id, student.points || 0, -10)}
                      className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-400 text-white rounded-lg font-bold shadow-lg active:scale-95 transition-all"
                      title="Убрать 10 очков"
                    >
                      -
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
