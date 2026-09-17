import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User, MapPin, LogOut } from 'lucide-react';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      // Регистрация
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: fullName } // Supabase автоматически не пишет в profiles, нужно делать через триггер или руками
        }
      });
      
      if (signUpError) {
        setError(signUpError.message);
      } else if (data.user) {
        // Создаем профиль студента
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          role: 'student'
        });
        if (profileError) setError(profileError.message);
      }
    }
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300 px-4">
        <div className="glass-card p-6 md:p-8 rounded-3xl w-full max-w-sm">
          <h2 className="text-2xl font-black mb-6 text-center text-slate-800 dark:text-white">
            {isLogin ? 'Вход для студентов' : 'Регистрация'}
          </h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-600 dark:text-slate-300">ФИО</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Иванов Иван Иванович"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-600 dark:text-slate-300">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="student@ist.kg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-600 dark:text-slate-300">Пароль (минимум 6 символов)</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
                minLength={6}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold p-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 active:scale-95"
            >
              {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {isLogin ? 'У меня еще нет аккаунта' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 pb-8 px-2 max-w-lg mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">
                {profile?.full_name || 'Студент'}
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md uppercase tracking-wider">
                {profile?.role === 'admin' ? 'Староста / Админ' : 'Студент'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
            title="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Как работают отметки
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Теперь вы можете отмечаться на парах прямо с телефона. Для этого нужно находиться <b>не дальше 250 метров</b> от университета. Кнопка «Я на паре» появляется на карточке текущего занятия.
          </p>
        </div>
      </div>
    </div>
  );
}
