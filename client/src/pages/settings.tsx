import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  
  // General settings
  const [companyName, setCompanyName] = useState("ABC Wholesaling LLC");
  const [companyEmail, setCompanyEmail] = useState("contact@abcwholesaling.com");
  const [companyPhone, setCompanyPhone] = useState("(555) 123-4567");
  const [companyAddress, setCompanyAddress] = useState("123 Business St, Suite 100, Anytown, CA 12345");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [dealAlerts, setDealAlerts] = useState(true);
  const [leadAlerts, setLeadAlerts] = useState(true);
  const [documentAlerts, setDocumentAlerts] = useState(false);
  
  // Team member settings (sample data)
  const sampleTeamMembers = [
    { id: "1", name: "John Doe", email: "john@abcwholesaling.com", role: "Admin", active: true },
    { id: "2", name: "Mary Johnson", email: "mary@abcwholesaling.com", role: "Agent", active: true },
    { id: "3", name: "Robert Williams", email: "robert@abcwholesaling.com", role: "Agent", active: false },
  ];
  
  const [teamMembers, setTeamMembers] = useState(sampleTeamMembers);
  
  // Handle form submissions
  const handleGeneralSettingsSave = () => {
    toast({
      title: "Settings saved",
      description: "Your company settings have been updated successfully."
    });
  };
  
  const handleNotificationSettingsSave = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated successfully."
    });
  };
  
  const handleTeamMemberStatusChange = (id: string, active: boolean) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, active } : member
    ));
    
    toast({
      title: `Team member ${active ? 'activated' : 'deactivated'}`,
      description: `The team member has been ${active ? 'activated' : 'deactivated'} successfully.`
    });
  };
  
  return (
    <Layout onSearch={() => {}}>
      <div className="bg-white border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Manage your company details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input 
                      id="companyEmail" 
                      type="email"
                      value={companyEmail} 
                      onChange={(e) => setCompanyEmail(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input 
                      id="companyPhone" 
                      value={companyPhone} 
                      onChange={(e) => setCompanyPhone(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="America/Los_Angeles">
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea 
                    id="companyAddress" 
                    value={companyAddress} 
                    onChange={(e) => setCompanyAddress(e.target.value)} 
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-neutral-500">
                        Use dark theme across the application
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Auto-refresh Dashboard</Label>
                      <p className="text-sm text-neutral-500">
                        Automatically refresh dashboard data every 5 minutes
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleGeneralSettingsSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-neutral-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-neutral-500">
                        Receive notifications via text messages
                      </p>
                    </div>
                    <Switch 
                      checked={smsNotifications} 
                      onCheckedChange={setSmsNotifications} 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Deal Updates</Label>
                      <p className="text-sm text-neutral-500">
                        Notifications for status changes and updates on deals
                      </p>
                    </div>
                    <Switch 
                      checked={dealAlerts} 
                      onCheckedChange={setDealAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Lead Updates</Label>
                      <p className="text-sm text-neutral-500">
                        Notifications for new and updated leads
                      </p>
                    </div>
                    <Switch 
                      checked={leadAlerts} 
                      onCheckedChange={setLeadAlerts} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Document Updates</Label>
                      <p className="text-sm text-neutral-500">
                        Notifications when documents are uploaded or modified
                      </p>
                    </div>
                    <Switch 
                      checked={documentAlerts} 
                      onCheckedChange={setDocumentAlerts} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset to Default</Button>
                <Button onClick={handleNotificationSettingsSave}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Team Members */}
          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage user access and permissions
                  </CardDescription>
                </div>
                <Button>
                  <i className="ri-user-add-line mr-2"></i>
                  Add Team Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <AvatarPlaceholder name={member.name} />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-neutral-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{member.role}</p>
                          <p className={`text-xs ${member.active ? 'text-green-600' : 'text-red-600'}`}>
                            {member.active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <Switch 
                          checked={member.active} 
                          onCheckedChange={(checked) => handleTeamMemberStatusChange(member.id, checked)} 
                        />
                        <Button variant="ghost" size="icon">
                          <i className="ri-pencil-line"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Integrations */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect your CRM with external services and APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Email Integration Card */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-md text-blue-600 text-2xl">
                        <i className="ri-mail-line"></i>
                      </div>
                      <div>
                        <p className="font-medium">Email Service</p>
                        <p className="text-sm text-neutral-500">Connect to send automated emails</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                  
                  {/* SMS Integration Card */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-md text-green-600 text-2xl">
                        <i className="ri-message-2-line"></i>
                      </div>
                      <div>
                        <p className="font-medium">SMS Integration</p>
                        <p className="text-sm text-neutral-500">Connect to send text messages</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                  
                  {/* Calendar Integration Card */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-2 rounded-md text-purple-600 text-2xl">
                        <i className="ri-calendar-line"></i>
                      </div>
                      <div>
                        <p className="font-medium">Calendar Integration</p>
                        <p className="text-sm text-neutral-500">Sync with Google Calendar</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                  
                  {/* Document Storage Integration Card */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-amber-100 p-2 rounded-md text-amber-600 text-2xl">
                        <i className="ri-cloud-line"></i>
                      </div>
                      <div>
                        <p className="font-medium">Document Storage</p>
                        <p className="text-sm text-neutral-500">Connect to cloud storage provider</p>
                      </div>
                    </div>
                    <Button>Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Billing */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan */}
                <div className="bg-neutral-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Professional Plan</h3>
                      <p className="text-sm text-neutral-500">Your subscription renews on April 15, 2025</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">Monthly Price</p>
                      <p className="text-lg font-medium">$49.99</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Team Members</p>
                      <p className="text-lg font-medium">5 users</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Storage</p>
                      <p className="text-lg font-medium">50 GB</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Payment Methods</h3>
                    <Button variant="outline" size="sm">
                      <i className="ri-add-line mr-2"></i>
                      Add Method
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          <i className="ri-visa-line"></i>
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-neutral-500">Expires 12/2025</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Remove</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Billing History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing History</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">March 15, 2025</p>
                        <p className="text-sm text-neutral-500">Professional Plan - Monthly</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium">$49.99</p>
                        <Button variant="ghost" size="sm">
                          <i className="ri-download-line mr-2"></i>
                          Invoice
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">February 15, 2025</p>
                        <p className="text-sm text-neutral-500">Professional Plan - Monthly</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium">$49.99</p>
                        <Button variant="ghost" size="sm">
                          <i className="ri-download-line mr-2"></i>
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}