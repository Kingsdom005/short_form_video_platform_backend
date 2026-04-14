DROP TABLE IF EXISTS backend_user;

-- Create backend_user table for admin authentication
CREATE TABLE IF NOT EXISTS backend_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  unique_id VARCHAR(36) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user', -- admin, user
  nickname VARCHAR(50),
  dsc TEXT,
  gender ENUM('male', 'female', 'other'),
  birthday DATE,
  location VARCHAR(100),
  website VARCHAR(255),
  avatar VARCHAR(255),
  country VARCHAR(50),
  city VARCHAR(50),
  phone VARCHAR(20),
  wechat VARCHAR(50),
  qq VARCHAR(20),
  privacy_settings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_unique_id (unique_id)
);

-- Insert default admin user (password: admin)
INSERT IGNORE INTO backend_user (unique_id, username, email, password_hash, role, nickname) 
VALUES (UUID(), 'admin', 'admin@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', 'Admin');
