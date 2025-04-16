import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";

// Sample lead data
const sampleLeads = [
  {
    id: "1",
    name: "John Smith",
    phone: "(555) 123-4567",
    email: "john.smith@example.com",
    status: "New",
    source: "Online Form",
    created_at: "2025-03-15T08:30:00.000Z",
    last_contact: "2025-03-15T08:30:00.000Z",
    address: "123 Main St, Anytown, CA",
    notes: "Interested in selling inherited property"
  },
  {
    id: "2",
    name: "Mary Johnson",
    phone: "(555) 987-6543",
    email: "mary.johnson@example.com",
    status: "Contacted",
    source: "Referral",
    created_at: "2025-03-12T14:45:00.000Z",
    last_contact: "2025-03-14T11:20:00.000Z",
    address: "456 Oak Ave, Sometown, CA",
    notes: "Follow up next week about property value"
  },
  {
    id: "3",
    name: "Robert Williams",
    phone: "(555) 456-7890",
    email: "robert.williams@example.com",
    status: "Qualified",
    source: "Direct Mail",
    created_at: "2025-03-10T09:15:00.000Z",
    last_contact: "2025-03-13T15:30:00.000Z",
    address: "789 Pine St, Othertown, CA",
    notes: "Motivated seller, needs to sell within 30 days"
  },
  {
    id: "4",
    name: "Jennifer Brown",
    phone: "(555) 234-5678",
    email: "jennifer.brown@example.com",
    status: "Nurturing",
    source: "Cold Call",
    created_at: "2025-03-08T16:20:00.000Z",
    last_contact: "2025-03-14T10:15:00.000Z",
    address: "321 Elm St, Newtown, CA",
    notes: "Not ready to sell yet, but open to offers"
  },
  {
    id: "5",
    name: "Michael Davis",
    phone: "(555) 876-5432",
    email: "michael.davis@example.com",
    status: "Dead",
    source: "Website",
    created_at: "2025-03-05T11:10:00.000Z",
    last_contact: "2025-03-11T09:45:00.000Z",
    address: "654 Maple Dr, Oldtown, CA",
    notes: "Decided not to sell at this time"
  },
];

// Lead status types and colors
const leadStatusColors: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800",
  "Contacted": "bg-purple-100 text-purple-800",
  "Qualified": "bg-green-100 text-green-800",
  "Nurturing": "bg-amber-100 text-amber-800",
  "Dead": "bg-red-100 text-red-800"
};

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  
  // Stats for the leads
  const totalLeads = sampleLeads.length;
  const newLeads = sampleLeads.filter(lead => lead.status === "New").length;
  const qualifiedLeads = sampleLeads.filter(lead => lead.status === "Qualified").length;
  const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
  
  // Filter leads based on search term and filters
  const filteredLeads = sampleLeads.filter(lead => {
    // Search term filter
    const matchesSearchTerm = !searchTerm ? true : 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" ? true : lead.status === statusFilter;
    
    // Source filter
    const matchesSource = sourceFilter === "all" ? true : lead.source === sourceFilter;
    
    return matchesSearchTerm && matchesStatus && matchesSource;
  });
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <Layout onSearch={handleSearch}>
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Leads</h1>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 lg:p-8 bg-white border-b border-neutral-200">
        <StatCard 
          title="Total Leads" 
          value={totalLeads} 
          change={{ value: 12.5, isPositive: true }}
          subtitle="from last month"
        />
        <StatCard 
          title="New Leads (MTD)" 
          value={newLeads} 
          change={{ value: 8.3, isPositive: true }}
          subtitle="from last month"
        />
        <StatCard 
          title="Qualified Leads" 
          value={qualifiedLeads} 
          change={{ value: 5.7, isPositive: true }}
          subtitle="from last month"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${conversionRate.toFixed(1)}%`} 
          change={{ value: 2.1, isPositive: false }}
          subtitle="from last month"
        />
      </div>
      
      {/* Filters and actions */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white border-b border-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Nurturing">Nurturing</SelectItem>
                  <SelectItem value="Dead">Dead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Online Form">Online Form</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Direct Mail">Direct Mail</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <i className="ri-download-line mr-2"></i>
              Export
            </Button>
            <Button>
              <i className="ri-add-line mr-2"></i>
              Add Lead
            </Button>
          </div>
        </div>
      </div>
      
      {/* Leads table */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AvatarPlaceholder name={lead.name} />
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-neutral-500 truncate max-w-[200px]">
                          {lead.address}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={leadStatusColors[lead.status]} 
                      variant="outline"
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{lead.phone}</div>
                      <div className="text-neutral-500">{lead.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(lead.created_at)}</TableCell>
                  <TableCell>{formatDate(lead.last_contact)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <i className="ri-user-line"></i>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <i className="ri-phone-line"></i>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <i className="ri-more-line"></i>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}