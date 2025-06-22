
import { Order } from "@/types";
import { formatINR, formatSimpleDate } from "@/utils/formatters";
import jsPDF from 'jspdf';

// Generate PDF invoice
export const generateInvoice = async (order: Order): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Create PDF invoice
  const pdf = new jsPDF();
  
  // Add content to PDF
  createInvoicePDF(pdf, order);
  
  // Convert PDF to blob and create download URL
  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  
  return url;
};

// Create PDF invoice content with blue design matching the template
function createInvoicePDF(pdf: jsPDF, order: Order): void {
  const discount = calculateDiscount(order);
  const subtotal = order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const tax = (subtotal - discount) * 0.05;
  
  // Blue color scheme matching the template
  const primaryBlue = { r: 31, g: 81, b: 135 }; // Dark blue
  const lightBlue = { r: 59, g: 130, b: 246 }; // Light blue
  const grayColor = { r: 107, g: 114, b: 128 };
  
  // Create curved header design
  pdf.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
  
  // Main header rectangle
  pdf.rect(0, 0, 210, 60, 'F');
  
  // Create curved bottom design
  pdf.setFillColor(lightBlue.r, lightBlue.g, lightBlue.b);
  for (let i = 0; i < 210; i += 2) {
    const curveHeight = 10 * Math.sin((i / 210) * Math.PI);
    pdf.rect(i, 50 + curveHeight, 2, 15, 'F');
  }
  
  // INVOICE title - large and bold
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', 25, 35);
  
  // Invoice number
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`NO: INV-${order.id.split('-')[1] || '12345-1'}`, 150, 35);
  
  // Reset text color to black for body content
  pdf.setTextColor(0, 0, 0);
  
  // Bill To and From sections
  let yPos = 85;
  
  // Bill To section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', 25, yPos);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(order.shippingDetails.name, 25, yPos + 12);
  pdf.text(order.shippingDetails.phone, 25, yPos + 24);
  pdf.text(order.shippingDetails.address, 25, yPos + 36);
  pdf.text(`${order.shippingDetails.city}, ${order.shippingDetails.state}`, 25, yPos + 48);
  
  // From section (right side)
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('From:', 150, yPos);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ShopNow Store', 150, yPos + 12);
  pdf.text('+91-98765-43210', 150, yPos + 24);
  pdf.text('123 Business St., Business City', 150, yPos + 36);
  
  // Date
  yPos += 70;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${formatSimpleDate(order.createdAt)}`, 25, yPos);
  
  // Items table
  yPos += 25;
  
  // Table header with blue background
  pdf.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
  pdf.rect(25, yPos - 8, 160, 15, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Description', 30, yPos);
  pdf.text('Qty', 110, yPos);
  pdf.text('Price', 130, yPos);
  pdf.text('Total', 160, yPos);
  
  // Reset text color for table content
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  
  // Table items
  yPos += 20;
  order.items.forEach((item, index) => {
    // Alternate row colors
    if (index % 2 === 0) {
      pdf.setFillColor(248, 249, 250);
      pdf.rect(25, yPos - 8, 160, 12, 'F');
    }
    
    const itemName = item.product.name.length > 25 ? 
      item.product.name.substring(0, 25) + '...' : item.product.name;
    
    pdf.text(itemName, 30, yPos);
    pdf.text(item.quantity.toString(), 115, yPos);
    pdf.text(formatINR(item.product.price), 135, yPos);
    pdf.text(formatINR(item.product.price * item.quantity), 165, yPos);
    yPos += 15;
  });
  
  // Table border
  pdf.setDrawColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
  pdf.setLineWidth(1);
  pdf.line(25, yPos, 185, yPos);
  
  // Totals section with blue background
  yPos += 20;
  
  // Sub Total row with blue background
  pdf.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
  pdf.rect(120, yPos - 8, 65, 15, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Sub Total', 125, yPos);
  pdf.text(formatINR(subtotal), 165, yPos);
  
  // Reset text color for other totals
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  if (discount > 0) {
    yPos += 20;
    pdf.text('Discount:', 125, yPos);
    pdf.text(`-${formatINR(discount)}`, 165, yPos);
  }
  
  yPos += 20;
  pdf.text('Tax (5%):', 125, yPos);
  pdf.text(formatINR(tax), 165, yPos);
  
  yPos += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Total:', 125, yPos);
  pdf.text(formatINR(order.totalAmount), 165, yPos);
  
  // Payment Information section
  if (order.paymentInfo) {
    yPos += 35;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Payment Information:', 25, yPos);
    
    yPos += 15;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`Bank: ShopNow Bank`, 25, yPos);
    yPos += 12;
    pdf.text(`No Bank: 123-456-7890`, 25, yPos);
    yPos += 12;
    pdf.text(`Email: support@shopnow.com`, 25, yPos);
  }
  
  // Thank You message - large and centered
  yPos += 35;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
  pdf.text('Thank You!', 105, yPos, { align: 'center' });
  
  // Footer note
  yPos += 20;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(grayColor.r, grayColor.g, grayColor.b);
  pdf.text('For support, contact us at support@shopnow.com', 105, yPos, { align: 'center' });
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

// Download the PDF invoice
export const downloadInvoice = (invoiceUrl: string, orderId: string) => {
  const link = document.createElement('a');
  link.href = invoiceUrl;
  link.download = `invoice-${orderId}.pdf`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object after download
  setTimeout(() => {
    URL.revokeObjectURL(invoiceUrl);
  }, 1000);
};
