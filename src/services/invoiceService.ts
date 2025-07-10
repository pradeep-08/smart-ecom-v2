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

// Create PDF invoice content with improved blue design
function createInvoicePDF(pdf: jsPDF, order: Order): void {
  const discount = calculateDiscount(order);
  const subtotal = order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const tax = (subtotal - discount) * 0.05;
  
  // Enhanced blue color scheme
  const primaryBlue = [31, 81, 135] as const; // Dark blue
  const lightBlue = [59, 130, 246] as const; // Light blue
  const accentBlue = [37, 99, 235] as const; // Medium blue
  const grayColor = [107, 114, 128] as const;
  const lightGray = [243, 244, 246] as const;
  
  // Create modern header with gradient effect
  pdf.setFillColor(31, 81, 135);
  pdf.rect(0, 0, 210, 50, 'F');
  
  // Add gradient effect with multiple rectangles
  for (let i = 0; i < 5; i++) {
    const opacity = 0.2 - (i * 0.04);
    pdf.setFillColor(59, 130, 246);
    pdf.setGState(pdf.GState({ opacity }));
    pdf.rect(0, 45 + i * 2, 210, 8, 'F');
  }
  
  // Reset opacity
  pdf.setGState(pdf.GState({ opacity: 1 }));
  
  // INVOICE title - modern typography
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', 20, 35);
  
  // Invoice number with modern styling
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const invoiceNumber = `INV-${order.id.split('-')[1] || Date.now().toString().slice(-6)}`;
  pdf.text(`Invoice No: ${invoiceNumber}`, 140, 25);
  pdf.text(`Date: ${formatSimpleDate(order.createdAt)}`, 140, 35);
  
  // Reset text color for body content
  pdf.setTextColor(0, 0, 0);
  
  // Company and customer information section
  let yPos = 75;
  
  // From section (Company info) - left side with box
  pdf.setFillColor(243, 244, 246);
  pdf.rect(20, yPos - 5, 80, 45, 'F');
  pdf.setDrawColor(31, 81, 135);
  pdf.setLineWidth(0.5);
  pdf.rect(20, yPos - 5, 80, 45, 'S');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('FROM:', 25, yPos + 5);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Market Cloud eCommerce', 25, yPos + 15);
  pdf.text('123 Business Street', 25, yPos + 25);
  pdf.text('Business City, State 12345', 25, yPos + 35);
  
  // Bill To section (Customer info) - right side with box
  pdf.setFillColor(243, 244, 246);
  pdf.rect(110, yPos - 5, 80, 45, 'F');
  pdf.setDrawColor(31, 81, 135);
  pdf.rect(110, yPos - 5, 80, 45, 'S');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('BILL TO:', 115, yPos + 5);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(order.shippingDetails.name, 115, yPos + 15);
  pdf.text(order.shippingDetails.phone, 115, yPos + 25);
  const address = order.shippingDetails.address.length > 25 ? 
    order.shippingDetails.address.substring(0, 25) + '...' : order.shippingDetails.address;
  pdf.text(address, 115, yPos + 35);
  
  // Items table with improved styling
  yPos += 70;
  
  // Table header with gradient
  pdf.setFillColor(31, 81, 135);
  pdf.rect(20, yPos - 8, 170, 15, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('DESCRIPTION', 25, yPos);
  pdf.text('QTY', 120, yPos);
  pdf.text('PRICE', 140, yPos);
  pdf.text('TOTAL', 165, yPos);
  
  // Table items with alternating colors
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  yPos += 20;
  order.items.forEach((item, index) => {
    // Alternating row colors
    if (index % 2 === 0) {
      pdf.setFillColor(248, 249, 250);
      pdf.rect(20, yPos - 8, 170, 12, 'F');
    }
    
    const itemName = item.product.name.length > 35 ? 
      item.product.name.substring(0, 35) + '...' : item.product.name;
    
    pdf.text(itemName, 25, yPos);
    pdf.text(item.quantity.toString(), 125, yPos);
    pdf.text(formatINR(item.product.price), 145, yPos);
    pdf.text(formatINR(item.product.price * item.quantity), 170, yPos);
    yPos += 15;
  });
  
  // Table bottom border
  pdf.setDrawColor(31, 81, 135);
  pdf.setLineWidth(1);
  pdf.line(20, yPos, 190, yPos);
  
  // Summary section with improved styling
  yPos += 25;
  const summaryStartY = yPos;
  
  // Summary box background
  pdf.setFillColor(243, 244, 246);
  pdf.rect(120, yPos - 10, 70, 80, 'F');
  pdf.setDrawColor(31, 81, 135);
  pdf.setLineWidth(0.5);
  pdf.rect(120, yPos - 10, 70, 80, 'S');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  
  // Subtotal
  pdf.text('Subtotal:', 125, yPos);
  pdf.text(formatINR(subtotal), 165, yPos);
  yPos += 15;
  
  // Discount (if applicable)
  if (discount > 0) {
    pdf.setTextColor(220, 38, 38); // Red color for discount
    pdf.text('Discount:', 125, yPos);
    pdf.text(`-${formatINR(discount)}`, 165, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += 15;
  }
  
  // Tax
  pdf.text('Tax (5%):', 125, yPos);
  pdf.text(formatINR(tax), 165, yPos);
  yPos += 15;
  
  // Total with highlight
  pdf.setFillColor(31, 81, 135);
  pdf.rect(120, yPos - 8, 70, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('TOTAL:', 125, yPos);
  pdf.text(formatINR(order.totalAmount), 165, yPos);
  
  // Payment Information
  yPos += 35;
  pdf.setTextColor(37, 99, 235);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('PAYMENT INFORMATION', 20, yPos);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('Bank: Market Cloud Bank', 20, yPos);
  yPos += 10;
  pdf.text('Account: 1234-5678-9012', 20, yPos);
  yPos += 10;
  pdf.text('IFSC: MCLD0001234', 20, yPos);
  yPos += 10;
  pdf.text('Email: billing@marketcloud.com', 20, yPos);
  
  // Thank you message with styling
  yPos += 25;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(31, 81, 135);
  pdf.text('Thank You for Your Business!', 105, yPos, { align: 'center' });
  
  // Footer
  yPos += 15;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text('This is a computer-generated invoice. For queries, contact support@marketcloud.com', 105, yPos, { align: 'center' });
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
