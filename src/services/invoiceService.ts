import { Order, CartItem } from "@/types";
import { formatINR, formatSimpleDate } from "@/utils/formatters";

// In a production app, this would use a PDF generation library
// Here we simulate invoice generation with a delay
export const generateInvoice = async (order: Order): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real app, this would return a PDF blob or a URL
  // For now, we'll return a data URL that can be used in an <a> tag for download
  return createMockInvoiceDataUrl(order);
};

// Generate a mock PDF invoice as a data URL for demonstration
function createMockInvoiceDataUrl(order: Order): string {
  // This would normally be done using a proper PDF generation library
  // For now, we'll create a simple mock version that returns a data URL
  
  const invoiceContent = `
    INVOICE
    
    Order ID: ${order.id}
    Date: ${formatSimpleDate(order.createdAt)}
    
    Customer: ${order.shippingDetails.name}
    Address: ${order.shippingDetails.address}, ${order.shippingDetails.city}
    ${order.shippingDetails.state}, ${order.shippingDetails.zipCode}
    Phone: ${order.shippingDetails.phone}
    
    Items:
    ${order.items.map(item => 
      `${item.product.name} x ${item.quantity} - ${formatINR(item.product.price * item.quantity)}`
    ).join('\n')}
    
    ${order.couponApplied ? `Discount: ${formatINR(calculateDiscount(order))}` : ''}
    Tax (5%): ${formatINR(order.totalAmount * 0.05)}
    
    Total: ${formatINR(order.totalAmount)}
    
    Payment Method: ${order.paymentInfo?.paymentMethod || 'Not specified'}
    Payment Status: ${order.paymentInfo?.paymentStatus || 'Not specified'}
    
    Thank you for your business!
  `;
  
  // Convert the text to base64 for a simple "download"
  // In a real app, this would be a proper PDF
  const encodedContent = btoa(invoiceContent);
  return `data:application/pdf;base64,${encodedContent}`;
}

// Calculate discount amount
function calculateDiscount(order: Order): number {
  if (!order.couponApplied) return 0;
  
  const subtotal = order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  if (order.couponApplied.discountType === 'percentage') {
    return subtotal * (order.couponApplied.discountPercentage / 100);
  } else {
    return order.couponApplied.discountValue;
  }
}

// Download the invoice
export const downloadInvoice = (invoiceDataUrl: string, orderId: string) => {
  const link = document.createElement('a');
  link.href = invoiceDataUrl;
  link.download = `invoice-${orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
