// OTP API URLs
export const OTP_VALIDATION_URL = '/web/otp/request/validate';
export const WEB_OTP_REQUEST_GENERATE_URL = '/web/otp/generate';

// TARGET TYPE API URLs
export const ADD_TARGET_TYPE_URL = "/asset/type";
export const EDIT_TARGET_TYPE_URL = "/asset/type/$id";
export const LIST_TARGET_TYPE_URL = "/asset/type/list";
export const GET_TARGET_TYPE_URL = "/asset/type/$id";

// USE CASE API URLs
export const ADD_USE_CASE_URL = "/asset/use/case";
export const EDIT_USE_CASE_URL = "/asset/use/case/$id";
export const LIST_USE_CASE_URL = "/asset/use/case/list";
export const GET_USE_CASE_URL = "/asset/use/case/$id";

// API ENDPOINTS object for all API files
export const API_ENDPOINTS = {
  USERS: {
    GET_ALL: '/api/users',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  PRODUCTS: {
    GET_ALL: '/api/products',
    GET_BY_ID: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    UPDATE_STOCK: (id: string) => `/api/products/${id}/stock`,
  },
  ORDERS: {
    GET_ALL: '/api/orders',
    GET_BY_ID: (id: string) => `/api/orders/${id}`,
    GET_BY_USER: (userId: string) => `/api/orders/user/${userId}`,
    CREATE: '/api/orders',
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    UPDATE_COURIER: (id: string) => `/api/orders/${id}/courier`,
    COMPLETE_PAYMENT: (id: string) => `/api/orders/${id}/payment`,
  },
  COUPONS: {
    GET_ALL: '/api/coupons',
    GET_BY_CODE: (code: string) => `/api/coupons/${code}`,
    CREATE: '/api/coupons',
    VALIDATE: '/api/coupons/validate',
    DELETE: (code: string) => `/api/coupons/${code}`,
  },
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    ANALYTICS: '/api/admin/analytics',
    REVENUE_STATS: '/api/admin/revenue-stats',
    TOP_PRODUCTS: '/api/admin/top-products',
    RECENT_ORDERS: '/api/admin/recent-orders',
    USERS_SUMMARY: '/api/admin/users-summary',
  }
};

// Helper function to replace $id placeholder with actual ID
export const replaceIdInUrl = (url: string, id: string): string => {
  return url.replace('$id', id);
};

// Helper function to log endpoint calls
export const logEndpointCall = (endpoint: string, method: string = 'GET', data?: any) => {
  console.log(`🔗 API Call: ${method} ${endpoint}`);
  if (data) {
    console.log('📦 Request Data:', JSON.stringify(data, null, 2));
  }
};

// Helper function to log endpoint responses
export const logEndpointResponse = (endpoint: string, data: any) => {
  console.log(`✅ API Response from ${endpoint}:`);
  console.log(JSON.stringify(data, null, 2));
};
