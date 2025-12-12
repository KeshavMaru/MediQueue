-- Add patient_user_id to bookings to associate bookings with authenticated patients
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS patient_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_patient_user_id ON bookings(patient_user_id);
