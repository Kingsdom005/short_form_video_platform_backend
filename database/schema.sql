CREATE DATABASE IF NOT EXISTS douyin_agent DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE douyin_agent;

CREATE TABLE IF NOT EXISTS rooms (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  room_id VARCHAR(64) NOT NULL UNIQUE,
  room_name VARCHAR(128) NOT NULL,
  owner_name VARCHAR(128) DEFAULT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'online',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS live_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(64) NOT NULL UNIQUE,
  room_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  started_at DATETIME DEFAULT NULL,
  ended_at DATETIME DEFAULT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'running',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_live_sessions_room_id (room_id),
  INDEX idx_live_sessions_status (status)
);

CREATE TABLE IF NOT EXISTS customer_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_open_id VARCHAR(128) NOT NULL UNIQUE,
  nickname VARCHAR(128) DEFAULT NULL,
  phone_masked VARCHAR(32) DEFAULT NULL,
  tags_json JSON DEFAULT NULL,
  last_intent VARCHAR(64) DEFAULT NULL,
  lead_score INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customer_profiles_lead_score (lead_score)
);

CREATE TABLE IF NOT EXISTS event_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id VARCHAR(64) NOT NULL UNIQUE,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  room_id VARCHAR(64) NOT NULL,
  session_id VARCHAR(64) NOT NULL,
  user_open_id VARCHAR(128) NOT NULL,
  nickname VARCHAR(128) DEFAULT NULL,
  source_type VARCHAR(32) NOT NULL DEFAULT 'live_message',
  message_text TEXT NOT NULL,
  normalized_text TEXT DEFAULT NULL,
  intent VARCHAR(64) DEFAULT NULL,
  risk_level VARCHAR(32) DEFAULT 'low',
  process_status VARCHAR(32) NOT NULL DEFAULT 'queued',
  extra_json JSON DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_messages_room_created (room_id, created_at),
  INDEX idx_event_messages_user_created (user_open_id, created_at),
  INDEX idx_event_messages_status_created (process_status, created_at)
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  lead_no VARCHAR(64) NOT NULL UNIQUE,
  user_open_id VARCHAR(128) NOT NULL,
  room_id VARCHAR(64) NOT NULL,
  source_event_id VARCHAR(64) DEFAULT NULL,
  lead_status VARCHAR(32) NOT NULL DEFAULT 'new',
  lead_score INT NOT NULL DEFAULT 0,
  intent VARCHAR(64) DEFAULT NULL,
  assigned_agent VARCHAR(64) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_leads_status_updated (lead_status, updated_at),
  INDEX idx_leads_room_status (room_id, lead_status),
  INDEX idx_leads_user (user_open_id)
);

CREATE TABLE IF NOT EXISTS agent_tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  task_no VARCHAR(64) NOT NULL UNIQUE,
  event_id VARCHAR(64) NOT NULL,
  agent_type VARCHAR(64) NOT NULL,
  task_status VARCHAR(32) NOT NULL DEFAULT 'queued',
  priority_level INT NOT NULL DEFAULT 5,
  input_json JSON NOT NULL,
  output_json JSON DEFAULT NULL,
  retry_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_agent_tasks_status_created (task_status, created_at),
  INDEX idx_agent_tasks_agent_status (agent_type, task_status)
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  run_no VARCHAR(64) NOT NULL UNIQUE,
  task_no VARCHAR(64) NOT NULL,
  agent_type VARCHAR(64) NOT NULL,
  model_name VARCHAR(64) DEFAULT NULL,
  prompt_version VARCHAR(32) DEFAULT NULL,
  latency_ms INT NOT NULL DEFAULT 0,
  result_status VARCHAR(32) NOT NULL DEFAULT 'success',
  result_summary VARCHAR(255) DEFAULT NULL,
  request_json JSON DEFAULT NULL,
  response_json JSON DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_agent_runs_agent_created (agent_type, created_at)
);

CREATE TABLE IF NOT EXISTS knowledge_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  item_key VARCHAR(128) NOT NULL UNIQUE,
  category VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_knowledge_category_enabled (category, enabled)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ref_type VARCHAR(64) NOT NULL,
  ref_id VARCHAR(64) NOT NULL,
  operation VARCHAR(64) NOT NULL,
  operator_name VARCHAR(128) NOT NULL DEFAULT 'system',
  detail_json JSON DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_ref (ref_type, ref_id),
  INDEX idx_audit_logs_created (created_at)
);
