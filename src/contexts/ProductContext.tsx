import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { toast } from "sonner";
import { productApi } from "@/backend/api/productApi";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "createdAt">>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (productId: string, quantityOrdered: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Load products from API on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    try {
      const newProduct = await productApi.create(product);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      toast.success(`Product "${product.name}" added successfully`);
        // Redirect after success
      navigate("/admin/products"); 
    } catch (error) {
      console.error("Failed to add product", error);
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (id: string, productUpdate: Partial<Omit<Product, "id" | "createdAt">>) => {
    try {
      const updatedProduct = await productApi.update(id, productUpdate);
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? updatedProduct : product
        )
      );
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productToDelete = products.find(product => product.id === id);
      await productApi.delete(id);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      if (productToDelete) {
        toast.success(`Product "${productToDelete.name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    }
  };

  const updateStock = async (productId: string, quantityOrdered: number) => {
    try {
      await productApi.updateStock(productId, quantityOrdered);
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
    } catch (error) {
      console.error("Failed to update stock", error);
      toast.error("Failed to update stock");
    }
  };

  const refreshProducts = async () => {
    await loadProducts();
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      refreshProducts
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
