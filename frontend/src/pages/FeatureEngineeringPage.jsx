import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const FeatureEngineeringPage = () => {
  const [userId, setUserId] = useState('');
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGetFeatures = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please enter a user ID');
      return;
    }

    try {
      setLoading(true);
      const response = await client.get(`/recommendations/features/${userId}`);
      setFeatures(response.data);
    } catch (err) {
      setError('Failed to fetch features');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Feature Engineering</h1>
        <button 
          onClick={() => navigate('/recommendations')}
          style={{
            padding: '10px 14px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to Recommendations
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      
      <div className="panel" style={{ marginBottom: '30px' }}>
        <h3>Extract User Features</h3>
        <form onSubmit={handleGetFeatures}>
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
            {loading ? 'Loading...' : 'Extract Features'}
          </button>
        </form>
      </div>

      {features && (
        <div>
          <div className="panel" style={{ marginBottom: '30px' }}>
            <h3>User Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{features.features.activityScore}</div>
                <div style={{ marginTop: '8px' }}>Activity Score</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{features.features.engagementLevel}</div>
                <div style={{ marginTop: '8px' }}>Engagement Level</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>{features.features.watchTimePerVideo.toFixed(2)}s</div>
                <div style={{ marginTop: '8px' }}>Watch Time Per Video</div>
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: '30px' }}>
            <h3>Category Preferences</h3>
            {Object.keys(features.features.categoryPreferences).length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Watch Time</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(features.features.categoryPreferences).map(([category, watchTime]) => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>{watchTime}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No category preferences found</div>
            )}
          </div>

          <div className="panel">
            <h3>Raw Data</h3>
            <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                {JSON.stringify(features.rawData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureEngineeringPage;