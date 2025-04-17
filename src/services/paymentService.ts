import { toast } from "sonner";

// Types for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  orderId?: string;
  email: string;
  contact?: string;
}

interface PaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Mock function to create a Razorpay order ID
// In a real app, this would call your backend API which would use Razorpay's server API
const createRazorpayOrder = async (amount: number): Promise<string> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock order ID
      const orderId = 'order_' + Date.now().toString();
      resolve(orderId);
    }, 800);
  });
};

export const initiatePayment = async (
  options: PaymentOptions,
  onSuccess: (response: PaymentSuccessResponse) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  try {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Generate order ID (in a real app this would come from your server)
    const orderId = await createRazorpayOrder(options.amount);
    
    // Initialize Razorpay options
    const razorpayOptions = {
      key: 'rzp_test_YourTestKey', // Replace with your Razorpay key
      amount: options.amount * 100, // Razorpay expects amount in paise
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: orderId,
      prefill: {
        email: options.email,
        contact: options.contact || '',
      },
      theme: {
        color: '#8B5CF6', // Match with your site theme
      },
      handler: function(response: PaymentSuccessResponse) {
        onSuccess(response);
      },
    };
    
    // Initialize Razorpay
    const razorpayInstance = new window.Razorpay(razorpayOptions);
    razorpayInstance.open();
  } catch (error) {
    console.error('Payment initiation failed:', error);
    toast.error('Payment initiation failed. Please try again.');
    onFailure(error);
  }
};
