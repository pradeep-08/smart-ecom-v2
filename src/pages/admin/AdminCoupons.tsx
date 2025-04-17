import { useState } from "react";
import { useCoupon } from "@/contexts/CouponContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { format, addDays, addMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X, Plus, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Coupon } from "@/types";
import { formatINR } from "@/utils/formatters";
import { useForm } from "react-hook-form";

export default function AdminCoupons() {
  const { coupons, addCoupon, removeCoupon } = useCoupon();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [expiryDate, setExpiryDate] = useState<Date>(addMonths(new Date(), 1));
  const [isActive, setIsActive] = useState(true);
  
  const form = useForm({
    defaultValues: {
      code: "",
      discountValue: "",
      minimumAmount: ""
    }
  });
  
  // Filter coupons by search term
  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleAddCoupon = (data: any) => {
    const code = data.code.toUpperCase();
    const discountValue = parseFloat(data.discountValue);
    const minimumAmount = data.minimumAmount ? parseFloat(data.minimumAmount) : undefined;
    
    if (!code || isNaN(discountValue) || discountValue <= 0) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    // For percentage discount, ensure it's not more than 100%
    if (discountType === "percentage" && discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }
    
    // Add the coupon
    addCoupon({
      code,
      discountType,
      discountValue,
      discountPercentage: discountType === "percentage" ? discountValue : 0,
      minimumAmount,
      expiresAt: expiryDate,
      isActive,
    });
    
    // Reset form and close dialog
    form.reset();
    setIsAddDialogOpen(false);
  };
  
  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountPercentage}%`;
    } else {
      return formatINR(coupon.discountValue);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Add a new coupon code for your customers.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddCoupon)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="SUMMER20"
                          className="uppercase"
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a unique code for this coupon.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Type*</Label>
                    <Select
                      value={discountType}
                      onValueChange={(value: "percentage" | "flat") => setDiscountType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {discountType === "percentage" ? "Discount %" : "Discount Amount (₹)"}*
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            max={discountType === "percentage" ? 100 : undefined}
                            placeholder={discountType === "percentage" ? "20" : "100"}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="minimumAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Purchase Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          placeholder="1000"
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum order total required to use this coupon (optional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Label>Expiry Date*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={(date) => date && setExpiryDate(date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                      <div className="p-3 border-t flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setExpiryDate(addDays(new Date(), 7))}
                        >
                          7 Days
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setExpiryDate(addMonths(new Date(), 1))}
                        >
                          1 Month
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setExpiryDate(addMonths(new Date(), 3))}
                        >
                          3 Months
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive" className="text-sm font-normal">
                    Coupon is active
                  </Label>
                </div>
                
                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Coupon</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Coupons List */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left font-medium">Code</th>
              <th className="h-10 px-4 text-left font-medium">Discount</th>
              <th className="h-10 px-4 text-left font-medium">Min. Amount</th>
              <th className="h-10 px-4 text-left font-medium">Expiry Date</th>
              <th className="h-10 px-4 text-left font-medium">Status</th>
              <th className="h-10 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <tr key={coupon.code} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-mono font-bold">{coupon.code}</td>
                  <td className="p-4">{formatDiscount(coupon)}</td>
                  <td className="p-4">
                    {coupon.minimumAmount ? formatINR(coupon.minimumAmount) : <span className="text-muted-foreground italic">None</span>}
                  </td>
                  <td className="p-4">
                    {format(new Date(coupon.expiresAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-4">
                    <Badge variant={coupon.isActive ? "default" : "outline"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:bg-destructive/10"
                      onClick={() => removeCoupon(coupon.code)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
