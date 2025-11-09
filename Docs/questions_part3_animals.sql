-- Part 3: Животные (60 вопросов)
DO $$ 
DECLARE v_id UUID;
BEGIN
  -- 3.1 Любимая порода собак
  SELECT id INTO v_id FROM subcategories WHERE name='Любимая порода собак' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Лабрадор','/images/subcategories/animals-dog-breed/card-1.jpg',1),
    (v_id,'Хаски','/images/subcategories/animals-dog-breed/card-2.jpg',2),
    (v_id,'Немецкая овчарка','/images/subcategories/animals-dog-breed/card-3.jpg',3),
    (v_id,'Золотистый ретривер','/images/subcategories/animals-dog-breed/card-4.jpg',4),
    (v_id,'Французский бульдог','/images/subcategories/animals-dog-breed/card-5.jpg',5),
    (v_id,'Корги','/images/subcategories/animals-dog-breed/card-6.jpg',6),
    (v_id,'Шпиц','/images/subcategories/animals-dog-breed/card-7.jpg',7),
    (v_id,'Бигль','/images/subcategories/animals-dog-breed/card-8.jpg',8),
    (v_id,'Джек-рассел терьер','/images/subcategories/animals-dog-breed/card-9.jpg',9),
    (v_id,'Йоркширский терьер','/images/subcategories/animals-dog-breed/card-10.jpg',10),
    (v_id,'Доберман','/images/subcategories/animals-dog-breed/card-11.jpg',11),
    (v_id,'Чихуахуа','/images/subcategories/animals-dog-breed/card-12.jpg',12),
    (v_id,'Самоед','/images/subcategories/animals-dog-breed/card-13.jpg',13),
    (v_id,'Бордер-колли','/images/subcategories/animals-dog-breed/card-14.jpg',14),
    (v_id,'Мопс','/images/subcategories/animals-dog-breed/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимая порода собак: 15';
  END IF;

  -- 3.2 Кошки vs собаки
  SELECT id INTO v_id FROM subcategories WHERE name='Кошки vs собаки' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Игривый котенок','/images/subcategories/animals-cats-vs-dogs/card-1.jpg',1),
    (v_id,'Преданный пес','/images/subcategories/animals-cats-vs-dogs/card-2.jpg',2),
    (v_id,'Независимая кошка','/images/subcategories/animals-cats-vs-dogs/card-3.jpg',3),
    (v_id,'Энергичный щенок','/images/subcategories/animals-cats-vs-dogs/card-4.jpg',4),
    (v_id,'Ленивый кот','/images/subcategories/animals-cats-vs-dogs/card-5.jpg',5),
    (v_id,'Охранный пес','/images/subcategories/animals-cats-vs-dogs/card-6.jpg',6),
    (v_id,'Грациозная кошка','/images/subcategories/animals-cats-vs-dogs/card-7.jpg',7),
    (v_id,'Дружелюбный пес','/images/subcategories/animals-cats-vs-dogs/card-8.jpg',8),
    (v_id,'Любопытный кот','/images/subcategories/animals-cats-vs-dogs/card-9.jpg',9),
    (v_id,'Обучаемая собака','/images/subcategories/animals-cats-vs-dogs/card-10.jpg',10),
    (v_id,'Чистоплотная кошка','/images/subcategories/animals-cats-vs-dogs/card-11.jpg',11),
    (v_id,'Активная собака','/images/subcategories/animals-cats-vs-dogs/card-12.jpg',12),
    (v_id,'Ночной кот','/images/subcategories/animals-cats-vs-dogs/card-13.jpg',13),
    (v_id,'Дневная собака','/images/subcategories/animals-cats-vs-dogs/card-14.jpg',14),
    (v_id,'Оба хороши!','/images/subcategories/animals-cats-vs-dogs/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Кошки vs собаки: 15';
  END IF;

  -- 3.3 Идеальный питомец
  SELECT id INTO v_id FROM subcategories WHERE name='Идеальный питомец' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Собака','/images/subcategories/animals-ideal-pet/card-1.jpg',1),
    (v_id,'Кошка','/images/subcategories/animals-ideal-pet/card-2.jpg',2),
    (v_id,'Попугай','/images/subcategories/animals-ideal-pet/card-3.jpg',3),
    (v_id,'Хомяк','/images/subcategories/animals-ideal-pet/card-4.jpg',4),
    (v_id,'Кролик','/images/subcategories/animals-ideal-pet/card-5.jpg',5),
    (v_id,'Аквариумные рыбки','/images/subcategories/animals-ideal-pet/card-6.jpg',6),
    (v_id,'Морская свинка','/images/subcategories/animals-ideal-pet/card-7.jpg',7),
    (v_id,'Черепаха','/images/subcategories/animals-ideal-pet/card-8.jpg',8),
    (v_id,'Крыса','/images/subcategories/animals-ideal-pet/card-9.jpg',9),
    (v_id,'Шиншилла','/images/subcategories/animals-ideal-pet/card-10.jpg',10),
    (v_id,'Ёж','/images/subcategories/animals-ideal-pet/card-11.jpg',11),
    (v_id,'Змея','/images/subcategories/animals-ideal-pet/card-12.jpg',12),
    (v_id,'Игуана','/images/subcategories/animals-ideal-pet/card-13.jpg',13),
    (v_id,'Хорек','/images/subcategories/animals-ideal-pet/card-14.jpg',14),
    (v_id,'Сахарный поссум','/images/subcategories/animals-ideal-pet/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Идеальный питомец: 15';
  END IF;

  -- 3.4 Дикая природа или домашние любимцы
  SELECT id INTO v_id FROM subcategories WHERE name='Дикая природа или домашние любимцы' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Африканский лев','/images/subcategories/animals-wildlife/card-1.jpg',1),
    (v_id,'Домашняя кошка','/images/subcategories/animals-wildlife/card-2.jpg',2),
    (v_id,'Волк','/images/subcategories/animals-wildlife/card-3.jpg',3),
    (v_id,'Домашняя собака','/images/subcategories/animals-wildlife/card-4.jpg',4),
    (v_id,'Слон','/images/subcategories/animals-wildlife/card-5.jpg',5),
    (v_id,'Морские свинки','/images/subcategories/animals-wildlife/card-6.jpg',6),
    (v_id,'Тигр','/images/subcategories/animals-wildlife/card-7.jpg',7),
    (v_id,'Канарейка','/images/subcategories/animals-wildlife/card-8.jpg',8),
    (v_id,'Дельфин','/images/subcategories/animals-wildlife/card-9.jpg',9),
    (v_id,'Аквариумные рыбки','/images/subcategories/animals-wildlife/card-10.jpg',10),
    (v_id,'Панда','/images/subcategories/animals-wildlife/card-11.jpg',11),
    (v_id,'Хомяк','/images/subcategories/animals-wildlife/card-12.jpg',12),
    (v_id,'Жираф','/images/subcategories/animals-wildlife/card-13.jpg',13),
    (v_id,'Кролик','/images/subcategories/animals-wildlife/card-14.jpg',14),
    (v_id,'Оба мира интересны','/images/subcategories/animals-wildlife/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Дикая природа: 15';
  END IF;

  RAISE NOTICE '🐶 Животные: 60 вопросов добавлено';
END $$;
