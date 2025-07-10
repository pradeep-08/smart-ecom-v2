import { OrderStatus } from "@/types";
import { Check } from "lucide-react";

interface OrderTrackerProps {
  status: OrderStatus;
}

export default function OrderTracker({ status }: OrderTrackerProps) {
  const steps = [
    { id: "placed", label: "Order Placed" },
    { id: "processing", label: "Processing" },
    { id: "packed", label: "Packed" },
    { id: "shipped", label: "Shipped" },
    { id: "out_for_delivery", label: "Out for Delivery" },
    { id: "delivered", label: "Delivered" }
  ];
  
  // Map order status to step number
  const statusValues: Record<OrderStatus, number> = {
    placed: 0,
    processing: 1,
    packed: 2,
    shipped: 3,
    out_for_delivery: 4,
    delivered: 5,
    cancelled: 0 // Setting cancelled to 0 to show minimal progress
  };
  
  const currentStatusValue = statusValues[status];
  
  // If the order is cancelled, show a different UI
  if (status === "cancelled") {
    return (
      <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="text-red-800 font-medium">This order has been cancelled.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <div className="relative">
        {/* Progress Bar */}
        <div className="overflow-hidden h-2 mb-4 flex bg-gray-200 rounded">
          <div
            className="bg-primary transition-all duration-500"
            style={{ width: `${(currentStatusValue / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isActive = index <= currentStatusValue;
            
            return (
              <div 
                key={step.id}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                {/* Step Circle */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}
                  mb-2
                `}>
                  {isActive ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                
                {/* Step Label */}
                <span className={`
                  text-xs text-center font-medium
                  ${isActive ? 'text-primary' : 'text-gray-400'}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
