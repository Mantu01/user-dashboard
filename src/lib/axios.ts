import axios from 'axios';

// Configure axios instance for API requests
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Ensure cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

