// helpers/HttpClient.js
import axios from 'axios';

const ErrorCodeMessages = {
  401: 'Invalid credentials',
  403: 'Access Forbidden',
  404: 'Resource or page not found',
};

// Create a single instance (not inside a function)
const HttpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for Authorization header
HttpClient.interceptors.request.use(
  (config) => {
    if (!config._skipAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with error formatting
HttpClient.interceptors.response.use(
  (response) => response.data, // Only return the actual data
  (error) => {
    const errorMessage =
      error.response && typeof error.response.data === 'object'
        ? error.response.data.message
        : error.message;

    return Promise.reject(
      ErrorCodeMessages[error.response?.status] || errorMessage
    );
  }
);

// Export standard HTTP methods
const HttpClientWrapper = {
  get: (url, config = {}) => HttpClient.get(url, config),
  post: (url, data, config = {}) => HttpClient.post(url, data, config),
  patch: (url, data, config = {}) => HttpClient.patch(url, data, config),
  put: (url, data, config = {}) => HttpClient.put(url, data, config),
  delete: (url, config = {}) => HttpClient.delete(url, config),
};

export default HttpClientWrapper;
