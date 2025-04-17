import { Order, ShippingDetails, OrderStatus } from "@/types";
import { formatINR } from "@/utils/formatters";

// In a real app, this would connect to an actual email service provider
export const sendOrderConfirmationEmail = async (order: Order, email: string): Promise<boolean> => {
  console.log(`Sending order confirmation email to ${email} for order ${order.id}`);
  
  // Simulate API call to email service
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return true;
};

export const sendOrderStatusUpdateEmail = async (
  orderId: string, 
  status: OrderStatus,
  email: string
): Promise<boolean> => {
  console.log(`Sending order status update email to ${email} for order ${orderId}. New status: ${status}`);
  
  // Simulate API call to email service
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return true;
};

// This would generate the content of the email in a real application
export const generateOrderEmailContent = (order: Order, shippingDetails: ShippingDetails): string => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN');
  const itemsList = order.items.map(item => 
    `${item.product.name} (${item.quantity}x) - ${formatINR(item.product.price * item.quantity)}`
  ).join('\n');
  
  return `
    Order Confirmation - ${order.id}
    
    Thank you for your order on ${orderDate}!
    
    Items:
    ${itemsList}
    
    Shipping to:
    ${shippingDetails.name}
    ${shippingDetails.address}
    ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zipCode}
    
    Total: ${formatINR(order.totalAmount)}
    
    We'll notify you when your order ships.
  `;
};
