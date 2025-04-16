import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const { toast } = useToast();
  
  // Sample user data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@abcwholesaling.com",
    phone: "(555) 123-4567",
    role: "Admin",
    bio: "Real estate investor with 5+ years of experience in wholesaling. Specializing in distressed properties and vacant land deals.",
    timeZone: "America/Los_Angeles",
    communication: {
      email: true,
      phone: false,
    },
    activity: [
      { id: 1, action: "Updated profile", date: "2025-04-15T12:30:00.000Z" },
      { id: 2, action: "Changed password", date: "2025-04-10T08:15:00.000Z" },
      { id: 3, action: "Added new lead", date: "2025-04-08T14:20:00.000Z" },
      { id: 4, action: "Closed deal #1234", date: "2025-04-05T16:45:00.000Z" },
      { id: 5, action: "Updated deal status", date: "2025-04-02T09:30:00.000Z" },
    ]
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Handle profile update
  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };
  
  // Handle password change
  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    // Reset password fields
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully."
    });
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Layout onSearch={() => {}}>
      <div className="bg-white border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-4">
                    <AvatarPlaceholder name={user.name} size="lg" className="w-24 h-24" />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full bg-neutral-100 shadow"
                    >
                      <i className="ri-camera-line"></i>
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-neutral-500">{user.role}</p>
                  
                  <div className="w-full mt-6 space-y-2">
                    <div className="flex items-center p-2 rounded-md hover:bg-neutral-100">
                      <i className="ri-user-line mr-3 text-neutral-500"></i>
                      <span>Edit Profile</span>
                    </div>
                    <div className="flex items-center p-2 rounded-md hover:bg-neutral-100">
                      <i className="ri-lock-line mr-3 text-neutral-500"></i>
                      <span>Security</span>
                    </div>
                    <div className="flex items-center p-2 rounded-md hover:bg-neutral-100">
                      <i className="ri-notification-line mr-3 text-neutral-500"></i>
                      <span>Notifications</span>
                    </div>
                    <div className="flex items-center p-2 rounded-md hover:bg-neutral-100">
                      <i className="ri-logout-box-line mr-3 text-neutral-500"></i>
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.activity.map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className="mr-3 mt-0.5 bg-neutral-100 p-1 rounded-full text-neutral-500">
                        <i className="ri-history-line"></i>
                      </div>
                      <div>
                        <p className="text-sm">{item.action}</p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Profile Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              {/* Profile Information Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          value={user.name} 
                          onChange={(e) => setUser({...user, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={user.email} 
                          onChange={(e) => setUser({...user, email: e.target.value})} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={user.phone} 
                          onChange={(e) => setUser({...user, phone: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          defaultValue={user.role}
                          onValueChange={(value) => setUser({...user, role: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Agent">Agent</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={user.bio} 
                        onChange={(e) => setUser({...user, bio: e.target.value})} 
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleProfileUpdate}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password"
                        value={passwordData.currentPassword} 
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password"
                        value={passwordData.newPassword} 
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        value={passwordData.confirmPassword} 
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handlePasswordChange}>Update Password</Button>
                  </CardFooter>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="mt-1 text-3xl text-neutral-500">
                        <i className="ri-shield-keyhole-line"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          Add an extra layer of security to your account by requiring both your
                          password and a verification code from your mobile device.
                        </p>
                        <Button className="mt-4">Enable 2FA</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                    <CardDescription>
                      Configure your personal preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Select 
                        defaultValue={user.timeZone}
                        onValueChange={(value) => setUser({...user, timeZone: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Communication Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Email Updates</Label>
                            <p className="text-sm text-neutral-500">
                              Receive updates and notifications via email
                            </p>
                          </div>
                          <div className="flex h-6 items-center">
                            <input
                              id="email-updates"
                              type="checkbox"
                              className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                              checked={user.communication.email}
                              onChange={(e) => {
                                setUser({
                                  ...user,
                                  communication: {
                                    ...user.communication,
                                    email: e.target.checked
                                  }
                                });
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Phone Updates</Label>
                            <p className="text-sm text-neutral-500">
                              Receive updates and notifications via SMS
                            </p>
                          </div>
                          <div className="flex h-6 items-center">
                            <input
                              id="phone-updates"
                              type="checkbox"
                              className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                              checked={user.communication.phone}
                              onChange={(e) => {
                                setUser({
                                  ...user,
                                  communication: {
                                    ...user.communication,
                                    phone: e.target.checked
                                  }
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Reset to Default</Button>
                    <Button onClick={handleProfileUpdate}>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}