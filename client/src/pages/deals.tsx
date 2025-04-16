import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/deals/kanban-board";
import { DealFormModal } from "@/components/deals/deal-form-modal";
import { useDeals } from "@/hooks/use-deals";
import { useDocuments } from "@/hooks/use-documents";
import { Deal, DealStatus, InsertDeal } from "@shared/schema";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Deals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);
  const { deals, isLoading, createDeal, updateStatus } = useDeals();
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleAddDeal = async (data: InsertDeal) => {
    await createDeal.mutateAsync(data);
    setAddDealModalOpen(false);
  };
  
  const handleUpdateStatus = async (dealId: string, status: DealStatus, notes?: string) => {
    await updateStatus.mutateAsync({
      id: dealId,
      status,
      notes,
      changed_by: "admin" // Simplified - would use actual user ID
    });
  };
  
  const handleDocumentUpload = async (dealId: string, file: File) => {
    const { simulateFileUpload } = useDocuments(dealId);
    return await simulateFileUpload(file, "admin"); // Simplified - would use actual user ID
  };
  
  // Filter deals based on search term and status filter
  const filteredDeals = deals?.filter(deal => {
    // Search term filter
    const matchesSearchTerm = !searchTerm ? true : (
      deal.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.seller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.seller_email && deal.seller_email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Status filter
    const matchesStatus = statusFilter === "all" ? true : deal.status === statusFilter;
    
    return matchesSearchTerm && matchesStatus;
  }) || [];
  
  return (
    <Layout onSearch={handleSearch}>
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="kanban">
            <TabsList className="mb-0">
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Page content */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold leading-7 text-neutral-900 sm:truncate">All Deals</h2>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-3">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={DealStatus.New}>New</SelectItem>
                  <SelectItem value={DealStatus.Negotiating}>Negotiating</SelectItem>
                  <SelectItem value={DealStatus.UnderContract}>Under Contract</SelectItem>
                  <SelectItem value={DealStatus.Assigned}>Assigned</SelectItem>
                  <SelectItem value={DealStatus.Closed}>Closed</SelectItem>
                  <SelectItem value={DealStatus.Dead}>Dead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setAddDealModalOpen(true)}>
              <i className="ri-add-line mr-2"></i>
              Add Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <KanbanBoard 
          deals={filteredDeals}
          loading={isLoading}
          onUpdateStatus={handleUpdateStatus}
          onUploadDocument={handleDocumentUpload}
        />
      </div>
      
      {/* Add Deal Modal */}
      <DealFormModal 
        isOpen={addDealModalOpen}
        onClose={() => setAddDealModalOpen(false)}
        onSubmit={handleAddDeal}
        isSubmitting={createDeal.isPending}
      />
    </Layout>
  );
}
