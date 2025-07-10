import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useReview } from "@/contexts/ReviewContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import ProductReviews from "@/components/reviews/ProductReviews";
import ProductImageGallery from "@/components/ProductImageGallery";
import WaitlistButton from "@/components/WaitlistButton";
import { formatINR } from "@/utils/formatters";
import { productApi } from "@/backend/api/productApi";
import { Product } from "@/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { getProductReviews, addReview } = useReview();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const reviews = id ? getProductReviews(id) : [];

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const productData = await productApi.getById(productId);
      setProduct(productData);
    } catch (error) {
      console.error("Failed to load product", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-24 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <Skeleton className="h-96 w-full rounded-lg" />
          
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
            
            <Skeleton className="h-4 w-24" />
            
            <div className="space-y-4">
              <Skeleton className="h-6 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The product you are looking for might have been removed or does not exist.
        </p>
        <Button onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  // Prepare images array for the gallery
  const productImages = [product.imageUrl, ...(product.images || [])];
  
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock !== undefined && product.stock <= 5 && product.stock > 0;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div className="rounded-lg overflow-hidden">
          <ProductImageGallery 
            images={productImages}
            productName={product.name}
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
            )}
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-baseline mt-2">
              <span className="text-2xl font-bold">{formatINR(product.price)}</span>
              {product.stock !== undefined && (
                <span className={`ml-4 text-sm ${
                  isOutOfStock ? 'text-destructive' : 
                  isLowStock ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {isOutOfStock ? 'Out of stock' : 
                   isLowStock ? `Only ${product.stock} left` : 
                   `${product.stock} in stock`}
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description}
            </p>
          </div>
          
          {product.sku && (
            <div className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </div>
          )}
          
          <div className="py-4 space-y-4">
            {!isOutOfStock ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(q => (q > 1 ? q - 1 : q))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-16 mx-2 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(q => (q < (product.stock || 10) ? q + 1 : q))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-destructive font-medium">
                  This product is currently out of stock
                </p>
                <WaitlistButton 
                  productId={product.id}
                  productName={product.name}
                  isOutOfStock={isOutOfStock}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16">
        <ProductReviews 
          productId={id!} 
          reviews={reviews}
          onAddReview={addReview}
        />
      </div>
    </div>
  );
}
