// src/services/slotService.js
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

function parseTimeToDate(date, timeStr) {
  // date is a Date; timeStr like "09:00:00" (HH:MM:SS)
  const [h, m, s] = (timeStr || '09:00:00').split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, s, 0);
  return d;
}

async function generateSlotsForDoctor(doctorId) {
  // fetch doctor config
  const docRes = await db.query('SELECT * FROM doctors WHERE id=$1', [doctorId]);
  if (docRes.rowCount === 0) throw new Error('doctor not found');
  const doctor = docRes.rows[0];

  // Generate slots for next 3 days only (excluding Sundays)
  const slotDuration = doctor.slot_duration_minutes || 15;
  const lunchStartHour = 12; // Lunch break from 12:00
  const lunchEndHour = 13; // to 13:00 (1 hour lunch)

  const now = new Date();
  const inserts = [];

  // Find next 3 non-Sunday days
  let daysGenerated = 0;
  let dayOffset = 0;

  while (daysGenerated < 3) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);
    
    // Skip Sundays (day 0)
    if (date.getDay() === 0) {
      dayOffset++;
      continue;
    }

    const start = parseTimeToDate(date, doctor.daily_start_time || '09:00:00');
    const end = parseTimeToDate(date, doctor.daily_end_time || '17:00:00');
    
    // Create lunch break times
    const lunchStart = parseTimeToDate(date, `${String(lunchStartHour).padStart(2, '0')}:00:00`);
    const lunchEnd = parseTimeToDate(date, `${String(lunchEndHour).padStart(2, '0')}:00:00`);

    let cur = new Date(start);
    while (cur < end) {
      // Skip slots during lunch break
      if (cur >= lunchStart && cur < lunchEnd) {
        cur = new Date(cur.getTime() + slotDuration * 60 * 1000);
        continue;
      }

      const slotTimeISO = cur.toISOString();
      inserts.push({ doctor_id: doctorId, slot_time: slotTimeISO });
      cur = new Date(cur.getTime() + slotDuration * 60 * 1000);
    }

    daysGenerated++;
    dayOffset++;
  }

  // Bulk insert with ON CONFLICT DO NOTHING
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const insertText = `INSERT INTO slots (id, doctor_id, slot_time) VALUES ($1,$2,$3) ON CONFLICT (doctor_id, slot_time) DO NOTHING`;
    for (const item of inserts) {
      await client.query(insertText, [uuidv4(), item.doctor_id, item.slot_time]);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  generateSlotsForDoctor,
};
