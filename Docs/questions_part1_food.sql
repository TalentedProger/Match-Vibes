-- Part 1: Еда и напитки (105 вопросов)
DO $$ 
DECLARE v_id UUID;
BEGIN
  -- 1.1 Любимая кухня
  SELECT id INTO v_id FROM subcategories WHERE name='Любимая кухня' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Итальянская','/images/subcategories/food-favorite-cuisine/card-1.jpg',1),
    (v_id,'Японская','/images/subcategories/food-favorite-cuisine/card-2.jpg',2),
    (v_id,'Мексиканская','/images/subcategories/food-favorite-cuisine/card-3.jpg',3),
    (v_id,'Французская','/images/subcategories/food-favorite-cuisine/card-4.jpg',4),
    (v_id,'Китайская','/images/subcategories/food-favorite-cuisine/card-5.jpg',5),
    (v_id,'Индийская','/images/subcategories/food-favorite-cuisine/card-6.jpg',6),
    (v_id,'Тайская','/images/subcategories/food-favorite-cuisine/card-7.jpg',7),
    (v_id,'Грузинская','/images/subcategories/food-favorite-cuisine/card-8.jpg',8),
    (v_id,'Средиземноморская','/images/subcategories/food-favorite-cuisine/card-9.jpg',9),
    (v_id,'Корейская','/images/subcategories/food-favorite-cuisine/card-10.jpg',10),
    (v_id,'Вьетнамская','/images/subcategories/food-favorite-cuisine/card-11.jpg',11),
    (v_id,'Турецкая','/images/subcategories/food-favorite-cuisine/card-12.jpg',12),
    (v_id,'Испанская','/images/subcategories/food-favorite-cuisine/card-13.jpg',13),
    (v_id,'Русская','/images/subcategories/food-favorite-cuisine/card-14.jpg',14),
    (v_id,'Американская','/images/subcategories/food-favorite-cuisine/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимая кухня: 15';
  END IF;

  -- 1.2 Любимое блюдо
  SELECT id INTO v_id FROM subcategories WHERE name='Любимое блюдо' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Пицца Маргарита','/images/subcategories/food-favorite-dish/card-1.jpg',1),
    (v_id,'Борщ','/images/subcategories/food-favorite-dish/card-2.jpg',2),
    (v_id,'Паста Карбонара','/images/subcategories/food-favorite-dish/card-3.jpg',3),
    (v_id,'Суши Сет','/images/subcategories/food-favorite-dish/card-4.jpg',4),
    (v_id,'Стейк Рибай','/images/subcategories/food-favorite-dish/card-5.jpg',5),
    (v_id,'Рамен','/images/subcategories/food-favorite-dish/card-6.jpg',6),
    (v_id,'Лазанья','/images/subcategories/food-favorite-dish/card-7.jpg',7),
    (v_id,'Хачапури','/images/subcategories/food-favorite-dish/card-8.jpg',8),
    (v_id,'Пельмени','/images/subcategories/food-favorite-dish/card-9.jpg',9),
    (v_id,'Бургер','/images/subcategories/food-favorite-dish/card-10.jpg',10),
    (v_id,'Ризотто','/images/subcategories/food-favorite-dish/card-11.jpg',11),
    (v_id,'Шашлык','/images/subcategories/food-favorite-dish/card-12.jpg',12),
    (v_id,'Плов','/images/subcategories/food-favorite-dish/card-13.jpg',13),
    (v_id,'Том Ям','/images/subcategories/food-favorite-dish/card-14.jpg',14),
    (v_id,'Утка по-пекински','/images/subcategories/food-favorite-dish/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Любимое блюдо: 15';
  END IF;

  -- 1.3 Кофе / чай
  SELECT id INTO v_id FROM subcategories WHERE name='Кофе / чай' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Эспрессо','/images/subcategories/food-coffee-tea/card-1.jpg',1),
    (v_id,'Капучино','/images/subcategories/food-coffee-tea/card-2.jpg',2),
    (v_id,'Латте','/images/subcategories/food-coffee-tea/card-3.jpg',3),
    (v_id,'Черный чай','/images/subcategories/food-coffee-tea/card-4.jpg',4),
    (v_id,'Зеленый чай','/images/subcategories/food-coffee-tea/card-5.jpg',5),
    (v_id,'Матча','/images/subcategories/food-coffee-tea/card-6.jpg',6),
    (v_id,'Американо','/images/subcategories/food-coffee-tea/card-7.jpg',7),
    (v_id,'Флэт Уайт','/images/subcategories/food-coffee-tea/card-8.jpg',8),
    (v_id,'Раф','/images/subcategories/food-coffee-tea/card-9.jpg',9),
    (v_id,'Травяной чай','/images/subcategories/food-coffee-tea/card-10.jpg',10),
    (v_id,'Фраппучино','/images/subcategories/food-coffee-tea/card-11.jpg',11),
    (v_id,'Масала чай','/images/subcategories/food-coffee-tea/card-12.jpg',12),
    (v_id,'Турецкий кофе','/images/subcategories/food-coffee-tea/card-13.jpg',13),
    (v_id,'Пуэр','/images/subcategories/food-coffee-tea/card-14.jpg',14),
    (v_id,'Колд брю','/images/subcategories/food-coffee-tea/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Кофе / чай: 15';
  END IF;

  -- 1.4 Десерты
  SELECT id INTO v_id FROM subcategories WHERE name='Десерты' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Тирамису','/images/subcategories/food-desserts/card-1.jpg',1),
    (v_id,'Чизкейк','/images/subcategories/food-desserts/card-2.jpg',2),
    (v_id,'Брауни','/images/subcategories/food-desserts/card-3.jpg',3),
    (v_id,'Макаруны','/images/subcategories/food-desserts/card-4.jpg',4),
    (v_id,'Эклеры','/images/subcategories/food-desserts/card-5.jpg',5),
    (v_id,'Панна-котта','/images/subcategories/food-desserts/card-6.jpg',6),
    (v_id,'Медовик','/images/subcategories/food-desserts/card-7.jpg',7),
    (v_id,'Профитроли','/images/subcategories/food-desserts/card-8.jpg',8),
    (v_id,'Павлова','/images/subcategories/food-desserts/card-9.jpg',9),
    (v_id,'Штрудель','/images/subcategories/food-desserts/card-10.jpg',10),
    (v_id,'Крем-брюле','/images/subcategories/food-desserts/card-11.jpg',11),
    (v_id,'Наполеон','/images/subcategories/food-desserts/card-12.jpg',12),
    (v_id,'Пахлава','/images/subcategories/food-desserts/card-13.jpg',13),
    (v_id,'Маффины','/images/subcategories/food-desserts/card-14.jpg',14),
    (v_id,'Мороженое','/images/subcategories/food-desserts/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Десерты: 15';
  END IF;

  -- 1.5 Уличная еда
  SELECT id INTO v_id FROM subcategories WHERE name='Уличная еда' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Хот-дог','/images/subcategories/food-street-food/card-1.jpg',1),
    (v_id,'Шаурма','/images/subcategories/food-street-food/card-2.jpg',2),
    (v_id,'Тако','/images/subcategories/food-street-food/card-3.jpg',3),
    (v_id,'Бургер','/images/subcategories/food-street-food/card-4.jpg',4),
    (v_id,'Корн-дог','/images/subcategories/food-street-food/card-5.jpg',5),
    (v_id,'Фалафель','/images/subcategories/food-street-food/card-6.jpg',6),
    (v_id,'Пирожок','/images/subcategories/food-street-food/card-7.jpg',7),
    (v_id,'Чебурек','/images/subcategories/food-street-food/card-8.jpg',8),
    (v_id,'Бань-ми','/images/subcategories/food-street-food/card-9.jpg',9),
    (v_id,'Сэндвич','/images/subcategories/food-street-food/card-10.jpg',10),
    (v_id,'Самса','/images/subcategories/food-street-food/card-11.jpg',11),
    (v_id,'Вафли','/images/subcategories/food-street-food/card-12.jpg',12),
    (v_id,'Блины','/images/subcategories/food-street-food/card-13.jpg',13),
    (v_id,'Пицца кусочек','/images/subcategories/food-street-food/card-14.jpg',14),
    (v_id,'Картофель фри','/images/subcategories/food-street-food/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Уличная еда: 15';
  END IF;

  -- 1.6 Завтрак мечты
  SELECT id INTO v_id FROM subcategories WHERE name='Завтрак мечты' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Панкейки с ягодами','/images/subcategories/food-dream-breakfast/card-1.jpg',1),
    (v_id,'Круассаны','/images/subcategories/food-dream-breakfast/card-2.jpg',2),
    (v_id,'Яичница с беконом','/images/subcategories/food-dream-breakfast/card-3.jpg',3),
    (v_id,'Авокадо тост','/images/subcategories/food-dream-breakfast/card-4.jpg',4),
    (v_id,'Овсянка с фруктами','/images/subcategories/food-dream-breakfast/card-5.jpg',5),
    (v_id,'Бельгийские вафли','/images/subcategories/food-dream-breakfast/card-6.jpg',6),
    (v_id,'Омлет','/images/subcategories/food-dream-breakfast/card-7.jpg',7),
    (v_id,'Гранола с йогуртом','/images/subcategories/food-dream-breakfast/card-8.jpg',8),
    (v_id,'Бейглы с лососем','/images/subcategories/food-dream-breakfast/card-9.jpg',9),
    (v_id,'Французские тосты','/images/subcategories/food-dream-breakfast/card-10.jpg',10),
    (v_id,'Сырники','/images/subcategories/food-dream-breakfast/card-11.jpg',11),
    (v_id,'Смузи боул','/images/subcategories/food-dream-breakfast/card-12.jpg',12),
    (v_id,'Английский завтрак','/images/subcategories/food-dream-breakfast/card-13.jpg',13),
    (v_id,'Шакшука','/images/subcategories/food-dream-breakfast/card-14.jpg',14),
    (v_id,'Блинчики','/images/subcategories/food-dream-breakfast/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Завтрак мечты: 15';
  END IF;

  -- 1.7 Ресторан мечты
  SELECT id INTO v_id FROM subcategories WHERE name='Ресторан мечты' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO questions(subcategory_id,text,image_url,order_index) VALUES
    (v_id,'Мишленовский ресторан','/images/subcategories/food-dream-restaurant/card-1.jpg',1),
    (v_id,'Панорамный ресторан','/images/subcategories/food-dream-restaurant/card-2.jpg',2),
    (v_id,'Ресторан у моря','/images/subcategories/food-dream-restaurant/card-3.jpg',3),
    (v_id,'Японский ресторан','/images/subcategories/food-dream-restaurant/card-4.jpg',4),
    (v_id,'Итальянская траттория','/images/subcategories/food-dream-restaurant/card-5.jpg',5),
    (v_id,'Стейк-хаус','/images/subcategories/food-dream-restaurant/card-6.jpg',6),
    (v_id,'Веганский ресторан','/images/subcategories/food-dream-restaurant/card-7.jpg',7),
    (v_id,'Молекулярная кухня','/images/subcategories/food-dream-restaurant/card-8.jpg',8),
    (v_id,'Ресторан на воде','/images/subcategories/food-dream-restaurant/card-9.jpg',9),
    (v_id,'Ресторан в замке','/images/subcategories/food-dream-restaurant/card-10.jpg',10),
    (v_id,'Тематический ресторан','/images/subcategories/food-dream-restaurant/card-11.jpg',11),
    (v_id,'Гастропаб','/images/subcategories/food-dream-restaurant/card-12.jpg',12),
    (v_id,'Ресторан в саду','/images/subcategories/food-dream-restaurant/card-13.jpg',13),
    (v_id,'Семейный ресторан','/images/subcategories/food-dream-restaurant/card-14.jpg',14),
    (v_id,'Футуристический','/images/subcategories/food-dream-restaurant/card-15.jpg',15)
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Ресторан мечты: 15';
  END IF;

  RAISE NOTICE '🍕 Еда и напитки: 105 вопросов добавлено';
END $$;
