import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";

const UserProfileDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/profiles/${userId}`);
      setProfile(response.data);
    } catch (err) {
      setError("Failed to fetch user profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>User Profile: {profile.basicInfo.username}</h1>
        <button
          onClick={() => navigate("/profiles")}
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

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}
      >
        {/* Basic Info */}
        <div className="panel">
          <h3>Basic Information</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
              <strong>Username:</strong> {profile.basicInfo.username}
            </div>
            <div>
              <strong>Nickname:</strong> {profile.basicInfo.nickname || "-"}
            </div>
            <div>
              <strong>Gender:</strong> {profile.basicInfo.gender || "-"}
            </div>
            <div>
              <strong>Birthday:</strong> {profile.basicInfo.birthday || "-"}
            </div>
            <div>
              <strong>Location:</strong> {profile.basicInfo.location || "-"}
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {new Date(profile.basicInfo.created_at).toLocaleString()}
            </div>
          </div>
          {profile.basicInfo.bio && (
            <div style={{ marginTop: "16px" }}>
              <strong>Bio:</strong>
              <p>{profile.basicInfo.bio}</p>
            </div>
          )}
        </div>

        {/* Activity Stats */}
        <div className="panel">
          <h3>Activity Stats</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1890ff",
                }}
              >
                {profile.activity.totalWatchTime}s
              </div>
              <div style={{ marginTop: "8px" }}>Total Watch Time</div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#52c41a",
                }}
              >
                {profile.activity.totalLikes}
              </div>
              <div style={{ marginTop: "8px" }}>Total Likes</div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#faad14",
                }}
              >
                {profile.activity.totalComments}
              </div>
              <div style={{ marginTop: "8px" }}>Total Comments</div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#722ed1",
                }}
              >
                {profile.activity.totalVideosWatched}
              </div>
              <div style={{ marginTop: "8px" }}>Total Videos Watched</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div className="panel" style={{ marginBottom: "20px" }}>
          <h3>Category Preferences</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h4>Most Watched Categories</h4>
              {profile.preferences.watchedCategories.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {profile.preferences.watchedCategories.map(
                    (category, index) => (
                      <li
                        key={index}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div>{category.name}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {category.total_watch_time}s watched
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <div>No data available</div>
              )}
            </div>
            <div>
              <h4>Most Liked Categories</h4>
              {profile.preferences.likedCategories.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {profile.preferences.likedCategories.map(
                    (category, index) => (
                      <li
                        key={index}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div>{category.name}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {category.count} likes
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <div>No data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: "20px" }}>
          <h3>Recent Activity</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h4>Recent Watch History</h4>
              {profile.recentActivity.watchHistory.length > 0 ? (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {profile.recentActivity.watchHistory.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {item.watch_time}s watched on{" "}
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No data available</div>
              )}
            </div>
            <div>
              <h4>Recent Likes</h4>
              {profile.recentActivity.likes.length > 0 ? (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {profile.recentActivity.likes.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Liked on {new Date(item.created_at).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No data available</div>
              )}
            </div>
            <div>
              <h4>Recent Comments</h4>
              {profile.recentActivity.comments.length > 0 ? (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {profile.recentActivity.comments.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "4px",
                        }}
                      >
                        {item.content}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          marginTop: "4px",
                        }}
                      >
                        Commented on{" "}
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetailPage;
