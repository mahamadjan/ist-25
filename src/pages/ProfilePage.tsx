import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User, MapPin, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setProfileLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setProfileLoaded(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
    setProfileLoaded(true);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    const { error: profileError } = await supabase.from('profiles').insert({
      id: session.user.id,
      full_name: fullName,
      role: 'student'
    });
    if (!profileError) {
      await fetchProfile(session.user.id);
    } else {
      setError(profileError.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginEmail = email.includes('@') ? email : `${email.toLowerCase().trim()}@ist.kg`;

    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    if (error) setError(error.message);
    
    setLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300 px-4">
        <div className="glass-card p-6 md:p-8 rounded-3xl w-full max-w-sm">
          <h2 className="text-2xl font-black mb-6 text-center text-slate-800 dark:text-white">
            Вход для студентов
          </h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-600 dark:text-slate-300">Логин (выдает староста)</label>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Например: aibek"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-600 dark:text-slate-300">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold p-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 active:scale-95"
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!profileLoaded) {
    return <div className="p-8 text-center text-slate-500">Загрузка профиля...</div>;
  }

  if (session && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300 px-4">
        <div className="glass-card p-6 md:p-8 rounded-3xl w-full max-w-sm">
          <h2 className="text-xl font-black mb-4 text-center text-slate-800 dark:text-white">
            Как вас зовут?
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">Пожалуйста, введите ваши имя и фамилию для журнала посещаемости.</p>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">{error}</div>}
          
          <form onSubmit={handleSaveName} className="space-y-4">
            <div>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Иванов Иван"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold p-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 active:scale-95"
            >
              {loading ? 'Сохранение...' : 'Продолжить'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Вы должны выбрать изображение для загрузки.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${session?.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase.from('profiles').update({
        avatar_url: data.publicUrl
      }).eq('id', session?.user.id!);

      if (updateError) {
        throw updateError;
      }

      await fetchProfile(session?.user.id!);
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 pb-8 px-2 max-w-lg mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Аватар" className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 dark:border-emerald-800" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              )}
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-bold text-center p-1">
                Изменить
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>
            
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">
                {profile?.full_name || 'Студент'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md uppercase tracking-wider">
                  {profile?.role === 'admin' ? 'Староста / Админ' : 'Студент'}
                </span>
                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  ⭐ {profile?.points || 0}
                </span>
              </div>
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

        {profile?.role === 'admin' && (
          <div className="mt-4">
            <Link 
              to="/admin" 
              className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold p-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-lg"
            >
              Перейти в Панель управления
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
