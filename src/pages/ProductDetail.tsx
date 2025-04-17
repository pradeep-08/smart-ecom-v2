import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useReview } from "@/contexts/ReviewContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import ProductReviews from "@/components/reviews/ProductReviews";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProduct();
  const { addToCart } = useCart();
  const { getProductReviews, addReview } = useReview();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  
  const product = getProduct(id!);
  const reviews = getProductReviews(id!);
  
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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto aspect-square object-cover"
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
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.stock !== undefined && (
                <span className={`ml-4 text-sm ${product.stock > 10 ? 'text-success' : 'text-warning'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
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
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => (q > 1 ? q - 1 : q))}
                  disabled={product.stock === 0}
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
                  disabled={product.stock === 0}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => (q < (product.stock || 10) ? q + 1 : q))}
                  disabled={product.stock === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              size="lg"
              className="w-full"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            {product.stock === 0 && (
              <p className="text-destructive text-sm">
                This product is currently out of stock
              </p>
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
