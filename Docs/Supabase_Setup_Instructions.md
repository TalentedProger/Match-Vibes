# Supabase Setup Instructions

Подробная инструкция по настройке базы данных для MatchVibe.

---

## Шаг 1: Запуск основной схемы базы данных

### 1.1 Откройте Supabase Dashboard

1. Перейдите на https://supabase.com/
2. Войдите в аккаунт
3. Выберите ваш проект MatchVibe

### 1.2 Откройте SQL Editor

1. В левом меню найдите раздел **SQL Editor**
2. Нажмите на него

![SQL Editor Location](https://supabase.com/docs/img/sql-editor-location.png)

### 1.3 Создайте новый запрос

1. Нажмите кнопку **"New query"** (синяя кнопка вверху справа)
2. Или нажмите **"+ New query"** в списке запросов

### 1.4 Выполните схему базы данных

1. Откройте файл `Docs/supabase_schema_safe.sql`
2. Скопируйте **весь** код из файла (Ctrl+A, Ctrl+C)
3. Вставьте в SQL Editor (Ctrl+V)
4. Нажмите кнопку **"Run"** внизу справа (или Ctrl+Enter)

**Ожидаемый результат:**

```
✅ Database schema created/updated successfully!
Created tables: profiles, categories, questions, rooms, responses, results, favorites, achievements, user_achievements
RLS policies configured for Telegram Mini App
```

**Если видите ошибку "already exists":**

- Это нормально! Скрипт безопасен для повторного запуска
- Просто проигнорируйте эти предупреждения

---

## Шаг 2: Загрузка вопросов (Questions Seed)

### 2.1 Откройте новый запрос

1. Снова в **SQL Editor**
2. Нажмите **"+ New query"** для создания нового запроса
3. ⚠️ **Важно:** Не используйте предыдущий запрос, создайте новый!

### 2.2 Вставьте seed данные

1. Откройте файл `Docs/questions_seed.sql`
2. Скопируйте **весь** код (Ctrl+A, Ctrl+C)
3. Вставьте в новый SQL Editor запрос (Ctrl+V)
4. Нажмите **"Run"** (Ctrl+Enter)

**Ожидаемый результат:**

```
✅ Questions seed data inserted successfully!
Total: 75 questions (15 per category × 5 categories)
```

### 2.3 Проверьте загрузку

1. В левом меню выберите **Table Editor**
2. Найдите таблицу **questions**
3. Проверьте, что в таблице **75 строк**

**Проверочный запрос:**

```sql
-- Посчитать вопросы по категориям
SELECT
  c.name as category_name,
  COUNT(q.id) as question_count
FROM categories c
LEFT JOIN questions q ON q.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.order_index;
```

**Должно показать:**

```
Еда и напитки     | 15
Фильмы           | 15
Животные         | 15
Отношения        | 15
Путешествия      | 15
```

---

## Шаг 3: Настройка RLS (Row Level Security)

### 3.1 Проверьте что RLS включен

1. В **Table Editor** выберите любую таблицу (например, `rooms`)
2. Перейдите на вкладку **"Policies"**
3. Убедитесь что **"RLS enabled"** = ✅

### 3.2 Если RLS не включен

Выполните в SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
```

---

## Шаг 4: Настройка Realtime

### 4.1 Включите Realtime для таблиц

1. Перейдите в **Database** → **Replication**
2. Найдите следующие таблицы и включите для них Realtime:
   - ✅ `rooms`
   - ✅ `responses`
   - ✅ `results`

### 4.2 Как включить:

1. Нажмите на переключатель рядом с названием таблицы
2. Должно появиться состояние **"Enabled"** (зеленая галочка)

---

## Шаг 5: Настройка API URL и Keys

### 5.1 Найдите ваши credentials

1. В левом меню выберите **Settings** (⚙️)
2. Перейдите в **API**
3. Скопируйте:
   - **Project URL** (URL проекта)
   - **anon public** (публичный ключ)

### 5.2 Обновите .env.local

Откройте файл `.env.local` в корне проекта и обновите:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ
```

---

## Шаг 6: Проверка подключения

### 6.1 Тестовый запрос

Выполните в SQL Editor:

```sql
-- Test query to check everything works
SELECT
  'Categories' as table_name,
  COUNT(*) as count
FROM categories
UNION ALL
SELECT
  'Questions' as table_name,
  COUNT(*) as count
FROM questions;
```

**Ожидаемый результат:**

```
Categories | 5
Questions  | 75
```

### 6.2 Проверка из приложения

1. Запустите dev сервер: `pnpm dev`
2. Откройте http://localhost:3002
3. Войдите через Telegram
4. Попробуйте создать комнату
5. Выберите любую категорию

**Если всё работает:**

- Категории загружаются ✅
- Вопросы отображаются ✅
- Нет ошибок в консоли ✅

---

## Частые проблемы

### Проблема 1: "Questions not loading" / Медленная загрузка

**Причина:** Индексы не созданы

**Решение:**

```sql
-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(order_index);
```

### Проблема 2: "Permission denied for table questions"

**Причина:** RLS политики не применились

**Решение:**

```sql
-- Drop and recreate policy
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (is_active = TRUE);
```

### Проблема 3: "t.from is not a function"

**Причина:** Проблема с Supabase client в API routes

**Решение:** Уже исправлено - убедитесь что используете `await createClient()`

### Проблема 4: Duplicate key error при повторном запуске

**Причина:** Данные уже существуют

**Решение:**

- Это нормально при повторном запуске
- Используйте `ON CONFLICT DO NOTHING` (уже в скриптах)
- Или удалите данные перед повторной загрузкой:

```sql
DELETE FROM questions;
DELETE FROM categories;
```

Затем запустите скрипты заново.

---

## Проверочный чеклист

После выполнения всех шагов проверьте:

- [ ] Таблицы созданы (9 таблиц)
- [ ] Категории загружены (5 категорий)
- [ ] Вопросы загружены (75 вопросов)
- [ ] RLS включен на всех таблицах
- [ ] Realtime включен для rooms, responses, results
- [ ] API credentials обновлены в .env.local
- [ ] Индексы созданы
- [ ] Тестовый запрос работает
- [ ] Приложение подключается к БД
- [ ] Категории отображаются в приложении
- [ ] Вопросы загружаются без ошибок

---

## Дополнительные команды

### Очистка данных (для тестирования)

```sql
-- Clear all game data (but keep categories and questions)
TRUNCATE responses CASCADE;
TRUNCATE rooms CASCADE;
TRUNCATE results CASCADE;
TRUNCATE profiles CASCADE;
```

### Полный сброс БД (осторожно!)

```sql
-- Drop all tables
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

Затем запустите схему и seed снова.

---

## Контакты для поддержки

Если возникли проблемы:

1. Проверьте логи в Supabase: **Logs** → **Edge Functions**
2. Проверьте консоль браузера на ошибки
3. Проверьте `.env.local` - все переменные заполнены?

**Документация:**

- Supabase: https://supabase.com/docs
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Realtime: https://supabase.com/docs/guides/realtime

---

**Готово! 🎉**

База данных настроена и готова к работе.
