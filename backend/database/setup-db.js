const mysql = require('mysql2/promise');
const env = require('../src/config/env');

async function setupDatabase() {
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password
    });

    console.log('Connected to MySQL server successfully!');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${env.mysql.database}`);
    console.log(`Database ${env.mysql.database} created or already exists`);

    // Use the database
    await connection.query(`USE ${env.mysql.database}`);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      )
    `);
    console.log('Users table created or already exists');

    // Create leads table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        lead_id VARCHAR(50) UNIQUE NOT NULL,
        user_open_id VARCHAR(100) NOT NULL,
        nickname VARCHAR(100) NOT NULL,
        room_id VARCHAR(50) NOT NULL,
        session_id VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        score INT DEFAULT 0,
        assigned_to VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_lead_id (lead_id),
        INDEX idx_user_open_id (user_open_id),
        INDEX idx_status (status),
        INDEX idx_score (score)
      )
    `);
    console.log('Leads table created or already exists');

    // Create events table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        event_id VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        room_id VARCHAR(50) NOT NULL,
        session_id VARCHAR(100) NOT NULL,
        user_open_id VARCHAR(100) NOT NULL,
        nickname VARCHAR(100) NOT NULL,
        content TEXT,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_event_id (event_id),
        INDEX idx_room_id (room_id),
        INDEX idx_session_id (session_id),
        INDEX idx_user_open_id (user_open_id),
        INDEX idx_type (type),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('Events table created or already exists');

    // Insert default admin user if not exists
    await connection.query(
      'INSERT IGNORE INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin']
    );
    console.log('Default admin user created or already exists');

    // Close connection
    await connection.end();
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
