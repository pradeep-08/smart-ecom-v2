import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  User, 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  IndianRupee,
  Package,
  RefreshCw,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { User as UserType } from "@/types";
import { formatINR } from "@/utils/formatters";
import { useOrder } from "@/contexts/OrderContext";
import { usersApi } from "@/backend/api/usersApi";
import { toast } from "sonner";

export default function AdminUsers() {
  const { getMockUsers } = useAuth();
  const { getAllOrders, loading: ordersLoading } = useOrder();
  
  const allUsers = getMockUsers();
  const allOrders = getAllOrders();
  
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "admin"
  });
  
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

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user"
    });
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await usersApi.create({
        name: formData.name,
        email: formData.email,
        role: formData.role
      });
      toast.success("User created successfully!");
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const handleEditUser = async () => {
    if (!currentUser || !formData.name || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await usersApi.update(currentUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role
      });
      toast.success("User updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const openEditDialog = (user: UserType) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await usersApi.delete(userId);
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };
  
  if (ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <Skeleton className="h-10 w-full" />
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
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
                onEdit={openEditDialog}
                onDelete={handleDeleteUser}
              />
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your search
          </div>
        )}
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "user" | "admin") => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "user" | "admin") => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface UserCardProps {
  user: UserType;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: Date | null;
  onEdit: (user: UserType) => void;
  onDelete: (userId: string) => void;
}

function UserCard({ user, totalOrders, totalValue, lastOrderDate, onEdit, onDelete }: UserCardProps) {
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
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(user.id)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
