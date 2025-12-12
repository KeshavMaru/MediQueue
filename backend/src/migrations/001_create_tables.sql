-- doctors
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  experience_years INT,
  daily_start_time TIME,
  daily_end_time TIME,
  slot_duration_minutes INT NOT NULL DEFAULT 15,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- slots (one per doctor per slot_time)
CREATE TABLE IF NOT EXISTS slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE | HOLD | BOOKED
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (doctor_id, slot_time)
);

-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_contact TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING | CONFIRMED | FAILED
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  meta JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_slots_doctor_time ON slots(doctor_id, slot_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status_expires ON bookings(status, expires_at);
