
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Coupon } from "@/types";
import { toast } from "sonner";

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  removeCoupon: (code: string) => void;
  validateCoupon: (code: string, amount: number) => Coupon | null;
  activeCoupon: Coupon | null;
  setActiveCoupon: (coupon: Coupon | null) => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

// Mock coupons for demo
const MOCK_COUPONS: Coupon[] = [
  {
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    discountPercentage: 20,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    minimumAmount: 1000, // ₹1000
    isActive: true,
  },
  {
    code: "FLAT100",
    discountType: "flat",
    discountValue: 100,
    discountPercentage: 0,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    minimumAmount: 500,
    isActive: true,
  },
  {
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    discountPercentage: 10,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    isActive: true,
  },
];

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Load coupons from localStorage
  useEffect(() => {
    const savedCoupons = localStorage.getItem("coupons");
    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons));
      } catch (error) {
        console.error("Failed to parse coupons from localStorage", error);
      }
    }
  }, []);

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (couponData: Omit<Coupon, "id">) => {
    const existingCoupon = coupons.find(
      (c) => c.code.toLowerCase() === couponData.code.toLowerCase()
    );

    if (existingCoupon) {
      toast.error(`Coupon with code ${couponData.code} already exists`);
      return;
    }

    setCoupons((prev) => [...prev, couponData]);
    toast.success(`Coupon ${couponData.code} added successfully`);
  };

  const removeCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((coupon) => coupon.code !== code));
    
    if (activeCoupon?.code === code) {
      setActiveCoupon(null);
    }
    
    toast.success(`Coupon ${code} removed successfully`);
  };

  const validateCoupon = (code: string, amount: number): Coupon | null => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive
    );

    if (!coupon) {
      toast.error("Invalid coupon code");
      return null;
    }

    if (coupon.expiresAt < new Date()) {
      toast.error("Coupon has expired");
      return null;
    }

    if (coupon.minimumAmount && amount < coupon.minimumAmount) {
      toast.error(
        `Minimum order amount for this coupon is ₹${coupon.minimumAmount}`
      );
      return null;
    }

    return coupon;
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        addCoupon,
        removeCoupon,
        validateCoupon,
        activeCoupon,
        setActiveCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
}
