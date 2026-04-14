const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const env = require('../src/config/env');

async function updatePassword() {
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
      database: env.mysql.database
    });

    console.log('Connected to MySQL database successfully!');

    // Hash password
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(`New password hash: ${passwordHash}`);

    // Update admin user password
    await connection.query(
      'UPDATE users SET password_hash = ? WHERE username = ?',
      [passwordHash, 'admin']
    );
    console.log('Admin user password updated successfully!');

    // Close connection
    await connection.end();
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

// Run the update
updatePassword();
