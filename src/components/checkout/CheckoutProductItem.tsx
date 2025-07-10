import { CartItem } from "@/types";
import { formatINR } from "@/utils/formatters";

interface CheckoutProductItemProps {
  item: CartItem;
}

export default function CheckoutProductItem({ item }: CheckoutProductItemProps) {
  return (
    <div className="flex gap-4 py-2 border-b last:border-none">
      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
        <img 
          src={item.product.imageUrl} 
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-sm">{item.product.name}</h3>
          <span className="font-semibold">{formatINR(item.product.price * item.quantity)}</span>
        </div>
        <div className="flex justify-between mt-1 text-sm text-muted-foreground">
          <span>{item.quantity} × {formatINR(item.product.price)}</span>
          {item.product.category && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded">{item.product.category}</span>
          )}
        </div>
      </div>
    </div>
  );
}
