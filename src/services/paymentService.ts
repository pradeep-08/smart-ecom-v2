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
const createRazorpayOrder = async (amount: number): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderId = 'order_' + Date.now().toString();
      resolve(orderId);
    }, 800);
  });
};

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (
  options: PaymentOptions,
  onSuccess: (response: PaymentSuccessResponse) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  try {
    console.log('Initiating payment with options:', options);
    
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load payment gateway');
    }

    // Generate order ID
    const orderId = await createRazorpayOrder(options.amount);
    console.log('Generated order ID:', orderId);
    
    // Initialize Razorpay options
    const razorpayOptions = {
      key: 'rzp_test_YourTestKey', // Demo key
      amount: Math.round(options.amount * 100), // Convert to paise and ensure integer
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: orderId,
      prefill: {
        email: options.email,
        contact: options.contact || '',
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
          toast.error('Payment was cancelled');
          onFailure(new Error('Payment cancelled by user'));
        }
      },
      handler: function(response: PaymentSuccessResponse) {
        console.log('Payment successful:', response);
        toast.success('Payment completed successfully!');
        onSuccess(response);
      },
    };
    
    console.log('Creating Razorpay instance with options:', razorpayOptions);
    
    // Initialize Razorpay
    const razorpayInstance = new window.Razorpay(razorpayOptions);
    
    // Add error handler
    razorpayInstance.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      toast.error(`Payment failed: ${response.error.description}`);
      onFailure(response.error);
    });
    
    // Open the payment modal
    razorpayInstance.open();
    
  } catch (error) {
    console.error('Payment initiation failed:', error);
    toast.error('Failed to initiate payment. Please try again.');
    onFailure(error);
  }
};
