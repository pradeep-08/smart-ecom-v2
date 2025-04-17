
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Order, CartItem, OrderStatus, ShippingDetails, Coupon, PaymentInfo, TrackingInfo } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { getOrderTrackingStatus } from "@/services/trackingService";
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "@/services/emailService";
import { generateInvoice } from "@/services/invoiceService";

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], shippingDetails: ShippingDetails, appliedCoupon?: Coupon) => Promise<Order>;
  getUserOrders: () => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateCourierId: (orderId: string, courierId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  completeOrderPayment: (orderId: string, paymentInfo: Omit<PaymentInfo, "timestamp">) => void;
  refreshOrderTracking: (orderId: string) => Promise<TrackingInfo | null>;
  generateOrderInvoice: (orderId: string) => Promise<string>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Mock orders for demo
const MOCK_ORDERS: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [],
    totalAmount: 1299.99,
    status: "delivered",
    shippingDetails: {
      name: "Demo User",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      phone: "555-123-4567"
    },
    courierId: "IN4325678901",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  },
  {
    id: "order-2",
    userId: "user-1",
    items: [],
    totalAmount: 895.50,
    status: "shipped",
    shippingDetails: {
      name: "Demo User",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      phone: "555-123-4567"
    },
    courierId: "IN9876543210",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const { user } = useAuth();

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (
    items: CartItem[], 
    shippingDetails: ShippingDetails, 
    appliedCoupon?: Coupon
  ): Promise<Order> => {
    if (!user) {
      throw new Error("User must be logged in to create an order");
    }

    // Calculate total amount
    let totalAmount = items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    
    // Apply coupon discount if available
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        const discountAmount = (totalAmount * appliedCoupon.discountPercentage) / 100;
        totalAmount -= discountAmount;
      } else {
        totalAmount -= appliedCoupon.discountValue;
      }
      
      // Ensure total is never negative
      if (totalAmount < 0) totalAmount = 0;
    }

    // Add 5% tax
    totalAmount += totalAmount * 0.05;

    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      items,
      totalAmount,
      status: "placed",
      shippingDetails,
      couponApplied: appliedCoupon,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add order to state
    setOrders(prevOrders => [...prevOrders, newOrder]);
    toast.success("Order placed successfully!");
    
    // Send order confirmation email (in a real app)
    if (user.email) {
      try {
        await sendOrderConfirmationEmail(newOrder, user.email);
        toast.success("Order confirmation email sent!");
      } catch (error) {
        console.error("Failed to send order confirmation email", error);
      }
    }

    return newOrder;
  };

  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  };

  const getAllOrders = () => {
    return orders;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
    
    // Get the order and user to send email notification
    const updatedOrder = orders.find(order => order.id === orderId);
    if (updatedOrder) {
      const orderUser = user; // In a real app, would get user email from their ID
      if (orderUser && orderUser.email) {
        sendOrderStatusUpdateEmail(orderId, status, orderUser.email)
          .then(() => console.log(`Email sent for order ${orderId} status update`))
          .catch(error => console.error("Failed to send status update email", error));
      }
    }
    
    toast.success(`Order ${orderId} status updated to ${status}`);
  };
  
  const updateCourierId = (orderId: string, courierId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, courierId, updatedAt: new Date() }
          : order
      )
    );
    toast.success(`Courier ID updated for order ${orderId}`);
  };

  const completeOrderPayment = (orderId: string, paymentInfo: Omit<PaymentInfo, "timestamp">) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              paymentInfo: { ...paymentInfo, timestamp: new Date() },
              updatedAt: new Date()
            }
          : order
      )
    );
    toast.success(`Payment updated for order ${orderId}`);
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

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      getUserOrders,
      getAllOrders,
      updateOrderStatus,
      updateCourierId,
      getOrderById,
      completeOrderPayment,
      refreshOrderTracking,
      generateOrderInvoice
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
