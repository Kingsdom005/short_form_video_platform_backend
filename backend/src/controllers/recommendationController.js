const { pool } = require('../config/mysql');

// Deduplication function
function deduplicate(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.id.toString();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Counting function
function countOccurrences(items, key) {
  const counts = {};
  items.forEach(item => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}

// Feature engineering function
function extractFeatures(userProfile) {
  const features = {
    activityScore: 0,
    categoryPreferences: {},
    engagementLevel: 'low',
    watchTimePerVideo: 0
  };

  // Calculate activity score
  const { totalWatchTime, totalLikes, totalComments, totalVideosWatched } = userProfile.activity;
  features.activityScore = totalWatchTime + (totalLikes * 10) + (totalComments * 5);

  // Calculate watch time per video
  if (totalVideosWatched > 0) {
    features.watchTimePerVideo = totalWatchTime / totalVideosWatched;
  }

  // Determine engagement level
  if (features.activityScore > 1000) {
    features.engagementLevel = 'high';
  } else if (features.activityScore > 100) {
    features.engagementLevel = 'medium';
  }

  // Extract category preferences
  userProfile.preferences.watchedCategories.forEach(category => {
    features.categoryPreferences[category.name] = category.total_watch_time;
  });

  return features;
}

async function getRecommendations(req, res, next) {
  try {
    const { userId } = req.params;

    // Get user profile
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's watched videos
    const [watchedVideos] = await pool.query(
      'SELECT video_id FROM user_history WHERE user_id = ?',
      [userId]
    );
    const watchedVideoIds = watchedVideos.map(item => item.video_id);

    // Get user's liked videos
    const [likedVideos] = await pool.query(
      'SELECT video_id FROM likes WHERE user_id = ?',
      [userId]
    );
    const likedVideoIds = likedVideos.map(item => item.video_id);

    // Get user's preferred categories
    const [preferredCategories] = await pool.query(
      `SELECT 
        v.category_id, 
        SUM(uh.watch_time) as total_watch_time 
      FROM 
        user_history uh 
      JOIN 
        videos v ON uh.video_id = v.id 
      WHERE 
        uh.user_id = ? 
      GROUP BY 
        v.category_id 
      ORDER BY 
        total_watch_time DESC 
      LIMIT 5`,
      [userId]
    );
    const categoryIds = preferredCategories.map(item => item.category_id);

    let recommendations = [];

    // Get videos from preferred categories
    if (categoryIds.length > 0) {
      const [categoryVideos] = await pool.query(
        `SELECT 
          v.*, 
          c.name as category_name 
        FROM 
          videos v 
        JOIN 
          video_categories c ON v.category_id = c.id 
        WHERE 
          v.category_id IN (?) 
          AND v.id NOT IN (?) 
        ORDER BY 
          v.views DESC 
        LIMIT 20`,
        [categoryIds, [...watchedVideoIds, ...likedVideoIds]]
      );
      recommendations = [...recommendations, ...categoryVideos];
    }

    // Get trending videos
    const [trendingVideos] = await pool.query(
      `SELECT 
        v.*, 
        c.name as category_name 
      FROM 
        videos v 
      JOIN 
        video_categories c ON v.category_id = c.id 
      WHERE 
        v.id NOT IN (?) 
      ORDER BY 
        v.views DESC 
      LIMIT 20`,
      [[...watchedVideoIds, ...likedVideoIds, ...recommendations.map(v => v.id)]]
    );
    recommendations = [...recommendations, ...trendingVideos];

    // Deduplicate recommendations
    recommendations = deduplicate(recommendations);

    // Limit to 20 recommendations
    recommendations = recommendations.slice(0, 20);

    res.json({
      userId,
      recommendations,
      metadata: {
        total: recommendations.length,
        watchedCount: watchedVideoIds.length,
        likedCount: likedVideoIds.length,
        preferredCategories: categoryIds.length
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getRecommendationStats(req, res, next) {
  try {
    // Get recommendation statistics
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [totalVideos] = await pool.query('SELECT COUNT(*) as count FROM videos');
    const [totalRecommendations] = await pool.query('SELECT COUNT(*) as count FROM user_history');

    // Get most recommended categories
    const [recommendedCategories] = await pool.query(
      `SELECT 
        c.name, 
        COUNT(*) as recommendation_count 
      FROM 
        user_history uh 
      JOIN 
        videos v ON uh.video_id = v.id 
      JOIN 
        video_categories c ON v.category_id = c.id 
      GROUP BY 
        c.id 
      ORDER BY 
        recommendation_count DESC 
      LIMIT 10`
    );

    res.json({
      totalUsers: totalUsers[0].count,
      totalVideos: totalVideos[0].count,
      totalRecommendations: totalRecommendations[0].count,
      topCategories: recommendedCategories
    });
  } catch (error) {
    next(error);
  }
}

async function getFeatureEngineering(req, res, next) {
  try {
    const { userId } = req.params;

    // Get user profile
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user activity
    const [totalWatchTime] = await pool.query(
      'SELECT SUM(watch_time) as total FROM user_history WHERE user_id = ?',
      [userId]
    );

    const [totalLikes] = await pool.query(
      'SELECT COUNT(*) as total FROM likes WHERE user_id = ?',
      [userId]
    );

    const [totalComments] = await pool.query(
      'SELECT COUNT(*) as total FROM comments WHERE user_id = ?',
      [userId]
    );

    const [totalVideosWatched] = await pool.query(
      'SELECT COUNT(DISTINCT video_id) as total FROM user_history WHERE user_id = ?',
      [userId]
    );

    // Get user preferences
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
      [userId]
    );

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
      [userId]
    );

    // Create user profile object for feature engineering
    const userProfile = {
      activity: {
        totalWatchTime: totalWatchTime[0].total || 0,
        totalLikes: totalLikes[0].total || 0,
        totalComments: totalComments[0].total || 0,
        totalVideosWatched: totalVideosWatched[0].total || 0
      },
      preferences: {
        watchedCategories,
        likedCategories
      }
    };

    // Extract features
    const features = extractFeatures(userProfile);

    res.json({
      userId,
      features,
      rawData: userProfile
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getRecommendations, getRecommendationStats, getFeatureEngineering, deduplicate, countOccurrences, extractFeatures };