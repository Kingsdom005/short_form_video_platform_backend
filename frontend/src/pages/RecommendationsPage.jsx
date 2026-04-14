import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const RecommendationsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [userRecommendations, setUserRecommendations] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await client.get('/recommendations/stats/overview');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch recommendation stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please enter a user ID');
      return;
    }

    try {
      setLoading(true);
      const response = await client.get(`/recommendations/${userId}`);
      setUserRecommendations(response.data);
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Recommendation Service</h1>
        <button 
          onClick={fetchStats}
          style={{
            padding: '10px 14px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="panel">
          <h3>Recommendation Stats</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{stats?.totalUsers || 0}</div>
                <div style={{ marginTop: '8px' }}>Total Users</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{stats?.totalVideos || 0}</div>
                <div style={{ marginTop: '8px' }}>Total Videos</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>{stats?.totalRecommendations || 0}</div>
                <div style={{ marginTop: '8px' }}>Total Recommendations</div>
              </div>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Get Recommendations</h3>
          <form onSubmit={handleGetRecommendations}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>User ID</label>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 14px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </form>
        </div>
      </div>

      {stats && (
        <div className="panel" style={{ marginBottom: '30px' }}>
          <h3>Top Recommended Categories</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Recommendation Count</th>
              </tr>
            </thead>
            <tbody>
              {stats.topCategories.map((category, index) => (
                <tr key={index}>
                  <td>{category.name}</td>
                  <td>{category.recommendation_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {userRecommendations && (
        <div className="panel">
          <h3>Recommendations for User {userRecommendations.userId}</h3>
          <div style={{ marginBottom: '16px' }}>
            <div>Total Recommendations: {userRecommendations.metadata.total}</div>
            <div>Watched Videos: {userRecommendations.metadata.watchedCount}</div>
            <div>Liked Videos: {userRecommendations.metadata.likedCount}</div>
            <div>Preferred Categories: {userRecommendations.metadata.preferredCategories}</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Views</th>
                <th>Likes</th>
              </tr>
            </thead>
            <tbody>
              {userRecommendations.recommendations.map((video) => (
                <tr key={video.id}>
                  <td>{video.id}</td>
                  <td>{video.title}</td>
                  <td>{video.category_name}</td>
                  <td>{video.views}</td>
                  <td>{video.likes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;