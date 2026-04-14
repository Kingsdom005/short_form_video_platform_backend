const { pool } = require('../config/mysql');
const bcrypt = require('bcrypt');

async function getUsers(req, res, next) {
  try {
    const [users] = await pool.query('SELECT id, unique_id, username, email, role, nickname, created_at FROM backend_user');
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const [users] = await pool.query('SELECT * FROM backend_user WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { username, email, password, role = 'user', nickname, bio, gender, birthday, location, website, avatar, country, city, phone, wechat, qq, privacy_settings } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM backend_user WHERE username = ? OR email = ?', [username, email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    await pool.query(
      `INSERT INTO backend_user (unique_id, username, email, password_hash, role, nickname, bio, gender, birthday, location, website, avatar, country, city, phone, wechat, qq, privacy_settings)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, email, passwordHash, role, nickname, bio, gender, birthday, location, website, avatar, country, city, phone, wechat, qq, privacy_settings]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { username, email, role, nickname, bio, gender, birthday, location, website, avatar, country, city, phone, wechat, qq, privacy_settings } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM backend_user WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username or email is already taken by another user
    const [conflictingUsers] = await pool.query('SELECT * FROM backend_user WHERE (username = ? OR email = ?) AND id != ?', [username, email, id]);
    if (conflictingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Update user
    await pool.query(
      `UPDATE backend_user SET username = ?, email = ?, role = ?, nickname = ?, bio = ?, gender = ?, birthday = ?, location = ?, website = ?, avatar = ?, country = ?, city = ?, phone = ?, wechat = ?, qq = ?, privacy_settings = ? WHERE id = ?`,
      [username, email, role, nickname, bio, gender, birthday, location, website, avatar, country, city, phone, wechat, qq, privacy_settings, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM backend_user WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password
    await pool.query('UPDATE backend_user SET password_hash = ? WHERE id = ?', [passwordHash, id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM backend_user WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await pool.query('DELETE FROM backend_user WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, updatePassword, deleteUser };