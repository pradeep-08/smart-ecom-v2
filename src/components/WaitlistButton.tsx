import { Button } from "@/components/ui/button";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, BellOff } from "lucide-react";

interface WaitlistButtonProps {
  productId: string;
  productName: string;
  isOutOfStock: boolean;
}

export default function WaitlistButton({ productId, productName, isOutOfStock }: WaitlistButtonProps) {
  const { addToWaitlist, removeFromWaitlist, isUserOnWaitlist } = useWaitlist();
  const { user } = useAuth();
  const isOnWaitlist = isUserOnWaitlist(productId);

  if (!isOutOfStock) return null;

  const handleToggleWaitlist = () => {
    if (isOnWaitlist) {
      removeFromWaitlist(productId);
    } else {
      addToWaitlist(productId, productName);
    }
  };

  return (
    <Button
      onClick={handleToggleWaitlist}
      variant={isOnWaitlist ? "secondary" : "outline"}
      className="w-full"
      disabled={!user}
    >
      {isOnWaitlist ? (
        <>
          <BellOff className="mr-2 h-4 w-4" />
          Remove from Waitlist
        </>
      ) : (
        <>
          <Bell className="mr-2 h-4 w-4" />
          Join Waitlist
        </>
      )}
    </Button>
  );
}
