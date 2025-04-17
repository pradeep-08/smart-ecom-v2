import { PaymentInfo } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface OrderPaymentInfoProps {
  paymentInfo: PaymentInfo;
}

export default function OrderPaymentInfo({ paymentInfo }: OrderPaymentInfoProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Method:</span>
            <span>{paymentInfo.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className={
              paymentInfo.paymentStatus === 'completed' 
                ? 'text-green-600' 
                : 'text-amber-500'
            }>
              {paymentInfo.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
