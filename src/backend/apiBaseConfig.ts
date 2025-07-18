export const API_URL = 'https://Ajithkumar-API-URL.com/api';
export const AUTH_URL = 'https://Ajithkumar-AUTH-URL.com/api/auth';
export const IMS_API_URL = "https://Ajithkumar-IMS-API-URL.com/api/ims";

export const API_BASE_CONFIG = {
  baseURL: API_URL,
  authURL: AUTH_URL,
  imsURL: IMS_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  retryAttempts: 3,
  retryDelay: 1000,
};

export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
