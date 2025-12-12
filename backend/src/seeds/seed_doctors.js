// src/seeds/seed_doctors.js
const db = require('../db');

async function seedDoctors() {
  try {
    console.log('🏥 Seeding doctor details...');

    // Doctor 1: Dr. Rajesh Kumar - Cardiologist
    await db.query(
      `INSERT INTO doctors (name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      ['Dr. Rajesh Kumar', 'Cardiology', 15, '09:00:00', '17:00:00', 20]
    );

    // Doctor 2: Dr. Priya Sharma - Dermatologist
    await db.query(
      `INSERT INTO doctors (name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      ['Dr. Priya Sharma', 'Dermatology', 12, '10:00:00', '18:00:00', 15]
    );

    // Doctor 3: Dr. Arun Patel - Orthopedic Surgeon
    await db.query(
      `INSERT INTO doctors (name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      ['Dr. Arun Patel', 'Orthopedics', 18, '08:00:00', '16:00:00', 10]
    );

    console.log('✅ Doctor details seeded successfully!');
    console.log('\n📋 Doctor Information:');
    console.log('\n1️⃣  Dr. Rajesh Kumar');
    console.log('   Specialization: Cardiology');
    console.log('   Experience: 15 years');
    console.log('   Clinic Hours: 09:00 AM - 05:00 PM');
    console.log('   Slot Duration: 20 minutes');

    console.log('\n2️⃣  Dr. Priya Sharma');
    console.log('   Specialization: Dermatology');
    console.log('   Experience: 12 years');
    console.log('   Clinic Hours: 10:00 AM - 06:00 PM');
    console.log('   Slot Duration: 15 minutes');

    console.log('\n3️⃣  Dr. Arun Patel');
    console.log('   Specialization: Orthopedics');
    console.log('   Experience: 18 years');
    console.log('   Clinic Hours: 08:00 AM - 04:00 PM');
    console.log('   Slot Duration: 10 minutes');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDoctors();
