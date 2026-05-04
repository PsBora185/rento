import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rento_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem("rento_token");
      localStorage.removeItem("rento_user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;
