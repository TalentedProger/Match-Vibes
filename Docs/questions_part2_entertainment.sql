-- Part 2: Развлечения и культура (105 вопросов)
DO $$ 
DECLARE v_id UUID;
BEGIN
  -- 2.1 Любимый фильм
  SELECT id INTO v_id FROM subcategories WHERE name='Любимый фильм' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Криминальное чтиво','/images/subcategories/entertainment-favorite-movie/card-1.jpg',1),
    (v_id,'Начало','/images/subcategories/entertainment-favorite-movie/card-2.jpg',2),
    (v_id,'Бойцовский клуб','/images/subcategories/entertainment-favorite-movie/card-3.jpg',3),
    (v_id,'Форрест Гамп','/images/subcategories/entertainment-favorite-movie/card-4.jpg',4),
    (v_id,'Матрица','/images/subcategories/entertainment-favorite-movie/card-5.jpg',5),
    (v_id,'Титаник','/images/subcategories/entertainment-favorite-movie/card-6.jpg',6),
    (v_id,'Зеленая миля','/images/subcategories/entertainment-favorite-movie/card-7.jpg',7),
    (v_id,'Интерстеллар','/images/subcategories/entertainment-favorite-movie/card-8.jpg',8),
    (v_id,'Крестный отец','/images/subcategories/entertainment-favorite-movie/card-9.jpg',9),
    (v_id,'Темный рыцарь','/images/subcategories/entertainment-favorite-movie/card-10.jpg',10),
    (v_id,'1+1','/images/subcategories/entertainment-favorite-movie/card-11.jpg',11),
    (v_id,'Побег из Шоушенка','/images/subcategories/entertainment-favorite-movie/card-12.jpg',12),
    (v_id,'Леон','/images/subcategories/entertainment-favorite-movie/card-13.jpg',13),
    (v_id,'Властелин колец','/images/subcategories/entertainment-favorite-movie/card-14.jpg',14),
    (v_id,'Джокер','/images/subcategories/entertainment-favorite-movie/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимый фильм: 15';
  END IF;

  -- 2.2 Любимый жанр кино
  SELECT id INTO v_id FROM subcategories WHERE name='Любимый жанр кино' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Комедии','/images/subcategories/entertainment-movie-genre/card-1.jpg',1),
    (v_id,'Боевики','/images/subcategories/entertainment-movie-genre/card-2.jpg',2),
    (v_id,'Романтика','/images/subcategories/entertainment-movie-genre/card-3.jpg',3),
    (v_id,'Ужасы','/images/subcategories/entertainment-movie-genre/card-4.jpg',4),
    (v_id,'Научная фантастика','/images/subcategories/entertainment-movie-genre/card-5.jpg',5),
    (v_id,'Фэнтези','/images/subcategories/entertainment-movie-genre/card-6.jpg',6),
    (v_id,'Документальные','/images/subcategories/entertainment-movie-genre/card-7.jpg',7),
    (v_id,'Драма','/images/subcategories/entertainment-movie-genre/card-8.jpg',8),
    (v_id,'Триллеры','/images/subcategories/entertainment-movie-genre/card-9.jpg',9),
    (v_id,'Анимация','/images/subcategories/entertainment-movie-genre/card-10.jpg',10),
    (v_id,'Детективы','/images/subcategories/entertainment-movie-genre/card-11.jpg',11),
    (v_id,'Мюзиклы','/images/subcategories/entertainment-movie-genre/card-12.jpg',12),
    (v_id,'Приключения','/images/subcategories/entertainment-movie-genre/card-13.jpg',13),
    (v_id,'Биографии','/images/subcategories/entertainment-movie-genre/card-14.jpg',14),
    (v_id,'Артхаус','/images/subcategories/entertainment-movie-genre/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимый жанр кино: 15';
  END IF;

  -- 2.3 Любимый исполнитель
  SELECT id INTO v_id FROM subcategories WHERE name='Любимый исполнитель' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Рок-группа','/images/subcategories/entertainment-favorite-artist/card-1.jpg',1),
    (v_id,'Поп-звезда','/images/subcategories/entertainment-favorite-artist/card-2.jpg',2),
    (v_id,'Рэп-исполнитель','/images/subcategories/entertainment-favorite-artist/card-3.jpg',3),
    (v_id,'Джазовый музыкант','/images/subcategories/entertainment-favorite-artist/card-4.jpg',4),
    (v_id,'Электронный DJ','/images/subcategories/entertainment-favorite-artist/card-5.jpg',5),
    (v_id,'Классический композитор','/images/subcategories/entertainment-favorite-artist/card-6.jpg',6),
    (v_id,'Инди-группа','/images/subcategories/entertainment-favorite-artist/card-7.jpg',7),
    (v_id,'Кантри-певец','/images/subcategories/entertainment-favorite-artist/card-8.jpg',8),
    (v_id,'Метал-группа','/images/subcategories/entertainment-favorite-artist/card-9.jpg',9),
    (v_id,'R&B исполнитель','/images/subcategories/entertainment-favorite-artist/card-10.jpg',10),
    (v_id,'Фолк-музыкант','/images/subcategories/entertainment-favorite-artist/card-11.jpg',11),
    (v_id,'Регги-артист','/images/subcategories/entertainment-favorite-artist/card-12.jpg',12),
    (v_id,'Блюз-исполнитель','/images/subcategories/entertainment-favorite-artist/card-13.jpg',13),
    (v_id,'K-Pop группа','/images/subcategories/entertainment-favorite-artist/card-14.jpg',14),
    (v_id,'Оперный певец','/images/subcategories/entertainment-favorite-artist/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимый исполнитель: 15';
  END IF;

  -- 2.4 Любимая песня
  SELECT id INTO v_id FROM subcategories WHERE name='Любимая песня' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Рок-баллада','/images/subcategories/entertainment-favorite-song/card-1.jpg',1),
    (v_id,'Танцевальный хит','/images/subcategories/entertainment-favorite-song/card-2.jpg',2),
    (v_id,'Романтическая песня','/images/subcategories/entertainment-favorite-song/card-3.jpg',3),
    (v_id,'Гимн поколения','/images/subcategories/entertainment-favorite-song/card-4.jpg',4),
    (v_id,'Летний хит','/images/subcategories/entertainment-favorite-song/card-5.jpg',5),
    (v_id,'Грустная песня','/images/subcategories/entertainment-favorite-song/card-6.jpg',6),
    (v_id,'Мотивирующий трек','/images/subcategories/entertainment-favorite-song/card-7.jpg',7),
    (v_id,'Ретро-хит','/images/subcategories/entertainment-favorite-song/card-8.jpg',8),
    (v_id,'Рэп-трек','/images/subcategories/entertainment-favorite-song/card-9.jpg',9),
    (v_id,'Электронный трек','/images/subcategories/entertainment-favorite-song/card-10.jpg',10),
    (v_id,'Джазовая композиция','/images/subcategories/entertainment-favorite-song/card-11.jpg',11),
    (v_id,'Акустическая песня','/images/subcategories/entertainment-favorite-song/card-12.jpg',12),
    (v_id,'Песня из фильма','/images/subcategories/entertainment-favorite-song/card-13.jpg',13),
    (v_id,'Кавер-версия','/images/subcategories/entertainment-favorite-song/card-14.jpg',14),
    (v_id,'Инструментальная','/images/subcategories/entertainment-favorite-song/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимая песня: 15';
  END IF;

  -- 2.5 Сериал, который стоит пересмотреть
  SELECT id INTO v_id FROM subcategories WHERE name='Сериал, который стоит пересмотреть' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Игра престолов','/images/subcategories/entertainment-series/card-1.jpg',1),
    (v_id,'Друзья','/images/subcategories/entertainment-series/card-2.jpg',2),
    (v_id,'Во все тяжкие','/images/subcategories/entertainment-series/card-3.jpg',3),
    (v_id,'Шерлок','/images/subcategories/entertainment-series/card-4.jpg',4),
    (v_id,'Офис','/images/subcategories/entertainment-series/card-5.jpg',5),
    (v_id,'Странные дела','/images/subcategories/entertainment-series/card-6.jpg',6),
    (v_id,'Черное зеркало','/images/subcategories/entertainment-series/card-7.jpg',7),
    (v_id,'Теория большого взрыва','/images/subcategories/entertainment-series/card-8.jpg',8),
    (v_id,'Корона','/images/subcategories/entertainment-series/card-9.jpg',9),
    (v_id,'Мандалорец','/images/subcategories/entertainment-series/card-10.jpg',10),
    (v_id,'Ведьмак','/images/subcategories/entertainment-series/card-11.jpg',11),
    (v_id,'Бумажный дом','/images/subcategories/entertainment-series/card-12.jpg',12),
    (v_id,'Ривердейл','/images/subcategories/entertainment-series/card-13.jpg',13),
    (v_id,'Викинги','/images/subcategories/entertainment-series/card-14.jpg',14),
    (v_id,'Карточный домик','/images/subcategories/entertainment-series/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Сериал: 15';
  END IF;

  -- 2.6 Любимая игра (настольная / видеоигра)
  SELECT id INTO v_id FROM subcategories WHERE name='Любимая игра (настольная / видеоигра)' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Монополия','/images/subcategories/entertainment-favorite-game/card-1.jpg',1),
    (v_id,'Шахматы','/images/subcategories/entertainment-favorite-game/card-2.jpg',2),
    (v_id,'Мафия','/images/subcategories/entertainment-favorite-game/card-3.jpg',3),
    (v_id,'GTA','/images/subcategories/entertainment-favorite-game/card-4.jpg',4),
    (v_id,'FIFA','/images/subcategories/entertainment-favorite-game/card-5.jpg',5),
    (v_id,'Minecraft','/images/subcategories/entertainment-favorite-game/card-6.jpg',6),
    (v_id,'The Witcher','/images/subcategories/entertainment-favorite-game/card-7.jpg',7),
    (v_id,'CS:GO','/images/subcategories/entertainment-favorite-game/card-8.jpg',8),
    (v_id,'Покер','/images/subcategories/entertainment-favorite-game/card-9.jpg',9),
    (v_id,'Dota 2','/images/subcategories/entertainment-favorite-game/card-10.jpg',10),
    (v_id,'Каркассон','/images/subcategories/entertainment-favorite-game/card-11.jpg',11),
    (v_id,'Uno','/images/subcategories/entertainment-favorite-game/card-12.jpg',12),
    (v_id,'Скрабл','/images/subcategories/entertainment-favorite-game/card-13.jpg',13),
    (v_id,'Resident Evil','/images/subcategories/entertainment-favorite-game/card-14.jpg',14),
    (v_id,'Red Dead Redemption','/images/subcategories/entertainment-favorite-game/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимая игра: 15';
  END IF;

  -- 2.7 Самый вдохновляющий фильм
  SELECT id INTO v_id FROM subcategories WHERE name='Самый вдохновляющий фильм' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'В погоне за счастьем','/images/subcategories/entertainment-inspiring-movie/card-1.jpg',1),
    (v_id,'Общество мертвых поэтов','/images/subcategories/entertainment-inspiring-movie/card-2.jpg',2),
    (v_id,'Король говорит','/images/subcategories/entertainment-inspiring-movie/card-3.jpg',3),
    (v_id,'Всегда говори «Да»','/images/subcategories/entertainment-inspiring-movie/card-4.jpg',4),
    (v_id,'127 часов','/images/subcategories/entertainment-inspiring-movie/card-5.jpg',5),
    (v_id,'Невозможное','/images/subcategories/entertainment-inspiring-movie/card-6.jpg',6),
    (v_id,'Август Раш','/images/subcategories/entertainment-inspiring-movie/card-7.jpg',7),
    (v_id,'Жизнь прекрасна','/images/subcategories/entertainment-inspiring-movie/card-8.jpg',8),
    (v_id,'Рокки','/images/subcategories/entertainment-inspiring-movie/card-9.jpg',9),
    (v_id,'Социальная сеть','/images/subcategories/entertainment-inspiring-movie/card-10.jpg',10),
    (v_id,'Билли Эллиот','/images/subcategories/entertainment-inspiring-movie/card-11.jpg',11),
    (v_id,'Малышка на миллион','/images/subcategories/entertainment-inspiring-movie/card-12.jpg',12),
    (v_id,'Достучаться до небес','/images/subcategories/entertainment-inspiring-movie/card-13.jpg',13),
    (v_id,'Одаренная','/images/subcategories/entertainment-inspiring-movie/card-14.jpg',14),
    (v_id,'Игры разума','/images/subcategories/entertainment-inspiring-movie/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Вдохновляющий фильм: 15';
  END IF;

  RAISE NOTICE '🎬 Развлечения и культура: 105 вопросов добавлено';
END $$;
