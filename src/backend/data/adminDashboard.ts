export const ADMIN_DASHBOARD_DATA = {
  overview: {
    totalRevenue: 125000,
    totalOrders: 5,
    totalProducts: 5,
    totalUsers: 5,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    usersGrowth: 15.2
  },
  
  salesChart: [
    { month: 'Jan', sales: 15000, orders: 120 },
    { month: 'Feb', sales: 18000, orders: 145 },
    { month: 'Mar', sales: 22000, orders: 180 },
    { month: 'Apr', sales: 25000, orders: 200 },
    { month: 'May', sales: 28000, orders: 225 }
  ],
  
  orderStatusChart: [
    { status: 'delivered', count: 1, value: 20 },
    { status: 'shipped', count: 1, value: 20 },
    { status: 'processing', count: 1, value: 20 },
    { status: 'placed', count: 1, value: 20 },
    { status: 'cancelled', count: 1, value: 20 }
  ],
  
  topProducts: [
    { id: 'product-3', name: 'Ultra HD 4K Monitor', sales: 45, revenue: 125955 },
    { id: 'product-2', name: 'Smart Fitness Watch', sales: 32, revenue: 47997 },
    { id: 'product-5', name: 'Professional Coffee Machine', sales: 28, revenue: 64397 },
    { id: 'product-1', name: 'Premium Wireless Earbuds', sales: 25, revenue: 24998 },
    { id: 'product-4', name: 'Mechanical Gaming Keyboard', sales: 18, revenue: 12598 }
  ],
  
  recentOrders: [
    { id: 'order-4', customer: 'Bob Johnson', amount: 649.99, status: 'placed', date: new Date() },
    { id: 'order-3', customer: 'Jane Smith', amount: 2599.99, status: 'processing', date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: 'order-2', customer: 'Demo User', amount: 895.50, status: 'shipped', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: 'order-1', customer: 'Demo User', amount: 1299.99, status: 'delivered', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: 'order-5', customer: 'Alice Brown', amount: 1899.99, status: 'cancelled', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) }
  ]
};
