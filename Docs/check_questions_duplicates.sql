-- Проверка дубликатов вопросов в базе данных
-- Запустить в Supabase SQL Editor для анализа проблемы дублирования

-- 1. Проверка общего количества вопросов
SELECT 
  'Всего вопросов в базе' as description,
  COUNT(*) as count
FROM questions
WHERE is_active = true;

-- 2. Проверка дубликатов по тексту
SELECT 
  text,
  COUNT(*) as duplicate_count,
  array_agg(id) as question_ids,
  array_agg(subcategory_id) as subcategory_ids
FROM questions 
WHERE is_active = true
GROUP BY text 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 3. Проверка дубликатов по ID (не должно быть)
SELECT 
  id,
  COUNT(*) as duplicate_count
FROM questions 
WHERE is_active = true
GROUP BY id 
HAVING COUNT(*) > 1;

-- 4. Статистика по подкатегориям
SELECT 
  s.name as subcategory_name,
  c.name as category_name,
  COUNT(q.id) as questions_count
FROM subcategories s
LEFT JOIN categories c ON s.category_id = c.id
LEFT JOIN questions q ON q.subcategory_id = s.id AND q.is_active = true
GROUP BY s.id, s.name, c.name
ORDER BY c.name, s.name;

-- 5. Поиск вопросов с одинаковыми текстами но разными ID
WITH question_groups AS (
  SELECT 
    text,
    COUNT(*) as count,
    array_agg(id ORDER BY id) as ids,
    array_agg(subcategory_id ORDER BY id) as subcategories
  FROM questions 
  WHERE is_active = true
  GROUP BY text
)
SELECT 
  text,
  count as duplicate_count,
  ids,
  subcategories
FROM question_groups 
WHERE count > 1
ORDER BY count DESC;

-- 6. Анализ конкретной подкатегории (замените ID на нужный)
SELECT 
  q.id,
  q.text,
  q.subcategory_id,
  s.name as subcategory_name,
  c.name as category_name,
  q.order_index
FROM questions q
LEFT JOIN subcategories s ON q.subcategory_id = s.id
LEFT JOIN categories c ON s.category_id = c.id
WHERE q.is_active = true 
  AND c.name = 'Еда и напитки'  -- Замените на нужную категорию
ORDER BY s.name, q.order_index;
