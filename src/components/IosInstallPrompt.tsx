import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export default function IosInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Проверяем, это iOS устройство?
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Проверяем, установлено ли уже приложение (standalone mode)
    const isStandalone = () => {
      return ('standalone' in window.navigator) && (window.navigator as any).standalone;
    };

    // Проверяем, показывали ли мы уже подсказку сегодня
    const hasSeenPrompt = localStorage.getItem('ios_install_prompt');
    const today = new Date().toDateString();

    if (isIos() && !isStandalone() && hasSeenPrompt !== today) {
      // Показываем подсказку с небольшой задержкой
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('ios_install_prompt', new Date().toDateString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-blue-100 dark:border-blue-900/30 p-4 rounded-2xl shadow-2xl relative">
        <button 
          onClick={dismissPrompt}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="font-bold text-slate-800 dark:text-white mb-2 pr-6">
          Установите приложение 📱
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-tight">
          Добавьте расписание на домашний экран, чтобы открывать его в один клик без браузера!
        </p>
        
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
          1. Нажмите <Share className="w-5 h-5 text-blue-500 mx-1 inline" /> внизу<br />
          2. Выберите «На экран "Домой"» <PlusSquare className="w-4 h-4 mx-1 inline" />
        </div>
        
        {/* Треугольник, указывающий вниз на кнопку поделиться в Safari */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-b border-r border-blue-100 dark:border-blue-900/30 rotate-45" />
      </div>
    </div>
  );
}
