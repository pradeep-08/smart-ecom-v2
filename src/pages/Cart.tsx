import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatINR } from "@/utils/formatters";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { getProduct } = useProduct();
  const navigate = useNavigate();
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }
    
    const product = getProduct(productId);
    if (product && product.stock !== undefined && quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    updateQuantity(productId, quantity);
  };
  
  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };
  
  // Check for stock issues
  const stockIssues = items.filter(item => {
    const currentProduct = getProduct(item.product.id);
    return currentProduct && currentProduct.stock !== undefined && 
           (currentProduct.stock < item.quantity || currentProduct.stock === 0);
  });
  
  const hasStockIssues = stockIssues.length > 0;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products to your cart yet
          </p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          {/* Stock Issues Alert */}
          {hasStockIssues && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Some items in your cart have stock limitations. Please review quantities before checkout.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="min-w-[150px]">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const currentProduct = getProduct(item.product.id);
                  const stock = currentProduct?.stock;
                  const hasStockIssue = stock !== undefined && (stock < item.quantity || stock === 0);
                  const isOutOfStock = stock === 0;
                  
                  return (
                    <TableRow key={item.product.id} className={hasStockIssue ? "bg-orange-50" : ""}>
                      <TableCell>
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product.name}
                        {hasStockIssue && (
                          <div className="mt-1">
                            <Badge variant="destructive" className="text-xs">
                              {isOutOfStock ? "Out of Stock" : "Limited Stock"}
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatINR(item.product.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={isOutOfStock}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.product.id, Number(e.target.value))}
                            className="w-14 h-8 text-center"
                            min="1"
                            max={stock}
                            disabled={isOutOfStock}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={isOutOfStock || (stock !== undefined && item.quantity >= stock)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {stock !== undefined ? (
                          <span className={stock <= 5 ? "text-orange-600 font-medium" : "text-muted-foreground"}>
                            {stock} left
                          </span>
                        ) : (
                          <span className="text-muted-foreground">In Stock</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatINR(item.product.price * item.quantity)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemove(item.product.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatINR(getCartTotal())}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </Button>
              <Button
                variant="ghost"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
            <Button 
              onClick={() => navigate("/checkout")} 
              className="group"
              disabled={hasStockIssues}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {hasStockIssues && (
            <p className="text-sm text-orange-600 mt-4 text-center">
              Please resolve stock issues before proceeding to checkout
            </p>
          )}
        </>
      )}
    </div>
  );
}
