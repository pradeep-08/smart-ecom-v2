import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/OrderContext";
import { Download, Loader2 } from "lucide-react";
import { downloadInvoice } from "@/services/invoiceService";
import { toast } from "sonner";

interface OrderInvoiceProps {
  orderId: string;
}

export default function OrderInvoice({ orderId }: OrderInvoiceProps) {
  const { generateOrderInvoice } = useOrder();
  const [loading, setLoading] = useState(false);
  
  const handleDownloadInvoice = async () => {
    setLoading(true);
    try {
      const invoiceDataUrl = await generateOrderInvoice(orderId);
      downloadInvoice(invoiceDataUrl, orderId);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Failed to download invoice", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleDownloadInvoice} 
      disabled={loading}
      variant="outline" 
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? "Generating..." : "Download Invoice"}
    </Button>
  );
}
