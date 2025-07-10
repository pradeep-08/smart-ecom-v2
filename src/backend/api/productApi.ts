
import { Product } from '@/types';

import { API_ENDPOINTS, logEndpointCall, logEndpointResponse } from './apiConfig';
import { PRODUCTS_DATA } from '../data/products';
import { apiClient } from '@/services/api/apiClient';

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const productApi = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    logEndpointCall(API_ENDPOINTS.PRODUCTS.GET_ALL);
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
      logEndpointResponse(API_ENDPOINTS.PRODUCTS.GET_ALL, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock products data');
      await mockDelay();
      logEndpointResponse(API_ENDPOINTS.PRODUCTS.GET_ALL, PRODUCTS_DATA);
      return PRODUCTS_DATA;
    }
  },

  // Get product by ID
  getById: async (id: string): Promise<Product | null> => {
    const endpoint = API_ENDPOINTS.PRODUCTS.GET_BY_ID(id);
    logEndpointCall(endpoint);
    try {
      const response = await apiClient.get(endpoint);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock product data');
      await mockDelay();
      const product = PRODUCTS_DATA.find(product => product.id === id) || null;
      logEndpointResponse(endpoint, product);
      return product;
    }
  },

  // Create new product
  create: async (product: Omit<Product, "id" | "createdAt">): Promise<Product> => {
    logEndpointCall(API_ENDPOINTS.PRODUCTS.CREATE, 'POST', product);
    try {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, product);
      logEndpointResponse(API_ENDPOINTS.PRODUCTS.CREATE, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock product creation');
      await mockDelay();
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}`,
        createdAt: new Date()
      };
      PRODUCTS_DATA.push(newProduct);
      logEndpointResponse(API_ENDPOINTS.PRODUCTS.CREATE, newProduct);
      return newProduct;
    }
  },

  // Update product
  update: async (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> => {
    const endpoint = API_ENDPOINTS.PRODUCTS.UPDATE(id);
    logEndpointCall(endpoint, 'PUT', updates);
    try {
      const response = await apiClient.put(endpoint, updates);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock product update');
      await mockDelay();
      const productIndex = PRODUCTS_DATA.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        PRODUCTS_DATA[productIndex] = { ...PRODUCTS_DATA[productIndex], ...updates };
        logEndpointResponse(endpoint, PRODUCTS_DATA[productIndex]);
        return PRODUCTS_DATA[productIndex];
      }
      throw new Error('Product not found');
    }
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    const endpoint = API_ENDPOINTS.PRODUCTS.DELETE(id);
    logEndpointCall(endpoint, 'DELETE');
    try {
      await apiClient.delete(endpoint);
      logEndpointResponse(endpoint, { success: true });
    } catch (error) {
      console.log('Using mock product deletion');
      await mockDelay();
      const productIndex = PRODUCTS_DATA.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        PRODUCTS_DATA.splice(productIndex, 1);
      }
      logEndpointResponse(endpoint, { success: true });
    }
  },

  // Update stock
  updateStock: async (productId: string, quantityOrdered: number): Promise<void> => {
    const endpoint = API_ENDPOINTS.PRODUCTS.UPDATE_STOCK(productId);
    logEndpointCall(endpoint, 'PATCH', { quantityOrdered });
    try {
      await apiClient.patch(endpoint, { quantityOrdered });
      logEndpointResponse(endpoint, { success: true });
    } catch (error) {
      console.log('Using mock stock update');
      await mockDelay();
      const product = PRODUCTS_DATA.find(p => p.id === productId);
      if (product && product.stock !== undefined) {
        product.stock = Math.max(0, product.stock - quantityOrdered);
      }
      logEndpointResponse(endpoint, { success: true, newStock: product?.stock });
    }
  }
};
