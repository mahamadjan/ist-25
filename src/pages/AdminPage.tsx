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
  const [viewingAttendance, setViewingAttendance] = useState<string | null>(null);
  const [attendanceList, setAttendanceList] = useState<{full_name: string, date: string}[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  
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

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdmin(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkAdmin(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    setIsAdmin(data?.role === 'admin');
  };

  useEffect(() => {
    if (session && isAdmin) {
      fetchLessons();
    }
  }, [session, isAdmin]);

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
    const loginEmail = email.includes('@') ? email : `${email.toLowerCase().trim()}@ist.kg`;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
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

  const handleViewAttendance = async (lessonId: string) => {
    if (viewingAttendance === lessonId) {
      setViewingAttendance(null);
      return;
    }
    
    setViewingAttendance(lessonId);
    setAttendanceLoading(true);
    
    // Получаем отметки
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) {
      // Получаем имена студентов вручную, так как прямого FK нет
      const studentIds = data.map(d => d.student_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentIds);
        
      const profileMap: Record<string, string> = {};
      if (profilesData) {
        profilesData.forEach(p => {
          profileMap[p.id] = p.full_name;
        });
      }
      
      setAttendanceList(data.map(item => {
        // Форматируем время из created_at (или fall back на date)
        const checkInTime = item.created_at 
          ? new Date(item.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
          : item.date;

        return {
          date: checkInTime,
          full_name: profileMap[item.student_id] || 'Неизвестный студент'
        };
      }));
    } else {
      setAttendanceList([]);
    }
    
    setAttendanceLoading(false);
  };

  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'attendance'>('edit');
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 7);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300">
        <div className="ios-card p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Вход для старосты</h2>
          {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Логин (без @)</label>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#007AFF] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#007AFF] outline-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-[#007AFF] hover:bg-[#0056b3] text-white font-medium p-3 rounded-xl transition-colors disabled:opacity-70 shadow-md shadow-blue-500/20"
            >
              {authLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300 px-4 text-center">
        <div className="ios-card p-8 w-full max-w-sm border-red-200 dark:border-red-900/30">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Доступ закрыт</h2>
          <p className="text-sm text-slate-500 mb-6">Эта страница доступна только администратору (старосте).</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold p-3 rounded-xl transition-all"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    );
  }

  const handleEditClick = (lesson: Lesson) => {
    handleEdit(lesson);
    setActiveTab('create');
  };

  return (
    <div className="animate-in fade-in duration-300 pb-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Админ Панель</h2>
        <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Выйти">
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar px-2 pb-2">
        <button 
          onClick={() => setActiveTab('edit')} 
          className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'edit' ? 'bg-[#007AFF] text-white shadow-md shadow-blue-500/30' : 'bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/5 text-gray-500'}`}
        >
          Изменить расписание
        </button>
        <button 
          onClick={() => { setActiveTab('create'); setEditingId(null); setFormData(initialForm); }} 
          className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'create' ? 'bg-[#007AFF] text-white shadow-md shadow-blue-500/30' : 'bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/5 text-gray-500'}`}
        >
          Добавить пару
        </button>
        <button 
          onClick={() => setActiveTab('attendance')} 
          className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'attendance' ? 'bg-[#007AFF] text-white shadow-md shadow-blue-500/30' : 'bg-white dark:bg-[#1c1c1e] border border-black/5 dark:border-white/5 text-gray-500'}`}
        >
          Журнал (Кто был)
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="ios-card p-6 mb-8 mx-2">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Редактировать занятие' : 'Создать занятие'}</h3>
          <form onSubmit={(e) => { handleSubmit(e); setActiveTab('edit'); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">День недели</label>
                <select 
                  value={formData.day_of_week} 
                  onChange={e => setFormData({...formData, day_of_week: Number(e.target.value)})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  {[1,2,3,4,5,6,7].map(d => (
                    <option key={d} value={d}>{['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'][d-1]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Номер пары (1-10)</label>
                <input 
                  type="number" min="1" max="10" 
                  value={formData.lesson_number} 
                  onChange={e => setFormData({...formData, lesson_number: Number(e.target.value)})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Время начала</label>
                <input 
                  type="time" 
                  value={formData.start_time} 
                  onChange={e => setFormData({...formData, start_time: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Время окончания</label>
                <input 
                  type="time" 
                  value={formData.end_time} 
                  onChange={e => setFormData({...formData, end_time: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Название предмета</label>
                <input 
                  type="text" 
                  value={formData.subject} 
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Преподаватель</label>
                <input 
                  type="text" 
                  value={formData.teacher} 
                  onChange={e => setFormData({...formData, teacher: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Кабинет</label>
                <input 
                  type="text" 
                  value={formData.room} 
                  onChange={e => setFormData({...formData, room: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Тип занятия</label>
                <select 
                  value={formData.lesson_type} 
                  onChange={e => setFormData({...formData, lesson_type: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  <option>Лекция</option>
                  <option>Практика</option>
                  <option>Лабораторная</option>
                  <option>Экзамен</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Дополнительно (необяз.)</label>
                <input 
                  type="text" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-[#007AFF] hover:bg-[#0056b3] text-white font-medium p-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-md shadow-blue-500/20"
              >
                {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? 'Сохранить' : 'Создать'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setFormData(initialForm); setActiveTab('edit'); }}
                  className="px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-medium rounded-xl transition-colors"
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="space-y-4 px-2">
          {lessons.map(lesson => (
            <div key={lesson.id} className="ios-card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[#007AFF]">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][lesson.day_of_week - 1]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {lesson.start_time.slice(0, 5)} - {lesson.end_time.slice(0, 5)} (Пара {lesson.lesson_number})
                  </span>
                </div>
                <div className="font-black text-lg">{lesson.subject}</div>
                <div className="text-sm text-gray-500">{lesson.teacher} • {lesson.room}</div>
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button onClick={() => handleEditClick(lesson)} className="flex-1 md:flex-none p-3 text-[#007AFF] bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 flex justify-center items-center gap-2 font-bold">
                  <Pencil className="w-5 h-5" /> Изменить
                </button>
                <button onClick={() => handleDelete(lesson)} className="p-3 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 flex justify-center items-center">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {lessons.length === 0 && <p className="text-gray-500 text-center py-8">Расписание пустое.</p>}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="px-2">
          <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
            {[1,2,3,4,5,6,7].map(d => (
              <button 
                key={d}
                onClick={() => { setSelectedDay(d); setViewingAttendance(null); }}
                className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm min-w-[50px] transition-all ${selectedDay === d ? 'bg-[#007AFF] text-white shadow-md' : 'bg-white dark:bg-[#1c1c1e] text-gray-500 border border-black/5 dark:border-white/5'}`}
              >
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][d-1]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {lessons.filter(l => l.day_of_week === selectedDay).length === 0 && (
              <p className="text-gray-500 text-center py-8">В этот день пар нет.</p>
            )}
            {lessons.filter(l => l.day_of_week === selectedDay).map(lesson => (
              <div key={lesson.id} className="ios-card p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-bold text-sm text-gray-500 mb-1">Пара {lesson.lesson_number} ({lesson.start_time.slice(0, 5)})</div>
                    <div className="font-black text-lg leading-tight">{lesson.subject}</div>
                  </div>
                  <button 
                    onClick={() => handleViewAttendance(lesson.id)} 
                    className="p-2.5 px-4 text-[#007AFF] bg-blue-50 dark:bg-blue-900/30 rounded-xl font-bold text-sm"
                  >
                    {viewingAttendance === lesson.id ? 'Скрыть' : 'Посмотреть'}
                  </button>
                </div>
                
                {viewingAttendance === lesson.id && (
                  <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 animate-in slide-in-from-top-2">
                    {attendanceLoading ? (
                      <p className="text-sm text-gray-500 animate-pulse">Загрузка данных...</p>
                    ) : attendanceList.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Пока никто не отмечался.</p>
                    ) : (
                      <ul className="space-y-2">
                        {attendanceList.map((att, i) => (
                          <li key={i} className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50 p-2.5 px-3 rounded-lg">
                            <span className="font-bold">{att.full_name}</span>
                            <span className="text-gray-500 font-medium">{att.date}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
