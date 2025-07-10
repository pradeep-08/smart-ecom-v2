import { Order } from '@/types';

// Calculate discount amount for an order
export function calculateDiscount(order: Order): number {
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

// Calculate tax amount
export function calculateTax(subtotal: number, discount: number): number {
  return (subtotal - discount) * 0.05;
}

// Calculate final total
export function calculateTotal(subtotal: number, discount: number, tax: number): number {
  return subtotal - discount + tax;
}
