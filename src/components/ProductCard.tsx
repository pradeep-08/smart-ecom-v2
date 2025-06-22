import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Images } from "lucide-react";
import { formatINR } from "@/utils/formatters";

interface ProductCardProps {
  product: Product;
  minimal?: boolean;
}

export default function ProductCard({ product, minimal = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };
  
  const totalImages = 1 + (product.images?.length || 0);
  
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <Link to={`/products/${product.id}`} className="overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform hover:scale-105"
        />
        {totalImages > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Images className="h-3 w-3" />
            {totalImages}
          </div>
        )}
      </Link>
      
      <CardContent className="flex-1 p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {!minimal && (
          <p className="text-muted-foreground line-clamp-2 mt-2 text-sm h-10">
            {product.description}
          </p>
        )}
        
        <div className="mt-3 flex justify-between items-baseline">
          <span className="text-lg font-bold">{formatINR(product.price)}</span>
          {!minimal && product.stock !== undefined && (
            <span className={`text-xs ${product.stock > 10 ? 'text-success' : 'text-warning'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          )}
        </div>
      </CardContent>
      
      {!minimal && (
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full space-x-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(q => (q > 1 ? q - 1 : q))}
                disabled={product.stock === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(q => (q < (product.stock || 10) ? q + 1 : q))}
                disabled={product.stock === 0}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <Button 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
