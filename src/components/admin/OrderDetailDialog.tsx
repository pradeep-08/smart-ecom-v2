import { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { format } from "date-fns";
import { formatINR } from "@/utils/formatters";
import { Truck } from "lucide-react";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateCourierId: (orderId: string, courierId: string) => void;
}

export default function OrderDetailDialog({ 
  order,
  open,
  onOpenChange,
  onUpdateStatus,
  onUpdateCourierId
}: OrderDetailDialogProps) {
  const [courierIdInput, setCourierIdInput] = useState("");
  
  // Set courier ID input when order changes
  useState(() => {
    if (order) {
      setCourierIdInput(order.courierId || "");
    }
  });
  
  if (!order) return null;

  const handleUpdateCourierId = () => {
    if (courierIdInput.trim()) {
      onUpdateCourierId(order.id, courierIdInput.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order ID: {order.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Order Status */}
          <div className="space-y-2">
            <h3 className="font-medium">Status</h3>
            <div className="flex items-center gap-4">
              <OrderStatusBadge status={order.status} />
              <Select 
                value={order.status}
                onValueChange={(value) => onUpdateStatus(order.id, value as OrderStatus)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground text-sm">
              Last updated: {format(new Date(order.updatedAt), "PPp")}
            </p>
          </div>
          
          {/* Courier ID Section */}
          <div className="space-y-2">
            <h3 className="font-medium">Courier Information</h3>
            <div className="flex items-center gap-3">
              <Input 
                placeholder="Enter courier tracking ID"
                value={courierIdInput}
                onChange={(e) => setCourierIdInput(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleUpdateCourierId}
                disabled={!courierIdInput.trim()}
              >
                <Truck className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
            {order.courierId && (
              <p className="text-sm mt-1">
                Current Courier ID: <span className="font-mono">{order.courierId}</span>
              </p>
            )}
          </div>
          
          {/* Customer Details */}
          <div className="space-y-2">
            <h3 className="font-medium">Customer Information</h3>
            <div className="bg-muted rounded-lg p-3 text-sm">
              <p><strong>Name:</strong> {order.shippingDetails.name}</p>
              <p><strong>Address:</strong> {order.shippingDetails.address}</p>
              <p>
                {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zipCode}
              </p>
              <p><strong>Phone:</strong> {order.shippingDetails.phone}</p>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="space-y-2">
            <h3 className="font-medium">Order Items</h3>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-2 px-3 text-left">Product</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Price</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.product.id} className="border-b">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-8 w-8 rounded object-cover"
                          />
                          <span>{item.product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {formatINR(item.product.price)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        {formatINR(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {order.couponApplied && (
                    <tr className="bg-muted/30">
                      <td colSpan={3} className="py-2 px-3 text-right text-green-600">
                        {order.couponApplied.discountType === 'percentage' ? 
                          `Discount (${order.couponApplied.discountPercentage}%)` : 
                          'Discount (Flat)'}
                      </td>
                      <td className="py-2 px-3 text-right text-green-600">
                        {order.couponApplied.discountType === 'percentage' ? 
                          `-${formatINR(order.items.reduce(
                            (sum, item) => sum + item.product.price * item.quantity, 0
                          ) * order.couponApplied.discountPercentage / 100)}` :
                          `-${formatINR(order.couponApplied.discountValue)}`
                        }
                      </td>
                    </tr>
                  )}
                  <tr className="bg-muted/30">
                    <td colSpan={3} className="py-2 px-3 text-right font-medium">
                      Total
                    </td>
                    <td className="py-2 px-3 text-right font-medium">
                      {formatINR(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Payment Information */}
          {order.paymentInfo && (
            <div className="space-y-2">
              <h3 className="font-medium">Payment Information</h3>
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p><strong>Method:</strong> {order.paymentInfo.paymentMethod}</p>
                <p><strong>Status:</strong> <span className={
                  order.paymentInfo.paymentStatus === 'completed' 
                    ? 'text-green-600' 
                    : 'text-amber-500'
                }>
                  {order.paymentInfo.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                </span></p>
                <p><strong>Payment ID:</strong> {order.paymentInfo.paymentId}</p>
                <p><strong>Amount:</strong> {formatINR(order.paymentInfo.amount)}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
