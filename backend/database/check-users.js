const mysql = require('mysql2/promise');
const env = require('../src/config/env');

async function checkUsers() {
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

    // Check users table
    const [users] = await connection.query('SELECT * FROM users');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });

    // Close connection
    await connection.end();
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

// Run the check
checkUsers();
