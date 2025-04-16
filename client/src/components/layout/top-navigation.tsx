import { useState } from "react";
import { Link } from "wouter";
import { SearchBar } from "./search-bar";
import { AvatarPlaceholder } from "../ui/avatar-placeholder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeSince } from "@/lib/utils/deal-utils";

type TopNavigationProps = {
  onSearch: (value: string) => void;
  onMobileMenuClick: () => void;
};

export const TopNavigation = ({ onSearch, onMobileMenuClick }: TopNavigationProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Sample notifications data
  const notifications = [
    {
      id: "1",
      title: "Deal Status Update",
      message: "123 Main St. deal moved to 'Under Contract'",
      time: "2025-04-15T12:30:00.000Z",
      read: false
    },
    {
      id: "2",
      title: "New Document Uploaded",
      message: "Purchase agreement uploaded for 456 Oak Ave",
      time: "2025-04-14T10:15:00.000Z",
      read: false
    },
    {
      id: "3",
      title: "Lead Assignment",
      message: "New lead assigned to you by Admin",
      time: "2025-04-12T15:45:00.000Z",
      read: true
    },
    {
      id: "4",
      title: "Deal Closing Reminder",
      message: "789 Pine St. deal closing in 3 days",
      time: "2025-04-10T09:20:00.000Z",
      read: true
    }
  ];
  
  // Sample help items
  const helpItems = [
    { id: "1", title: "Getting Started Guide", icon: "ri-book-open-line" },
    { id: "2", title: "Video Tutorials", icon: "ri-video-line" },
    { id: "3", title: "Knowledge Base", icon: "ri-article-line" },
    { id: "4", title: "Contact Support", icon: "ri-customer-service-2-line" }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 bg-white">
      {/* Mobile menu button */}
      <button 
        type="button" 
        className="md:hidden text-neutral-500 hover:text-neutral-900 focus:outline-none"
        onClick={onMobileMenuClick}
      >
        <i className="ri-menu-line text-xl"></i>
      </button>
      
      {/* Search */}
      <div className="flex-1 max-w-3xl mx-auto">
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Actions */}
      <div className="ml-4 flex items-center md:ml-6 space-x-3">
        {/* Notifications */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <button className="text-neutral-500 hover:text-neutral-900 relative">
              <i className="ri-notification-3-line text-xl"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs h-6">
                  Mark all as read
                </Button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-neutral-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b last:border-b-0 hover:bg-neutral-50 ${
                      notification.read ? '' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 self-stretch rounded-full ${
                        notification.read ? 'bg-transparent' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-neutral-500">
                            {getTimeSince(notification.time)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" className="w-full text-sm">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Help */}
        <Popover open={helpOpen} onOpenChange={setHelpOpen}>
          <PopoverTrigger asChild>
            <button className="text-neutral-500 hover:text-neutral-900">
              <i className="ri-question-line text-xl"></i>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="end">
            <div className="p-3 border-b">
              <h3 className="font-semibold">Help & Resources</h3>
            </div>
            <div className="p-2">
              {helpItems.map((item) => (
                <Button 
                  key={item.id}
                  variant="ghost" 
                  className="w-full justify-start text-sm h-9 px-2 mb-1"
                >
                  <i className={`${item.icon} mr-2 text-neutral-600`}></i>
                  {item.title}
                </Button>
              ))}
            </div>
            <div className="p-3 border-t bg-neutral-50">
              <p className="text-xs text-neutral-500">
                Need direct assistance? Email us at <span className="font-medium">support@example.com</span>
              </p>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile dropdown (mobile) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="md:hidden rounded-full bg-neutral-200 p-1 text-neutral-500">
              <AvatarPlaceholder name="John Doe" size="sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>
                <i className="ri-user-line mr-2"></i>
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem>
                <i className="ri-settings-3-line mr-2"></i>
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <i className="ri-logout-box-line mr-2"></i>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
