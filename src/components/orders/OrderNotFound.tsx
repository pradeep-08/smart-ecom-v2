import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
      <p className="mb-8 text-muted-foreground">
        The order you are looking for does not exist.
      </p>
      <Button onClick={() => navigate("/orders")}>
        View All Orders
      </Button>
    </div>
  );
}
