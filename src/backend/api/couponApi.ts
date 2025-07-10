import { apiClient } from '@/services/api/apiClient';
import { Coupon } from '@/types';
import { COUPONS_DATA } from '../data/coupons';
import { API_ENDPOINTS, logEndpointCall, logEndpointResponse } from './apiConfig';

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const couponApi = {
  // Get all coupons
  getAll: async (): Promise<Coupon[]> => {
    logEndpointCall(API_ENDPOINTS.COUPONS.GET_ALL);
    try {
      const response = await apiClient.get(API_ENDPOINTS.COUPONS.GET_ALL);
      logEndpointResponse(API_ENDPOINTS.COUPONS.GET_ALL, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock coupons data');
      await mockDelay();
      logEndpointResponse(API_ENDPOINTS.COUPONS.GET_ALL, COUPONS_DATA);
      return COUPONS_DATA;
    }
  },

  // Get coupon by code 
  getByCode: async (code: string): Promise<Coupon | null> => {
    const endpoint = API_ENDPOINTS.COUPONS.GET_BY_CODE(code);
    logEndpointCall(endpoint);
    try {
      const response = await apiClient.get(endpoint);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock coupon data');
      await mockDelay();
      const coupon = COUPONS_DATA.find(c => c.code === code) || null;
      logEndpointResponse(endpoint, coupon);
      return coupon;
    }
  },

  // Create new coupon
  create: async (coupon: Omit<Coupon, "id">): Promise<Coupon> => {
    logEndpointCall(API_ENDPOINTS.COUPONS.CREATE, 'POST', coupon);
    try {
      const response = await apiClient.post(API_ENDPOINTS.COUPONS.CREATE, coupon);
      logEndpointResponse(API_ENDPOINTS.COUPONS.CREATE, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock coupon creation');
      await mockDelay();
      const newCoupon: Coupon = { ...coupon };
      COUPONS_DATA.push(newCoupon);
      logEndpointResponse(API_ENDPOINTS.COUPONS.CREATE, newCoupon);
      return newCoupon;
    }
  },

  // Validate coupon
  validate: async (code: string, amount: number): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> => {
    logEndpointCall(API_ENDPOINTS.COUPONS.VALIDATE, 'POST', { code, amount });
    try {
      const response = await apiClient.post(API_ENDPOINTS.COUPONS.VALIDATE, { code, amount });
      logEndpointResponse(API_ENDPOINTS.COUPONS.VALIDATE, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock coupon validation');
      await mockDelay();
      
      const coupon = COUPONS_DATA.find(c => c.code.toLowerCase() === code.toLowerCase() && c.isActive);
      
      if (!coupon) {
        const result = { valid: false, message: 'Invalid coupon code' };
        logEndpointResponse(API_ENDPOINTS.COUPONS.VALIDATE, result);
        return result;
      }

      if (coupon.expiresAt < new Date()) {
        const result = { valid: false, message: 'Coupon has expired' };
        logEndpointResponse(API_ENDPOINTS.COUPONS.VALIDATE, result);
        return result;
      }

      if (coupon.minimumAmount && amount < coupon.minimumAmount) {
        const result = { valid: false, message: `Minimum order amount for this coupon is ₹${coupon.minimumAmount}` };
        logEndpointResponse(API_ENDPOINTS.COUPONS.VALIDATE, result);
        return result;
      }

      const result = { valid: true, coupon };
      logEndpointResponse(API_ENDPOINTS.COUPONS.VALIDATE, result);
      return result;
    }
  },

  // Update coupon
  update: async (originalCode: string, updates: Partial<Omit<Coupon, "id">>): Promise<Coupon> => {
    const endpoint = `/api/coupons/${originalCode}`;
    logEndpointCall(endpoint, 'PUT', updates);
    try {
      const response = await apiClient.put(endpoint, updates);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock coupon update');
      await mockDelay();
      const couponIndex = COUPONS_DATA.findIndex(c => c.code === originalCode);
      if (couponIndex !== -1) {
        COUPONS_DATA[couponIndex] = { ...COUPONS_DATA[couponIndex], ...updates };
        logEndpointResponse(endpoint, COUPONS_DATA[couponIndex]);
        return COUPONS_DATA[couponIndex];
      }
      throw new Error('Coupon not found');
    }
  },

  // Delete coupon
  delete: async (code: string): Promise<void> => {
    const endpoint = API_ENDPOINTS.COUPONS.DELETE(code);
    logEndpointCall(endpoint, 'DELETE');
    try {
      await apiClient.delete(endpoint);
      logEndpointResponse(endpoint, { success: true });
    } catch (error) {
      console.log('Using mock coupon deletion');
      await mockDelay();
      const couponIndex = COUPONS_DATA.findIndex(c => c.code === code);
      if (couponIndex !== -1) {
        COUPONS_DATA.splice(couponIndex, 1);
      }
      logEndpointResponse(endpoint, { success: true });
    }
  }
};
