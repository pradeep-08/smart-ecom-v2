import jsPDF from 'jspdf';
import { Order } from '@/types';
import { formatINR, formatSimpleDate } from '@/utils/formatters';
import { PDF_COLORS, PDF_LAYOUT, PDF_FONTS } from './pdfStyles';
import { calculateDiscount } from './invoiceCalculations';

export class PDFGenerator {
  private pdf: jsPDF;
  private order: Order;

  constructor(order: Order) {
    this.pdf = new jsPDF();
    this.order = order;
  }

  generate(): Blob {
    this.createHeader();
    this.createCompanyAndCustomerInfo();
    this.createItemsTable();
    this.createSummarySection();
    this.createPaymentInfo();
    this.createFooter();
    
    return this.pdf.output('blob');
  }

  private createHeader(): void {
    // Create modern header with gradient effect
    this.pdf.setFillColor(...PDF_COLORS.primaryBlue);
    this.pdf.rect(0, 0, PDF_LAYOUT.pageWidth, PDF_LAYOUT.headerHeight, 'F');
    
    // Add gradient effect
    for (let i = 0; i < 5; i++) {
      const opacity = 0.2 - (i * 0.04);
      this.pdf.setFillColor(...PDF_COLORS.lightBlue);
      this.pdf.setGState(this.pdf.GState({ opacity }));
      this.pdf.rect(0, 45 + i * 2, PDF_LAYOUT.pageWidth, 8, 'F');
    }
    
    // Reset opacity
    this.pdf.setGState(this.pdf.GState({ opacity: 1 }));
    
    // INVOICE title
    this.pdf.setTextColor(...PDF_COLORS.white);
    this.pdf.setFontSize(PDF_FONTS.title.size);
    this.pdf.setFont('helvetica', PDF_FONTS.title.style);
    this.pdf.text('INVOICE', 20, 35);
    
    // Invoice details
    this.pdf.setFontSize(PDF_FONTS.body.size);
    this.pdf.setFont('helvetica', 'normal');
    const invoiceNumber = `INV-${this.order.id.split('-')[1] || Date.now().toString().slice(-6)}`;
    this.pdf.text(`Invoice No: ${invoiceNumber}`, 140, 25);
    this.pdf.text(`Date: ${formatSimpleDate(this.order.createdAt)}`, 140, 35);
  }

  private createCompanyAndCustomerInfo(): void {
    let yPos = 75;
    
    // Company info box
    this.createInfoBox(20, yPos - 5, 'FROM:', [
      'Market Cloud eCommerce',
      '123 Business Street',
      'Business City, State 12345'
    ]);
    
    // Customer info box
    this.createInfoBox(110, yPos - 5, 'BILL TO:', [
      this.order.shippingDetails.name,
      this.order.shippingDetails.phone,
      this.order.shippingDetails.address.length > 25 
        ? this.order.shippingDetails.address.substring(0, 25) + '...'
        : this.order.shippingDetails.address
    ]);
  }

  private createInfoBox(x: number, y: number, title: string, content: string[]): void {
    // Box background and border
    this.pdf.setFillColor(...PDF_COLORS.lightGray);
    this.pdf.rect(x, y, PDF_LAYOUT.boxWidth, PDF_LAYOUT.boxHeight, 'F');
    this.pdf.setDrawColor(...PDF_COLORS.primaryBlue);
    this.pdf.setLineWidth(0.5);
    this.pdf.rect(x, y, PDF_LAYOUT.boxWidth, PDF_LAYOUT.boxHeight, 'S');
    
    // Title
    this.pdf.setFontSize(PDF_FONTS.subtitle.size);
    this.pdf.setFont('helvetica', PDF_FONTS.subtitle.style);
    this.pdf.setTextColor(...PDF_COLORS.accentBlue);
    this.pdf.text(title, x + 5, y + 10);
    
    // Content
    this.pdf.setFontSize(PDF_FONTS.body.size);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(...PDF_COLORS.black);
    content.forEach((line, index) => {
      this.pdf.text(line, x + 5, y + 20 + (index * 10));
    });
  }

  private createItemsTable(): void {
    let yPos = 145;
    
    // Table header
    this.pdf.setFillColor(...PDF_COLORS.primaryBlue);
    this.pdf.rect(20, yPos - 8, PDF_LAYOUT.columnWidth, 15, 'F');
    
    this.pdf.setTextColor(...PDF_COLORS.white);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(PDF_FONTS.body.size);
    this.pdf.text('DESCRIPTION', 25, yPos);
    this.pdf.text('QTY', 120, yPos);
    this.pdf.text('PRICE', 140, yPos);
    this.pdf.text('TOTAL', 165, yPos);
    
    // Table items
    this.pdf.setTextColor(...PDF_COLORS.black);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(PDF_FONTS.small.size);
    
    yPos += 20;
    this.order.items.forEach((item, index) => {
      // Alternating row colors
      if (index % 2 === 0) {
        this.pdf.setFillColor(248, 249, 250);
        this.pdf.rect(20, yPos - 8, PDF_LAYOUT.columnWidth, 12, 'F');
      }
      
      const itemName = item.product.name.length > 35 
        ? item.product.name.substring(0, 35) + '...' 
        : item.product.name;
      
      this.pdf.text(itemName, 25, yPos);
      this.pdf.text(item.quantity.toString(), 125, yPos);
      this.pdf.text(formatINR(item.product.price), 145, yPos);
      this.pdf.text(formatINR(item.product.price * item.quantity), 170, yPos);
      yPos += 15;
    });
    
    // Table bottom border
    this.pdf.setDrawColor(...PDF_COLORS.primaryBlue);
    this.pdf.setLineWidth(1);
    this.pdf.line(20, yPos, 190, yPos);
  }

  private createSummarySection(): void {
    const discount = calculateDiscount(this.order);
    const subtotal = this.order.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const tax = (subtotal - discount) * 0.05;
    
    let yPos = 220;
    
    // Summary box
    this.pdf.setFillColor(...PDF_COLORS.lightGray);
    this.pdf.rect(120, yPos - 10, 70, 80, 'F');
    this.pdf.setDrawColor(...PDF_COLORS.primaryBlue);
    this.pdf.setLineWidth(0.5);
    this.pdf.rect(120, yPos - 10, 70, 80, 'S');
    
    this.pdf.setTextColor(...PDF_COLORS.black);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(PDF_FONTS.body.size);
    
    // Subtotal
    this.pdf.text('Subtotal:', 125, yPos);
    this.pdf.text(formatINR(subtotal), 165, yPos);
    yPos += 15;
    
    // Discount
    if (discount > 0) {
      this.pdf.setTextColor(...PDF_COLORS.red);
      this.pdf.text('Discount:', 125, yPos);
      this.pdf.text(`-${formatINR(discount)}`, 165, yPos);
      this.pdf.setTextColor(...PDF_COLORS.black);
      yPos += 15;
    }
    
    // Tax
    this.pdf.text('Tax (5%):', 125, yPos);
    this.pdf.text(formatINR(tax), 165, yPos);
    yPos += 15;
    
    // Total
    this.pdf.setFillColor(...PDF_COLORS.primaryBlue);
    this.pdf.rect(120, yPos - 8, 70, 15, 'F');
    this.pdf.setTextColor(...PDF_COLORS.white);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(PDF_FONTS.total.size);
    this.pdf.text('TOTAL:', 125, yPos);
    this.pdf.text(formatINR(this.order.totalAmount), 165, yPos);
  }

  private createPaymentInfo(): void {
    let yPos = 250;
    
    this.pdf.setTextColor(...PDF_COLORS.accentBlue);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(PDF_FONTS.total.size);
    this.pdf.text('PAYMENT INFORMATION', 20, yPos);
    
    yPos += 15;
    this.pdf.setTextColor(...PDF_COLORS.black);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(PDF_FONTS.small.size);
    
    const paymentInfo = [
      'Bank: Market Cloud Bank',
      'Account: 1234-5678-9012',
      'IFSC: MCLD0001234',
      'Email: billing@marketcloud.com'
    ];
    
    paymentInfo.forEach((info, index) => {
      this.pdf.text(info, 20, yPos + (index * 10));
    });
  }

  private createFooter(): void {
    let yPos = 290;
    
    // Thank you message
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(PDF_FONTS.thankYou.size);
    this.pdf.setTextColor(...PDF_COLORS.primaryBlue);
    this.pdf.text('Thank You for Your Business!', 105, yPos, { align: 'center' });
    
    // Footer text
    yPos += 15;
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setFontSize(PDF_FONTS.footer.size);
    this.pdf.setTextColor(...PDF_COLORS.grayColor);
    this.pdf.text('This is a computer-generated invoice. For queries, contact support@marketcloud.com', 105, yPos, { align: 'center' });
  }
}
