import { useNavigate } from "react-router-dom";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderTracker from "@/components/OrderTracker";
import { ArrowLeft, CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface OrderHeaderProps {
  order: Order;
  isNewOrder: boolean | undefined;
}

export default function OrderHeader({ order, isNewOrder }: OrderHeaderProps) {
  const navigate = useNavigate();
  
  const orderDate = new Date(order.createdAt);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(orderDate.getDate() + 7);
  
  return (
    <>
      <Button variant="ghost" onClick={() => navigate("/orders")} className="mb-8 -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>
      
      {isNewOrder && (
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6 pb-4 flex items-center gap-4">
            <div className="bg-primary/10 rounded-full p-2">
              <CheckCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Order Placed Successfully!</h2>
              <p className="text-sm text-muted-foreground">
                Thank you for your order. We'll ship your items as soon as possible.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="mb-8">
          <OrderTracker status={order.status} />
        </div>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-muted rounded-lg p-4">
            <dt className="font-medium mb-1">Order ID</dt>
            <dd className="text-muted-foreground font-mono">{order.id}</dd>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <dt className="font-medium mb-1">Order Date</dt>
            <dd className="text-muted-foreground">
              {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </dd>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <dt className="font-medium mb-1">Last Updated</dt>
            <dd className="text-muted-foreground">
              {format(new Date(order.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
            </dd>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <dt className="font-medium mb-1">Estimated Delivery</dt>
            <dd className="text-muted-foreground">
              {format(estimatedDelivery, "MMMM d, yyyy")}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
