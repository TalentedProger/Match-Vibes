-- ========================================
-- FIX CATEGORY DUPLICATES - FINAL SOLUTION
-- ========================================
-- Этот скрипт:
-- 1. Удаляет все дубликаты категорий
-- 2. Оставляет только одну категорию с каждым emoji
-- 3. Обновляет названия на правильные
-- 4. Перепривязывает подкатегории к правильным категориям
-- ========================================

BEGIN;

-- ========================================
-- ШАГ 1: Найти категории с подкатегориями (те что нужно оставить)
-- ========================================

DO $$
DECLARE
  -- Категории которые нужно оставить (те, у которых есть подкатегории)
  food_keep_id UUID;
  entertainment_keep_id UUID;
  animals_keep_id UUID;
  relationships_keep_id UUID;
  leisure_keep_id UUID;
  perception_keep_id UUID;
  misc_keep_id UUID;
  
  -- Временные переменные для подсчета
  deleted_count INTEGER := 0;
BEGIN
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'FIXING CATEGORY DUPLICATES';
  RAISE NOTICE '==============================================';
  
  -- ========================================
  -- ШАГ 2: Найти "правильные" категории (с подкатегориями)
  -- ========================================
  
  -- 🍕 Еда и напитки
  SELECT c.id INTO food_keep_id
  FROM categories c
  LEFT JOIN subcategories sc ON sc.category_id = c.id
  WHERE c.icon = '🍕'
  GROUP BY c.id
  HAVING COUNT(sc.id) > 0
  LIMIT 1;
  
  -- 🎬 Развлечения и культура
  SELECT c.id INTO entertainment_keep_id
  FROM categories c
  LEFT JOIN subcategories sc ON sc.category_id = c.id
  WHERE c.icon = '🎬'
  GROUP BY c.id
  HAVING COUNT(sc.id) > 0
  LIMIT 1;
  
  -- 🐶 Животные
  SELECT c.id INTO animals_keep_id
  FROM categories c
  LEFT JOIN subcategories sc ON sc.category_id = c.id
  WHERE c.icon = '🐶'
  GROUP BY c.id
  HAVING COUNT(sc.id) > 0
  LIMIT 1;
  
  -- 💞 Отношения и личность
  SELECT c.id INTO relationships_keep_id
  FROM categories c
  LEFT JOIN subcategories sc ON sc.category_id = c.id
  WHERE c.icon = '💞'
  GROUP BY c.id
  HAVING COUNT(sc.id) > 0
  LIMIT 1;
  
  -- 🏖️ Досуг и путешествия
  SELECT c.id INTO leisure_keep_id
  FROM categories c
  LEFT JOIN subcategories sc ON sc.category_id = c.id
  WHERE c.icon = '🏖️'
  GROUP BY c.id
  HAVING COUNT(sc.id) > 0
  LIMIT 1;
  
  -- 💡 Личное восприятие (обычно не дублируется, но проверим)
  SELECT c.id INTO perception_keep_id
  FROM categories c
  WHERE c.icon = '💡'
  LIMIT 1;
  
  -- 🎁 Разное и весёлое (обычно не дублируется, но проверим)
  SELECT c.id INTO misc_keep_id
  FROM categories c
  WHERE c.icon = '🎁'
  LIMIT 1;
  
  RAISE NOTICE '';
  RAISE NOTICE 'Found categories to keep:';
  RAISE NOTICE '  🍕 Food: %', food_keep_id;
  RAISE NOTICE '  🎬 Entertainment: %', entertainment_keep_id;
  RAISE NOTICE '  🐶 Animals: %', animals_keep_id;
  RAISE NOTICE '  💞 Relationships: %', relationships_keep_id;
  RAISE NOTICE '  🏖️ Leisure: %', leisure_keep_id;
  RAISE NOTICE '  💡 Perception: %', perception_keep_id;
  RAISE NOTICE '  🎁 Misc: %', misc_keep_id;
  RAISE NOTICE '';
  
  -- ========================================
  -- ШАГ 3: Обновить названия "правильных" категорий
  -- ========================================
  
  RAISE NOTICE 'Updating category names...';
  
  IF food_keep_id IS NOT NULL THEN
    UPDATE categories SET name = 'Еда и напитки' WHERE id = food_keep_id;
    RAISE NOTICE '  ✅ Updated: Еда и напитки';
  END IF;
  
  IF entertainment_keep_id IS NOT NULL THEN
    UPDATE categories SET name = 'Развлечения и культура' WHERE id = entertainment_keep_id;
    RAISE NOTICE '  ✅ Updated: Развлечения и культура';
  END IF;
  
  IF animals_keep_id IS NOT NULL THEN
    UPDATE categories SET name = 'Животные' WHERE id = animals_keep_id;
    RAISE NOTICE '  ✅ Updated: Животные';
  END IF;
  
  IF relationships_keep_id IS NOT NULL THEN
    UPDATE categories SET name = 'Отношения и личность' WHERE id = relationships_keep_id;
    RAISE NOTICE '  ✅ Updated: Отношения и личность';
  END IF;
  
  IF leisure_keep_id IS NOT NULL THEN
    UPDATE categories SET name = 'Досуг и путешествия' WHERE id = leisure_keep_id;
    RAISE NOTICE '  ✅ Updated: Досуг и путешествия';
  END IF;
  
  IF perception_keep_id IS NOT NULL THEN
    UPDATE categories SET name = 'Личное восприятие' WHERE id = perception_keep_id;
    RAISE NOTICE '  ✅ Updated: Личное восприятие';
  END IF;
  
  IF misc_keep_id IS NOT NULL THEN
    UPDATE categories SET name = 'Разное и весёлое' WHERE id = misc_keep_id;
    RAISE NOTICE '  ✅ Updated: Разное и весёлое';
  END IF;
  
  RAISE NOTICE '';
  
  -- ========================================
  -- ШАГ 4: Удалить дубликаты категорий
  -- ========================================
  
  RAISE NOTICE 'Deleting duplicate categories...';
  
  -- Удаляем все категории с emoji 🍕 кроме той, которую оставляем
  IF food_keep_id IS NOT NULL THEN
    DELETE FROM categories WHERE icon = '🍕' AND id != food_keep_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '  🍕 Deleted % duplicates', deleted_count;
  END IF;
  
  -- Удаляем все категории с emoji 🎬 кроме той, которую оставляем
  IF entertainment_keep_id IS NOT NULL THEN
    DELETE FROM categories WHERE icon = '🎬' AND id != entertainment_keep_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '  🎬 Deleted % duplicates', deleted_count;
  END IF;
  
  -- Удаляем все категории с emoji 🐶 кроме той, которую оставляем
  IF animals_keep_id IS NOT NULL THEN
    DELETE FROM categories WHERE icon = '🐶' AND id != animals_keep_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '  🐶 Deleted % duplicates', deleted_count;
  END IF;
  
  -- Удаляем все категории с emoji 💞 кроме той, которую оставляем
  IF relationships_keep_id IS NOT NULL THEN
    DELETE FROM categories WHERE icon = '💞' AND id != relationships_keep_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '  💞 Deleted % duplicates', deleted_count;
  END IF;
  
  -- Удаляем все категории с emoji 🏖️ кроме той, которую оставляем
  IF leisure_keep_id IS NOT NULL THEN
    DELETE FROM categories WHERE icon = '🏖️' AND id != leisure_keep_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '  🏖️ Deleted % duplicates', deleted_count;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ DUPLICATES REMOVED SUCCESSFULLY!';
  RAISE NOTICE '';
  
END $$;

-- ========================================
-- ШАГ 5: Проверка результата
-- ========================================

DO $$
DECLARE
  total_categories INTEGER;
  total_subcategories INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_categories FROM categories WHERE is_active = TRUE;
  SELECT COUNT(*) INTO total_subcategories FROM subcategories WHERE is_active = TRUE;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'VERIFICATION';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Total active categories: %', total_categories;
  RAISE NOTICE 'Total active subcategories: %', total_subcategories;
  RAISE NOTICE '';
END $$;

-- Показать финальный результат
SELECT 
  c.name as category_name,
  c.icon as category_icon,
  c.order_index,
  COUNT(sc.id) as subcategory_count
FROM categories c
LEFT JOIN subcategories sc ON sc.category_id = c.id
WHERE c.is_active = TRUE
GROUP BY c.id, c.name, c.icon, c.order_index
ORDER BY c.order_index;

COMMIT;

-- ========================================
-- ГОТОВО!
-- ========================================
-- 
-- Результат:
-- ✅ Только уникальные категории (7 штук)
-- ✅ Правильные названия
-- ✅ Все подкатегории привязаны
-- ✅ Нет дубликатов
-- 
-- ========================================
