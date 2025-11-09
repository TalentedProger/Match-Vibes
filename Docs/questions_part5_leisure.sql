-- Part 5: Досуг и путешествия (75 вопросов)
DO $$ 
DECLARE v_id UUID;
BEGIN
  -- 5.1 Любимое место отдыха
  SELECT id INTO v_id FROM subcategories WHERE name='Любимое место отдыха' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Морской курорт','/images/subcategories/leisure-favorite-place/card-1.jpg',1),
    (v_id,'Горы','/images/subcategories/leisure-favorite-place/card-2.jpg',2),
    (v_id,'Загородный дом','/images/subcategories/leisure-favorite-place/card-3.jpg',3),
    (v_id,'Городской отель','/images/subcategories/leisure-favorite-place/card-4.jpg',4),
    (v_id,'Тропический остров','/images/subcategories/leisure-favorite-place/card-5.jpg',5),
    (v_id,'Лесная база','/images/subcategories/leisure-favorite-place/card-6.jpg',6),
    (v_id,'Горнолыжный курорт','/images/subcategories/leisure-favorite-place/card-7.jpg',7),
    (v_id,'Кемпинг','/images/subcategories/leisure-favorite-place/card-8.jpg',8),
    (v_id,'Спа-отель','/images/subcategories/leisure-favorite-place/card-9.jpg',9),
    (v_id,'Круизный лайнер','/images/subcategories/leisure-favorite-place/card-10.jpg',10),
    (v_id,'Бунгало на воде','/images/subcategories/leisure-favorite-place/card-11.jpg',11),
    (v_id,'Эко-ферма','/images/subcategories/leisure-favorite-place/card-12.jpg',12),
    (v_id,'Винный регион','/images/subcategories/leisure-favorite-place/card-13.jpg',13),
    (v_id,'Историческое место','/images/subcategories/leisure-favorite-place/card-14.jpg',14),
    (v_id,'Домашний диван','/images/subcategories/leisure-favorite-place/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимое место отдыха: 15';
  END IF;

  -- 5.2 Идеальное путешествие
  SELECT id INTO v_id FROM subcategories WHERE name='Идеальное путешествие' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Автопутешествие','/images/subcategories/leisure-ideal-travel/card-1.jpg',1),
    (v_id,'Круиз','/images/subcategories/leisure-ideal-travel/card-2.jpg',2),
    (v_id,'Пеший туризм','/images/subcategories/leisure-ideal-travel/card-3.jpg',3),
    (v_id,'Экскурсионный тур','/images/subcategories/leisure-ideal-travel/card-4.jpg',4),
    (v_id,'Самостоятельное путешествие','/images/subcategories/leisure-ideal-travel/card-5.jpg',5),
    (v_id,'Пляжный отдых','/images/subcategories/leisure-ideal-travel/card-6.jpg',6),
    (v_id,'Горные походы','/images/subcategories/leisure-ideal-travel/card-7.jpg',7),
    (v_id,'Гастрономический тур','/images/subcategories/leisure-ideal-travel/card-8.jpg',8),
    (v_id,'Культурное погружение','/images/subcategories/leisure-ideal-travel/card-9.jpg',9),
    (v_id,'Приключенческий туризм','/images/subcategories/leisure-ideal-travel/card-10.jpg',10),
    (v_id,'Романтический отпуск','/images/subcategories/leisure-ideal-travel/card-11.jpg',11),
    (v_id,'Фототур','/images/subcategories/leisure-ideal-travel/card-12.jpg',12),
    (v_id,'Духовное путешествие','/images/subcategories/leisure-ideal-travel/card-13.jpg',13),
    (v_id,'Семейный отдых','/images/subcategories/leisure-ideal-travel/card-14.jpg',14),
    (v_id,'Виртуальное путешествие','/images/subcategories/leisure-ideal-travel/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Идеальное путешествие: 15';
  END IF;

  -- 5.3 Активный отдых или релакс
  SELECT id INTO v_id FROM subcategories WHERE name='Активный отдых или релакс' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Бег по утрам','/images/subcategories/leisure-active-relax/card-1.jpg',1),
    (v_id,'Йога на пляже','/images/subcategories/leisure-active-relax/card-2.jpg',2),
    (v_id,'Экстремальный спорт','/images/subcategories/leisure-active-relax/card-3.jpg',3),
    (v_id,'Массаж в спа','/images/subcategories/leisure-active-relax/card-4.jpg',4),
    (v_id,'Велопрогулки','/images/subcategories/leisure-active-relax/card-5.jpg',5),
    (v_id,'Чтение книг','/images/subcategories/leisure-active-relax/card-6.jpg',6),
    (v_id,'Серфинг','/images/subcategories/leisure-active-relax/card-7.jpg',7),
    (v_id,'Медитация','/images/subcategories/leisure-active-relax/card-8.jpg',8),
    (v_id,'Скалолазание','/images/subcategories/leisure-active-relax/card-9.jpg',9),
    (v_id,'Ванна с пеной','/images/subcategories/leisure-active-relax/card-10.jpg',10),
    (v_id,'Дайвинг','/images/subcategories/leisure-active-relax/card-11.jpg',11),
    (v_id,'Созерцание природы','/images/subcategories/leisure-active-relax/card-12.jpg',12),
    (v_id,'Парашютный спорт','/images/subcategories/leisure-active-relax/card-13.jpg',13),
    (v_id,'Сон до обеда','/images/subcategories/leisure-active-relax/card-14.jpg',14),
    (v_id,'Баланс активности и покоя','/images/subcategories/leisure-active-relax/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Активный отдых: 15';
  END IF;

  -- 5.4 Город мечты
  SELECT id INTO v_id FROM subcategories WHERE name='Город мечты' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Париж','/images/subcategories/leisure-dream-city/card-1.jpg',1),
    (v_id,'Нью-Йорк','/images/subcategories/leisure-dream-city/card-2.jpg',2),
    (v_id,'Токио','/images/subcategories/leisure-dream-city/card-3.jpg',3),
    (v_id,'Рим','/images/subcategories/leisure-dream-city/card-4.jpg',4),
    (v_id,'Дубай','/images/subcategories/leisure-dream-city/card-5.jpg',5),
    (v_id,'Лондон','/images/subcategories/leisure-dream-city/card-6.jpg',6),
    (v_id,'Барселона','/images/subcategories/leisure-dream-city/card-7.jpg',7),
    (v_id,'Амстердам','/images/subcategories/leisure-dream-city/card-8.jpg',8),
    (v_id,'Стамбул','/images/subcategories/leisure-dream-city/card-9.jpg',9),
    (v_id,'Сидней','/images/subcategories/leisure-dream-city/card-10.jpg',10),
    (v_id,'Прага','/images/subcategories/leisure-dream-city/card-11.jpg',11),
    (v_id,'Сингапур','/images/subcategories/leisure-dream-city/card-12.jpg',12),
    (v_id,'Венеция','/images/subcategories/leisure-dream-city/card-13.jpg',13),
    (v_id,'Берлин','/images/subcategories/leisure-dream-city/card-14.jpg',14),
    (v_id,'Мой родной город','/images/subcategories/leisure-dream-city/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Город мечты: 15';
  END IF;

  -- 5.5 Идеальный выходной
  SELECT id INTO v_id FROM subcategories WHERE name='Идеальный выходной' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Выспаться и в кровати','/images/subcategories/leisure-ideal-weekend/card-1.jpg',1),
    (v_id,'Бранч с друзьями','/images/subcategories/leisure-ideal-weekend/card-2.jpg',2),
    (v_id,'Поход на природу','/images/subcategories/leisure-ideal-weekend/card-3.jpg',3),
    (v_id,'Кино и попкорн','/images/subcategories/leisure-ideal-weekend/card-4.jpg',4),
    (v_id,'Шопинг','/images/subcategories/leisure-ideal-weekend/card-5.jpg',5),
    (v_id,'Спорт и тренировка','/images/subcategories/leisure-ideal-weekend/card-6.jpg',6),
    (v_id,'Готовка сложного блюда','/images/subcategories/leisure-ideal-weekend/card-7.jpg',7),
    (v_id,'Музеи и выставки','/images/subcategories/leisure-ideal-weekend/card-8.jpg',8),
    (v_id,'Пикник в парке','/images/subcategories/leisure-ideal-weekend/card-9.jpg',9),
    (v_id,'Видеоигры','/images/subcategories/leisure-ideal-weekend/card-10.jpg',10),
    (v_id,'Спа-день','/images/subcategories/leisure-ideal-weekend/card-11.jpg',11),
    (v_id,'Встреча с семьей','/images/subcategories/leisure-ideal-weekend/card-12.jpg',12),
    (v_id,'Концерт или фестиваль','/images/subcategories/leisure-ideal-weekend/card-13.jpg',13),
    (v_id,'Ничего не делать','/images/subcategories/leisure-ideal-weekend/card-14.jpg',14),
    (v_id,'Спонтанные планы','/images/subcategories/leisure-ideal-weekend/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Идеальный выходной: 15';
  END IF;

  RAISE NOTICE '🏖️ Досуг и путешествия: 75 вопросов добавлено';
END $$;
