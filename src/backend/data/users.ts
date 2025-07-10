import { User } from "@/types";

export const USERS_DATA: User[] = [
  {
    id: "user-1",
    name: "Demo User",
    email: "demo@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  },
  {
    id: "user-2", 
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  },
  {
    id: "user-3",
    name: "Bob Johnson", 
    email: "bob.johnson@example.com",
    role: "user",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
  },
  {
    id: "user-4",
    name: "Alice Brown",
    email: "alice.brown@example.com", 
    role: "user",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin", 
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
  }
];
