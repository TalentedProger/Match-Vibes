-- ============================================================
-- Subcategories Migration for MatchVibe
-- ============================================================
-- Adds subcategory structure to existing categories
-- Version: 2.0.0 (FIXED)
-- Date: 2025-01-09
-- Fix: Corrected UUID duplicate deletion method
-- ============================================================

-- ========================================
-- 1. Create Subcategories Table
-- ========================================

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subcategories_category 
ON subcategories(category_id, is_active, order_index);

-- Enable RLS
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view active subcategories
DROP POLICY IF EXISTS "Subcategories are viewable by everyone" ON subcategories;
CREATE POLICY "Subcategories are viewable by everyone"
  ON subcategories FOR SELECT
  USING (is_active = TRUE);

-- ========================================
-- 2. Update Questions Table
-- ========================================

-- Add subcategory_id column to questions
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Create index for subcategory lookups
CREATE INDEX IF NOT EXISTS idx_questions_subcategory 
ON questions(subcategory_id);

-- ========================================
-- 3. Clean up existing duplicates
-- ========================================

DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete duplicate subcategories, keeping only the oldest one
  -- Using CTE with ROW_NUMBER() because MIN() doesn't work with UUID
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
  RAISE NOTICE 'Deleted % duplicate subcategories', deleted_count;
  
  -- Now create unique constraint to prevent future duplicates
  -- Must be created BEFORE inserts for ON CONFLICT to work
  DROP INDEX IF EXISTS idx_subcategories_unique;
  CREATE UNIQUE INDEX idx_subcategories_unique 
  ON subcategories(category_id, name);
  
  RAISE NOTICE 'Unique index created - ready for inserts';
END $$;

-- ========================================
-- 4. Insert Subcategories Data
-- ========================================

DO $$
DECLARE
  food_cat_id UUID;
  entertainment_cat_id UUID;
  animals_cat_id UUID;
  relationships_cat_id UUID;
  leisure_cat_id UUID;
  perception_cat_id UUID;
  misc_cat_id UUID;
BEGIN
  -- Get existing category IDs by icon (more reliable than name)
  SELECT id INTO food_cat_id FROM categories WHERE icon = '🍕' LIMIT 1;
  SELECT id INTO entertainment_cat_id FROM categories WHERE icon = '🎬' LIMIT 1;
  SELECT id INTO animals_cat_id FROM categories WHERE icon = '🐶' LIMIT 1;
  SELECT id INTO relationships_cat_id FROM categories WHERE icon = '💞' LIMIT 1;
  SELECT id INTO leisure_cat_id FROM categories WHERE icon = '🏖️' LIMIT 1;
  
  -- Try to find by name if icon search failed
  IF food_cat_id IS NULL THEN
    SELECT id INTO food_cat_id FROM categories WHERE name ILIKE '%еда%' OR name ILIKE '%food%' LIMIT 1;
  END IF;
  
  IF entertainment_cat_id IS NULL THEN
    SELECT id INTO entertainment_cat_id FROM categories WHERE name ILIKE '%развлечен%' OR name ILIKE '%фильм%' LIMIT 1;
  END IF;
  
  IF animals_cat_id IS NULL THEN
    SELECT id INTO animals_cat_id FROM categories WHERE name ILIKE '%животн%' OR name ILIKE '%animal%' LIMIT 1;
  END IF;
  
  IF relationships_cat_id IS NULL THEN
    SELECT id INTO relationships_cat_id FROM categories WHERE name ILIKE '%отношен%' OR name ILIKE '%личност%' LIMIT 1;
  END IF;
  
  IF leisure_cat_id IS NULL THEN
    SELECT id INTO leisure_cat_id FROM categories WHERE name ILIKE '%досуг%' OR name ILIKE '%путешеств%' LIMIT 1;
  END IF;
  
  -- If still not found, raise notice
  IF food_cat_id IS NULL THEN
    RAISE NOTICE 'WARNING: Food category not found! Please create it first.';
  END IF;
  
  IF entertainment_cat_id IS NULL THEN
    RAISE NOTICE 'WARNING: Entertainment category not found! Please create it first.';
  END IF;
  
  IF animals_cat_id IS NULL THEN
    RAISE NOTICE 'WARNING: Animals category not found! Please create it first.';
  END IF;
  
  IF relationships_cat_id IS NULL THEN
    RAISE NOTICE 'WARNING: Relationships category not found! Please create it first.';
  END IF;
  
  IF leisure_cat_id IS NULL THEN
    RAISE NOTICE 'WARNING: Leisure category not found! Please create it first.';
  END IF;

  -- Insert Subcategories (only if category exists)

  -- 🍕 Еда и напитки
  IF food_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, order_index) 
    VALUES
      (food_cat_id, 'Любимая кухня', 1),
      (food_cat_id, 'Любимое блюдо', 2),
      (food_cat_id, 'Кофе / чай', 3),
      (food_cat_id, 'Десерты', 4),
      (food_cat_id, 'Уличная еда', 5),
      (food_cat_id, 'Завтрак мечты', 6),
      (food_cat_id, 'Ресторан мечты', 7)
    ON CONFLICT (category_id, name) DO NOTHING;
    RAISE NOTICE 'Food subcategories: 7 items';
  END IF;

  -- 🎬 Развлечения и культура
  IF entertainment_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, order_index) 
    VALUES
      (entertainment_cat_id, 'Любимый фильм', 1),
      (entertainment_cat_id, 'Любимый жанр кино', 2),
      (entertainment_cat_id, 'Любимый исполнитель', 3),
      (entertainment_cat_id, 'Любимая песня', 4),
      (entertainment_cat_id, 'Сериал, который стоит пересмотреть', 5),
      (entertainment_cat_id, 'Любимая игра (настольная / видеоигра)', 6),
      (entertainment_cat_id, 'Самый вдохновляющий фильм', 7)
    ON CONFLICT (category_id, name) DO NOTHING;
    RAISE NOTICE 'Entertainment subcategories: 7 items';
  END IF;

  -- 🐶 Животные
  IF animals_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, order_index) 
    VALUES
      (animals_cat_id, 'Любимая порода собак', 1),
      (animals_cat_id, 'Кошки vs собаки', 2),
      (animals_cat_id, 'Идеальный питомец', 3),
      (animals_cat_id, 'Дикая природа или домашние любимцы', 4)
    ON CONFLICT (category_id, name) DO NOTHING;
    RAISE NOTICE 'Animals subcategories: 4 items';
  END IF;

  -- 💞 Отношения и личность
  IF relationships_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, order_index) 
    VALUES
      (relationships_cat_id, 'Главное качество в человеке', 1),
      (relationships_cat_id, 'Главный страх', 2),
      (relationships_cat_id, 'Заветная мечта', 3),
      (relationships_cat_id, 'Отношение к дружбе', 4),
      (relationships_cat_id, 'Как ты проявляешь заботу', 5),
      (relationships_cat_id, 'Любимый тип отдыха вдвоем', 6)
    ON CONFLICT (category_id, name) DO NOTHING;
    RAISE NOTICE 'Relationships subcategories: 6 items';
  END IF;

  -- 🏖️ Досуг и путешествия
  IF leisure_cat_id IS NOT NULL THEN
    INSERT INTO subcategories (category_id, name, order_index) 
    VALUES
      (leisure_cat_id, 'Любимое место отдыха', 1),
      (leisure_cat_id, 'Идеальное путешествие', 2),
      (leisure_cat_id, 'Активный отдых или релакс', 3),
      (leisure_cat_id, 'Город мечты', 4),
      (leisure_cat_id, 'Идеальный выходной', 5)
    ON CONFLICT (category_id, name) DO NOTHING;
    RAISE NOTICE 'Leisure subcategories: 5 items';
  END IF;

  RAISE NOTICE '✅ Subcategories created successfully!';
END $$;

-- ========================================
-- 5. Verification
-- ========================================

-- Check subcategories count
DO $$
DECLARE
  subcat_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO subcat_count FROM subcategories;
  RAISE NOTICE 'Total subcategories: %', subcat_count;
END $$;

-- Show subcategories grouped by category
SELECT 
  c.name as category_name,
  c.icon as category_icon,
  COUNT(sc.id) as subcategory_count
FROM categories c
LEFT JOIN subcategories sc ON sc.category_id = c.id
GROUP BY c.id, c.name, c.icon, c.order_index
ORDER BY c.order_index;
