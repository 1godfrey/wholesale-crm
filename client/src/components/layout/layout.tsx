import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNavigation } from "./top-navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type LayoutProps = {
  children: React.ReactNode;
  onSearch?: (value: string) => void;
};

export const Layout = ({ children, onSearch = () => {} }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-neutral-800 text-white">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavigation 
          onSearch={onSearch} 
          onMobileMenuClick={() => setMobileMenuOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto bg-neutral-50">
          {children}
        </main>
      </div>
    </div>
  );
};
