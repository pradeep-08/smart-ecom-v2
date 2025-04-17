import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { formatINR } from "@/utils/formatters";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export default function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-10 px-4 text-left font-medium">Order ID</th>
            <th className="h-10 px-4 text-left font-medium">Customer</th>
            <th className="h-10 px-4 text-left font-medium">Date</th>
            <th className="h-10 px-4 text-left font-medium">Items</th>
            <th className="h-10 px-4 text-left font-medium">Total</th>
            <th className="h-10 px-4 text-left font-medium">Status</th>
            <th className="h-10 px-4 text-left font-medium">Courier ID</th>
            <th className="h-10 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-muted/50">
                <td className="p-4 font-mono text-xs">{order.id}</td>
                <td className="p-4">{order.shippingDetails.name}</td>
                <td className="p-4">
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </td>
                <td className="p-4">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </td>
                <td className="p-4">{formatINR(order.totalAmount)}</td>
                <td className="p-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="p-4">
                  {order.courierId ? (
                    <span className="font-mono text-xs">{order.courierId}</span>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Not assigned</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                    onClick={() => onViewOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-6 text-center text-muted-foreground">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
