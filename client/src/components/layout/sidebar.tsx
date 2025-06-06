import { AvatarPlaceholder } from "../ui/avatar-placeholder";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

export const Sidebar = () => {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/deals", label: "Deals", icon: "ri-list-check-2" },
    { path: "/leads", label: "Leads", icon: "ri-contacts-line", badge: "New" },
    { path: "/documents", label: "Documents", icon: "ri-file-list-3-line" },
    { path: "/settings", label: "Settings", icon: "ri-settings-3-line" },
  ];
  
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-neutral-800 text-white">
        <div className="flex items-center justify-center h-16 px-4 border-b border-neutral-700">
          <h1 className="text-lg font-semibold">Horizon CRM</h1>
        </div>
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
              >
                <a 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location === item.path 
                      ? "bg-primary text-white" 
                      : "text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                >
                  <i className={`${item.icon} text-xl mr-3`}></i>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-2 bg-blue-600 hover:bg-blue-700 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="px-2 mt-6">
            <h3 className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Analytics
            </h3>
            <div className="mt-2 space-y-1">
              <Link href="/analytics/performance">
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-300 hover:bg-neutral-700 hover:text-white">
                  <i className="ri-line-chart-line text-xl mr-3"></i>
                  Performance
                </a>
              </Link>
              <Link href="/analytics/reports">
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-300 hover:bg-neutral-700 hover:text-white">
                  <i className="ri-file-chart-line text-xl mr-3"></i>
                  Reports
                </a>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-neutral-700 p-4">
          <Link href="/profile">
            <a className="flex items-center w-full group">
              <AvatarPlaceholder name="John Doe" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-neutral-400 group-hover:text-neutral-300">View profile</p>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
