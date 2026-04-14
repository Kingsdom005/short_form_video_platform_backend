import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await client.get('/roles');
      setRoles(response.data);
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await client.get('/roles/permissions/all');
      setPermissions(response.data);
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await client.delete(`/roles/${roleId}`);
        fetchRoles();
      } catch (err) {
        setError('Failed to delete role');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Role Management</h1>
        <button 
          onClick={() => navigate('/roles/create')}
          style={{
            padding: '10px 14px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Add Role
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
                <th>Name</th>
                <th>Description</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>{role.description || '-'}</td>
                  <td>{new Date(role.created_at).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/roles/edit/${role.id}`)}
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
                      onClick={() => handleDeleteRole(role.id)}
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

export default RolesPage;