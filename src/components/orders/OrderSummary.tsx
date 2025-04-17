import { Order } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import OrderInvoice from "./OrderInvoice";

interface OrderSummaryProps {
  order: Order;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  // Calculate subtotal without tax
  const subtotal = order.items.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  // Calculate discount if coupon was applied
  let discount = 0;
  if (order.couponApplied) {
    if (order.couponApplied.discountType === 'percentage') {
      discount = subtotal * order.couponApplied.discountPercentage / 100;
    } else {
      discount = order.couponApplied.discountValue;
    }
  }
  
  // 5% tax
  const tax = (subtotal - discount) * 0.05;
  
  return (
    <div className="bg-muted p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-mono">{order.id}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        
        <div className="border-t my-4 pt-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatINR(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span>{formatINR(tax)}</span>
          </div>
          
          <div className="flex justify-between font-semibold border-t mt-2 pt-2">
            <span>Total</span>
            <span>{formatINR(order.totalAmount)}</span>
          </div>
        </div>
      </div>
      
      {/* Invoice Download Button */}
      <div className="mt-4">
        <OrderInvoice orderId={order.id} />
      </div>
    </div>
  );
}
