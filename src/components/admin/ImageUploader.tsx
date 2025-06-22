import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Plus, Image } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const processFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          reject(new Error("Please select only image files"));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    };
    
    const processFiles = async () => {
      try {
        const fileArray = Array.from(files);
        const availableSlots = maxImages - images.length;
        
        if (fileArray.length > availableSlots) {
          toast.error(`Can only add ${availableSlots} more image(s). Maximum ${maxImages} images allowed.`);
          return;
        }
        
        const newImages: string[] = [];
        for (const file of fileArray) {
          try {
            const dataUrl = await processFile(file);
            newImages.push(dataUrl);
          } catch (error) {
            console.error("Error processing file:", error);
            toast.error(`Failed to process ${file.name}`);
          }
        }
        
        if (newImages.length > 0) {
          onImagesChange([...images, ...newImages]);
          toast.success(`Added ${newImages.length} image(s) successfully`);
        }
      } catch (error) {
        console.error("Error processing files:", error);
        toast.error("Failed to process files");
      }
    };
    
    processFiles();
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUrlAdd = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    // Basic URL validation
    try {
      new URL(urlInput);
      onImagesChange([...images, urlInput.trim()]);
      setUrlInput("");
      toast.success("Image URL added successfully");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success("Image removed");
  };
  
  return (
    <div className="space-y-4">
      <Label>Product Images (Max {maxImages})</Label>
      
      {/* Display current images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
                onError={(e) => {
                  console.error("Image failed to load:", image);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-1 -right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 bg-primary text-primary-foreground text-xs px-1 rounded-tr">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Upload controls */}
      {images.length < maxImages && (
        <div className="space-y-3">
          {/* File Upload */}
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </div>
          
          {/* URL Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Or paste image URL here..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlAdd}
              disabled={!urlInput.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {images.length === 0 && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Upload images or add URLs to get started
          </p>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        The first image will be used as the main product image. You can upload up to {maxImages} images.
      </p>
    </div>
  );
}
