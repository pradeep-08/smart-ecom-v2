import { Order, CartItem, ShippingDetails, Coupon, OrderStatus, PaymentInfo } from '@/types';

import { API_ENDPOINTS, logEndpointCall, logEndpointResponse } from './apiConfig';
import { ORDERS_DATA } from '../data/orders';
import { apiClient } from '@/services/api/apiClient';

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const orderApi = {
  // Get all orders
  getAll: async (): Promise<Order[]> => {
    logEndpointCall(API_ENDPOINTS.ORDERS.GET_ALL);
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_ALL);
      logEndpointResponse(API_ENDPOINTS.ORDERS.GET_ALL, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock orders data');
      await mockDelay();
      logEndpointResponse(API_ENDPOINTS.ORDERS.GET_ALL, ORDERS_DATA);
      return ORDERS_DATA;
    }
  },

  // Get orders by user ID
  getByUserId: async (userId: string): Promise<Order[]> => {
    const endpoint = API_ENDPOINTS.ORDERS.GET_BY_USER(userId);
    logEndpointCall(endpoint);
    try {
      const response = await apiClient.get(endpoint);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock user orders data');
      await mockDelay();
      const userOrders = ORDERS_DATA.filter(order => order.userId === userId);
      logEndpointResponse(endpoint, userOrders);
      return userOrders;
    }
  },

  // Get order by ID
  getById: async (id: string): Promise<Order | null> => {
    const endpoint = API_ENDPOINTS.ORDERS.GET_BY_ID(id);
    logEndpointCall(endpoint);
    try {
      const response = await apiClient.get(endpoint);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock order data');
      await mockDelay();
      const order = ORDERS_DATA.find(order => order.id === id) || null;
      logEndpointResponse(endpoint, order);
      return order;
    }
  },

  // Create new order
  create: async (orderData: {
    userId: string;
    items: CartItem[];
    shippingDetails: ShippingDetails;
    appliedCoupon?: Coupon;
  }): Promise<Order> => {
    logEndpointCall(API_ENDPOINTS.ORDERS.CREATE, 'POST', orderData);
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      logEndpointResponse(API_ENDPOINTS.ORDERS.CREATE, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock order creation');
      await mockDelay();
      
      // Calculate total amount
      let totalAmount = orderData.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      
      // Apply coupon discount if available
      if (orderData.appliedCoupon) {
        if (orderData.appliedCoupon.discountType === 'percentage') {
          const discountAmount = (totalAmount * orderData.appliedCoupon.discountPercentage) / 100;
          totalAmount -= discountAmount;
        } else {
          totalAmount -= orderData.appliedCoupon.discountValue;
        }
        
        if (totalAmount < 0) totalAmount = 0;
      }

      // Add 5% tax
      const taxAmount = totalAmount * 0.05;
      totalAmount += taxAmount;

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: orderData.userId,
        items: orderData.items,
        totalAmount,
        status: "placed",
        shippingDetails: orderData.shippingDetails,
        couponApplied: orderData.appliedCoupon,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      ORDERS_DATA.push(newOrder);
      logEndpointResponse(API_ENDPOINTS.ORDERS.CREATE, newOrder);
      return newOrder;
    }
  },

  // Update order status
  updateStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const endpoint = API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId);
    logEndpointCall(endpoint, 'PATCH', { status });
    try {
      const response = await apiClient.patch(endpoint, { status });
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock order status update');
      await mockDelay();
      const orderIndex = ORDERS_DATA.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        ORDERS_DATA[orderIndex] = { 
          ...ORDERS_DATA[orderIndex], 
          status, 
          updatedAt: new Date() 
        };
        logEndpointResponse(endpoint, ORDERS_DATA[orderIndex]);
        return ORDERS_DATA[orderIndex];
      }
      throw new Error('Order not found');
    }
  },

  // Update courier ID
  updateCourierId: async (orderId: string, courierId: string): Promise<Order> => {
    const endpoint = API_ENDPOINTS.ORDERS.UPDATE_COURIER(orderId);
    logEndpointCall(endpoint, 'PATCH', { courierId });
    try {
      const response = await apiClient.patch(endpoint, { courierId });
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock courier ID update');
      await mockDelay();
      const orderIndex = ORDERS_DATA.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        ORDERS_DATA[orderIndex] = { 
          ...ORDERS_DATA[orderIndex], 
          courierId, 
          updatedAt: new Date() 
        };
        logEndpointResponse(endpoint, ORDERS_DATA[orderIndex]);
        return ORDERS_DATA[orderIndex];
      }
      throw new Error('Order not found');
    }
  },

  // Complete payment
  completePayment: async (orderId: string, paymentInfo: Omit<PaymentInfo, "timestamp">): Promise<Order> => {
    const endpoint = API_ENDPOINTS.ORDERS.COMPLETE_PAYMENT(orderId);
    logEndpointCall(endpoint, 'PATCH', paymentInfo);
    try {
      const response = await apiClient.patch(endpoint, paymentInfo);
      logEndpointResponse(endpoint, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock payment completion');
      await mockDelay();
      const orderIndex = ORDERS_DATA.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        ORDERS_DATA[orderIndex] = { 
          ...ORDERS_DATA[orderIndex], 
          paymentInfo: { ...paymentInfo, timestamp: new Date() },
          updatedAt: new Date() 
        };
        logEndpointResponse(endpoint, ORDERS_DATA[orderIndex]);
        return ORDERS_DATA[orderIndex];
      }
      throw new Error('Order not found');
    }
  }
};
