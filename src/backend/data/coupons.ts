import { Coupon } from "@/types";

export const COUPONS_DATA: Coupon[] = [
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
  {
    code: "NEWUSER50",
    discountType: "flat",
    discountValue: 50,
    discountPercentage: 0,
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    minimumAmount: 300,
    isActive: true,
  },
  {
    code: "EXPIRED",
    discountType: "percentage",
    discountValue: 25,
    discountPercentage: 25,
    expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (expired)
    minimumAmount: 1500,
    isActive: false,
  }
];
