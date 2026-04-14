import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import UsersPage from "./pages/UsersPage";
import UserFormPage from "./pages/UserFormPage";
import RolesPage from "./pages/RolesPage";
import RoleFormPage from "./pages/RoleFormPage";
import UserProfilesPage from "./pages/UserProfilesPage";
import UserProfileDetailPage from "./pages/UserProfileDetailPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import FeatureEngineeringPage from "./pages/FeatureEngineeringPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import authApi from "./api/auth";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = authApi.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        await authApi.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        authApi.logout();
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

const AppShell = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Douyin Agent Ops</h1>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/leads">Leads</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/roles">Roles</NavLink>
          <NavLink to="/profiles">User Profiles</NavLink>
          <NavLink to="/recommendations">Recommendations</NavLink>
        </nav>
        <div style={{ marginTop: "auto", padding: "20px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#f5222d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <LeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <ProtectedRoute>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <ProtectedRoute>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles/create"
            element={
              <ProtectedRoute>
                <RoleFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles/edit/:id"
            element={
              <ProtectedRoute>
                <RoleFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <UserProfilesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles/:userId"
            element={
              <ProtectedRoute>
                <UserProfileDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations/features"
            element={
              <ProtectedRoute>
                <FeatureEngineeringPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  );
}
