// Export all types here for easier imports

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrl: string;
  images?: string[]; // Additional images for the product
  sku?: string;
  stock?: number;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export type OrderStatus = "placed" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

export interface PaymentInfo {
  paymentId: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: string;
  amount: number;
  timestamp: Date;
}

export type TrackingStatus = "pickup_pending" | "in_transit" | "out_for_delivery" | "delivered" | "exception";

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: Date;
}

export interface TrackingInfo {
  currentStatus: string;
  location: string;
  updatedAt: Date;
  history?: TrackingEvent[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingDetails: ShippingDetails;
  createdAt: Date;
  updatedAt: Date;
  paymentInfo?: PaymentInfo;
  couponApplied?: Coupon;
  courierId?: string;
  trackingStatus?: TrackingInfo;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountPercentage: number; // Used for UI display when type is 'percentage'
  expiresAt: Date;
  minimumAmount?: number;
  isActive: boolean;
}

// Import and re-export Review interface
export * from "./review";
