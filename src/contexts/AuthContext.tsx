import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<"admin" | "user">;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  getMockUsers: () => User[]; // New method to get mock users for admin panel
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: "admin-1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-1",
    email: "user@example.com",
    name: "Demo User",
    role: "user",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-2",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "user",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-3",
    email: "john@example.com",
    name: "John Doe",
    role: "user",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulating API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      setLoading(false);
      toast.error("Invalid email or password");
      throw new Error("Invalid email or password");
    }
    
    // In a real app, we would validate the password here
    // For demo, we'll just assume password is "password"
    if (password !== "password") {
      setLoading(false);
      toast.error("Invalid email or password");
      throw new Error("Invalid email or password");
    }
    
    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));
    toast.success(`Welcome back, ${foundUser.name}`);
    setLoading(false);
    
    // Return user role to help with navigation decisions
    return foundUser.role;
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    // Simulating API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      setLoading(false);
      toast.error("User with this email already exists");
      throw new Error("User already exists");
    }
    
    // Create new user (in a real app, this would be done on the backend)
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "user",
      createdAt: new Date(),
    };
    
    // For demo, we'll add to our mock users
    MOCK_USERS.push(newUser);
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success("Account created successfully");
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You've been logged out");
    
    // We'll now handle navigation in the components that use this context
    // Instead of directly navigating here
  };
  
  // Get mock users for admin panel
  const getMockUsers = () => {
    return MOCK_USERS;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      getMockUsers 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
