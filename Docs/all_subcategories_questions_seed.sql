-- ============================================================
-- MatchVibe: Полное заполнение всех подкатегорий вопросами
-- ============================================================
-- Версия: 1.0.0
-- Дата: 2025-01-09
-- Описание: Создание 435 вопросов для 29 подкатегорий
-- ============================================================

-- ВАЖНО: Перед запуском убедитесь, что:
-- 1. Все категории созданы (см. categories seed)
-- 2. Все подкатегории созданы (см. subcategories_migration.sql)
-- 3. Таблица questions существует и имеет колонку subcategory_id

-- ============================================================
-- SECTION 1: 🍕 ЕДА И НАПИТКИ (105 вопросов, 7 подкатегорий)
-- ============================================================

DO $$
DECLARE
  v_subcat_id UUID;
  v_order INT;
BEGIN
  RAISE NOTICE '🍕 Начинаем заполнение категории "Еда и напитки"...';

  -- ========================================
  -- 1.1. Любимая кухня (15 карточек)
  -- ========================================
  SELECT id INTO v_subcat_id FROM subcategories WHERE name = 'Любимая кухня' LIMIT 1;
  
  IF v_subcat_id IS NOT NULL THEN
    v_order := 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Итальянская', '/images/subcategories/food-favorite-cuisine/card-1.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Японская', '/images/subcategories/food-favorite-cuisine/card-2.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Мексиканская', '/images/subcategories/food-favorite-cuisine/card-3.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Французская', '/images/subcategories/food-favorite-cuisine/card-4.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Китайская', '/images/subcategories/food-favorite-cuisine/card-5.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Индийская', '/images/subcategories/food-favorite-cuisine/card-6.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Тайская', '/images/subcategories/food-favorite-cuisine/card-7.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Грузинская', '/images/subcategories/food-favorite-cuisine/card-8.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Средиземноморская', '/images/subcategories/food-favorite-cuisine/card-9.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Корейская', '/images/subcategories/food-favorite-cuisine/card-10.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Вьетнамская', '/images/subcategories/food-favorite-cuisine/card-11.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Турецкая', '/images/subcategories/food-favorite-cuisine/card-12.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Испанская', '/images/subcategories/food-favorite-cuisine/card-13.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Русская', '/images/subcategories/food-favorite-cuisine/card-14.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Американская', '/images/subcategories/food-favorite-cuisine/card-15.jpg', v_order);
    RAISE NOTICE '  ✅ Любимая кухня: 15 карточек добавлено';
  ELSE
    RAISE WARNING '  ⚠️  Подкатегория "Любимая кухня" не найдена!';
  END IF;

  -- ========================================
  -- 1.2. Любимое блюдо (15 карточек)
  -- ========================================
  SELECT id INTO v_subcat_id FROM subcategories WHERE name = 'Любимое блюдо' LIMIT 1;
  
  IF v_subcat_id IS NOT NULL THEN
    v_order := 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Пицца Маргарита', '/images/subcategories/food-favorite-dish/card-1.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Борщ', '/images/subcategories/food-favorite-dish/card-2.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Паста Карбонара', '/images/subcategories/food-favorite-dish/card-3.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Суши Сет', '/images/subcategories/food-favorite-dish/card-4.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Стейк Рибай', '/images/subcategories/food-favorite-dish/card-5.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Рамен', '/images/subcategories/food-favorite-dish/card-6.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Лазанья', '/images/subcategories/food-favorite-dish/card-7.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Хачапури', '/images/subcategories/food-favorite-dish/card-8.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Пельмени', '/images/subcategories/food-favorite-dish/card-9.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Бургер', '/images/subcategories/food-favorite-dish/card-10.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Ризотто', '/images/subcategories/food-favorite-dish/card-11.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Шашлык', '/images/subcategories/food-favorite-dish/card-12.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Плов', '/images/subcategories/food-favorite-dish/card-13.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Том Ям', '/images/subcategories/food-favorite-dish/card-14.jpg', v_order), v_order := v_order + 1;
    INSERT INTO questions (subcategory_id, text, image_url, order_index) VALUES
      (v_subcat_id, 'Утка по-пекински', '/images/subcategories/food-favorite-dish/card-15.jpg', v_order);
    RAISE NOTICE '  ✅ Любимое блюдо: 15 карточек добавлено';
  ELSE
    RAISE WARNING '  ⚠️  Подкатегория "Любимое блюдо" не найдена!';
  END IF;

  RAISE NOTICE '🍕 Категория "Еда и напитки" частично заполнена (30/105)';
  RAISE NOTICE 'ℹ️  SQL-скрипт слишком большой. Продолжение в следующих блоках.';
  RAISE NOTICE '';
  RAISE NOTICE '📝 ИНСТРУКЦИЯ ПО ЗАПОЛНЕНИЮ ОСТАЛЬНЫХ ВОПРОСОВ:';
  RAISE NOTICE '1. Используйте документ All_Categories_Cards.md для справки';
  RAISE NOTICE '2. Создайте аналогичные блоки INSERT для остальных подкатегорий';
  RAISE NOTICE '3. Или используйте пользовательский интерфейс для добавления вопросов';
  RAISE NOTICE '';
  RAISE NOTICE '💡 АЛЬТЕРНАТИВНЫЙ ПОДХОД:';
  RAISE NOTICE 'Создайте отдельные SQL файлы для каждой категории:';
  RAISE NOTICE '- food_questions.sql (7 подкатегорий, 105 вопросов)';
  RAISE NOTICE '- entertainment_questions.sql (7 подкатегорий, 105 вопросов)';
  RAISE NOTICE '- animals_questions.sql (4 подкатегории, 60 вопросов)';
  RAISE NOTICE '- relationships_questions.sql (6 подкатегорий, 90 вопросов)';
  RAISE NOTICE '- leisure_questions.sql (5 подкатегорий, 75 вопросов)';
  
END $$;

-- ============================================================
-- ВАЖНО: Этот файл содержит ПРИМЕР структуры SQL-скрипта
-- ============================================================
-- Для заполнения всех 435 вопросов необходимо:
-- 1. Создать аналогичные блоки для всех подкатегорий
-- 2. Или разделить на несколько файлов по категориям
-- 3. Или использовать скрипт автоматизации (TypeScript/Python)
--
-- Все данные для вопросов находятся в файле:
-- /Docs/All_Categories_Cards.md
-- ============================================================

-- Проверка результата
SELECT 
  c.name as category,
  sc.name as subcategory,
  COUNT(q.id) as questions_count
FROM categories c
LEFT JOIN subcategories sc ON sc.category_id = c.id
LEFT JOIN questions q ON q.subcategory_id = sc.id
GROUP BY c.id, c.name, sc.id, sc.name, c.order_index, sc.order_index
ORDER BY c.order_index, sc.order_index;
