-- ============================================================
-- Add subcategory_id to rooms table
-- ============================================================
-- Date: 2025-01-09
-- Purpose: Support subcategory filtering in game rooms
-- ============================================================

-- Add subcategory_id column to rooms table
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rooms_subcategory 
ON rooms(subcategory_id);

-- Verify the change
DO $$
BEGIN
  RAISE NOTICE '✅ Added subcategory_id column to rooms table';
  RAISE NOTICE 'Rooms can now be filtered by specific subcategories';
END $$;
