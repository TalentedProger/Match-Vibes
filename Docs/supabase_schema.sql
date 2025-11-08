-- MatchVibe Database Schema
-- Supabase PostgreSQL Setup
-- Version: 1.0.0
-- Last Updated: 2025-01-08

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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to profiles table
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Rooms: Users can view rooms they're part of
CREATE POLICY "Users can view their own rooms"
  ON rooms FOR SELECT
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

CREATE POLICY "Users can create rooms"
  ON rooms FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own rooms"
  ON rooms FOR UPDATE
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

-- Responses: Users can view and insert their own responses
CREATE POLICY "Users can view their own responses"
  ON responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Results: Users can view results of their games
CREATE POLICY "Users can view their own results"
  ON results FOR SELECT
  USING (auth.uid() = host_id OR auth.uid() = guest_id);

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Categories and Questions are public (read-only)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (is_active = TRUE);

-- Seed initial categories
INSERT INTO categories (name, description, icon, color, order_index) VALUES
  ('Еда и напитки', 'Узнайте ваши общие вкусы в еде', '🍕', 'hsl(25, 100%, 66%)', 1),
  ('Фильмы', 'Найдите общие любимые фильмы', '🎬', 'hsl(276, 100%, 70%)', 2),
  ('Животные', 'Кого вы любите больше?', '🐶', 'hsl(30, 100%, 74%)', 3),
  ('Отношения', 'Узнайте о важном в отношениях', '💞', 'hsl(345, 100%, 74%)', 4),
  ('Путешествия', 'Куда бы вы хотели поехать', '🏖️', 'hsl(210, 100%, 70%)', 5)
ON CONFLICT DO NOTHING;

-- Seed initial achievements
INSERT INTO achievements (name, description, icon, requirement, type) VALUES
  ('Первая игра', 'Сыграйте первую игру', '🎯', 1, 'games'),
  ('10 игр', 'Сыграйте 10 игр', '🔥', 10, 'games'),
  ('50 игр', 'Сыграйте 50 игр', '⭐', 50, 'games'),
  ('Первое совпадение', 'Найдите первое совпадение', '💫', 1, 'matches'),
  ('10 совпадений', 'Найдите 10 совпадений', '✨', 10, 'matches'),
  ('Высокая совместимость', 'Достигните 80%+ совместимости', '💯', 80, 'compatibility')
ON CONFLICT DO NOTHING;
