import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';

const RoleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPermissions();
    if (id) {
      fetchRole();
    }
  }, [id]);

  const fetchPermissions = async () => {
    try {
      const response = await client.get('/roles/permissions/all');
      setPermissions(response.data);
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
    }
  };

  const fetchRole = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/roles/${id}`);
      const role = response.data;
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(p => p.id)
      });
    } catch (err) {
      setError('Failed to fetch role');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (id) {
        // Update role
        await client.put(`/roles/${id}`, formData);
        setSuccess('Role updated successfully');
      } else {
        // Create role
        await client.post('/roles', formData);
        setSuccess('Role created successfully');
      }
      setTimeout(() => {
        navigate('/roles');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{id ? 'Edit Role' : 'Add Role'}</h1>
        <button 
          onClick={() => navigate('/roles')}
          style={{
            padding: '10px 14px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '16px' }}>{success}</div>}
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="panel">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Permissions</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {permissions.map(permission => (
                  <div key={permission.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      checked={formData.permissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                    />
                    <label htmlFor={`permission-${permission.id}`} style={{ marginLeft: '8px' }}>
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                {loading ? 'Loading...' : (id ? 'Update Role' : 'Create Role')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoleFormPage;