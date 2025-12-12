-- Add user_type column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) NOT NULL DEFAULT 'patient';

-- Add constraint to ensure valid user_type
ALTER TABLE users ADD CONSTRAINT check_user_type CHECK (user_type IN ('doctor', 'patient'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
