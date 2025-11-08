-- MatchVibe Database Schema - SAFE RERUN VERSION
-- Supabase PostgreSQL Setup
-- Version: 1.0.1
-- Last Updated: 2025-01-08
-- This script can be run multiple times safely

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  premium_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  color TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('waiting', 'ready', 'playing', 'completed', 'cancelled')) DEFAULT 'waiting',
  invitation_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer SMALLINT CHECK (answer IN (0, 1)) NOT NULL, -- 0 = dislike, 1 = like
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id, question_id)
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID UNIQUE REFERENCES rooms(id) ON DELETE CASCADE,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  match_percentage DECIMAL(5,2) NOT NULL,
  host_favorite TEXT,
  guest_favorite TEXT,
  shared_item TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_name, category_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement INT NOT NULL,
  type TEXT CHECK (type IN ('games', 'matches', 'friends', 'compatibility')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON profiles(telegram_id);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_guest_id ON rooms(guest_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_invitation_code ON rooms(invitation_code);
CREATE INDEX IF NOT EXISTS idx_responses_room_id ON responses(room_id);
CREATE INDEX IF NOT EXISTS idx_responses_user_id ON responses(user_id);
CREATE INDEX IF NOT EXISTS idx_results_host_id ON results(host_id);
CREATE INDEX IF NOT EXISTS idx_results_guest_id ON results(guest_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON questions(category_id);

-- Create updated_at trigger function (drop and recreate to avoid conflicts)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to profiles table (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- SIMPLIFIED FOR TELEGRAM MINI APP (No Supabase Auth)
-- Note: For production, consider implementing service role authentication

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all operations on rooms" ON rooms;
DROP POLICY IF EXISTS "Allow all operations on responses" ON responses;
DROP POLICY IF EXISTS "Allow all operations on results" ON results;
DROP POLICY IF EXISTS "Allow all operations on favorites" ON favorites;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
DROP POLICY IF EXISTS "Allow all operations on user_achievements" ON user_achievements;

-- Profiles: Allow all operations (Telegram validates on API level)
CREATE POLICY "Allow all operations on profiles"
  ON profiles
  USING (true)
  WITH CHECK (true);

-- Rooms: Allow all operations
CREATE POLICY "Allow all operations on rooms"
  ON rooms
  USING (true)
  WITH CHECK (true);

-- Responses: Allow all operations
CREATE POLICY "Allow all operations on responses"
  ON responses
  USING (true)
  WITH CHECK (true);

-- Results: Allow all operations
CREATE POLICY "Allow all operations on results"
  ON results
  USING (true)
  WITH CHECK (true);

-- Favorites: Allow all operations
CREATE POLICY "Allow all operations on favorites"
  ON favorites
  USING (true)
  WITH CHECK (true);

-- Categories: Public read-only
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = TRUE);

-- Questions: Public read-only
CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (is_active = TRUE);

-- Achievements: Public read-only
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

-- User Achievements: Allow all operations (users can unlock achievements)
CREATE POLICY "Allow all operations on user_achievements"
  ON user_achievements
  USING (true)
  WITH CHECK (true);

-- Seed initial categories (ON CONFLICT DO NOTHING to avoid duplicates)
INSERT INTO categories (name, description, icon, color, order_index) VALUES
  ('Еда и напитки', 'Узнайте ваши общие вкусы в еде', '🍕', 'hsl(25, 100%, 66%)', 1),
  ('Фильмы', 'Найдите общие любимые фильмы', '🎬', 'hsl(276, 100%, 70%)', 2),
  ('Животные', 'Кого вы любите больше?', '🐶', 'hsl(30, 100%, 74%)', 3),
  ('Отношения', 'Узнайте о важном в отношениях', '💞', 'hsl(345, 100%, 74%)', 4),
  ('Путешествия', 'Куда бы вы хотели поехать', '🏖️', 'hsl(210, 100%, 70%)', 5)
ON CONFLICT DO NOTHING;

-- Seed initial achievements (ON CONFLICT DO NOTHING to avoid duplicates)
INSERT INTO achievements (name, description, icon, requirement, type) VALUES
  ('Первая игра', 'Сыграйте первую игру', '🎯', 1, 'games'),
  ('10 игр', 'Сыграйте 10 игр', '🔥', 10, 'games'),
  ('50 игр', 'Сыграйте 50 игр', '⭐', 50, 'games'),
  ('Первое совпадение', 'Найдите первое совпадение', '💫', 1, 'matches'),
  ('10 совпадений', 'Найдите 10 совпадений', '✨', 10, 'matches'),
  ('Высокая совместимость', 'Достигните 80%+ совместимости', '💯', 80, 'compatibility')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created/updated successfully!';
  RAISE NOTICE 'Created tables: profiles, categories, questions, rooms, responses, results, favorites, achievements, user_achievements';
  RAISE NOTICE 'RLS policies configured for Telegram Mini App';
END $$;
