// src/migrations/run_migrations.js
const fs = require('fs');
const path = require('path');
const db = require('../db');

async function run() {
  try {
    // Run all migrations in order
    const migrations = [
      '001_create_tables.sql',
      '002_create_users_and_sessions.sql',
      '003_add_user_type.sql',
      '004_link_doctors_to_users.sql',
      '005_add_patient_user_to_bookings.sql'
    ];

    for (const migration of migrations) {
      const sql = fs.readFileSync(path.join(__dirname, migration)).toString();
      await db.query(sql);
      console.log(`✓ Migration ${migration} ran successfully`);
    }

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration error', err);
    process.exit(1);
  }
}

run();
