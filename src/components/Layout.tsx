import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
  fullScreen?: boolean;
}

export default function Layout({ children, fullScreen = false }: LayoutProps) {
  const { user } = useAuth();
  
  if (fullScreen) {
    return (
      <div className="min-h-screen w-full bg-background">
        {children}
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </div>
      </main>
      <footer className="bg-muted py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm max-w-7xl">
          &copy; {new Date().getFullYear()} Market Cloud eCommerce. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
