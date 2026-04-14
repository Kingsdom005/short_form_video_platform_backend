import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await client.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await client.delete(`/users/${userId}`);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>User Management</h1>
        <button 
          onClick={() => navigate('/users/create')}
          style={{
            padding: '10px 14px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Add User
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
                <th>Email</th>
                <th>Role</th>
                <th>Nickname</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.nickname || '-'}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#52c41a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f5222d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
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

export default UsersPage;