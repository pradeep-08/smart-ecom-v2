import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Review } from "@/types";
import { MessageSquare, Star } from "lucide-react";

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, "id" | "createdAt" | "adminReply">) => void;
}

export default function ProductReviews({ productId, reviews, onAddReview }: ProductReviewsProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitReview = () => {
    if (!user) {
      toast.error("You must be logged in to leave a review");
      return;
    }
    
    if (!reviewText.trim()) {
      toast.error("Please enter a review message");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onAddReview({
        productId,
        userId: user.id,
        userName: user.name,
        rating,
        comment: reviewText,
      });
      
      setReviewText("");
      setRating(5);
      setIsSubmitting(false);
      toast.success("Review submitted successfully");
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <MessageSquare className="h-5 w-5 mr-2" />
        Customer Reviews
      </h2>
      
      {/* Review form for logged in users */}
      {user && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3">Write a Review</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Rating</label>
                <Rating value={rating} onChange={setRating} />
              </div>
              
              <div>
                <label htmlFor="review-text" className="block text-sm mb-1">Your Review</label>
                <Textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="resize-none"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSubmitReview} 
                disabled={isSubmitting || !reviewText.trim()}
              >
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium">{review.userName}</p>
            <div className="flex items-center mt-1">
              <Rating value={review.rating} readOnly />
              <span className="text-xs text-muted-foreground ml-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <p className="mt-3 text-muted-foreground">{review.comment}</p>
        
        {review.adminReply && (
          <div className="mt-4 pl-4 border-l-2 border-primary/20">
            <p className="text-sm font-semibold">Admin Response</p>
            <p className="mt-1 text-sm text-muted-foreground">{review.adminReply}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
