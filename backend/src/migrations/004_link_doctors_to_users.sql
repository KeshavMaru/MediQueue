-- Link doctors table to users table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
