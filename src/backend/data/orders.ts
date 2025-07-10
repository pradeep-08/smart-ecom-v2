import { Order } from "@/types";

export const ORDERS_DATA: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [],
    totalAmount: 1299.99,
    status: "delivered",
    shippingDetails: {
      name: "Demo User",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      phone: "555-123-4567"
    },
    courierId: "IN4325678901",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: "order-2",
    userId: "user-1",
    items: [],
    totalAmount: 895.50,
    status: "shipped",
    shippingDetails: {
      name: "Demo User",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      phone: "555-123-4567"
    },
    courierId: "IN9876543210",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "order-3",
    userId: "user-2",
    items: [],
    totalAmount: 2599.99,
    status: "processing",
    shippingDetails: {
      name: "Jane Smith",
      address: "456 Oak Ave",
      city: "Springfield",
      state: "NY",
      zipCode: "67890",
      phone: "555-987-6543"
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "order-4",
    userId: "user-3",
    items: [],
    totalAmount: 649.99,
    status: "placed",
    shippingDetails: {
      name: "Bob Johnson",
      address: "789 Pine St",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      phone: "555-456-7890"
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "order-5",
    userId: "user-4",
    items: [],
    totalAmount: 1899.99,
    status: "cancelled",
    shippingDetails: {
      name: "Alice Brown",
      address: "321 Elm St",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      phone: "555-321-9876"
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  }
];
