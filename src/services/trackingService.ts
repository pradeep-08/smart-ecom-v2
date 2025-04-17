import { TrackingInfo, TrackingEvent } from "@/types";

// This is a mock service that would be replaced with real API calls
// to shipping providers like Delhivery or Shiprocket
export async function getOrderTrackingStatus(courierId: string): Promise<TrackingInfo> {
  // In a real app, this would call the courier API
  // For demo purposes, we'll simulate a delayed response with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random status for demo
      const statuses = ['in_transit', 'out_for_delivery', 'delivered'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      // Generate mock tracking history
      const history: TrackingEvent[] = [];
      
      // Always add package received event
      history.push({
        status: 'pickup_complete',
        location: 'Warehouse',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      });
      
      // Add in_transit event if not delivered
      if (randomStatus !== 'delivered') {
        history.push({
          status: 'in_transit',
          location: locations[Math.floor(Math.random() * locations.length)],
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        });
      }
      
      // Add the current status
      history.push({
        status: randomStatus,
        location: randomLocation,
        timestamp: new Date()
      });
      
      resolve({
        currentStatus: randomStatus,
        location: randomLocation,
        updatedAt: new Date(),
        history: history
      });
    }, 1000); // Simulate API delay
  });
}
