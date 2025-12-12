const db = require('../db');

async function inspect() {
  try {
    const emails = ['amit.kumar@gmail.com','neha.sharma@gmail.com','rohan.desai@gmail.com'];
    const res = await db.query(`SELECT id,email,user_type,is_active,password_hash FROM users WHERE email = ANY($1::text[])`, [emails]);
    if (res.rowCount === 0) {
      console.log('No matching users found');
      process.exit(0);
    }
    for (const row of res.rows) {
      console.log('---');
      console.log('email:', row.email);
      console.log('user_type:', row.user_type);
      console.log('is_active:', row.is_active);
      console.log('password_hash (first 60):', row.password_hash ? row.password_hash.slice(0,60) : null);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error inspecting users:', err);
    process.exit(1);
  }
}

inspect();
