const { pool } = require("../config/mysql");

async function getUserProfile(req, res, next) {
  try {
    const { userId } = req.params;

    // Get user basic information
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = users[0];

    // Get user watch history
    const [watchHistory] = await pool.query(
      `SELECT 
        v.category_id, 
        v.title, 
        uh.watch_time, 
        uh.created_at 
      FROM 
        user_history uh 
      JOIN 
        videos v ON uh.video_id = v.id 
      WHERE 
        uh.user_id = ? 
      ORDER BY 
        uh.created_at DESC 
      LIMIT 20`,
      [userId],
    );

    // Get user likes
    const [likes] = await pool.query(
      `SELECT 
        v.category_id, 
        v.title, 
        l.created_at 
      FROM 
        likes l 
      JOIN 
        videos v ON l.video_id = v.id 
      WHERE 
        l.user_id = ? 
      ORDER BY 
        l.created_at DESC 
      LIMIT 20`,
      [userId],
    );

    // Get user comments
    const [comments] = await pool.query(
      `SELECT 
        v.category_id, 
        v.title, 
        c.content, 
        c.created_at 
      FROM 
        comments c 
      JOIN 
        videos v ON c.video_id = v.id 
      WHERE 
        c.user_id = ? 
      ORDER BY 
        c.created_at DESC 
      LIMIT 20`,
      [userId],
    );

    // Get user's most watched categories
    const [watchedCategories] = await pool.query(
      `SELECT 
        c.name, 
        COUNT(*) as count, 
        SUM(uh.watch_time) as total_watch_time 
      FROM 
        user_history uh 
      JOIN 
        videos v ON uh.video_id = v.id 
      JOIN 
        video_categories c ON v.category_id = c.id 
      WHERE 
        uh.user_id = ? 
      GROUP BY 
        c.id 
      ORDER BY 
        total_watch_time DESC 
      LIMIT 10`,
      [userId],
    );

    // Get user's most liked categories
    const [likedCategories] = await pool.query(
      `SELECT 
        c.name, 
        COUNT(*) as count 
      FROM 
        likes l 
      JOIN 
        videos v ON l.video_id = v.id 
      JOIN 
        video_categories c ON v.category_id = c.id 
      WHERE 
        l.user_id = ? 
      GROUP BY 
        c.id 
      ORDER BY 
        count DESC 
      LIMIT 10`,
      [userId],
    );

    // Calculate user activity metrics
    const [totalWatchTime] = await pool.query(
      "SELECT SUM(watch_time) as total FROM user_history WHERE user_id = ?",
      [userId],
    );

    const [totalLikes] = await pool.query(
      "SELECT COUNT(*) as total FROM likes WHERE user_id = ?",
      [userId],
    );

    const [totalComments] = await pool.query(
      "SELECT COUNT(*) as total FROM comments WHERE user_id = ?",
      [userId],
    );

    const [totalVideosWatched] = await pool.query(
      "SELECT COUNT(DISTINCT video_id) as total FROM user_history WHERE user_id = ?",
      [userId],
    );

    // Generate user profile
    const profile = {
      basicInfo: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        bio: user.bio,
        gender: user.gender,
        birthday: user.birthday,
        location: user.location,
        avatar: user.avatar,
        created_at: user.created_at,
      },
      activity: {
        totalWatchTime: totalWatchTime[0].total || 0,
        totalLikes: totalLikes[0].total || 0,
        totalComments: totalComments[0].total || 0,
        totalVideosWatched: totalVideosWatched[0].total || 0,
      },
      preferences: {
        watchedCategories,
        likedCategories,
      },
      recentActivity: {
        watchHistory: watchHistory.slice(0, 10),
        likes: likes.slice(0, 10),
        comments: comments.slice(0, 10),
      },
    };

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function getAllUserProfiles(req, res, next) {
  try {
    // Get all users with basic information
    const [users] = await pool.query(
      "SELECT id, username, nickname, created_at FROM users LIMIT 100",
    );

    // Get user activity metrics for each user
    const profiles = await Promise.all(
      users.map(async (user) => {
        const [totalWatchTime] = await pool.query(
          "SELECT SUM(watch_time) as total FROM user_history WHERE user_id = ?",
          [user.id],
        );

        const [totalLikes] = await pool.query(
          "SELECT COUNT(*) as total FROM likes WHERE user_id = ?",
          [user.id],
        );

        const [totalComments] = await pool.query(
          "SELECT COUNT(*) as total FROM comments WHERE user_id = ?",
          [user.id],
        );

        return {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          created_at: user.created_at,
          activity: {
            totalWatchTime: totalWatchTime[0].total || 0,
            totalLikes: totalLikes[0].total || 0,
            totalComments: totalComments[0].total || 0,
          },
        };
      }),
    );

    res.json(profiles);
  } catch (error) {
    next(error);
  }
}

module.exports = { getUserProfile, getAllUserProfiles };
