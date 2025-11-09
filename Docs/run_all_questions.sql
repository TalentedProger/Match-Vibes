-- ============================================================
-- MatchVibe: Мастер-файл для запуска всех вопросов
-- ============================================================
-- Версия: 1.0.0
-- Дата: 2025-01-09
-- ============================================================

-- ИНСТРУКЦИЯ ПО ЗАПУСКУ:
-- 1. Убедитесь, что все категории и подкатегории созданы (subcategories_migration.sql)
-- 2. Запустите файлы в следующем порядке:

-- \i 'c:/Users/Салим/Desktop/Together_tests/Docs/questions_part1_food.sql'
-- \i 'c:/Users/Салим/Desktop/Together_tests/Docs/questions_part2_entertainment.sql'
-- \i 'c:/Users/Салим/Desktop/Together_tests/Docs/questions_part3_animals.sql'
-- \i 'c:/Users/Салим/Desktop/Together_tests/Docs/questions_part4_relationships.sql'
-- \i 'c:/Users/Салим/Desktop/Together_tests/Docs/questions_part5_leisure.sql'

-- Или скопируйте содержимое каждого файла в Supabase SQL Editor
-- и запустите их последовательно

RAISE NOTICE '╔═══════════════════════════════════════════════════════════╗';
RAISE NOTICE '║  MatchVibe: Готов к заполнению вопросов                 ║';
RAISE NOTICE '║  Файлы: 5 × SQL (по категориям)                         ║';
RAISE NOTICE '║  Вопросов: 435 (29 подкатегорий × 15 вопросов)          ║';
RAISE NOTICE '╚═══════════════════════════════════════════════════════════╝';
