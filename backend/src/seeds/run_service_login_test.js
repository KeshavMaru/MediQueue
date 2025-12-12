const { login } = require('../services/authService');

async function run() {
  try {
    const tokens = await login('neha.sharma@gmail.com', 'patient123', 'patient');
    console.log('login success', tokens);
  } catch (err) {
    console.error('login error:', err.message);
  }
}

run();
