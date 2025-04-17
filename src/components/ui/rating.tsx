import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  count?: number;
  readOnly?: boolean;
  className?: string;
}

export function Rating({ 
  value, 
  onChange, 
  count = 5, 
  readOnly = false,
  className
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div 
      className={cn("flex items-center", className)}
      onMouseLeave={() => !readOnly && setHoverRating(0)}
    >
      {Array.from({ length: count }, (_, i) => i + 1).map((starValue) => {
        const isActive = hoverRating ? starValue <= hoverRating : starValue <= value;
        return (
          <Star
            key={starValue}
            className={cn(
              "h-5 w-5 cursor-default transition-all",
              isActive ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground",
              !readOnly && "cursor-pointer"
            )}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onClick={() => !readOnly && onChange?.(starValue)}
          />
        );
      })}
      
      {!readOnly && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value} of {count}
        </span>
      )}
    </div>
  );
}
