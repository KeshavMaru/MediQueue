// src/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Get all patients
router.get('/patients', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, email, full_name, role, user_type, is_active, created_at FROM users WHERE user_type = 'patient' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get all doctors
router.get('/doctors', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.id, d.name, d.specialization, d.experience_years, d.daily_start_time, d.daily_end_time, 
              d.slot_duration_minutes, d.user_id, u.email, u.is_active, d.created_at
       FROM doctors d
       LEFT JOIN users u ON d.user_id = u.id
       ORDER BY d.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Delete patient
router.delete('/patients/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 AND user_type = $2 RETURNING id', [id, 'patient']);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ ok: true, message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Delete doctor
router.delete('/doctors/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM doctors WHERE id = $1 RETURNING id', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json({ ok: true, message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Update patient
router.put('/patients/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, is_active } = req.body;
    
    const result = await db.query(
      'UPDATE users SET full_name = $1, email = $2, is_active = $3, updated_at = now() WHERE id = $4 AND user_type = $5 RETURNING id, email, full_name, is_active',
      [full_name, email, is_active, id, 'patient']
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ ok: true, body: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Update doctor
router.put('/doctors/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes } = req.body;
    
    const result = await db.query(
      `UPDATE doctors 
       SET name = $1, specialization = $2, experience_years = $3, daily_start_time = $4, daily_end_time = $5, slot_duration_minutes = $6, updated_at = now()
       WHERE id = $7 
       RETURNING id, name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes`,
      [name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json({ ok: true, body: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
