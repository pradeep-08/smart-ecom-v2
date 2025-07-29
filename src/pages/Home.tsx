import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Filter } from "lucide-react";

export default function Home() {
  const { products } = useProduct();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Extract unique categories from products
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))];
  
  // Filter products by selected category
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  // Get featured products (latest 3 from filtered results)
  const featuredProducts = filteredProducts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6); // Show more products when filtered
  
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      {/* <section className="relative py-20 px-4 md:px-8 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/80 to-accent/80 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1740')] mix-blend-overlay opacity-20 bg-cover bg-center" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Amazing Products for Your Needs
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Shop the latest products with our easy-to-use eCommerce platform. 
            Quick checkout, secure payment, and fast delivery.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="font-semibold">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 font-semibold">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section> */}

      {/* Category Filter Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Shop by Category</h2>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Products" : category}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured/Filtered Products Section */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            {selectedCategory === "all" ? "Featured Products" : `${selectedCategory} Products`}
          </h2>
          <Button asChild variant="ghost" className="group">
            <Link to="/products" className="flex items-center">
              View All 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found in the {selectedCategory} category.
            </p>
            <Button 
              onClick={() => setSelectedCategory("all")} 
              className="mt-4"
              variant="outline"
            >
              Show All Products
            </Button>
          </div>
        )}
      </section>
      
      {/* Features Section */}
      {/* <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Shop With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card shadow-sm rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-muted-foreground">
                We source only the best products with rigorous quality control.
              </p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                We ensure your orders reach you quickly with our efficient logistics.
              </p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">
                Your transactions are protected with industry-standard security.
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
