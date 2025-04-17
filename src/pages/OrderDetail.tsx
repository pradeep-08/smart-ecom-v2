import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import OrderHeader from "@/components/orders/OrderHeader";
import OrderItems from "@/components/orders/OrderItems";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderShippingInfo from "@/components/orders/OrderShippingInfo";
import OrderPaymentInfo from "@/components/orders/OrderPaymentInfo";
import OrderNotFound from "@/components/orders/OrderNotFound";
import OrderTracking from "@/components/OrderTracking";
import OrderInvoice from "@/components/orders/OrderInvoice";
import { toast } from "sonner";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrder();
  const location = useLocation();
  
  const order = getOrderById(id!);
  const isNewOrder = location.state?.isNewOrder;
  
  useEffect(() => {
    if (isNewOrder) {
      toast.success("Order placed successfully!");
      toast.info("Your invoice has been emailed to you.");
    }
  }, [isNewOrder]);
  
  if (!order) {
    return <OrderNotFound />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <OrderHeader order={order} isNewOrder={isNewOrder} />
        <OrderInvoice orderId={order.id} />
      </div>
      
      {/* Courier Tracking Information */}
      {order.courierId && (
        <div className="mb-8">
          <OrderTracking courierId={order.courierId} initialStatus={order.trackingStatus} />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <OrderItems items={order.items} />
        </div>
        
        <div>
          <OrderSummary order={order} />
          <OrderShippingInfo shippingDetails={order.shippingDetails} />
          
          {order.paymentInfo && (
            <OrderPaymentInfo paymentInfo={order.paymentInfo} />
          )}
        </div>
      </div>
    </div>
  );
}
