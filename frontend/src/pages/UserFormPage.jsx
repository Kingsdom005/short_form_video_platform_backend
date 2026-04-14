import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    nickname: "",
    bio: "",
    gender: "",
    birthday: "",
    location: "",
    website: "",
    avatar: "",
    country: "",
    city: "",
    phone: "",
    wechat: "",
    qq: "",
    privacy_settings: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/users/${id}`);
      const user = response.data;
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
        role: user.role,
        nickname: user.nickname || "",
        bio: user.bio || "",
        gender: user.gender || "",
        birthday: user.birthday || "",
        location: user.location || "",
        website: user.website || "",
        avatar: user.avatar || "",
        country: user.country || "",
        city: user.city || "",
        phone: user.phone || "",
        wechat: user.wechat || "",
        qq: user.qq || "",
        privacy_settings: user.privacy_settings || {},
      });
    } catch (err) {
      setError("Failed to fetch user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (id) {
        // Update user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await client.put(`/users/${id}`, updateData);
        setSuccess("User updated successfully");
      } else {
        // Create user
        await client.post("/users", formData);
        setSuccess("User created successfully");
      }
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{id ? "Edit User" : "Add User"}</h1>
        <button
          onClick={() => navigate("/users")}
          style={{
            padding: "10px 14px",
            backgroundColor: "#666",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>
      )}
      {success && (
        <div style={{ color: "green", marginBottom: "16px" }}>{success}</div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="panel">
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <h3>Basic Information</h3>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                {id
                  ? "New Password (leave blank to keep current)"
                  : "Password *"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!id ? true : false}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <h3>Profile Information</h3>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Nickname
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Birthday
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Avatar
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                WeChat
              </label>
              <input
                type="text"
                name="wechat"
                value={formData.wechat}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>
                QQ
              </label>
              <input
                type="text"
                name="qq"
                value={formData.qq}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#1890ff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              >
                {loading ? "Loading..." : id ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserFormPage;
