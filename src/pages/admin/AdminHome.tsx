import { useState } from "react";
import { useProduct } from "@/contexts/ProductContext";
import { useOrder } from "@/contexts/OrderContext";

import { format, isWithinInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, TrendingUp, Bell } from "lucide-react";
import DashboardFilters, { DashboardFilters as FilterType } from "@/components/admin/DashboardFilters";
import { toast } from "sonner";
import { useWaitlist } from "@/contexts/WaitlistContext";

export default function AdminHome() {
  const { products } = useProduct();
  const { getAllOrders } = useOrder();
  const { getAdminNotifications, markAsNotified } = useWaitlist();
  const allOrders = getAllOrders();
  const waitlistNotifications = getAdminNotifications();
  
  const [filters, setFilters] = useState<FilterType>({
    dateRange: {},
    status: "all",
    search: ""
  });
  
  // Apply filters to orders
  const filteredOrders = allOrders.filter(order => {
    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const orderDate = new Date(order.createdAt);
      if (filters.dateRange.from && filters.dateRange.to) {
        if (!isWithinInterval(orderDate, { start: filters.dateRange.from, end: filters.dateRange.to })) {
          return false;
        }
      } else if (filters.dateRange.from && orderDate < filters.dateRange.from) {
        return false;
      } else if (filters.dateRange.to && orderDate > filters.dateRange.to) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status !== "all" && order.status !== filters.status) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.shippingDetails.name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Calculate stats based on filtered orders
  const totalProducts = products.length;
  const totalOrders = filteredOrders.length;
  const revenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stock !== undefined && p.stock <= 5).length;
  
  // Get 5 most recent filtered orders
  const recentOrders = [...filteredOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Count orders by status from filtered results
  const ordersByStatus = filteredOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const handleClearFilters = () => {
    setFilters({
      dateRange: {},
      status: "all",
      search: ""
    });
  };
  
  const handleNotificationClick = (notificationId: string) => {
    markAsNotified(notificationId);
    toast.success("Notification marked as read");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {waitlistNotifications.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {waitlistNotifications.length} waitlist requests
          </Badge>
        )}
      </div>
      
      {/* Waitlist Notifications */}
      {waitlistNotifications.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Waitlist Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {waitlistNotifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">{notification.userName}</span> wants to be notified when{" "}
                    <span className="font-medium">"{notification.productName}"</span> is back in stock
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    Mark as Read
                  </Button>
                </div>
              ))}
              {waitlistNotifications.length > 3 && (
                <p className="text-sm text-orange-700">
                  +{waitlistNotifications.length - 3} more waitlist requests
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Filters */}
      <DashboardFilters 
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockProducts > 0 && `${lowStockProducts} low stock`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Filtered Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {totalOrders !== allOrders.length && `of ${allOrders.length} total`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Filtered Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{revenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From filtered orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Order Status
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <Badge key={status} variant="outline" className="text-xs">
                  {status}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Recent Orders {filters.search || filters.status !== "all" || filters.dateRange.from || filters.dateRange.to ? "(Filtered)" : ""}
      </h2>
      
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 text-left font-medium">Order ID</th>
              <th className="py-3 px-4 text-left font-medium">Customer</th>
              <th className="py-3 px-4 text-left font-medium">Date</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-left font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-mono text-xs">
                    {order.id}
                  </td>
                  <td className="py-3 px-4">
                    {order.shippingDetails.name}
                  </td>
                  <td className="py-3 px-4">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                  No orders found matching the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
