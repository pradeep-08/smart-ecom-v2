import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  User, 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  IndianRupee,
  Package
} from "lucide-react";
import { User as UserType } from "@/types";
import { formatINR } from "@/utils/formatters";
import { useOrder } from "@/contexts/OrderContext";

export default function AdminUsers() {
  // In a real app, this would come from a users context or API
  // For now, we'll use the mock users from AuthContext
  const { getMockUsers } = useAuth();
  const { getAllOrders } = useOrder();
  
  const allUsers = getMockUsers();
  const allOrders = getAllOrders();
  
  const [search, setSearch] = useState("");
  
  // Filter users by search term
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );
  
  // Calculate user stats
  const getUserStats = (userId: string) => {
    const userOrders = allOrders.filter(order => order.userId === userId);
    
    const totalOrders = userOrders.length;
    const totalValue = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastOrderDate = userOrders.length > 0 ? 
      new Date(Math.max(...userOrders.map(o => new Date(o.createdAt).getTime()))) : 
      null;
      
    return {
      totalOrders,
      totalValue,
      lastOrderDate
    };
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => {
            const stats = getUserStats(user.id);
            
            return (
              <UserCard 
                key={user.id} 
                user={user} 
                totalOrders={stats.totalOrders}
                totalValue={stats.totalValue}
                lastOrderDate={stats.lastOrderDate}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your search
          </div>
        )}
      </div>
    </div>
  );
}

interface UserCardProps {
  user: UserType;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: Date | null;
}

function UserCard({ user, totalOrders, totalValue, lastOrderDate }: UserCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Package className="h-3 w-3" /> Orders
          </div>
          <div className="font-medium">{totalOrders}</div>
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <IndianRupee className="h-3 w-3" /> Lifetime Value
          </div>
          <div className="font-medium">{formatINR(totalValue)}</div>
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Last Order
          </div>
          <div className="font-medium">
            {lastOrderDate ? new Date(lastOrderDate).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-2 md:mt-0">
        <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
          {user.role === "admin" ? (
            <div className="flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Admin
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              User
            </div>
          )}
        </Badge>
        
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>
    </div>
  );
}
