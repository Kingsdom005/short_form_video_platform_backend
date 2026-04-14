import client from "./client";

const authApi = {
  register: async (userData) => {
    const response = await client.post("/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await client.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await client.get("/auth/me");
    return response.data;
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  updatePassword: async (data) => {
    const response = await client.post("/auth/update-password", data);
    return response.data;
  },
};

export default authApi;
