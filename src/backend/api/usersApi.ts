import { User } from '@/types';

import { API_ENDPOINTS, logEndpointCall, logEndpointResponse } from './apiConfig';
import { USERS_DATA } from '../data/users';
import { apiClient } from '@/services/api/apiClient';

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const usersApi = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    logEndpointCall(API_ENDPOINTS.USERS.GET_ALL);
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.GET_ALL);
      logEndpointResponse(API_ENDPOINTS.USERS.GET_ALL, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock users data');
      await mockDelay();
      logEndpointResponse(API_ENDPOINTS.USERS.GET_ALL, USERS_DATA);
      return USERS_DATA;
    }
  },

  // Get user by ID
  getById: async (id: string): Promise<User | null> => {
    const endpoint = API_ENDPOINTS.USERS.GET_BY_ID(id);
    logEndpointCall(endpoint);
    try {
      const response = await apiClient.get(endpoint);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock user data');
      await mockDelay();
      const user = USERS_DATA.find(user => user.id === id) || null;
      logEndpointResponse(endpoint, user);
      return user;
    }
  },

  // Create new user
  create: async (user: Omit<User, "id" | "createdAt">): Promise<User> => {
    logEndpointCall(API_ENDPOINTS.USERS.CREATE, 'POST', user);
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, user);
      logEndpointResponse(API_ENDPOINTS.USERS.CREATE, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock user creation');
      await mockDelay();
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date()
      };
      USERS_DATA.push(newUser);
      logEndpointResponse(API_ENDPOINTS.USERS.CREATE, newUser);
      return newUser;
    }
  },

  // Update user
  update: async (id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User> => {
    const endpoint = API_ENDPOINTS.USERS.UPDATE(id);
    logEndpointCall(endpoint, 'PUT', updates);
    try {
      const response = await apiClient.put(endpoint, updates);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock user update');
      await mockDelay();
      const userIndex = USERS_DATA.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        USERS_DATA[userIndex] = { ...USERS_DATA[userIndex], ...updates };
        logEndpointResponse(endpoint, USERS_DATA[userIndex]);
        return USERS_DATA[userIndex];
      }
      throw new Error('User not found');
    }
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    const endpoint = API_ENDPOINTS.USERS.DELETE(id);
    logEndpointCall(endpoint, 'DELETE');
    try {
      await apiClient.delete(endpoint);
      logEndpointResponse(endpoint, { success: true });
    } catch (error) {
      console.log('Using mock user deletion');
      await mockDelay();
      const userIndex = USERS_DATA.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        USERS_DATA.splice(userIndex, 1);
      }
      logEndpointResponse(endpoint, { success: true });
    }
  }
};
