import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const UserProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await client.get('/profiles');
      setProfiles(response.data);
    } catch (err) {
      setError('Failed to fetch user profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>User Profiles</h1>
        <button 
          onClick={fetchProfiles}
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
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Nickname</th>
                <th>Total Watch Time</th>
                <th>Total Likes</th>
                <th>Total Comments</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id}>
                  <td>{profile.id}</td>
                  <td>{profile.username}</td>
                  <td>{profile.nickname || '-'}</td>
                  <td>{profile.activity.totalWatchTime}s</td>
                  <td>{profile.activity.totalLikes}</td>
                  <td>{profile.activity.totalComments}</td>
                  <td>{new Date(profile.created_at).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/profiles/${profile.id}`)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfilesPage;