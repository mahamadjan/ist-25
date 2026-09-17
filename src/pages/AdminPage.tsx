import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { Database } from '../types/supabase';
import { sendTelegramNotification } from '../lib/telegram';

type Lesson = Database['public']['Tables']['schedule']['Row'];

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialForm = {
    day_of_week: 1,
    lesson_number: 1,
    start_time: '08:30',
    end_time: '09:50',
    subject: '',
    teacher: '',
    room: '',
    lesson_type: 'Лекция',
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchLessons();
    }
  }, [session]);

  const fetchLessons = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('schedule')
      .select('*')
      .order('day_of_week', { ascending: true })
      .order('lesson_number', { ascending: true });
    if (data) setLessons(data);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setAuthLoading(false);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const handleDelete = async (lesson: Lesson) => {
    if (confirm('Вы действительно хотите удалить это занятие?')) {
      await supabase.from('schedule').delete().eq('id', lesson.id);
      
      const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      const descText = lesson.description ? `\nℹ️ Дополнительно: <i>${lesson.description}</i>` : '';
      await sendTelegramNotification(
        `🚨 <b>Отмена пары</b>\n\nУдалено занятие: <b>${lesson.subject}</b>\n📅 ${days[lesson.day_of_week - 1]}, ${lesson.start_time.slice(0, 5)}${descText}`
      );
      
      fetchLessons();
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setFormData({
      day_of_week: lesson.day_of_week,
      lesson_number: lesson.lesson_number,
      start_time: lesson.start_time.slice(0, 5),
      end_time: lesson.end_time.slice(0, 5),
      subject: lesson.subject,
      teacher: lesson.teacher,
      room: lesson.room,
      lesson_type: lesson.lesson_type,
      description: lesson.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const descText = formData.description ? `\nℹ️ Дополнительно: <i>${formData.description}</i>` : '';
    
    if (editingId) {
      await supabase.from('schedule').update(formData as any).eq('id', editingId);
      await sendTelegramNotification(
        `🔄 <b>Изменение в расписании</b>\n\nИзменено занятие: <b>${formData.subject}</b>\n📅 ${days[formData.day_of_week - 1]}, ${formData.start_time}\n📍 Кабинет: ${formData.room}${descText}`
      );
    } else {
      await supabase.from('schedule').insert([formData as any]);
      await sendTelegramNotification(
        `✅ <b>Новая пара</b>\n\nДобавлено занятие: <b>${formData.subject}</b>\n📅 ${days[formData.day_of_week - 1]}, ${formData.start_time}\n👨‍🏫 Преподаватель: ${formData.teacher}\n📍 Кабинет: ${formData.room}${descText}`
      );
    }
    
    setEditingId(null);
    setFormData(initialForm);
    fetchLessons();
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300">
        <div className="glass-card p-8 rounded-3xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Вход в панель</h2>
          {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-xl transition-colors disabled:opacity-70"
            >
              {authLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 pb-8">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">АДМИН-ПАНЕЛЬ</h2>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="hidden md:inline">Выйти</span>
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl mb-8">
        <h3 className="text-lg font-bold mb-4">{editingId ? 'Редактировать занятие' : 'Добавить занятие'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">День недели</label>
              <select 
                value={formData.day_of_week} 
                onChange={e => setFormData({...formData, day_of_week: Number(e.target.value)})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {[1,2,3,4,5,6,7].map(d => (
                  <option key={d} value={d}>{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][d-1]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Номер пары</label>
              <input 
                type="number" min="1" max="10" 
                value={formData.lesson_number} 
                onChange={e => setFormData({...formData, lesson_number: Number(e.target.value)})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Время начала</label>
              <input 
                type="time" 
                value={formData.start_time} 
                onChange={e => setFormData({...formData, start_time: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Время окончания</label>
              <input 
                type="time" 
                value={formData.end_time} 
                onChange={e => setFormData({...formData, end_time: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Название предмета</label>
              <input 
                type="text" 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Преподаватель</label>
              <input 
                type="text" 
                value={formData.teacher} 
                onChange={e => setFormData({...formData, teacher: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Кабинет</label>
              <input 
                type="text" 
                value={formData.room} 
                onChange={e => setFormData({...formData, room: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Тип занятия</label>
              <select 
                value={formData.lesson_type} 
                onChange={e => setFormData({...formData, lesson_type: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option>Лекция</option>
                <option>Практика</option>
                <option>Лабораторная</option>
                <option>Экзамен</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Дополнительно (необяз.)</label>
              <input 
                type="text" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? 'Сохранить изменения' : 'Добавить занятие'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setFormData(initialForm); }}
                className="px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium rounded-xl transition-colors"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold px-2">Существующие занятия</h3>
        {lessons.map(lesson => (
          <div key={lesson.id} className="glass-card p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][lesson.day_of_week - 1]}
                </span>
                <span className="text-sm text-slate-500">
                  {lesson.start_time.slice(0, 5)} - {lesson.end_time.slice(0, 5)} (Пара {lesson.lesson_number})
                </span>
              </div>
              <div className="font-medium">{lesson.subject}</div>
              <div className="text-sm text-slate-500">{lesson.teacher} • {lesson.room}</div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => handleEdit(lesson)} className="flex-1 md:flex-none p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 flex justify-center items-center">
                <Pencil className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(lesson)} className="flex-1 md:flex-none p-2 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 flex justify-center items-center">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
