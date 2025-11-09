-- Part 4: Отношения и личность (90 вопросов)
DO $$ 
DECLARE v_id UUID;
BEGIN
  -- 4.1 Главное качество в человеке
  SELECT id INTO v_id FROM subcategories WHERE name='Главное качество в человеке' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Честность','/images/subcategories/relationships-main-quality/card-1.jpg',1),
    (v_id,'Доброта','/images/subcategories/relationships-main-quality/card-2.jpg',2),
    (v_id,'Ум','/images/subcategories/relationships-main-quality/card-3.jpg',3),
    (v_id,'Юмор','/images/subcategories/relationships-main-quality/card-4.jpg',4),
    (v_id,'Верность','/images/subcategories/relationships-main-quality/card-5.jpg',5),
    (v_id,'Смелость','/images/subcategories/relationships-main-quality/card-6.jpg',6),
    (v_id,'Щедрость','/images/subcategories/relationships-main-quality/card-7.jpg',7),
    (v_id,'Уважение','/images/subcategories/relationships-main-quality/card-8.jpg',8),
    (v_id,'Ответственность','/images/subcategories/relationships-main-quality/card-9.jpg',9),
    (v_id,'Терпение','/images/subcategories/relationships-main-quality/card-10.jpg',10),
    (v_id,'Искренность','/images/subcategories/relationships-main-quality/card-11.jpg',11),
    (v_id,'Креативность','/images/subcategories/relationships-main-quality/card-12.jpg',12),
    (v_id,'Амбициозность','/images/subcategories/relationships-main-quality/card-13.jpg',13),
    (v_id,'Эмпатия','/images/subcategories/relationships-main-quality/card-14.jpg',14),
    (v_id,'Оптимизм','/images/subcategories/relationships-main-quality/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Главное качество: 15';
  END IF;

  -- 4.2 Главный страх
  SELECT id INTO v_id FROM subcategories WHERE name='Главный страх' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Одиночество','/images/subcategories/relationships-main-fear/card-1.jpg',1),
    (v_id,'Потеря близких','/images/subcategories/relationships-main-fear/card-2.jpg',2),
    (v_id,'Неудача','/images/subcategories/relationships-main-fear/card-3.jpg',3),
    (v_id,'Болезнь','/images/subcategories/relationships-main-fear/card-4.jpg',4),
    (v_id,'Предательство','/images/subcategories/relationships-main-fear/card-5.jpg',5),
    (v_id,'Бедность','/images/subcategories/relationships-main-fear/card-6.jpg',6),
    (v_id,'Публичное унижение','/images/subcategories/relationships-main-fear/card-7.jpg',7),
    (v_id,'Смерть','/images/subcategories/relationships-main-fear/card-8.jpg',8),
    (v_id,'Неопределенность','/images/subcategories/relationships-main-fear/card-9.jpg',9),
    (v_id,'Отвержение','/images/subcategories/relationships-main-fear/card-10.jpg',10),
    (v_id,'Потеря контроля','/images/subcategories/relationships-main-fear/card-11.jpg',11),
    (v_id,'Несправедливость','/images/subcategories/relationships-main-fear/card-12.jpg',12),
    (v_id,'Изоляция','/images/subcategories/relationships-main-fear/card-13.jpg',13),
    (v_id,'Жалость','/images/subcategories/relationships-main-fear/card-14.jpg',14),
    (v_id,'Обыденность','/images/subcategories/relationships-main-fear/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Главный страх: 15';
  END IF;

  -- 4.3 Заветная мечта
  SELECT id INTO v_id FROM subcategories WHERE name='Заветная мечта' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Путешествие по миру','/images/subcategories/relationships-dream/card-1.jpg',1),
    (v_id,'Счастливая семья','/images/subcategories/relationships-dream/card-2.jpg',2),
    (v_id,'Собственный бизнес','/images/subcategories/relationships-dream/card-3.jpg',3),
    (v_id,'Творческая реализация','/images/subcategories/relationships-dream/card-4.jpg',4),
    (v_id,'Финансовая свобода','/images/subcategories/relationships-dream/card-5.jpg',5),
    (v_id,'Помогать людям','/images/subcategories/relationships-dream/card-6.jpg',6),
    (v_id,'Жить у моря','/images/subcategories/relationships-dream/card-7.jpg',7),
    (v_id,'Научное открытие','/images/subcategories/relationships-dream/card-8.jpg',8),
    (v_id,'Известность','/images/subcategories/relationships-dream/card-9.jpg',9),
    (v_id,'Гармония с собой','/images/subcategories/relationships-dream/card-10.jpg',10),
    (v_id,'Написать книгу','/images/subcategories/relationships-dream/card-11.jpg',11),
    (v_id,'Здоровье близких','/images/subcategories/relationships-dream/card-12.jpg',12),
    (v_id,'Свой дом','/images/subcategories/relationships-dream/card-13.jpg',13),
    (v_id,'Вечная любовь','/images/subcategories/relationships-dream/card-14.jpg',14),
    (v_id,'Изменить мир','/images/subcategories/relationships-dream/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Заветная мечта: 15';
  END IF;

  -- 4.4 Отношение к дружбе
  SELECT id INTO v_id FROM subcategories WHERE name='Отношение к дружбе' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Несколько близких друзей','/images/subcategories/relationships-friendship/card-1.jpg',1),
    (v_id,'Много знакомых','/images/subcategories/relationships-friendship/card-2.jpg',2),
    (v_id,'Друзья детства','/images/subcategories/relationships-friendship/card-3.jpg',3),
    (v_id,'Новые знакомства','/images/subcategories/relationships-friendship/card-4.jpg',4),
    (v_id,'Общие интересы','/images/subcategories/relationships-friendship/card-5.jpg',5),
    (v_id,'Взаимопомощь','/images/subcategories/relationships-friendship/card-6.jpg',6),
    (v_id,'Веселье вместе','/images/subcategories/relationships-friendship/card-7.jpg',7),
    (v_id,'Глубокие разговоры','/images/subcategories/relationships-friendship/card-8.jpg',8),
    (v_id,'Независимость','/images/subcategories/relationships-friendship/card-9.jpg',9),
    (v_id,'Постоянное общение','/images/subcategories/relationships-friendship/card-10.jpg',10),
    (v_id,'Честность','/images/subcategories/relationships-friendship/card-11.jpg',11),
    (v_id,'Лояльность','/images/subcategories/relationships-friendship/card-12.jpg',12),
    (v_id,'Общие воспоминания','/images/subcategories/relationships-friendship/card-13.jpg',13),
    (v_id,'Доверие','/images/subcategories/relationships-friendship/card-14.jpg',14),
    (v_id,'Друзья как семья','/images/subcategories/relationships-friendship/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Отношение к дружбе: 15';
  END IF;

  -- 4.5 Как ты проявляешь заботу
  SELECT id INTO v_id FROM subcategories WHERE name='Как ты проявляешь заботу' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Слушаю и поддерживаю','/images/subcategories/relationships-care/card-1.jpg',1),
    (v_id,'Готовлю еду','/images/subcategories/relationships-care/card-2.jpg',2),
    (v_id,'Дарю подарки','/images/subcategories/relationships-care/card-3.jpg',3),
    (v_id,'Провожу время вместе','/images/subcategories/relationships-care/card-4.jpg',4),
    (v_id,'Помогаю делами','/images/subcategories/relationships-care/card-5.jpg',5),
    (v_id,'Говорю комплименты','/images/subcategories/relationships-care/card-6.jpg',6),
    (v_id,'Обнимаю','/images/subcategories/relationships-care/card-7.jpg',7),
    (v_id,'Даю советы','/images/subcategories/relationships-care/card-8.jpg',8),
    (v_id,'Забочусь о здоровье','/images/subcategories/relationships-care/card-9.jpg',9),
    (v_id,'Создаю комфорт','/images/subcategories/relationships-care/card-10.jpg',10),
    (v_id,'Защищаю','/images/subcategories/relationships-care/card-11.jpg',11),
    (v_id,'Вдохновляю','/images/subcategories/relationships-care/card-12.jpg',12),
    (v_id,'Прощаю','/images/subcategories/relationships-care/card-13.jpg',13),
    (v_id,'Делаю массаж','/images/subcategories/relationships-care/card-14.jpg',14),
    (v_id,'Просто рядом','/images/subcategories/relationships-care/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Проявление заботы: 15';
  END IF;

  -- 4.6 Любимый тип отдыха вдвоем
  SELECT id INTO v_id FROM subcategories WHERE name='Любимый тип отдыха вдвоем' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Путешествия','/images/subcategories/relationships-rest-together/card-1.jpg',1),
    (v_id,'Домашний уют','/images/subcategories/relationships-rest-together/card-2.jpg',2),
    (v_id,'Активный спорт','/images/subcategories/relationships-rest-together/card-3.jpg',3),
    (v_id,'Прогулки на природе','/images/subcategories/relationships-rest-together/card-4.jpg',4),
    (v_id,'Рестораны и кафе','/images/subcategories/relationships-rest-together/card-5.jpg',5),
    (v_id,'Культурные мероприятия','/images/subcategories/relationships-rest-together/card-6.jpg',6),
    (v_id,'Пляжный отдых','/images/subcategories/relationships-rest-together/card-7.jpg',7),
    (v_id,'Игры вдвоем','/images/subcategories/relationships-rest-together/card-8.jpg',8),
    (v_id,'Готовим вместе','/images/subcategories/relationships-rest-together/card-9.jpg',9),
    (v_id,'Читаем рядом','/images/subcategories/relationships-rest-together/card-10.jpg',10),
    (v_id,'Танцы','/images/subcategories/relationships-rest-together/card-11.jpg',11),
    (v_id,'Творчество','/images/subcategories/relationships-rest-together/card-12.jpg',12),
    (v_id,'Спа и релакс','/images/subcategories/relationships-rest-together/card-13.jpg',13),
    (v_id,'Экстрим','/images/subcategories/relationships-rest-together/card-14.jpg',14),
    (v_id,'Просто разговоры','/images/subcategories/relationships-rest-together/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Отдых вдвоем: 15';
  END IF;

  RAISE NOTICE '💞 Отношения и личность: 90 вопросов добавлено';
END $$;
