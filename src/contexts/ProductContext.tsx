import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";

interface ProductContextType {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "createdAt">>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock products for demo - Updated to INR pricing
const MOCK_PRODUCTS: Product[] = [
  {
    id: "product-1",
    name: "Premium Wireless Earbuds",
    description: "High-quality wireless earbuds with noise cancellation and long battery life.",
    price: 9999, // ₹9,999
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=360",
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
  },
  {
    id: "product-9",
    name: "Ergonomic Office Chair",
    description: "Adjustable lumbar support, breathable mesh, and comfort-focused design.",
    price: 15999, // ₹15,999
    imageUrl: "https://images.unsplash.com/photo-1616627981261-4c2b1e2d58b3?auto=format&fit=crop&q=80&w=360",
    sku: "CHAIR-001",
    category: "Furniture",
    stock: 18,
    createdAt: new Date()
  },
  {
    id: "product-10",
    name: "Multi-Port USB-C Hub",
    description: "7-in-1 hub with HDMI, USB 3.0, SD card reader, and power delivery.",
    price: 2499, // ₹2,499
    imageUrl: "https://images.unsplash.com/photo-1611186871348-bb5c4a4d4065?auto=format&fit=crop&q=80&w=360",
    sku: "USBHUB-001",
    category: "Accessories",
    stock: 40,
    createdAt: new Date()
  },
  {
    id: "product-11",
    name: "Portable Projector",
    description: "Compact full HD projector perfect for home theater and presentations.",
    price: 18999, // ₹18,999
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=360",
    sku: "PROJ-001",
    category: "Electronics",
    stock: 12,
    createdAt: new Date()
  },
  {
    id: "product-12",
    name: "Wireless Charging Pad",
    description: "Fast Qi wireless charger compatible with iPhone, Android, and AirPods.",
    price: 1399, // ₹1,399
    imageUrl: "https://images.unsplash.com/photo-1587825140708-5ec0c99764d5?auto=format&fit=crop&q=80&w=360",
    sku: "CHRG-001",
    category: "Accessories",
    stock: 60,
    createdAt: new Date()
  },
  {
    id: "product-13",
    name: "4-Slice Toaster with Digital Display",
    description: "Customizable browning control with reheat and defrost functions.",
    price: 4999, // ₹4,999
    imageUrl: "https://images.unsplash.com/photo-1570813094899-7d5b8b36f708?auto=format&fit=crop&q=80&w=360",
    sku: "TOAST-001",
    category: "Kitchen",
    stock: 22,
    createdAt: new Date()
  },
  {
    id: "product-14",
    name: "Compact Air Purifier",
    description: "Removes dust, smoke, and allergens from your home or office air.",
    price: 8999, // ₹8,999
    imageUrl: "https://images.unsplash.com/photo-1627471467477-baf2c1c9932b?auto=format&fit=crop&q=80&w=360",
    sku: "AIR-001",
    category: "Home Appliances",
    stock: 15,
    createdAt: new Date()
  },
  {
    id: "product-15",
    name: "Cordless Electric Drill Kit",
    description: "21V powerful drill with 2-speed settings and 29 accessories.",
    price: 5999, // ₹5,999
    imageUrl: "https://images.unsplash.com/photo-1592842230699-93df65d38e56?auto=format&fit=crop&q=80&w=360",
    sku: "DRILL-001",
    category: "Tools",
    stock: 25,
    createdAt: new Date()
  },
  {
    id: "product-16",
    name: "Smart LED Light Strip",
    description: "Voice-controlled RGB LED strip lights with mobile app integration.",
    price: 2599, // ₹2,599
    imageUrl: "https://images.unsplash.com/photo-1612511894321-b0f23b94352f?auto=format&fit=crop&q=80&w=360",
    sku: "LED-001",
    category: "Home Decor",
    stock: 45,
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

  return (
    <ProductContext.Provider value={{
      products,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct
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
