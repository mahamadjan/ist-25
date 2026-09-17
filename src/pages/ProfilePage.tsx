import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { LogOut, CheckCircle2, MapPin, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Database } from '../types/supabase';
import Avatar from '../components/Avatar';
import { getThemeConfig, getAvailableThemes, PROFILE_THEMES } from '../lib/themes';

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

  const handleSelectTheme = async (themeId: string) => {
    if (!profile || !session) return;
    setProfile({ ...profile, theme_id: themeId }); // Optimistic update
    
    await supabase.from('profiles').update({
      theme_id: themeId
    }).eq('id', session.user.id);
  };

  const currentTheme = getThemeConfig(profile?.theme_id, profile?.points || 0, profile?.role === 'admin');
  const availableThemes = getAvailableThemes(profile?.points || 0, profile?.role === 'admin');

  return (
    <div className="animate-in fade-in duration-300 pb-8 px-2 max-w-lg mx-auto">
      <div className={`p-6 md:p-8 rounded-3xl mb-8 relative transition-all duration-500 border ${currentTheme.cardClass}`}>
        {currentTheme.cardEffect}
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative group z-10">
              <Avatar 
                url={profile?.avatar_url} 
                name={profile?.full_name || 'Студент'} 
                points={profile?.points || 0} 
                size="lg" 
                isAdmin={profile?.role === 'admin'} 
                themeId={profile?.theme_id}
              />
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-bold text-center p-1 z-20">
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
            
            <div className="relative z-10">
              <h2 className="text-xl font-black leading-tight mb-1">
                {profile?.full_name || 'Студент'}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-bold bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm">
                  {profile?.role === 'admin' ? 'Староста / Админ' : 'Студент'}
                </span>
                <span className="text-xs font-bold bg-black/10 dark:bg-white/10 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm">
                  ⭐ {profile?.points || 0}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 opacity-50 hover:opacity-100 hover:bg-red-500/20 text-red-500 rounded-xl transition-all z-10 relative"
            title="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 relative z-10">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Как работают отметки
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Теперь вы можете отмечаться на парах прямо с телефона. Для этого нужно находиться <b>не дальше 250 метров</b> от университета. За каждую отметку вы получаете очки рейтинга.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 mt-4 relative z-10">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Оформление профиля
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Темы открываются за очки рейтинга. Выберите тему, чтобы применить её к своей карточке!
          </p>
          
          <div className="space-y-2">
            {PROFILE_THEMES.map(theme => {
              const isUnlocked = availableThemes.some(t => t.id === theme.id);
              const isActive = profile?.theme_id === theme.id || (!profile?.theme_id && theme.id === 'default');
              
              return (
                <button
                  key={theme.id}
                  onClick={() => isUnlocked && handleSelectTheme(theme.id)}
                  disabled={!isUnlocked}
                  className={cn(
                    "w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all relative overflow-hidden",
                    theme.cardClass,
                    !isUnlocked && "opacity-75 grayscale-[50%] hover:grayscale-0 cursor-not-allowed",
                    isActive && "ring-2 ring-white/80 scale-[1.02] shadow-lg"
                  )}
                >
                  {theme.cardEffect}
                  
                  <div className="flex-shrink-0 relative z-10">
                    <Avatar 
                      name={profile?.full_name?.charAt(0) || 'С'} 
                      points={isUnlocked ? theme.minPoints : 0} 
                      size="sm" 
                      isAdmin={false} 
                      themeId={theme.id} 
                    />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm leading-tight drop-shadow-sm">{theme.name}</span>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-md" />}
                      </div>
                      
                      {!isUnlocked && (
                        <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                          <span className="text-[10px] font-bold uppercase text-white tracking-wider drop-shadow-md">
                            {theme.minPoints} очков
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {profile?.role === 'admin' && (
          <div className="mt-4 relative z-10">
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
