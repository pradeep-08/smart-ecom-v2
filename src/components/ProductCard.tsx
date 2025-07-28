// import { Product } from "@/types";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useCart } from "@/contexts/CartContext";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { ShoppingCart, Plus, Minus, Images } from "lucide-react";
// import { formatINR } from "@/utils/formatters";

// interface ProductCardProps {
//   product?: Product;
//   minimal?: boolean;
//   loading?: boolean;
// }

// export default function ProductCard({ product, minimal = false, loading = false }: ProductCardProps) {
//   const { addToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);

//   if (loading || !product) {
//     return (
//       <Card className="overflow-hidden h-full flex flex-col">
//         <Skeleton className="h-48 w-full" />
//         <CardContent className="flex-1 p-4">
//           <Skeleton className="h-6 w-3/4 mb-2" />
//           <Skeleton className="h-4 w-full mb-2" />
//           <Skeleton className="h-4 w-2/3 mb-3" />
//           <Skeleton className="h-5 w-1/3" />
//         </CardContent>
//         {!minimal && (
//           <CardFooter className="p-4 pt-0">
//             <Skeleton className="h-10 w-full" />
//           </CardFooter>
//         )}
//       </Card>
//     );
//   }

//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     setQuantity(1);
//   };

//   const totalImages = 1 + (product.images?.length || 0);

//   return (
//     <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
//       <Link to={`/products/${product.id}`} className="overflow-hidden relative">
//         <img
//           src={product.imageUrl}
//           alt={product.name}
//           className="h-48 w-full object-cover transition-transform hover:scale-105"
//         />
//         {totalImages > 1 && (
//           <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
//             <Images className="h-3 w-3" />
//             {totalImages}
//           </div>
//         )}
//       </Link>

//       <CardContent className="flex-1 p-4">
//         <Link to={`/products/${product.id}`}>
//           <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
//             {product.name}
//           </h3>
//         </Link>

//         {!minimal && (
//           <p className="text-muted-foreground line-clamp-2 mt-2 text-sm h-10">
//             {product.description}
//           </p>
//         )}

//         <div className="mt-3 flex justify-between items-baseline">
//           <span className="text-lg font-bold">{formatINR(product.price)}</span>
//           {!minimal && product.stock !== undefined && (
//             <span className={`text-xs ${product.stock > 10 ? 'text-success' : 'text-warning'}`}>
//               {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//             </span>
//           )}
//         </div>
//       </CardContent>

//       {!minimal && (
//         <CardFooter className="p-4 pt-0">
//           <div className="flex w-full space-x-2">
//             <div className="flex items-center border rounded-md">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8"
//                 onClick={() => setQuantity(q => (q > 1 ? q - 1 : q))}
//                 disabled={product.stock === 0}
//               >
//                 <Minus className="h-3 w-3" />
//               </Button>
//               <span className="w-8 text-center">{quantity}</span>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8"
//                 onClick={() => setQuantity(q => (q < (product.stock || 10) ? q + 1 : q))}
//                 disabled={product.stock === 0}
//               >
//                 <Plus className="h-3 w-3" />
//               </Button>
//             </div>

//             <Button 
//               className="flex-1"
//               onClick={handleAddToCart}
//               disabled={product.stock === 0}
//             >
//               <ShoppingCart className="h-4 w-4 mr-2" />
//               Add to Cart
//             </Button>
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// }


// import { Product } from "@/types";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useCart } from "@/contexts/CartContext";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { ShoppingCart, Plus, Minus, Images } from "lucide-react";
// import { formatINR } from "@/utils/formatters";

// interface ProductCardProps {
//   product?: Product;
//   minimal?: boolean;
//   loading?: boolean;
// }

// export default function ProductCard({
//   product,
//   minimal = false,
//   loading = false,
// }: ProductCardProps) {
//   const { addToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);

//   if (loading || !product) {
//     return (
//       <Card className="overflow-hidden h-full flex flex-col">
//         <Skeleton className="h-48 sm:h-56 md:h-64 w-full" />
//         <CardContent className="flex-1 p-3 sm:p-4">
//           <Skeleton className="h-6 w-3/4 mb-2" />
//           <Skeleton className="h-4 w-full mb-2" />
//           <Skeleton className="h-4 w-2/3 mb-3" />
//           <Skeleton className="h-5 w-1/3" />
//         </CardContent>
//         {!minimal && (
//           <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
//             <Skeleton className="h-10 w-full" />
//           </CardFooter>
//         )}
//       </Card>
//     );
//   }

//   const handleAddToCart = () => {
//     addToCart(product, quantity);
//     setQuantity(1);
//   };

//   const totalImages = 1 + (product.images?.length || 0);

//   return (
//     <Card className="flex flex-col justify-between h-full overflow-hidden transition-all hover:shadow-md hover:shadow-primary/20 duration-300">
//       {/* Product Image */}
//       <Link to={`/products/${product.id}`} className="relative overflow-hidden">
//         <img
//           src={product.imageUrl}
//           alt={product.name}
//           className="w-full object-cover transition-transform hover:scale-105 h-48 sm:h-56 md:h-64 lg:h-72"
//         />
//         {totalImages > 1 && (
//           <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
//             <Images className="h-3 w-3" />
//             {totalImages}
//           </div>
//         )}
//       </Link>

//       {/* Product Content */}
//       <CardContent className="flex-1 p-3 sm:p-4">
//         <Link to={`/products/${product.id}`}>
//           <h3 className="font-semibold text-base sm:text-lg md:text-xl line-clamp-1 hover:text-primary transition-colors">
//             {product.name}
//           </h3>
//         </Link>

//         {!minimal && (
//           <p className="text-muted-foreground line-clamp-2 mt-2 text-sm sm:text-base h-10">
//             {product.description}
//           </p>
//         )}

//         <div className="mt-3 flex justify-between items-baseline">
//           <span className="text-sm sm:text-base md:text-lg font-bold">
//             {formatINR(product.price)}
//           </span>
//           {!minimal && product.stock !== undefined && (
//             <span
//               className={`text-xs sm:text-sm ${
//                 product.stock > 10 ? "text-success" : "text-warning"
//               }`}
//             >
//               {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
//             </span>
//           )}
//         </div>
//       </CardContent>

//       {/* Product Actions */}
//       {!minimal && (
//         <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
//           <div className="flex flex-col sm:flex-row w-full gap-2">
//             {/* Quantity Controls */}
//             <div className="flex items-center justify-between border rounded-md w-full sm:w-auto">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 sm:h-9 sm:w-9"
//                 onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
//                 disabled={product.stock === 0}
//                 aria-label="Decrease quantity"
//               >
//                 <Minus className="h-3 w-3" />
//               </Button>
//               <span className="w-8 text-center text-sm">{quantity}</span>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 sm:h-9 sm:w-9"
//                 onClick={() =>
//                   setQuantity((q) =>
//                     q < (product.stock || 10) ? q + 1 : q
//                   )
//                 }
//                 disabled={product.stock === 0}
//                 aria-label="Increase quantity"
//               >
//                 <Plus className="h-3 w-3" />
//               </Button>
//             </div>

//             {/* Add to Cart */}
//             <Button
//               className="w-full sm:flex-1"
//               onClick={handleAddToCart}
//               disabled={product.stock === 0}
//               aria-label="Add to cart"
//             >
//               <ShoppingCart className="h-4 w-4 mr-2" />
//               Add to Cart
//             </Button>
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// }




import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Images } from "lucide-react";
import { formatINR } from "@/utils/formatters";

interface ProductCardProps {
  product?: Product;
  minimal?: boolean;
  loading?: boolean;
}

export default function ProductCard({
  product,
  minimal = false,
  loading = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading || !product) {
    return (
      <Card className="overflow-hidden h-full flex flex-col">
        <Skeleton className="h-48 sm:h-56 md:h-60 lg:h-64 w-full" />
        <CardContent className="flex-1 p-3 sm:p-4 md:p-5">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-3" />
          <Skeleton className="h-5 w-1/3" />
        </CardContent>
        {!minimal && (
          <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        )}
      </Card>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const totalImages = 1 + (product.images?.length || 0);

  return (
    <Card className="flex flex-col justify-between h-full overflow-hidden transition-all hover:shadow-md hover:shadow-primary/20 duration-300">
      <Link to={`/products/${product.id}`} className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full object-cover h-48 sm:h-56 md:h-60 lg:h-64 xl:h-72 transition-transform hover:scale-105"
        />
        {totalImages > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Images className="h-3 w-3" />
            {totalImages}
          </div>
        )}
      </Link>

      <CardContent className="flex-1 p-3 sm:p-4 md:p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-base md:text-lg lg:text-xl line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {!minimal && (
          <p className="text-muted-foreground line-clamp-2 mt-2 text-sm md:text-base">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex justify-between items-baseline">
          <span className="text-base md:text-lg font-bold">{formatINR(product.price)}</span>
          {!minimal && product.stock !== undefined && (
            <span
              className={`text-xs md:text-sm ${product.stock > 10 ? "text-success" : "text-warning"
                }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          )}
        </div>
      </CardContent>

      {!minimal && (

        <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
  <div className="flex items-center justify-between w-full gap-2 flex-nowrap">
    {/* Quantity Controls */}
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:h-9 md:w-9"
        onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
        disabled={product.stock === 0}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm md:text-base">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:h-9 md:w-9"
        onClick={() =>
          setQuantity((q) => (q < (product.stock || 10) ? q + 1 : q))
        }
        disabled={product.stock === 0}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>

    {/* Add to Cart Button */}
    <Button
      className="flex-1 min-w-[40px] whitespace-nowrap"
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      aria-label="Add to cart"
    >
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden [@media(min-width:380px)]:inline ml-2">
        Add to Cart
      </span>
    </Button>
  </div>
</CardFooter>




      )}
    </Card>
  );
}
