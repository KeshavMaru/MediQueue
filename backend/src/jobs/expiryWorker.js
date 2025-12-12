// src/jobs/expiryWorker.js
const db = require('../db');

const INTERVAL_MS = 30 * 1000; // run every 30s

async function expirePendingBookings() {
  try {
    // 1. Find expired bookings
    const res = await db.query(`
      SELECT id, slot_id FROM bookings
      WHERE status = 'PENDING' AND expires_at <= now()
      FOR UPDATE SKIP LOCKED
    `);
    if (res.rowCount === 0) {
      return;
    }
    const txClient = await db.getClient();
    try {
      await txClient.query('BEGIN');
      // Mark bookings FAILED
      await txClient.query(`UPDATE bookings SET status='FAILED' WHERE status='PENDING' AND expires_at <= now()`);
      // Free associated slots
      await txClient.query(`UPDATE slots SET status='AVAILABLE' WHERE id IN (SELECT slot_id FROM bookings WHERE status='FAILED' AND expires_at <= now())`);
      await txClient.query('COMMIT');
      console.log('Expired bookings processed:', res.rowCount);
    } catch (e) {
      await txClient.query('ROLLBACK');
      console.error('expiry worker error', e);
    } finally {
      txClient.release();
    }
  } catch (err) {
    console.error('expiry worker outer error', err);
  }
}

function startExpiryWorker() {
  setInterval(expirePendingBookings, INTERVAL_MS);
}

module.exports = { startExpiryWorker };
