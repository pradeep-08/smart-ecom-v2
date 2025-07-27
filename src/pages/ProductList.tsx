// import { useEffect, useState } from "react";
// import { useProduct } from "@/contexts/ProductContext";
// import ProductCard from "@/components/ProductCard";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Search, Filter, Grid2X2, ListFilter, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
// import { formatINR } from "@/utils/formatters";

// export default function ProductList() {
//   const { products, loading, refreshProducts } = useProduct();
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState<string>("newest");
//   const [category, setCategory] = useState<string>("all");
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
  
//   // Extract unique categories from products
//   const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))];
  
//   // Find min and max prices for the price range filter
//   const minProductPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;
//   const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000;
  
//   useEffect(() => {
//     if (products.length > 0) {
//       setPriceRange([minProductPrice, maxProductPrice]);
//     }
//   }, [minProductPrice, maxProductPrice, products.length]);
  
//   // Filter and sort products
//   const filteredProducts = products
//     .filter(product => 
//       product.name.toLowerCase().includes(search.toLowerCase()) || 
//       product.description.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter(product => 
//       category === "all" || product.category === category
//     )
//     .filter(product =>
//       product.price >= priceRange[0] && product.price <= priceRange[1]
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "priceLow":
//           return a.price - b.price;
//         case "priceHigh":
//           return b.price - a.price;
//         case "name":
//           return a.name.localeCompare(b.name);
//         case "newest":
//         default:
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await refreshProducts();
//     setRefreshing(false);
//   };
  
//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">All Products</h1>
//         <Button 
//           variant="outline" 
//           onClick={handleRefresh}
//           disabled={refreshing}
//           className="flex items-center gap-2"
//         >
//           <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//           Refresh
//         </Button>
//       </div>
      
//       {/* Main Search */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>
        
//         <Button 
//           variant="outline" 
//           className="flex items-center gap-2"
//           onClick={() => setShowFilters(!showFilters)}
//         >
//           <Filter className="h-4 w-4" />
//           Filters
//         </Button>
        
//         <Select value={sortBy} onValueChange={setSortBy}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Sort By" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="newest">Newest First</SelectItem>
//             <SelectItem value="priceLow">
//               <div className="flex items-center gap-2">
//                 <ArrowUp className="h-3 w-3" /> Price: Low to High
//               </div>
//             </SelectItem>
//             <SelectItem value="priceHigh">
//               <div className="flex items-center gap-2">
//                 <ArrowDown className="h-3 w-3" /> Price: High to Low
//               </div>
//             </SelectItem>
//             <SelectItem value="name">Name: A to Z</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
      
//       {/* Advanced Filters */}
//       {showFilters && (
//         <div className="bg-muted/50 rounded-md p-4 mb-6">
//           <h2 className="font-medium mb-4 flex items-center gap-2">
//             <ListFilter className="h-4 w-4" /> Advanced Filters
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Category</label>
//               <Select value={category} onValueChange={setCategory}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map(cat => (
//                     <SelectItem key={cat} value={cat}>
//                       {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-2">Price Range</label>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm">{formatINR(priceRange[0])}</span>
//                 <div className="flex-1 px-2">
//                   <input
//                     type="range"
//                     min={minProductPrice}
//                     max={maxProductPrice}
//                     step={100}
//                     value={priceRange[1]}
//                     onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                     className="w-full"
//                   />
//                 </div>
//                 <span className="text-sm">{formatINR(priceRange[1])}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Loading State */}
//       {loading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {Array.from({ length: 8 }).map((_, index) => (
//             <ProductCard key={index} loading={true} />
//           ))}
//         </div>
//       )}
      
//       {/* Products Grid */}
//       {!loading && (
//         <>
//           {filteredProducts.length === 0 ? (
//             <div className="text-center py-16">
//               <h2 className="text-2xl font-semibold mb-4">No products found</h2>
//               <p className="text-muted-foreground mb-6">
//                 Try adjusting your search or filter criteria
//               </p>
//               <Button onClick={() => { 
//                 setSearch(""); 
//                 setCategory("all"); 
//                 setPriceRange([minProductPrice, maxProductPrice]); 
//               }}>
//                 Clear Filters
//               </Button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map(product => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import { useProduct } from "@/contexts/ProductContext";
// import ProductCard from "@/components/ProductCard";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Search,
//   Filter,
//   ArrowDown,
//   ArrowUp,
//   ListFilter,
//   RefreshCw,
// } from "lucide-react";
// import { formatINR } from "@/utils/formatters";

// export default function ProductList() {
//   const { products, loading, refreshProducts } = useProduct();
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState<string>("newest");
//   const [category, setCategory] = useState<string>("all");
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))];

//   const minProductPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;
//   const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000;

//   useEffect(() => {
//     if (products.length > 0) {
//       setPriceRange([minProductPrice, maxProductPrice]);
//     }
//   }, [minProductPrice, maxProductPrice, products.length]);

//   const filteredProducts = products
//     .filter(product =>
//       product.name.toLowerCase().includes(search.toLowerCase()) ||
//       product.description.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter(product =>
//       category === "all" || product.category === category
//     )
//     .filter(product =>
//       product.price >= priceRange[0] && product.price <= priceRange[1]
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "priceLow": return a.price - b.price;
//         case "priceHigh": return b.price - a.price;
//         case "name": return a.name.localeCompare(b.name);
//         case "newest":
//         default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//     });

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await refreshProducts();
//     setRefreshing(false);
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold">All Products</h1>
//         <Button
//           variant="outline"
//           onClick={handleRefresh}
//           disabled={refreshing}
//           className="flex items-center gap-2"
//         >
//           <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//           Refresh
//         </Button>
//       </div>

//       {/* Search, Filters, Sort */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
//           <Button
//             variant="outline"
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2"
//           >
//             <Filter className="h-4 w-4" />
//             Filters
//           </Button>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="sm:w-[180px] w-full">
//               <SelectValue placeholder="Sort By" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="newest">Newest First</SelectItem>
//               <SelectItem value="priceLow">
//                 <div className="flex items-center gap-2">
//                   <ArrowUp className="h-3 w-3" /> Price: Low to High
//                 </div>
//               </SelectItem>
//               <SelectItem value="priceHigh">
//                 <div className="flex items-center gap-2">
//                   <ArrowDown className="h-3 w-3" /> Price: High to Low
//                 </div>
//               </SelectItem>
//               <SelectItem value="name">Name: A to Z</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Advanced Filters */}
//       {showFilters && (
//         <div className="bg-muted/50 rounded-md p-4 mb-6">
//           <h2 className="font-medium mb-4 flex items-center gap-2">
//             <ListFilter className="h-4 w-4" /> Advanced Filters
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Category</label>
//               <Select value={category} onValueChange={setCategory}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map(cat => (
//                     <SelectItem key={cat} value={cat}>
//                       {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Price Range</label>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm">{formatINR(priceRange[0])}</span>
//                 <input
//                   type="range"
//                   min={minProductPrice}
//                   max={maxProductPrice}
//                   step={100}
//                   value={priceRange[1]}
//                   onChange={(e) =>
//                     setPriceRange([priceRange[0], Number(e.target.value)])
//                   }
//                   className="w-full"
//                 />
//                 <span className="text-sm">{formatINR(priceRange[1])}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loading */}
//       {loading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <ProductCard key={i} loading />
//           ))}
//         </div>
//       )}

//       {/* Product Results */}
//       {!loading && (
//         <>
//           {filteredProducts.length === 0 ? (
//             <div className="text-center py-16">
//               <h2 className="text-xl font-semibold mb-4">No products found</h2>
//               <p className="text-muted-foreground mb-6">
//                 Try adjusting your search or filters.
//               </p>
//               <Button
//                 onClick={() => {
//                   setSearch("");
//                   setCategory("all");
//                   setPriceRange([minProductPrice, maxProductPrice]);
//                 }}
//               >
//                 Clear Filters
//               </Button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }







import { useEffect, useState } from "react";
import { useProduct } from "@/contexts/ProductContext";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowDown,
  ArrowUp,
  ListFilter,
  RefreshCw,
} from "lucide-react";
import { formatINR } from "@/utils/formatters";

export default function ProductList() {
  const { products, loading, refreshProducts } = useProduct();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))];
  const minProductPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;
  const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000;

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minProductPrice, maxProductPrice]);
    }
  }, [minProductPrice, maxProductPrice, products.length]);

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter(product =>
      category === "all" || product.category === category
    )
    .filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "priceLow": return a.price - b.price;
        case "priceHigh": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        case "newest":
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 py-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">All Products</h1>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search + Filters + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 w-full mb-6">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filter & Sort */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="priceLow">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3" /> Price: Low to High
                </div>
              </SelectItem>
              <SelectItem value="priceHigh">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-3 w-3" /> Price: High to Low
                </div>
              </SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-muted/50 rounded-md p-4 mb-6">
          <h2 className="font-medium mb-4 flex items-center gap-2 text-sm sm:text-base">
            <ListFilter className="h-4 w-4" /> Advanced Filters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatINR(priceRange[0])}</span>
                <input
                  type="range"
                  min={minProductPrice}
                  max={maxProductPrice}
                  step={100}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full"
                />
                <span className="text-sm">{formatINR(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCard key={i} loading />
          ))}
        </div>
      )}

      {/* Product Results */}
      {!loading && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold mb-4">No products found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters.
              </p>
              <Button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setPriceRange([minProductPrice, maxProductPrice]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
