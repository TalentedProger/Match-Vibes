-- ============================================================
-- Check and Fix Duplicate Questions
-- ============================================================
-- Date: 2025-01-09
-- Purpose: Find and remove duplicate questions in database
-- ============================================================

-- Step 1: Check for duplicates
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  -- Count duplicates by text and category
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT text, category_id, COUNT(*) as count
    FROM questions
    WHERE is_active = true
    GROUP BY text, category_id
    HAVING COUNT(*) > 1
  ) duplicates;
  
  RAISE NOTICE 'Found % duplicate question groups', duplicate_count;
END $$;

-- Step 2: Show duplicate questions
SELECT 
  q.text,
  c.name as category_name,
  sc.name as subcategory_name,
  COUNT(*) as duplicate_count,
  ARRAY_AGG(q.id) as question_ids
FROM questions q
LEFT JOIN categories c ON c.id = q.category_id
LEFT JOIN subcategories sc ON sc.id = q.subcategory_id
WHERE q.is_active = true
GROUP BY q.text, c.name, sc.name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 3: Remove duplicates (keeping the oldest one)
DO $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete duplicate questions, keeping only the oldest one per text+category
  WITH duplicates_cte AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY text, category_id 
        ORDER BY created_at ASC, id
      ) as row_num
    FROM questions
    WHERE is_active = true
  )
  DELETE FROM questions
  WHERE id IN (
    SELECT id FROM duplicates_cte WHERE row_num > 1
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % duplicate questions', deleted_count;
END $$;

-- Step 4: Verify no duplicates remain
SELECT 
  text,
  category_id,
  COUNT(*) as count
FROM questions
WHERE is_active = true
GROUP BY text, category_id
HAVING COUNT(*) > 1;

-- If empty result, all duplicates are removed!

-- Step 5: Check questions count per category/subcategory
SELECT 
  c.name as category,
  sc.name as subcategory,
  COUNT(q.id) as question_count
FROM categories c
LEFT JOIN subcategories sc ON sc.category_id = c.id
LEFT JOIN questions q ON q.subcategory_id = sc.id AND q.is_active = true
GROUP BY c.name, sc.name
ORDER BY c.name, sc.name;

RAISE NOTICE '✅ Duplicate check and cleanup complete!';
