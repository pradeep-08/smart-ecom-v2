import { useState } from "react";
import { useOrder } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OrdersFilter from "@/components/admin/OrdersFilter";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderDetailDialog from "@/components/admin/OrderDetailDialog";
import { RefreshCw } from "lucide-react";

export default function AdminOrders() {
  const { getAllOrders, updateOrderStatus, updateCourierId, loading, refreshOrders } = useOrder();
  const allOrders = getAllOrders();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [viewOrderDialogOpen, setViewOrderDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter orders by search term and status
  const filteredOrders = allOrders.filter(order => {
    const searchMatches = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingDetails.name.toLowerCase().includes(search.toLowerCase());
    
    const statusMatches = statusFilter === "all" || order.status === statusFilter;
    
    return searchMatches && statusMatches;
  });
  
  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order);
    setViewOrderDialogOpen(true);
  };
  
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    
    // If the order being updated is the currently viewed order, update its status in the state
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        status,
        updatedAt: new Date()
      });
    }
  };

  const handleUpdateCourierId = async (orderId: string, courierId: string) => {
    await updateCourierId(orderId, courierId);
    
    // Update the current order if it's the one being viewed
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        courierId,
        updatedAt: new Date()
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Filters */}
      <OrdersFilter 
        search={search} 
        setSearch={setSearch} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      
      {/* Orders Table */}
      <OrdersTable 
        orders={filteredOrders} 
        onViewOrder={handleViewOrder} 
      />
      
      {/* View Order Dialog */}
      <OrderDetailDialog 
        order={currentOrder} 
        open={viewOrderDialogOpen} 
        onOpenChange={setViewOrderDialogOpen} 
        onUpdateStatus={handleUpdateStatus}
        onUpdateCourierId={handleUpdateCourierId}
      />
    </div>
  );
}
