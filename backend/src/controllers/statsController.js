const { pool } = require('../config/mysql');

async function getUserGrowth(req, res, next) {
  try {
    const [result] = await pool.query(
      `SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM 
        users 
      GROUP BY 
        DATE(created_at) 
      ORDER BY 
        date DESC 
      LIMIT 30`
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getVideoGrowth(req, res, next) {
  try {
    const [result] = await pool.query(
      `SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM 
        videos 
      GROUP BY 
        DATE(created_at) 
      ORDER BY 
        date DESC 
      LIMIT 30`
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getTotalWatchTime(req, res, next) {
  try {
    const [result] = await pool.query(
      `SELECT 
        DATE(created_at) as date, 
        SUM(watch_time) as total_watch_time 
      FROM 
        user_history 
      GROUP BY 
        DATE(created_at) 
      ORDER BY 
        date DESC 
      LIMIT 30`
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    // Get total users
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Get total videos
    const [totalVideos] = await pool.query('SELECT COUNT(*) as count FROM videos');
    
    // Get total watch time
    const [totalWatchTime] = await pool.query('SELECT SUM(watch_time) as total FROM user_history');
    
    // Get user growth in last 7 days
    const [userGrowth] = await pool.query(
      `SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM 
        users 
      WHERE 
        created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
      GROUP BY 
        DATE(created_at) 
      ORDER BY 
        date`
    );
    
    // Get video growth in last 7 days
    const [videoGrowth] = await pool.query(
      `SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM 
        videos 
      WHERE 
        created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
      GROUP BY 
        DATE(created_at) 
      ORDER BY 
        date`
    );
    
    // Get watch time in last 7 days
    const [watchTime] = await pool.query(
      `SELECT 
        DATE(created_at) as date, 
        SUM(watch_time) as total 
      FROM 
        user_history 
      WHERE 
        created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
      GROUP BY 
        DATE(created_at) 
      ORDER BY 
        date`
    );
    
    res.json({
      totalUsers: totalUsers[0].count,
      totalVideos: totalVideos[0].count,
      totalWatchTime: totalWatchTime[0].total || 0,
      userGrowth,
      videoGrowth,
      watchTime
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUserGrowth, getVideoGrowth, getTotalWatchTime, getDashboardStats };