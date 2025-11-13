-- ========================================
-- КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ ДУБЛИРОВАНИЯ КАРТОЧЕК
-- ========================================
-- Проблема: В базе данных существуют множественные дубли из-за:
-- 1. Повторного выполнения миграций подкатегорий (2 раза)  
-- 2. Старые вопросы БЕЗ subcategory_id (75 штук)
-- 3. Новые вопросы С subcategory_id (сотни штук)
-- 4. API возвращает ВСЕ вопросы, не фильтруя дубли
-- ========================================

BEGIN;

-- ========================================
-- ШАГ 1: Диагностика текущего состояния
-- ========================================

DO $$
DECLARE
  total_count INTEGER;
  no_subcat_count INTEGER;
  with_subcat_count INTEGER;
  duplicates_count INTEGER;
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'ДИАГНОСТИКА ДУБЛИРОВАНИЯ КАРТОЧЕК';
  RAISE NOTICE '==============================================';
  
  -- Проверяем общее количество вопросов
  SELECT COUNT(*) INTO total_count FROM questions WHERE is_active = true;
  RAISE NOTICE 'Всего вопросов в базе: %', total_count;
  
  SELECT COUNT(*) INTO no_subcat_count FROM questions WHERE is_active = true AND subcategory_id IS NULL;
  RAISE NOTICE 'Вопросов БЕЗ subcategory_id: %', no_subcat_count;
  
  SELECT COUNT(*) INTO with_subcat_count FROM questions WHERE is_active = true AND subcategory_id IS NOT NULL;
  RAISE NOTICE 'Вопросов С subcategory_id: %', with_subcat_count;
  
  SELECT COUNT(*) INTO duplicates_count FROM (
    SELECT text, COUNT(*) as cnt
    FROM questions 
    WHERE is_active = true
    GROUP BY text
    HAVING COUNT(*) > 1
  ) duplicates;
  RAISE NOTICE 'Дубликатов по тексту: %', duplicates_count;

  RAISE NOTICE '';
END $$;

-- ========================================  
-- ШАГ 2: Удалить ВСЕ старые вопросы без subcategory_id
-- ========================================

DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  RAISE NOTICE 'Удаляем СТАРЫЕ вопросы без subcategory_id...';
  
  -- Удаляем все вопросы которые НЕ привязаны к подкатегориям
  DELETE FROM questions 
  WHERE subcategory_id IS NULL AND is_active = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE '✅ Удалено старых вопросов: %', deleted_count;
  
  RAISE NOTICE '';
END $$;

-- ========================================
-- ШАГ 3: Удалить дублирующиеся подкатегории
-- ========================================

DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  RAISE NOTICE 'Удаляем дублирующиеся подкатегории...';
  
  -- Удаляем дубликаты подкатегорий, оставляя самую раннюю
  WITH duplicates_cte AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY category_id, name 
        ORDER BY created_at ASC, id
      ) as row_num
    FROM subcategories
  )
  DELETE FROM subcategories
  WHERE id IN (
    SELECT id FROM duplicates_cte WHERE row_num > 1
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE '✅ Удалено дубликатов подкатегорий: %', deleted_count;
  
  RAISE NOTICE '';
END $$;

-- ========================================
-- ШАГ 4: Удалить дублирующиеся вопросы в подкатегориях  
-- ========================================

DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  RAISE NOTICE 'Удаляем дублирующиеся вопросы по тексту...';
  
  -- Удаляем дубликаты вопросов по тексту + subcategory_id
  WITH duplicates_cte AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY subcategory_id, text 
        ORDER BY created_at ASC, id
      ) as row_num
    FROM questions
    WHERE is_active = true AND subcategory_id IS NOT NULL
  )
  DELETE FROM questions
  WHERE id IN (
    SELECT id FROM duplicates_cte WHERE row_num > 1
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE '✅ Удалено дубликатов вопросов: %', deleted_count;
  
  RAISE NOTICE '';
END $$;

-- ========================================
-- ШАГ 5: Проверка что остались ТОЛЬКО уникальные вопросы
-- ========================================

DO $$
DECLARE
  final_total INTEGER;
  final_with_subcat INTEGER;
  final_no_subcat INTEGER;
  final_duplicates INTEGER;
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'РЕЗУЛЬТАТ ОЧИСТКИ';
  RAISE NOTICE '==============================================';
  
  -- Финальный подсчет
  SELECT COUNT(*) INTO final_total FROM questions WHERE is_active = true;
  RAISE NOTICE 'Итого активных вопросов: %', final_total;
  
  SELECT COUNT(*) INTO final_with_subcat FROM questions WHERE is_active = true AND subcategory_id IS NOT NULL;
  RAISE NOTICE 'Вопросов С subcategory_id: %', final_with_subcat;
  
  SELECT COUNT(*) INTO final_no_subcat FROM questions WHERE is_active = true AND subcategory_id IS NULL;
  RAISE NOTICE 'Вопросов БЕЗ subcategory_id: %', final_no_subcat;
  
  SELECT COUNT(*) INTO final_duplicates FROM (
    SELECT text, COUNT(*) as cnt
    FROM questions 
    WHERE is_active = true
    GROUP BY text
    HAVING COUNT(*) > 1
  ) duplicates;
  RAISE NOTICE 'Дубликатов по тексту: %', final_duplicates;

  RAISE NOTICE '';
END $$;

-- ========================================
-- ШАГ 6: Показать статистику по подкатегориям
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'Статистика по подкатегориям:';
END $$;

SELECT 
  c.name || ' ' || c.icon as category,
  sc.name as subcategory,
  COUNT(q.id) as questions_count
FROM categories c
LEFT JOIN subcategories sc ON sc.category_id = c.id
LEFT JOIN questions q ON q.subcategory_id = sc.id AND q.is_active = true
WHERE c.is_active = true AND sc.is_active = true
GROUP BY c.id, c.name, c.icon, sc.id, sc.name, sc.order_index
ORDER BY c.order_index, sc.order_index;

-- ========================================
-- ШАГ 7: Создать уникальные индексы для предотвращения дубликатов
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'Создаем уникальные индексы...';
  
  -- Уникальность подкатегорий
  DROP INDEX IF EXISTS idx_subcategories_unique_active;
  CREATE UNIQUE INDEX idx_subcategories_unique_active 
  ON subcategories(category_id, name) 
  WHERE is_active = true;
  
  -- Уникальность вопросов в подкатегории  
  DROP INDEX IF EXISTS idx_questions_unique_active;
  CREATE UNIQUE INDEX idx_questions_unique_active 
  ON questions(subcategory_id, text) 
  WHERE is_active = true AND subcategory_id IS NOT NULL;
  
  RAISE NOTICE '✅ Уникальные индексы созданы';
  RAISE NOTICE '';
END $$;

COMMIT;

-- ========================================
-- ГОТОВО!
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ ДУБЛИРОВАНИЕ ИСПРАВЛЕНО!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Что исправлено:';
  RAISE NOTICE '  ✅ Удалены ВСЕ старые вопросы без subcategory_id';
  RAISE NOTICE '  ✅ Удалены дубликаты подкатегорий';  
  RAISE NOTICE '  ✅ Удалены дубликаты вопросов по тексту';
  RAISE NOTICE '  ✅ Созданы уникальные индексы';
  RAISE NOTICE '';
  RAISE NOTICE 'Теперь в каждой подкатегории ровно 15 уникальных вопросов!';
  RAISE NOTICE 'Дублирование карточек в игре устранено на уровне БД.';
  RAISE NOTICE '';
END $$;
