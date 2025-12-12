// src/controllers/doctorController.js
const db = require('../db');
const slotService = require('../services/slotService');
const { v4: uuidv4 } = require('uuid');

async function createDoctor(req, res) {
  const { name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes } = req.body;
  if (!name || !slot_duration_minutes) return res.status(400).json({ error: 'name and slot_duration_minutes required' });

  try {
    const id = uuidv4();
    const q = `INSERT INTO doctors (id, name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes)
               VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const values = [id, name, specialization || null, experience_years || null, daily_start_time || null, daily_end_time || null, slot_duration_minutes];
    const result = await db.query(q, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createDoctor error', err);
    res.status(500).json({ error: 'internal' });
  }
}

async function listDoctors(req, res) {
  try {
    const result = await db.query('SELECT * FROM doctors ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
}

async function generateSlotsForDoctor(req, res) {
  const doctorId = req.params.id;
  try {
    // Authorization: allow if admin or if authenticated user owns this doctor record
    const authUser = req.user || {};
    const doctorRes = await db.query('SELECT user_id FROM doctors WHERE id = $1', [doctorId]);
    if (doctorRes.rowCount === 0) return res.status(404).json({ error: 'Doctor not found' });
    const ownerId = doctorRes.rows[0].user_id;

    if (authUser.role !== 'admin' && authUser.sub !== ownerId && authUser.id !== ownerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await slotService.generateSlotsForDoctor(doctorId);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
}

async function getDoctorSlots(req, res) {
  const doctorId = req.params.id;
  try {
    const authUser = req.user || {};

    // determine owner
    const doctorRes = await db.query('SELECT user_id FROM doctors WHERE id = $1', [doctorId]);
    if (doctorRes.rowCount === 0) return res.status(404).json({ error: 'Doctor not found' });
    const ownerId = doctorRes.rows[0].user_id;

    const isOwnerOrAdmin = authUser.role === 'admin' || authUser.sub === ownerId || authUser.id === ownerId;

    if (isOwnerOrAdmin) {
      const q = `
        SELECT s.id, s.slot_time, s.status,
               b.id AS booking_id, b.patient_name, b.patient_contact, b.status AS booking_status
        FROM slots s
        LEFT JOIN bookings b ON b.slot_id = s.id
        WHERE s.doctor_id = $1 AND s.slot_time >= now()
        ORDER BY s.slot_time
      `;
      const result = await db.query(q, [doctorId]);
      res.json(result.rows);
    } else {
      const q = `SELECT id, slot_time, status FROM slots WHERE doctor_id = $1 AND slot_time >= now() ORDER BY slot_time`;
      const result = await db.query(q, [doctorId]);
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
}

async function getDoctorById(req, res) {
  const doctorId = req.params.id;
  try {
    const result = await db.query('SELECT id, name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes, user_id FROM doctors WHERE id = $1', [doctorId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
}

module.exports = {
  createDoctor,
  listDoctors,
  generateSlotsForDoctor,
  getDoctorSlots,
  getDoctorById,
};
