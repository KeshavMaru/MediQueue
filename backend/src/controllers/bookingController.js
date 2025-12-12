// src/controllers/bookingController.js
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const PENDING_TTL = Number(process.env.BOOKING_PENDING_TTL_SECONDS || 120);

async function createBooking(req, res) {
  const { doctor_id, slot_id, patient_name, patient_contact } = req.body;
  if (!doctor_id || !slot_id || !patient_name) return res.status(400).json({ error: 'doctor_id, slot_id, patient_name required' });

  // Only authenticated patients can create bookings
  const authUser = req.user;
  if (!authUser || authUser.user_type === 'doctor') {
    return res.status(403).json({ error: 'Only authenticated patients can create bookings' });
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Lock the slot row so concurrent requests wait
    const slotRes = await client.query('SELECT * FROM slots WHERE id=$1 FOR UPDATE', [slot_id]);
    if (slotRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'slot not found' });
    }
    const slot = slotRes.rows[0];
    if (slot.status !== 'AVAILABLE') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'slot not available' });
    }

    // Insert booking with PENDING and set expires_at
    const bookingId = uuidv4();
    const expiresAt = new Date(Date.now() + PENDING_TTL * 1000).toISOString();

    await client.query(
      `INSERT INTO bookings (id, doctor_id, slot_id, patient_name, patient_contact, status, expires_at, patient_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [bookingId, doctor_id, slot_id, patient_name, patient_contact || null, 'PENDING', expiresAt, authUser.sub || authUser.id]
    );

    // Mark slot as BOOKED (or HOLD if you want to allow release on PENDING expiration)
    await client.query('UPDATE slots SET status=$1 WHERE id=$2', ['BOOKED', slot_id]);

    await client.query('COMMIT');

    // Return booking id and status
    return res.status(201).json({ booking_id: bookingId, status: 'PENDING', expires_at: expiresAt });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('createBooking error', err);
    return res.status(500).json({ error: 'internal' });
  } finally {
    client.release();
  }
}

async function getBooking(req, res) {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
}

async function getMyBookings(req, res) {
  const authUser = req.user;
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
  const userId = authUser.sub || authUser.id;
  try {
    const q = `
      SELECT b.id, b.slot_id, b.doctor_id, b.patient_name, b.patient_contact, b.status, b.created_at, b.expires_at,
             s.slot_time, d.name AS doctor_name, d.specialization
      FROM bookings b
      LEFT JOIN slots s ON s.id = b.slot_id
      LEFT JOIN doctors d ON d.id = b.doctor_id
      WHERE b.patient_user_id = $1
      ORDER BY b.created_at DESC
    `;
    const result = await db.query(q, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
}

async function cancelBooking(req, res) {
  const bookingId = req.params.id;
  const authUser = req.user;
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
  const userId = authUser.sub || authUser.id;

  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const bRes = await client.query('SELECT * FROM bookings WHERE id=$1 FOR UPDATE', [bookingId]);
    if (bRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'booking not found' });
    }
    const booking = bRes.rows[0];
    if (booking.patient_user_id !== userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'forbidden' });
    }

    if (booking.status === 'FAILED') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'cannot cancel failed booking' });
    }

    // mark booking cancelled and free slot
    await client.query("UPDATE bookings SET status='CANCELLED' WHERE id=$1", [bookingId]);
    await client.query("UPDATE slots SET status='AVAILABLE' WHERE id=$1", [booking.slot_id]);

    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'internal' });
  } finally {
    client.release();
  }
}

async function respondToBookingByDoctor(req, res) {
  const bookingId = req.params.id;
  const { action } = req.body; // 'accept' or 'decline'
  const authUser = req.user;
  if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
  if (authUser.user_type !== 'doctor' && authUser.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const bRes = await client.query('SELECT * FROM bookings WHERE id=$1 FOR UPDATE', [bookingId]);
    if (bRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'booking not found' });
    }
    const booking = bRes.rows[0];

    // verify doctor owns this booking
    const docRes = await client.query('SELECT user_id FROM doctors WHERE id=$1', [booking.doctor_id]);
    if (docRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'doctor not found' });
    }
    const ownerId = docRes.rows[0].user_id;
    const isOwner = authUser.sub === ownerId || authUser.id === ownerId || authUser.role === 'admin';
    if (!isOwner) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'forbidden' });
    }

    if (action === 'accept') {
      await client.query("UPDATE bookings SET status='CONFIRMED' WHERE id=$1", [bookingId]);
      await client.query("UPDATE slots SET status='BOOKED' WHERE id=$1", [booking.slot_id]);
    } else if (action === 'decline') {
      await client.query("UPDATE bookings SET status='DECLINED' WHERE id=$1", [bookingId]);
      await client.query("UPDATE slots SET status='AVAILABLE' WHERE id=$1", [booking.slot_id]);
    } else {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'invalid action' });
    }

    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'internal' });
  } finally {
    client.release();
  }
}

module.exports = {
  createBooking,
  getBooking,
  getMyBookings,
  cancelBooking,
  respondToBookingByDoctor,
};
