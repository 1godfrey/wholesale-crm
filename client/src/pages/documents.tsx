import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/deal-utils";

// Sample document data
const sampleDocuments = [
  {
    id: "1",
    name: "Purchase Agreement - 123 Main St.pdf",
    type: "Purchase Agreement",
    deal_id: "1",
    deal_address: "123 Main St, Anytown, CA",
    uploaded_by: "John Doe",
    uploaded_at: "2025-03-15T08:30:00.000Z",
    size: "1.2 MB",
    tags: ["Contract"]
  },
  {
    id: "2",
    name: "Inspection Report - 456 Oak Ave.pdf",
    type: "Inspection Report",
    deal_id: "2",
    deal_address: "456 Oak Ave, Sometown, CA",
    uploaded_by: "Mary Johnson",
    uploaded_at: "2025-03-14T14:45:00.000Z",
    size: "3.7 MB",
    tags: ["Inspection"]
  },
  {
    id: "3",
    name: "Title Search - 789 Pine St.pdf",
    type: "Title Document",
    deal_id: "3",
    deal_address: "789 Pine St, Othertown, CA",
    uploaded_by: "John Doe",
    uploaded_at: "2025-03-13T11:20:00.000Z",
    size: "0.8 MB",
    tags: ["Title"]
  },
  {
    id: "4",
    name: "Contract Assignment - 123 Main St.pdf",
    type: "Assignment",
    deal_id: "1",
    deal_address: "123 Main St, Anytown, CA",
    uploaded_by: "John Doe",
    uploaded_at: "2025-03-12T16:15:00.000Z",
    size: "1.0 MB",
    tags: ["Assignment", "Contract"]
  },
  {
    id: "5",
    name: "Closing Statement - 123 Main St.pdf",
    type: "Closing Document",
    deal_id: "1",
    deal_address: "123 Main St, Anytown, CA",
    uploaded_by: "Robert Williams",
    uploaded_at: "2025-03-10T09:45:00.000Z",
    size: "0.5 MB",
    tags: ["Closing"]
  },
];

// Document type colors
const documentTypeColors: Record<string, string> = {
  "Purchase Agreement": "bg-blue-100 text-blue-800",
  "Inspection Report": "bg-purple-100 text-purple-800",
  "Title Document": "bg-amber-100 text-amber-800",
  "Assignment": "bg-green-100 text-green-800",
  "Closing Document": "bg-red-100 text-red-800",
};

type DocCardProps = {
  doc: typeof sampleDocuments[0];
};

const DocumentCard = ({ doc }: DocCardProps) => {
  // Get file icon based on name extension
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) return 'ri-file-pdf-line';
    if (filename.endsWith('.doc') || filename.endsWith('.docx')) return 'ri-file-word-line';
    if (filename.endsWith('.xls') || filename.endsWith('.xlsx')) return 'ri-file-excel-line';
    if (filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.gif')) 
      return 'ri-file-image-line';
    return 'ri-file-line';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="mr-4 text-3xl text-neutral-700">
            <i className={getFileIcon(doc.name)}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-neutral-900 truncate">{doc.name}</h3>
            <div className="mt-1 flex items-center text-xs text-neutral-500">
              <span>{doc.size}</span>
              <span className="mx-1">•</span>
              <span>{formatDate(doc.uploaded_at)}</span>
            </div>
            <div className="mt-1">
              <Badge 
                className={documentTypeColors[doc.type]} 
                variant="outline"
              >
                {doc.type}
              </Badge>
            </div>
            <div className="mt-3 text-xs text-neutral-500 truncate">
              <span>Deal: {doc.deal_address}</span>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <i className="ri-download-line"></i>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <i className="ri-more-line"></i>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  // Filter documents based on search term and type filter
  const filteredDocuments = sampleDocuments.filter(doc => {
    // Search term filter
    const matchesSearchTerm = !searchTerm ? true : 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.deal_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === "all" ? true : doc.type === typeFilter;
    
    return matchesSearchTerm && matchesType;
  });
  
  return (
    <Layout onSearch={handleSearch}>
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">Documents</h1>
        </div>
      </div>
      
      {/* Filters and actions */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white border-b border-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Document Types</SelectItem>
                  <SelectItem value="Purchase Agreement">Purchase Agreement</SelectItem>
                  <SelectItem value="Inspection Report">Inspection Report</SelectItem>
                  <SelectItem value="Title Document">Title Document</SelectItem>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                  <SelectItem value="Closing Document">Closing Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                className="rounded-none h-10"
                onClick={() => setViewMode("grid")}
              >
                <i className="ri-grid-line"></i>
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                className="rounded-none h-10"
                onClick={() => setViewMode("list")}
              >
                <i className="ri-list-check"></i>
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button>
              <i className="ri-upload-line mr-2"></i>
              Upload Document
            </Button>
          </div>
        </div>
      </div>
      
      {/* Documents content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Deal</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="text-xl text-neutral-700">
                          <i className={
                            doc.name.endsWith('.pdf') 
                              ? 'ri-file-pdf-line' 
                              : 'ri-file-line'
                          }></i>
                        </div>
                        <div className="font-medium">{doc.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={documentTypeColors[doc.type]} 
                        variant="outline"
                      >
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.deal_address}</TableCell>
                    <TableCell>{doc.uploaded_by}</TableCell>
                    <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <i className="ri-download-line"></i>
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
        )}
      </div>
    </Layout>
  );
}