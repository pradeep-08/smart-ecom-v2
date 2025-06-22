import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";

interface ProductContextType {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "createdAt">>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantityOrdered: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock products for demo - Updated to INR pricing with multiple images
const MOCK_PRODUCTS: Product[] = [
  {
    id: "product-1",
    name: "Premium Wireless Earbuds",
    description: "High-quality wireless earbuds with noise cancellation and long battery life.",
    price: 9999, // ₹9,999
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=360",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "EAR-001",
    category: "Electronics",
    stock: 45,
    createdAt: new Date()
  },
  {
    id: "product-2",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals, heart rate, and sleep patterns with this advanced smartwatch.",
    price: 14999, // ₹14,999
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=360",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "WATCH-001",
    category: "Electronics",
    stock: 30,
    createdAt: new Date()
  },
  {
    id: "product-3",
    name: "Ultra HD 4K Monitor",
    description: "Crystal clear 4K resolution with wide color gamut, perfect for professionals and gaming.",
    price: 27999, // ₹27,999
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "MON-001",
    category: "Electronics",
    stock: 15,
    createdAt: new Date()
  },
  {
    id: "product-4",
    name: "Mechanical Gaming Keyboard",
    description: "Responsive mechanical switches with RGB lighting for the ultimate gaming experience.",
    price: 6999, // ₹6,999
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=360",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=360",
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&q=80&w=360"
    ],
    sku: "KEY-001",
    category: "Gaming",
    stock: 25,
    createdAt: new Date()
  },
  {
    id: "product-5",
    name: "Professional Coffee Machine",
    description: "Barista-quality coffee at home with this professional-grade coffee maker.",
    price: 22999, // ₹22,999
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=360",
    sku: "COF-001",
    category: "Kitchen",
    stock: 10,
    createdAt: new Date()
  },
  {
    id: "product-6",
    name: "Smartphone Power Bank 20000mAh",
    description: "Fast charging power bank with high capacity for all your mobile devices.",
    price: 1999, // ₹1,999
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=360",
    sku: "PB-001",
    category: "Electronics",
    stock: 50,
    createdAt: new Date()
  },
  {
    id: "product-7",
    name: "Bluetooth Noise Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation and 30 hour battery life.",
    price: 12999, // ₹12,999
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=360",
    sku: "HEAD-001",
    category: "Electronics",
    stock: 35,
    createdAt: new Date()
  },
  {
    id: "product-8",
    name: "Smart Home Security Camera",
    description: "HD WiFi camera with motion detection, night vision and two-way audio.",
    price: 3999, // ₹3,999
    imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=360",
    sku: "CAM-001",
    category: "Home Security",
    stock: 20,
    createdAt: new Date()
  }
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Failed to parse products from localStorage", error);
      }
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date()
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    toast.success(`Product "${product.name}" added successfully`);
  };

  const updateProduct = (id: string, productUpdate: Partial<Omit<Product, "id" | "createdAt">>) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id
          ? { ...product, ...productUpdate }
          : product
      )
    );
    toast.success("Product updated successfully");
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    if (productToDelete) {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success(`Product "${productToDelete.name}" deleted successfully`);
    }
  };

  const updateStock = (productId: string, quantityOrdered: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { 
              ...product, 
              stock: product.stock !== undefined ? Math.max(0, product.stock - quantityOrdered) : undefined 
            }
          : product
      )
    );
  };

  return (
    <ProductContext.Provider value={{
      products,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}