import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { useCoupon } from "@/contexts/CouponContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingDetails } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, Loader2, IndianRupee, Tag, CreditCard } from "lucide-react";
import { formatINR } from "@/utils/formatters";
import { initiatePayment } from "@/services/paymentService";
import CheckoutProductItem from "@/components/checkout/CheckoutProductItem";

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const { validateCoupon, activeCoupon, setActiveCoupon } = useCoupon();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi">("card");
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplying, setIsCouponApplying] = useState(false);
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: user?.name || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Redirect if admin
  useEffect(() => {
    if (user?.role === 'admin') {
      toast.error("Administrators cannot place orders");
      navigate("/");
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    setIsCouponApplying(true);
    
    setTimeout(() => {
      const coupon = validateCoupon(couponCode, subtotal);
      if (coupon) {
        setActiveCoupon(coupon);
        toast.success(`Coupon ${couponCode} applied successfully!`);
        setCouponCode("");
      }
      setIsCouponApplying(false);
    }, 600);
  };
  
  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    toast.info("Coupon removed");
  };
  
  const processPayment = async () => {
    // For COD, we don't need to process payment
    if (paymentMethod === "cod") {
      return {
        paymentId: `COD-${Date.now()}`,
        paymentStatus: "pending",
        paymentMethod: "Cash on Delivery",
        amount: calculateTotal(),
      };
    }
    
    // For card or UPI, process payment through Razorpay
    return new Promise((resolve, reject) => {
      initiatePayment(
        {
          amount: calculateTotal(),
          currency: "INR",
          name: "ShopNow",
          description: "Purchase from ShopNow",
          email: user?.email || "customer@example.com",
          contact: shippingDetails.phone,
        },
        (response) => {
          // Payment success callback
          resolve({
            paymentId: response.razorpay_payment_id,
            paymentStatus: "completed",
            paymentMethod: paymentMethod === "card" ? "Credit/Debit Card" : "UPI",
            amount: calculateTotal(),
          });
        },
        (error) => {
          // Payment failure callback
          reject(error);
        }
      );
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      toast.info("Please log in to complete your purchase");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process payment
      const paymentInfo = await processPayment();
      
      // Create order
      const order = await createOrder(items, shippingDetails, activeCoupon);
      
      // Clear the cart after successful order placement
      clearCart();
      
      // Navigate to the order confirmation page
      navigate(`/orders/${order.id}`, { state: { isNewOrder: true } });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Payment failed. Please try again or choose a different payment method.");
      setIsProcessing(false);
    }
  };
  
  // If the cart is empty, redirect to the cart page
  if (items.length === 0 && !isProcessing) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Button onClick={() => navigate("/products")}>
          Browse Products
        </Button>
      </div>
    );
  }
  
  // If user is an admin, don't show checkout
  if (user?.role === 'admin') {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Access Restricted</h1>
        <p className="mb-6 text-muted-foreground">
          Administrators cannot place orders. Please use a customer account for shopping.
        </p>
        <Button onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    );
  }
  
  const subtotal = getCartTotal();
  
  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discount = subtotal * activeCoupon.discountPercentage / 100;
    } else {
      discount = activeCoupon.discountValue;
    }
  }
  
  const tax = (subtotal - discount) * 0.05; // 5% tax
  
  const calculateTotal = () => {
    return subtotal - discount + tax;
  };
  
  const total = calculateTotal();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-8 -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={shippingDetails.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={shippingDetails.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${
                    paymentMethod === "card" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Card</span>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${
                    paymentMethod === "upi" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 18L8 14H12L16 10H8L4 6H16L20 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 22L8 18L20 18L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>UPI</span>
                </div>
                <div
                  className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${
                    paymentMethod === "cod" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <IndianRupee className="h-6 w-6 mb-2" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>
            
            {paymentMethod === "card" && (
              <div className="p-4 border rounded-md bg-accent/10 mt-4">
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to our secure payment gateway to complete your purchase.
                </p>
              </div>
            )}
            
            {paymentMethod === "upi" && (
              <div className="p-4 border rounded-md bg-accent/10 mt-4">
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to complete the payment using your preferred UPI app.
                </p>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing
                ? "Processing..."
                : user 
                  ? (paymentMethod === "cod"
                    ? "Place Order (Cash on Delivery)"
                    : `Pay ${formatINR(total)} & Place Order`)
                  : "Login to Checkout"
              }
            </Button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-muted rounded-lg p-6">
            <div className="divide-y">
              <div className="space-y-3 pb-4">
                {items.map(item => (
                  <CheckoutProductItem key={item.product.id} item={item} />
                ))}
              </div>
              
              {/* Coupon Code Input */}
              <div className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">Have a coupon?</span>
                </div>
                
                {activeCoupon ? (
                  <div className="flex items-center justify-between bg-primary/10 p-3 rounded-md">
                    <div>
                      <span className="font-semibold text-primary">{activeCoupon.code}</span>
                      <p className="text-xs text-muted-foreground">
                        {activeCoupon.discountType === 'percentage' 
                          ? `${activeCoupon.discountPercentage}% discount applied`
                          : `${formatINR(activeCoupon.discountValue)} discount applied`
                        }
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isCouponApplying || !couponCode}
                    >
                      {isCouponApplying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>{formatINR(tax)}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Info Note */}
          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Payment Information</h3>
            <p className="text-sm text-muted-foreground">
              This is a demo app. No actual payment will be processed.
              {paymentMethod === "cod" 
                ? " You can pay cash upon delivery." 
                : " Click 'Pay & Place Order' to simulate a payment."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
