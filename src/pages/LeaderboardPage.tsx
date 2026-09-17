import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Database } from '../types/supabase';
import { cn } from '../lib/utils';
import Avatar from '../components/Avatar';

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

  const getCardStyle = (index: number, isMe: boolean) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700/50';
    if (index === 1) return 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 border-slate-200 dark:border-slate-700/50';
    if (index === 2) return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200/50 dark:border-amber-700/30';
    return isMe ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Trophy className="w-12 h-12 text-slate-300 animate-bounce mb-4" />
        <p className="text-slate-500 font-medium">Загрузка рейтинга...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 pb-20 px-2 max-w-lg mx-auto">
      <div className="text-center mb-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-2 relative z-10 drop-shadow-md" />
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Рейтинг</h1>
        <p className="text-slate-500 font-medium text-sm">Топ студентов по посещаемости</p>
      </div>

      <div className="space-y-3">
        {students.map((student, index) => {
          const isMe = student.id === currentUserId;
          return (
            <div 
              key={student.id} 
              className={cn(
                "p-4 rounded-2xl flex items-center gap-4 transition-all border",
                getCardStyle(index, isMe),
                isMe && "ring-2 ring-blue-500 shadow-md shadow-blue-500/10 transform scale-[1.02]"
              )}
            >
              <div className="flex items-center justify-center w-8">
                {getRankBadge(index)}
              </div>
              
              <Avatar 
                url={student.avatar_url} 
                name={student.full_name} 
                points={student.points || 0} 
                size="md" 
                isAdmin={student.role === 'admin'} 
              />
              
              <div className="flex-1 min-w-0 ml-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-800 dark:text-white leading-tight">
                    {student.full_name}
                  </h3>
                  {isMe && (
                    <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Вы
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {student.role === 'admin' ? 'Староста' : 'Студент'}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-black text-emerald-500">{student.points || 0}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Очков</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
