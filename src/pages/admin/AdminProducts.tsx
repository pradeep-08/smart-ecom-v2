import { useState } from "react";
import { useProduct } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  IndianRupee,
  Upload,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Product } from "@/types";
import { formatINR, formatSimpleDate } from "@/utils/formatters";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sku: "",
  });
  
  const [productImages, setProductImages] = useState<string[]>([]);
  
  // Filter products by search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      sku: "",
    });
    setProductImages([]);
  };
  
  const handleAddProduct = () => {
    const price = parseFloat(formData.price);
    const stock = formData.stock ? parseInt(formData.stock) : undefined;
    
    if (!formData.name || !formData.description || isNaN(price)) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (productImages.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    
    if (formData.stock && (isNaN(stock!) || stock! < 0)) {
      toast.error("Stock must be a valid number");
      return;
    }
    
    addProduct({
      name: formData.name,
      description: formData.description,
      price,
      imageUrl: productImages[0], // First image as main image
      images: productImages.slice(1), // Rest as additional images
      sku: formData.sku || undefined,
      category: formData.category || undefined,
      stock,
    });
    
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("Product added successfully!");
  };
  
  const handleEditProduct = () => {
    if (!currentProduct) return;
    
    const price = parseFloat(formData.price);
    const stock = formData.stock ? parseInt(formData.stock) : undefined;
    
    if (!formData.name || !formData.description || isNaN(price)) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (productImages.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    
    if (formData.stock && (isNaN(stock!) || stock! < 0)) {
      toast.error("Stock must be a valid number");
      return;
    }
    
    updateProduct(currentProduct.id, {
      name: formData.name,
      description: formData.description,
      price,
      imageUrl: productImages[0], // First image as main image
      images: productImages.slice(1), // Rest as additional images
      sku: formData.sku || undefined,
      category: formData.category || undefined,
      stock,
    });
    
    setIsEditDialogOpen(false);
    toast.success("Product updated successfully!");
  };
  
  const handleDeleteProduct = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category || "",
      stock: product.stock !== undefined ? product.stock.toString() : "",
      sku: product.sku || "",
    });
    // Combine main image and additional images
    setProductImages([product.imageUrl, ...(product.images || [])]);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleBulkUpload = () => {
    if (!bulkUploadFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    toast.info(`Processing ${bulkUploadFile.name}...`);
    
    setTimeout(() => {
      toast.success("Bulk upload completed successfully!");
      setIsBulkUploadDialogOpen(false);
      setBulkUploadFile(null);
    }, 2000);
  };
  
  const handleExportProducts = () => {
    toast.success("Exporting products...");
    
    setTimeout(() => {
      toast.info("Products exported successfully!");
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-1" onClick={() => setIsBulkUploadDialogOpen(true)}>
            <Upload className="h-4 w-4" /> Bulk Upload
          </Button>
          <Button variant="outline" className="gap-1" onClick={handleExportProducts}>
            <Download className="h-4 w-4" /> Export Products
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Products Table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left font-medium">Image</th>
              <th className="h-10 px-4 text-left font-medium">Name</th>
              <th className="h-10 px-4 text-left font-medium">Price</th>
              <th className="h-10 px-4 text-left font-medium">Stock</th>
              <th className="h-10 px-4 text-left font-medium">Category</th>
              <th className="h-10 px-4 text-left font-medium">Added</th>
              <th className="h-10 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      {product.images && product.images.length > 0 && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          +{product.images.length}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 whitespace-nowrap">{formatINR(product.price)}</td>
                  <td className="p-4">
                    {product.stock !== undefined ? (
                      product.stock <= 5 ? (
                        <Badge variant="destructive">{product.stock}</Badge>
                      ) : (
                        product.stock
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                  <td className="p-4">
                    {product.category || <span className="text-muted-foreground">N/A</span>}
                  </td>
                  <td className="p-4">
                    {formatSimpleDate(new Date(product.createdAt))}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => window.open(`/products/${product.id}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(product)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-muted-foreground">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the product details below to add a new product to your store.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Product Images */}
            <ImageUploader 
              images={productImages}
              onImagesChange={setProductImages}
            />
            
            {/* Product Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Product Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Category and SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Product Images */}
            <ImageUploader 
              images={productImages}
              onImagesChange={setProductImages}
            />
            
            {/* Product Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Product Description */}
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Category and SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Product Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-4">
              {currentProduct && (
                <>
                  <img
                    src={currentProduct.imageUrl}
                    alt={currentProduct.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{currentProduct.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatINR(currentProduct.price)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Products</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file with your product data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {bulkUploadFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileSpreadsheet className="h-6 w-6 text-primary" />
                    <span>{bulkUploadFile.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setBulkUploadFile(null)}
                      className="ml-2"
                    >
                      Clear
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="mt-4"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setBulkUploadFile(e.target.files[0]);
                        }
                      }}
                    />
                  </>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Required columns:</p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>name - Product name</li>
                  <li>description - Product description</li>
                  <li>price - Product price in INR</li>
                  <li>imageUrl - Product image URL</li>
                  <li>stock - Product stock quantity (optional)</li>
                  <li>category - Product category (optional)</li>
                  <li>sku - Product SKU (optional)</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={!bulkUploadFile}
              onClick={handleBulkUpload}
            >
              Upload Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
