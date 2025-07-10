import { apiClient } from '../api/apiClient';
import { Order } from '@/types';

// Invoice API endpoints (for future backend integration)
export const invoiceApi = {
  // Generate invoice on server
  generateInvoice: async (order: Order): Promise<{ invoiceUrl: string }> => {
    try {
      const response = await apiClient.post('/invoices/generate', { order });
      return response.data;
    } catch (error) {
      console.error('Failed to generate invoice via API:', error);
      throw error;
    }
  },

  // Get invoice by ID
  getInvoice: async (invoiceId: string): Promise<{ invoiceUrl: string }> => {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },

  // Send invoice via email
  emailInvoice: async (orderId: string, email: string): Promise<void> => {
    try {
      await apiClient.post('/invoices/email', { orderId, email });
    } catch (error) {
      console.error('Failed to email invoice:', error);
      throw error;
    }
  }
};
