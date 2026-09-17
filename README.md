# Расписание ИСТ-25

Современное веб-приложение для просмотра расписания группы ИСТ-25.

## 🚀 Запуск проекта

1. **Установите зависимости**
   ```bash
   npm install
   ```

2. **Настройте базу данных (Supabase)**
   - Создайте проект в [Supabase](https://supabase.com).
   - В разделе SQL Editor выполните скрипт из файла плана (implementation_plan.md).
   - Создайте пользователя-администратора (через раздел Authentication -> Users -> Add User).

3. **Настройте переменные окружения**
   - Переименуйте `.env.example` в `.env`.
   - Вставьте ваши `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` (находятся в Supabase -> Project Settings -> API).

4. **Запустите проект**
   ```bash
   npm run dev
   ```

Приложение будет доступно по адресу `http://localhost:5173`.
