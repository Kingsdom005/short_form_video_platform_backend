const mysql = require("mysql2/promise");
const env = require("./src/config/env");

async function testConnection() {
  try {
    console.log("Testing MySQL connection...");
    console.log("Config:", {
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: "********", // Mask password for security
      database: env.mysql.database,
    });

    // First, try to connect without specifying database
    const connection = await mysql.createConnection({
      host: env.mysql.host,
      port: env.mysql.port,
      user: env.mysql.user,
      password: env.mysql.password,
    });

    console.log("Connection successful!");

    // Check if database exists, create if not
    const [dbRows] = await connection.query(
      `SHOW DATABASES LIKE '${env.mysql.database}'`,
    );
    if (dbRows.length === 0) {
      console.log(`Database ${env.mysql.database} does not exist, creating...`);
      await connection.query(
        `CREATE DATABASE ${env.mysql.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
      );
      console.log(`Database ${env.mysql.database} created successfully`);
    } else {
      console.log(`Database ${env.mysql.database} exists`);
    }

    // Use the database
    await connection.query(`USE ${env.mysql.database}`);
    console.log(`Using database ${env.mysql.database}`);

    // Create leads table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_no VARCHAR(50) UNIQUE NOT NULL,
        user_open_id VARCHAR(100) NOT NULL,
        room_id VARCHAR(100) NOT NULL,
        source_event_id VARCHAR(100),
        lead_status VARCHAR(50) DEFAULT 'new',
        lead_score INT DEFAULT 0,
        intent VARCHAR(255),
        assigned_agent VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Leads table created or already exists");

    // Create events table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id VARCHAR(50) UNIQUE NOT NULL,
        idempotency_key VARCHAR(255) UNIQUE NOT NULL,
        room_id VARCHAR(100) NOT NULL,
        session_id VARCHAR(100) NOT NULL,
        user_open_id VARCHAR(100) NOT NULL,
        nickname VARCHAR(100),
        source_type VARCHAR(50),
        message TEXT NOT NULL,
        normalized_text TEXT NOT NULL,
        extra JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Events table created or already exists");

    await connection.end();
    console.log("All setup completed successfully!");
  } catch (error) {
    console.error("Connection error:", error.message);
  }
}

testConnection();
