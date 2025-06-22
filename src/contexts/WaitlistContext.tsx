import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface WaitlistEntry {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userEmail: string;
  userName: string;
  createdAt: Date;
  notified: boolean;
}

interface WaitlistContextType {
  waitlistEntries: WaitlistEntry[];
  addToWaitlist: (productId: string, productName: string) => void;
  removeFromWaitlist: (productId: string) => void;
  getWaitlistForProduct: (productId: string) => WaitlistEntry[];
  isUserOnWaitlist: (productId: string) => boolean;
  markAsNotified: (entryId: string) => void;
  getAdminNotifications: () => WaitlistEntry[];
}

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const { user } = useAuth();

  // Load waitlist from localStorage on component mount
  useEffect(() => {
    const savedWaitlist = localStorage.getItem("waitlist");
    if (savedWaitlist) {
      try {
        const parsedEntries = JSON.parse(savedWaitlist);
        setWaitlistEntries(parsedEntries.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        })));
      } catch (error) {
        console.error("Failed to parse waitlist from localStorage", error);
      }
    }
  }, []);

  // Save waitlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("waitlist", JSON.stringify(waitlistEntries));
  }, [waitlistEntries]);

  const addToWaitlist = (productId: string, productName: string) => {
    if (!user) {
      toast.error("Please login to join the waitlist");
      return;
    }

    // Check if user is already on waitlist for this product
    const existingEntry = waitlistEntries.find(
      entry => entry.productId === productId && entry.userId === user.id
    );

    if (existingEntry) {
      toast.info("You're already on the waitlist for this product");
      return;
    }

    const newEntry: WaitlistEntry = {
      id: `waitlist-${Date.now()}`,
      productId,
      productName,
      userId: user.id,
      userEmail: user.email || "",
      userName: user.name || "",
      createdAt: new Date(),
      notified: false
    };

    setWaitlistEntries(prev => [...prev, newEntry]);
    toast.success("Added to waitlist! We'll notify you when it's back in stock.");
  };

  const removeFromWaitlist = (productId: string) => {
    if (!user) return;

    setWaitlistEntries(prev => 
      prev.filter(entry => !(entry.productId === productId && entry.userId === user.id))
    );
    toast.info("Removed from waitlist");
  };

  const getWaitlistForProduct = (productId: string) => {
    return waitlistEntries.filter(entry => entry.productId === productId);
  };

  const isUserOnWaitlist = (productId: string) => {
    if (!user) return false;
    return waitlistEntries.some(
      entry => entry.productId === productId && entry.userId === user.id
    );
  };

  const markAsNotified = (entryId: string) => {
    setWaitlistEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, notified: true } : entry
      )
    );
  };

  const getAdminNotifications = () => {
    return waitlistEntries.filter(entry => !entry.notified);
  };

  return (
    <WaitlistContext.Provider value={{
      waitlistEntries,
      addToWaitlist,
      removeFromWaitlist,
      getWaitlistForProduct,
      isUserOnWaitlist,
      markAsNotified,
      getAdminNotifications
    }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const context = useContext(WaitlistContext);
  if (context === undefined) {
    throw new Error("useWaitlist must be used within a WaitlistProvider");
  }
  return context;
}
