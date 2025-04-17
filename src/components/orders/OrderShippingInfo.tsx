import { ShippingDetails } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift } from "lucide-react";

interface OrderShippingInfoProps {
  shippingDetails: ShippingDetails;
}

export default function OrderShippingInfo({ shippingDetails }: OrderShippingInfoProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <address className="not-italic space-y-1 text-muted-foreground">
          <p className="font-medium text-foreground">{shippingDetails.name}</p>
          <p>{shippingDetails.address}</p>
          <p>
            {shippingDetails.city}, {shippingDetails.state}{" "}
            {shippingDetails.zipCode}
          </p>
          <p>Phone: {shippingDetails.phone}</p>
        </address>
      </CardContent>
    </Card>
  );
}
