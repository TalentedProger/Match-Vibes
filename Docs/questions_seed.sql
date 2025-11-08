-- MatchVibe Questions Seed Data
-- 12+ questions per category with images
-- Version: 1.0.0
-- Last Updated: 2025-01-08

-- Temporary variables to hold category IDs
DO $$
DECLARE
  food_cat_id UUID;
  movies_cat_id UUID;
  animals_cat_id UUID;
  relations_cat_id UUID;
  travel_cat_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO food_cat_id FROM categories WHERE name = 'Еда и напитки';
  SELECT id INTO movies_cat_id FROM categories WHERE name = 'Фильмы';
  SELECT id INTO animals_cat_id FROM categories WHERE name = 'Животные';
  SELECT id INTO relations_cat_id FROM categories WHERE name = 'Отношения';
  SELECT id INTO travel_cat_id FROM categories WHERE name = 'Путешествия';

  -- ========================================
  -- CATEGORY 1: Еда и напитки (Food & Drinks)
  -- ========================================
  INSERT INTO questions (category_id, text, image_url, order_index) VALUES
    (food_cat_id, 'Пицца', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', 1),
    (food_cat_id, 'Суши', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop', 2),
    (food_cat_id, 'Бургеры', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 3),
    (food_cat_id, 'Паста', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop', 4),
    (food_cat_id, 'Стейк', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=400&fit=crop', 5),
    (food_cat_id, 'Шоколад', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop', 6),
    (food_cat_id, 'Мороженое', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 7),
    (food_cat_id, 'Кофе', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop', 8),
    (food_cat_id, 'Чай', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop', 9),
    (food_cat_id, 'Вино', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop', 10),
    (food_cat_id, 'Пиво', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop', 11),
    (food_cat_id, 'Коктейли', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop', 12),
    (food_cat_id, 'Торты', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', 13),
    (food_cat_id, 'Фрукты', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop', 14),
    (food_cat_id, 'Овощи', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', 15)
  ON CONFLICT DO NOTHING;

  -- ========================================
  -- CATEGORY 2: Фильмы (Movies)
  -- ========================================
  INSERT INTO questions (category_id, text, image_url, order_index) VALUES
    (movies_cat_id, 'Комедии', 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=400&fit=crop', 1),
    (movies_cat_id, 'Боевики', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop', 2),
    (movies_cat_id, 'Романтика', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=400&fit=crop', 3),
    (movies_cat_id, 'Ужасы', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=400&fit=crop', 4),
    (movies_cat_id, 'Научная фантастика', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=400&fit=crop', 5),
    (movies_cat_id, 'Фэнтези', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=400&fit=crop', 6),
    (movies_cat_id, 'Документальные', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop', 7),
    (movies_cat_id, 'Драма', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop', 8),
    (movies_cat_id, 'Триллеры', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop', 9),
    (movies_cat_id, 'Анимация', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop', 10),
    (movies_cat_id, 'Детективы', 'https://images.unsplash.com/photo-1560109947-543149eceb16?w=400&h=400&fit=crop', 11),
    (movies_cat_id, 'Мюзиклы', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=400&fit=crop', 12),
    (movies_cat_id, 'Приключения', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop', 13),
    (movies_cat_id, 'Биографии', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop', 14),
    (movies_cat_id, 'Артхаус', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop', 15)
  ON CONFLICT DO NOTHING;

  -- ========================================
  -- CATEGORY 3: Животные (Animals)
  -- ========================================
  INSERT INTO questions (category_id, text, image_url, order_index) VALUES
    (animals_cat_id, 'Собаки', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', 1),
    (animals_cat_id, 'Кошки', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', 2),
    (animals_cat_id, 'Птицы', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop', 3),
    (animals_cat_id, 'Рыбки', 'https://images.unsplash.com/photo-1520990269612-c18a49fa3c3e?w=400&h=400&fit=crop', 4),
    (animals_cat_id, 'Лошади', 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop', 5),
    (animals_cat_id, 'Кролики', 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop', 6),
    (animals_cat_id, 'Хомяки', 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=400&fit=crop', 7),
    (animals_cat_id, 'Черепахи', 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=400&fit=crop', 8),
    (animals_cat_id, 'Змеи', 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=400&fit=crop', 9),
    (animals_cat_id, 'Панды', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=400&fit=crop', 10),
    (animals_cat_id, 'Тигры', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop', 11),
    (animals_cat_id, 'Дельфины', 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=400&h=400&fit=crop', 12),
    (animals_cat_id, 'Слоны', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=400&fit=crop', 13),
    (animals_cat_id, 'Жирафы', 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=400&fit=crop', 14),
    (animals_cat_id, 'Пингвины', 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&h=400&fit=crop', 15)
  ON CONFLICT DO NOTHING;

  -- ========================================
  -- CATEGORY 4: Отношения (Relationships)
  -- ========================================
  INSERT INTO questions (category_id, text, image_url, order_index) VALUES
    (relations_cat_id, 'Романтические ужины', 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400&h=400&fit=crop', 1),
    (relations_cat_id, 'Путешествия вместе', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop', 2),
    (relations_cat_id, 'Доверие', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop', 3),
    (relations_cat_id, 'Общие хобби', 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=400&fit=crop', 4),
    (relations_cat_id, 'Сюрпризы', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop', 5),
    (relations_cat_id, 'Откровенные разговоры', 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400&h=400&fit=crop', 6),
    (relations_cat_id, 'Совместный отдых', 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=400&h=400&fit=crop', 7),
    (relations_cat_id, 'Поддержка', 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=400&fit=crop', 8),
    (relations_cat_id, 'Юмор', 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400&h=400&fit=crop', 9),
    (relations_cat_id, 'Личное пространство', 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400&h=400&fit=crop', 10),
    (relations_cat_id, 'Общие цели', 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=400&h=400&fit=crop', 11),
    (relations_cat_id, 'Семейные ценности', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop', 12),
    (relations_cat_id, 'Спонтанность', 'https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?w=400&h=400&fit=crop', 13),
    (relations_cat_id, 'Романтика', 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=400&fit=crop', 14),
    (relations_cat_id, 'Верность', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop', 15)
  ON CONFLICT DO NOTHING;

  -- ========================================
  -- CATEGORY 5: Путешествия (Travel)
  -- ========================================
  INSERT INTO questions (category_id, text, image_url, order_index) VALUES
    (travel_cat_id, 'Пляжный отдых', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', 1),
    (travel_cat_id, 'Горнолыжные курорты', 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400&h=400&fit=crop', 2),
    (travel_cat_id, 'Города Европы', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=400&fit=crop', 3),
    (travel_cat_id, 'Экзотические страны', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=400&fit=crop', 4),
    (travel_cat_id, 'Дикая природа', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', 5),
    (travel_cat_id, 'Исторические места', 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=400&h=400&fit=crop', 6),
    (travel_cat_id, 'Мегаполисы', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=400&fit=crop', 7),
    (travel_cat_id, 'Круизы', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop', 8),
    (travel_cat_id, 'Кемпинг', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop', 9),
    (travel_cat_id, 'Роскошные отели', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop', 10),
    (travel_cat_id, 'Сафари', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=400&fit=crop', 11),
    (travel_cat_id, 'Островные курорты', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop', 12),
    (travel_cat_id, 'Горные походы', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop', 13),
    (travel_cat_id, 'Культурные туры', 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=400&fit=crop', 14),
    (travel_cat_id, 'Гастрономические туры', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop', 15)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Questions seed data inserted successfully!';
  RAISE NOTICE 'Total: 75 questions (15 per category × 5 categories)';
END $$;
