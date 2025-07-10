import axios from 'axios';
import { API_BASE_CONFIG, API_URL, AUTH_URL, IMS_API_URL } from '@/backend/apiBaseConfig';

// Main API client configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_BASE_CONFIG.timeout,
  headers: API_BASE_CONFIG.headers,
});

// Auth API client configuration
export const authApiClient = axios.create({
  baseURL: AUTH_URL,
  timeout: API_BASE_CONFIG.timeout,
  headers: API_BASE_CONFIG.headers,
});

// IMS API client configuration
export const imsApiClient = axios.create({
  baseURL: IMS_API_URL,
  timeout: API_BASE_CONFIG.timeout,
  headers: API_BASE_CONFIG.headers,
});

// Request interceptor for main API client
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor for auth API client
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 Auth API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Auth Request Error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor for IMS API client
imsApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 IMS API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ IMS Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptors
[apiClient, authApiClient, imsApiClient].forEach(client => {
  client.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
});
