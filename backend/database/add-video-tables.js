const mysql = require('mysql2/promise');
const env = require('../src/config/env');

async function addVideoTables() {
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

    // Create videos table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        video_id VARCHAR(50) UNIQUE NOT NULL,
        user_id BIGINT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url VARCHAR(255) NOT NULL,
        thumbnail_url VARCHAR(255),
        duration INT DEFAULT 0,
        view_count INT DEFAULT 0,
        like_count INT DEFAULT 0,
        comment_count INT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_video_id (video_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('Videos table created or already exists');

    // Create comments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        comment_id VARCHAR(50) UNIQUE NOT NULL,
        video_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        content TEXT NOT NULL,
        parent_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_comment_id (comment_id),
        INDEX idx_video_id (video_id),
        INDEX idx_user_id (user_id),
        INDEX idx_parent_id (parent_id)
      )
    `);
    console.log('Comments table created or already exists');

    // Create likes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        video_id BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_video (user_id, video_id),
        INDEX idx_user_id (user_id),
        INDEX idx_video_id (video_id)
      )
    `);
    console.log('Likes table created or already exists');

    // Close connection
    await connection.end();
    console.log('Video tables added successfully!');
  } catch (error) {
    console.error('Error adding video tables:', error);
    process.exit(1);
  }
}

// Run the migration
addVideoTables();
