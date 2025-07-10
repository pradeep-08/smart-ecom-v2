import { Product } from "@/types";

export const PRODUCTS_DATA: Product[] = [
  {
    id: "product-1",
    name: "Premium Wireless Earbuds",
    description: "High-quality wireless earbuds with noise cancellation and long battery life.",
    price: 9999,
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=360",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "EAR-001",
    category: "Electronics",
    stock: 25,
    createdAt: new Date()
  },
  {
    id: "product-2",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals, heart rate, and sleep patterns with this advanced smartwatch.",
    price: 14999,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "WATCH-001",
    category: "Electronics",
    stock: 15,
    createdAt: new Date()
  },
  {
    id: "product-3",
    name: "Ultra HD 4K Monitor",
    description: "Crystal clear 4K resolution with wide color gamut, perfect for professionals and gaming.",
    price: 27999,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "MON-001",
    category: "Electronics",
    stock: 8,
    createdAt: new Date()
  },
  {
    id: "product-4",
    name: "Mechanical Gaming Keyboard",
    description: "Responsive mechanical switches with RGB lighting for the ultimate gaming experience.",
    price: 6999,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "KEY-001",
    category: "Gaming",
    stock: 12,
    createdAt: new Date()
  },
  {
    id: "product-5",
    name: "Professional Coffee Machine",
    description: "Barista-quality coffee at home with this professional-grade coffee maker.",
    price: 22999,
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=360",
    images: [],
    sku: "COF-001",
    category: "Kitchen",
    stock: 5,
    createdAt: new Date()
  }
];
