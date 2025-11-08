-- Performance Optimization Indexes for MatchVibe
-- Run this in Supabase SQL Editor to improve query performance
-- Version: 1.0.0
-- Last Updated: 2025-01-08

-- ========================================
-- Questions Table Optimization
-- ========================================

-- Index for filtering by category_id and is_active (most common query)
CREATE INDEX IF NOT EXISTS idx_questions_category_active 
ON questions(category_id, is_active) 
WHERE is_active = TRUE;

-- Index for ordering results
CREATE INDEX IF NOT EXISTS idx_questions_order 
ON questions(order_index);

-- Composite index for the exact query pattern used in API
CREATE INDEX IF NOT EXISTS idx_questions_lookup 
ON questions(category_id, is_active, order_index) 
WHERE is_active = TRUE;

-- ========================================
-- Rooms Table Optimization
-- ========================================

-- Index for finding room by invitation code
CREATE INDEX IF NOT EXISTS idx_rooms_invitation_code 
ON rooms(invitation_code) 
WHERE status != 'cancelled';

-- Index for finding user's active rooms
CREATE INDEX IF NOT EXISTS idx_rooms_host_status 
ON rooms(host_id, status);

CREATE INDEX IF NOT EXISTS idx_rooms_guest_status 
ON rooms(guest_id, status);

-- ========================================
-- Responses Table Optimization  
-- ========================================

-- Index for counting responses per room/user
CREATE INDEX IF NOT EXISTS idx_responses_room_user 
ON responses(room_id, user_id);

-- Index for finding user's responses
CREATE INDEX IF NOT EXISTS idx_responses_user 
ON responses(user_id, timestamp DESC);

-- ========================================
-- Results Table Optimization
-- ========================================

-- Index for finding results by room
CREATE INDEX IF NOT EXISTS idx_results_room 
ON results(room_id);

-- Index for finding user's results
CREATE INDEX IF NOT EXISTS idx_results_host 
ON results(host_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_results_guest 
ON results(guest_id, created_at DESC);

-- ========================================
-- Profiles Table Optimization
-- ========================================

-- Index for Telegram ID lookup (authentication)
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_lookup 
ON profiles(telegram_id) 
WHERE telegram_id IS NOT NULL;

-- ========================================
-- Verification
-- ========================================

-- Check that all indexes were created
DO $$
DECLARE
  idx_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes
  WHERE tablename IN ('questions', 'rooms', 'responses', 'results', 'profiles')
  AND indexname LIKE 'idx_%';
  
  RAISE NOTICE '✅ Performance indexes created successfully!';
  RAISE NOTICE 'Total custom indexes: %', idx_count;
END $$;

-- ========================================
-- Query Plan Analysis (Optional)
-- ========================================

-- Uncomment to analyze query performance:

-- EXPLAIN ANALYZE
-- SELECT id, text, image_url, order_index
-- FROM questions
-- WHERE category_id = 'YOUR_CATEGORY_ID'
-- AND is_active = TRUE
-- ORDER BY order_index;

-- Expected: Should use index scan, not sequential scan
