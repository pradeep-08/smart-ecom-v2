
import { API_ENDPOINTS, logEndpointCall, logEndpointResponse } from './apiConfig';
import { ADMIN_DASHBOARD_DATA } from '../data/adminDashboard';
import { apiClient } from '@/services/api/apiClient';

// Mock API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const adminDashboardApi = {
  // Get dashboard overview
  getOverview: async () => {
    logEndpointCall(API_ENDPOINTS.ADMIN.DASHBOARD);
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
      logEndpointResponse(API_ENDPOINTS.ADMIN.DASHBOARD, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock dashboard overview data');
      await mockDelay();
      logEndpointResponse(API_ENDPOINTS.ADMIN.DASHBOARD, ADMIN_DASHBOARD_DATA.overview);
      return ADMIN_DASHBOARD_DATA.overview;
    }
  },

  // Get analytics data
  getAnalytics: async () => {
    logEndpointCall(API_ENDPOINTS.ADMIN.ANALYTICS);
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS);
      logEndpointResponse(API_ENDPOINTS.ADMIN.ANALYTICS, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock analytics data');
      await mockDelay();
      const analyticsData = {
        salesChart: ADMIN_DASHBOARD_DATA.salesChart,
        orderStatusChart: ADMIN_DASHBOARD_DATA.orderStatusChart
      };
      logEndpointResponse(API_ENDPOINTS.ADMIN.ANALYTICS, analyticsData);
      return analyticsData;
    }
  },

  // Get revenue stats
  getRevenueStats: async () => {
    logEndpointCall(API_ENDPOINTS.ADMIN.REVENUE_STATS);
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.REVENUE_STATS);
      logEndpointResponse(API_ENDPOINTS.ADMIN.REVENUE_STATS, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock revenue stats data');
      await mockDelay();
      const revenueStats = {
        totalRevenue: ADMIN_DASHBOARD_DATA.overview.totalRevenue,
        revenueGrowth: ADMIN_DASHBOARD_DATA.overview.revenueGrowth,
        salesChart: ADMIN_DASHBOARD_DATA.salesChart
      };
      logEndpointResponse(API_ENDPOINTS.ADMIN.REVENUE_STATS, revenueStats);
      return revenueStats;
    }
  },

  // Get top products
  getTopProducts: async () => {
    logEndpointCall(API_ENDPOINTS.ADMIN.TOP_PRODUCTS);
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.TOP_PRODUCTS);
      logEndpointResponse(API_ENDPOINTS.ADMIN.TOP_PRODUCTS, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock top products data');
      await mockDelay();
      logEndpointResponse(API_ENDPOINTS.ADMIN.TOP_PRODUCTS, ADMIN_DASHBOARD_DATA.topProducts);
      return ADMIN_DASHBOARD_DATA.topProducts;
    }
  },

  // Get recent orders
  getRecentOrders: async () => {
    logEndpointCall(API_ENDPOINTS.ADMIN.RECENT_ORDERS);
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.RECENT_ORDERS);
      logEndpointResponse(API_ENDPOINTS.ADMIN.RECENT_ORDERS, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock recent orders data');
      await mockDelay();
      logEndpointResponse(API_ENDPOINTS.ADMIN.RECENT_ORDERS, ADMIN_DASHBOARD_DATA.recentOrders);
      return ADMIN_DASHBOARD_DATA.recentOrders;
    }
  },

  // Get users summary
  getUsersSummary: async () => {
    logEndpointCall(API_ENDPOINTS.ADMIN.USERS_SUMMARY);
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS_SUMMARY);
      logEndpointResponse(API_ENDPOINTS.ADMIN.USERS_SUMMARY, response.data);
      return response.data;
    } catch (error) {
      console.log('Using mock users summary data');
      await mockDelay();
      const usersSummary = {
        totalUsers: ADMIN_DASHBOARD_DATA.overview.totalUsers,
        usersGrowth: ADMIN_DASHBOARD_DATA.overview.usersGrowth,
        activeUsers: 4,
        newUsersThisMonth: 2
      };
      logEndpointResponse(API_ENDPOINTS.ADMIN.USERS_SUMMARY, usersSummary);
      return usersSummary;
    }
  }
};
