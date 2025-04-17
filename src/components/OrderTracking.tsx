import { useState, useEffect } from "react";
import { TrackingInfo, TrackingEvent } from "@/types";
import { getOrderTrackingStatus } from "@/services/trackingService";
import { formatDate } from "@/utils/formatters";
import { formatTrackingStatus } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Truck, Package, MapPin, Clock } from "lucide-react";

interface OrderTrackingProps {
  courierId: string;
  initialStatus?: TrackingInfo;
}

export default function OrderTracking({ courierId, initialStatus }: OrderTrackingProps) {
  const [trackingStatus, setTrackingStatus] = useState<TrackingInfo | null>(initialStatus || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialStatus);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialStatus) {
      fetchTrackingStatus();
    }
  }, [initialStatus, courierId]);

  const fetchTrackingStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await getOrderTrackingStatus(courierId);
      setTrackingStatus(status);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch tracking status:", err);
      setError("Could not retrieve tracking information. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTrackingStatus();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">Fetching tracking information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div className="text-red-600 font-medium">{error}</div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!trackingStatus) {
    return (
      <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="text-orange-600 font-medium">No tracking information available for this shipment yet.</div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Check Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Truck className="h-5 w-5 mr-2 text-primary" />
          Shipment Tracking
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRefresh}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-md border mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-lg">
              {formatTrackingStatus(trackingStatus.currentStatus)}
            </h4>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 inline" />
              {trackingStatus.location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {formatDate(new Date(trackingStatus.updatedAt))}
            </div>
            <div className="text-xs mt-1">Tracking ID: {courierId}</div>
          </div>
        </div>
      </div>
      
      {trackingStatus.history && trackingStatus.history.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tracking History</h4>
          {trackingStatus.history.map((event, index) => (
            <div key={index} className="relative pl-6 pb-4">
              {index !== trackingStatus.history!.length - 1 && (
                <div className="absolute top-2 bottom-0 left-[9px] w-0.5 bg-gray-200" />
              )}
              
              <div className="absolute top-1 left-0 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <Package className="h-2.5 w-2.5 text-primary" />
              </div>
              
              <div className="bg-white p-3 rounded-md border">
                <div className="font-medium">{formatTrackingStatus(event.status)}</div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">{event.location}</span>
                  <span className="text-muted-foreground">{formatDate(new Date(event.timestamp))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
