import { CartItem } from "@/types";
import { formatINR } from "@/utils/formatters";

interface OrderItemsProps {
  items: CartItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order Items</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 p-4 rounded-lg border"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {formatINR(item.product.price * item.quantity)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatINR(item.product.price)} each
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
