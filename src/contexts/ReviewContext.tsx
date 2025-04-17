import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Review } from "@/types";
import { toast } from "sonner";

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "createdAt" | "adminReply">) => void;
  getProductReviews: (productId: string) => Review[];
  addAdminReply: (reviewId: string, reply: string) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

// Mock reviews for demo
const MOCK_REVIEWS: Review[] = [
  {
    id: "review-1",
    productId: "product-1",
    userId: "user-1",
    userName: "Demo User",
    rating: 4,
    comment: "This product exceeded my expectations. Very high quality and durable.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: "review-2",
    productId: "product-1",
    userId: "user-2",
    userName: "Jane Smith",
    rating: 5,
    comment: "Absolutely love it! Would definitely recommend to friends and family.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    adminReply: "Thank you for your wonderful review! We're glad you enjoyed our product."
  },
  {
    id: "review-3",
    productId: "product-2",
    userId: "user-1",
    userName: "Demo User",
    rating: 3,
    comment: "Good product but took longer than expected to arrive.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  }
];

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem("reviews");
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error("Failed to parse reviews from localStorage", error);
      }
    }
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (reviewData: Omit<Review, "id" | "createdAt" | "adminReply">) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date(),
    };

    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(review => review.productId === productId);
  };

  const addAdminReply = (reviewId: string, reply: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, adminReply: reply }
          : review
      )
    );
    toast.success("Reply added successfully");
  };

  return (
    <ReviewContext.Provider value={{
      reviews,
      addReview,
      getProductReviews,
      addAdminReply
    }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
}
