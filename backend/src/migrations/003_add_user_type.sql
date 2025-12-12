-- Add user_type column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'patient';

-- Add constraint to validate user_type values (only if it doesn't already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_user_type' AND table_name = 'users'
  ) THEN
    ALTER TABLE users 
    ADD CONSTRAINT check_user_type 
    CHECK (user_type IN ('doctor', 'patient'));
  END IF;
END $$;

-- Create index on user_type
CREATE INDEX IF NOT EXISTS idx_users_user_type_combined ON users(user_type, is_active);
