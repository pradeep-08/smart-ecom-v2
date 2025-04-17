import { useState } from "react";
import { useOrder } from "@/contexts/OrderContext";
import { Order, OrderStatus } from "@/types";
import OrdersFilter from "@/components/admin/OrdersFilter";
import OrdersTable from "@/components/admin/OrdersTable";
import OrderDetailDialog from "@/components/admin/OrderDetailDialog";

export default function AdminOrders() {
  const { getAllOrders, updateOrderStatus, updateCourierId } = useOrder();
  const allOrders = getAllOrders();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [viewOrderDialogOpen, setViewOrderDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
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
  
  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    
    // If the order being updated is the currently viewed order, update its status in the state
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        status,
        updatedAt: new Date()
      });
    }
  };

  const handleUpdateCourierId = (orderId: string, courierId: string) => {
    updateCourierId(orderId, courierId);
    
    // Update the current order if it's the one being viewed
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        courierId,
        updatedAt: new Date()
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      
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
