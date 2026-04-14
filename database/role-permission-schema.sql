-- Create roles table
CREATE TABLE IF NOT EXISTS backend_roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS backend_permissions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Create role_permissions table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS backend_role_permissions (
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES backend_roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES backend_permissions(id) ON DELETE CASCADE,
  INDEX idx_role_id (role_id),
  INDEX idx_permission_id (permission_id)
);

-- Create user_roles table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS backend_user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES backend_user(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES backend_roles(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id)
);

-- Insert default roles
INSERT IGNORE INTO backend_roles (name, description) VALUES
('admin', 'Administrator with full access'),
('user', 'Regular user with limited access');

-- Insert default permissions
INSERT IGNORE INTO backend_permissions (name, description) VALUES
('read_users', 'Can read user information'),
('write_users', 'Can create, update, and delete users'),
('read_leads', 'Can read lead information'),
('write_leads', 'Can create, update, and delete leads'),
('read_dashboard', 'Can access dashboard'),
('read_user_profiles', 'Can access user profiles'),
('write_user_profiles', 'Can update user profiles'),
('read_recommendations', 'Can access recommendations'),
('write_recommendations', 'Can update recommendations');

-- Assign permissions to admin role
INSERT IGNORE INTO backend_role_permissions (role_id, permission_id) VALUES
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'read_users')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'write_users')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'read_leads')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'write_leads')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'read_dashboard')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'read_user_profiles')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'write_user_profiles')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'read_recommendations')),
((SELECT id FROM backend_roles WHERE name = 'admin'), (SELECT id FROM backend_permissions WHERE name = 'write_recommendations'));

-- Assign permissions to user role
INSERT IGNORE INTO backend_role_permissions (role_id, permission_id) VALUES
((SELECT id FROM backend_roles WHERE name = 'user'), (SELECT id FROM backend_permissions WHERE name = 'read_leads')),
((SELECT id FROM backend_roles WHERE name = 'user'), (SELECT id FROM backend_permissions WHERE name = 'read_dashboard')),
((SELECT id FROM backend_roles WHERE name = 'user'), (SELECT id FROM backend_permissions WHERE name = 'read_user_profiles')),
((SELECT id FROM backend_roles WHERE name = 'user'), (SELECT id FROM backend_permissions WHERE name = 'read_recommendations'));