const db = require('../db');
const bcrypt = require('bcrypt');

async function check() {
  try {
    const email = 'neha.sharma@gmail.com';
    const res = await db.query('SELECT password_hash FROM users WHERE email = $1', [email]);
    if (res.rowCount === 0) {
      console.log('user not found');
      process.exit(0);
    }
    const hash = res.rows[0].password_hash;
    const match = await bcrypt.compare('patient123', hash);
    console.log('bcrypt.compare result for patient123:', match);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
