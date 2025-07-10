import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Order, CartItem, OrderStatus, ShippingDetails, Coupon, PaymentInfo, TrackingInfo } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { getOrderTrackingStatus } from "@/services/trackingService";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "@/services/emailService";
import { generateInvoice } from "@/services/invoiceService";
import { orderApi } from "@/backend/api/orderApi";
import { productApi } from "@/backend/api/productApi";

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (items: CartItem[], shippingDetails: ShippingDetails, appliedCoupon?: Coupon) => Promise<Order>;
  getUserOrders: () => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateCourierId: (orderId: string, courierId: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  completeOrderPayment: (orderId: string, paymentInfo: Omit<PaymentInfo, "timestamp">) => Promise<void>;
  refreshOrderTracking: (orderId: string) => Promise<TrackingInfo | null>;
  generateOrderInvoice: (orderId: string) => Promise<string>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load orders from API on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (
    items: CartItem[], 
    shippingDetails: ShippingDetails, 
    appliedCoupon?: Coupon
  ): Promise<Order> => {
    if (!user) {
      throw new Error("User must be logged in to create an order");
    }

    console.log('Creating order for user:', user.id);
    console.log('Order items:', items);

    // Check stock availability before creating order
    for (const item of items) {
      if (item.product.stock !== undefined && item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`);
      }
    }

    try {
      const newOrder = await orderApi.create({
        userId: user.id,
        items,
        shippingDetails,
        appliedCoupon
      });

      // Update stock for each ordered item
      for (const item of items) {
        await productApi.updateStock(item.product.id, item.quantity);
      }

      // Add order to state
      setOrders(prevOrders => [...prevOrders, newOrder]);
      toast.success("Order placed successfully! Stock has been updated.");
      
      // Send order confirmation email (in a real app)
      if (user.email) {
        try {
          await sendOrderConfirmationEmail(newOrder, user.email);
          console.log("Order confirmation email sent successfully");
        } catch (error) {
          console.error("Failed to send order confirmation email", error);
        }
      }

      return newOrder;
    } catch (error) {
      console.error("Failed to create order", error);
      toast.error("Failed to create order");
      throw error;
    }
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  };

  const getAllOrders = () => {
    return orders;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await orderApi.updateStatus(orderId, status);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      
      // Send email notification
      const orderUser = user;
      if (orderUser && orderUser.email) {
        sendOrderStatusUpdateEmail(orderId, status, orderUser.email)
          .then(() => console.log(`Email sent for order ${orderId} status update`))
          .catch(error => console.error("Failed to send status update email", error));
      }
      
      toast.success(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("Failed to update order status");
    }
  };
  
  const updateCourierId = async (orderId: string, courierId: string) => {
    try {
      const updatedOrder = await orderApi.updateCourierId(orderId, courierId);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      toast.success(`Courier ID updated for order ${orderId}`);
    } catch (error) {
      console.error("Failed to update courier ID", error);
      toast.error("Failed to update courier ID");
    }
  };

  const completeOrderPayment = async (orderId: string, paymentInfo: Omit<PaymentInfo, "timestamp">) => {
    try {
      const updatedOrder = await orderApi.completePayment(orderId, paymentInfo);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      toast.success(`Payment updated for order ${orderId}`);
    } catch (error) {
      console.error("Failed to complete payment", error);
      toast.error("Failed to complete payment");
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };
  
  const refreshOrderTracking = async (orderId: string): Promise<TrackingInfo | null> => {
    const order = orders.find(order => order.id === orderId);
    
    if (!order || !order.courierId) {
      return null;
    }
    
    try {
      const trackingStatus = await getOrderTrackingStatus(order.courierId);
      
      // Update the order with the latest tracking status
      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === orderId
            ? { ...o, trackingStatus, updatedAt: new Date() }
            : o
        )
      );
      
      return trackingStatus;
    } catch (error) {
      console.error("Failed to refresh tracking status", error);
      return null;
    }
  };

  // Generate invoice for an order
  const generateOrderInvoice = async (orderId: string): Promise<string> => {
    const order = getOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    
    try {
      return await generateInvoice(order);
    } catch (error) {
      console.error("Failed to generate invoice", error);
      throw new Error("Failed to generate invoice");
    }
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      createOrder,
      getUserOrders,
      getAllOrders,
      updateOrderStatus,
      updateCourierId,
      getOrderById,
      completeOrderPayment,
      refreshOrderTracking,
      generateOrderInvoice,
      refreshOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
