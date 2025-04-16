import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/deals/kanban-board";
import { DealsListView } from "@/components/deals/deals-list-view";
import { DealsAnalytics } from "@/components/deals/deals-analytics";
import { DealFormModal } from "@/components/deals/deal-form-modal";
import { DealDetailModal } from "@/components/deals/deal-detail-modal";
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
  const [activeTab, setActiveTab] = useState("kanban");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
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
  
  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setDetailModalOpen(true);
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
          <Tabs defaultValue="kanban" value={activeTab} onValueChange={setActiveTab}>
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
            <h2 className="text-xl font-bold leading-7 text-neutral-900 sm:truncate">
              {activeTab === "analytics" ? "Deal Analytics" : "All Deals"}
            </h2>
          </div>
          {activeTab !== "analytics" && (
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
          )}
          {activeTab === "analytics" && (
            <div className="flex mt-4 md:mt-0 space-x-3">
              <Button variant="outline">
                <i className="ri-download-line mr-2"></i>
                Export Report
              </Button>
              <Select defaultValue="30d">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="year">Last 12 months</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === "kanban" && (
          <KanbanBoard 
            deals={filteredDeals}
            loading={isLoading}
            onUpdateStatus={handleUpdateStatus}
            onUploadDocument={handleDocumentUpload}
          />
        )}
        
        {activeTab === "list" && (
          <DealsListView 
            deals={filteredDeals} 
            loading={isLoading}
            onDealClick={handleDealClick}
          />
        )}
        
        {activeTab === "analytics" && (
          <DealsAnalytics deals={deals || []} />
        )}
      </div>
      
      {/* Add Deal Modal */}
      <DealFormModal 
        isOpen={addDealModalOpen}
        onClose={() => setAddDealModalOpen(false)}
        onSubmit={handleAddDeal}
        isSubmitting={createDeal.isPending}
      />
      
      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={selectedDeal}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onUploadDocument={file => handleDocumentUpload(selectedDeal?.deal_id || "", file)}
      />
    </Layout>
  );
}
