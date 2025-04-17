
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    placed: { label: "Placed", variant: "outline" },
    packed: { label: "Packed", variant: "secondary" },
    shipped: { label: "Shipped", variant: "default" },
    out_for_delivery: { label: "Out for Delivery", variant: "default" },
    delivered: { label: "Delivered", variant: "secondary" },
    cancelled: { label: "Cancelled", variant: "destructive" }
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
