-- SQL Script to Update Image URLs for Subcategories
-- Run this in Supabase SQL Editor after adding images to folders

-- ==============================================
-- Update Image URLs for All Subcategories
-- ==============================================

-- 🍕 FOOD AND DRINKS

-- Любимая кухня
UPDATE questions
SET image_url = '/images/subcategories/food-favorite-cuisine/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Любимая кухня' LIMIT 1
);

-- Любимое блюдо
UPDATE questions
SET image_url = '/images/subcategories/food-favorite-dish/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Любимое блюдо' LIMIT 1
);

-- Кофе / чай
UPDATE questions
SET image_url = '/images/subcategories/food-coffee-tea/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Кофе / чай' LIMIT 1
);

-- Десерты
UPDATE questions
SET image_url = '/images/subcategories/food-desserts/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Десерты' LIMIT 1
);

-- Уличная еда
UPDATE questions
SET image_url = '/images/subcategories/food-street-food/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Уличная еда' LIMIT 1
);

-- Завтрак мечты
UPDATE questions
SET image_url = '/images/subcategories/food-dream-breakfast/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Завтрак мечты' LIMIT 1
);

-- Ресторан мечты
UPDATE questions
SET image_url = '/images/subcategories/food-dream-restaurant/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Ресторан мечты' LIMIT 1
);


-- 🎬 ENTERTAINMENT AND CULTURE

-- Любимый фильм
UPDATE questions
SET image_url = '/images/subcategories/entertainment-favorite-movie/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Любимый фильм' LIMIT 1
);

-- Любимый жанр кино
UPDATE questions
SET image_url = '/images/subcategories/entertainment-movie-genre/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Любимый жанр кино' LIMIT 1
);

-- Любимый исполнитель
UPDATE questions
SET image_url = '/images/subcategories/entertainment-favorite-artist/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Любимый исполнитель' LIMIT 1
);

-- Любимая песня
UPDATE questions
SET image_url = '/images/subcategories/entertainment-favorite-song/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name = 'Любимая песня' LIMIT 1
);

-- Сериал, который стоит пересмотреть
UPDATE questions
SET image_url = '/images/subcategories/entertainment-series/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%сериал%' LIMIT 1
);

-- Любимая игра
UPDATE questions
SET image_url = '/images/subcategories/entertainment-favorite-game/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%любимая игра%' LIMIT 1
);

-- Самый вдохновляющий фильм
UPDATE questions
SET image_url = '/images/subcategories/entertainment-inspiring-movie/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%вдохновляющий%' LIMIT 1
);


-- 🐶 ANIMALS

-- Любимая порода собак
UPDATE questions
SET image_url = '/images/subcategories/animals-dog-breed/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%порода собак%' LIMIT 1
);

-- Кошки vs собаки
UPDATE questions
SET image_url = '/images/subcategories/animals-cats-vs-dogs/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%кошки%собаки%' LIMIT 1
);

-- Идеальный питомец
UPDATE questions
SET image_url = '/images/subcategories/animals-ideal-pet/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%идеальный питомец%' LIMIT 1
);

-- Дикая природа или домашние любимцы
UPDATE questions
SET image_url = '/images/subcategories/animals-wildlife/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%дикая природа%' LIMIT 1
);


-- 💞 RELATIONSHIPS AND PERSONALITY

-- Главное качество в человеке
UPDATE questions
SET image_url = '/images/subcategories/relationships-main-quality/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%главное качество%' LIMIT 1
);

-- Главный страх
UPDATE questions
SET image_url = '/images/subcategories/relationships-main-fear/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%главный страх%' LIMIT 1
);

-- Заветная мечта
UPDATE questions
SET image_url = '/images/subcategories/relationships-dream/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%заветная мечта%' LIMIT 1
);

-- Отношение к дружбе
UPDATE questions
SET image_url = '/images/subcategories/relationships-friendship/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%отношение к дружбе%' LIMIT 1
);

-- Как ты проявляешь заботу
UPDATE questions
SET image_url = '/images/subcategories/relationships-care/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%проявляешь заботу%' LIMIT 1
);

-- Любимый тип отдыха вдвоем
UPDATE questions
SET image_url = '/images/subcategories/relationships-rest-together/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%отдыха вдвоем%' LIMIT 1
);


-- 🏖️ LEISURE AND TRAVEL

-- Любимое место отдыха
UPDATE questions
SET image_url = '/images/subcategories/leisure-favorite-place/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%любимое место отдыха%' LIMIT 1
);

-- Идеальное путешествие
UPDATE questions
SET image_url = '/images/subcategories/leisure-ideal-travel/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%идеальное путешествие%' LIMIT 1
);

-- Активный отдых или релакс
UPDATE questions
SET image_url = '/images/subcategories/leisure-active-relax/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%активный отдых%' LIMIT 1
);

-- Город мечты
UPDATE questions
SET image_url = '/images/subcategories/leisure-dream-city/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%город мечты%' LIMIT 1
);

-- Идеальный выходной
UPDATE questions
SET image_url = '/images/subcategories/leisure-ideal-weekend/card-' || order_index || '.jpg'
WHERE subcategory_id = (
  SELECT id FROM subcategories WHERE name ILIKE '%идеальный выходной%' LIMIT 1
);


-- ==============================================
-- VERIFICATION
-- ==============================================

-- Check how many questions have images
SELECT 
  COUNT(*) as total_questions,
  COUNT(image_url) as questions_with_images,
  COUNT(*) - COUNT(image_url) as questions_without_images
FROM questions;

-- Show subcategories and their image counts
SELECT 
  c.name as category,
  sc.name as subcategory,
  COUNT(q.id) as total_questions,
  COUNT(q.image_url) as questions_with_images
FROM subcategories sc
JOIN categories c ON c.id = sc.category_id
LEFT JOIN questions q ON q.subcategory_id = sc.id
GROUP BY c.name, sc.name, sc.order_index
ORDER BY c.order_index, sc.order_index;
