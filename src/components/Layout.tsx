import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-8 h-full">
          {children}
        </div>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Market Cloud eCommerce. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
