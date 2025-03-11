import axios from 'axios';

const ErrorCodeMessages = {
  401: 'Invalid credentials',
  403: 'Access Forbidden',
  404: 'Resource or page not found',
};

const HttpClient = () => {
  const _httpClient = axios.create({
    timeout: 6000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  _httpClient.interceptors.request.use(
    async (config) => {
      // Allow unauthenticated access for blogs
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

  // Error Handler
  const _errorHandler = async (error) => {
    const errorMessage =
      error.response && typeof error.response.data === 'object'
        ? error.response.data.message
        : error.message;

    return Promise.reject(
      ErrorCodeMessages[error.response?.status] || errorMessage
    );
  };

  // Response Interceptor
  _httpClient.interceptors.response.use(
    (response) => response.data,
    _errorHandler
  );

  // HTTP methods
  return {
    get: (url, config = {}) => _httpClient.get(url, config),
    post: (url, data, config = {}) => _httpClient.post(url, data, config),
    patch: (url, data, config = {}) => _httpClient.patch(url, data, config),
    put: (url, data, config = {}) => _httpClient.put(url, data, config),
    delete: (url, config = {}) => _httpClient.delete(url, config),
  };
};

export default HttpClient();
