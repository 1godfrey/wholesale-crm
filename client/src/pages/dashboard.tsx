import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/deals/kanban-board";
import { DealsListView } from "@/components/deals/deals-list-view";
import { DealsAnalytics } from "@/components/deals/deals-analytics";
import { DealFormModal } from "@/components/deals/deal-form-modal";
import { DealDetailModal } from "@/components/deals/deal-detail-modal";
import { useDeals } from "@/hooks/use-deals";
import { useDocuments } from "@/hooks/use-documents";
import { Deal, DealStatus, InsertDeal } from "@shared/schema";
import { formatCurrency } from "@/lib/utils/deal-utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const { deals, isLoading, getByStatus, createDeal, updateStatus } = useDeals();
  
  // Calculate statistics
  const totalActiveDeals = deals?.filter(d => d.status !== DealStatus.Closed && d.status !== DealStatus.Dead).length || 0;
  const avgDealValue = deals && deals.length > 0
    ? deals.reduce((sum, deal) => sum + (Number(deal.target_price) || 0), 0) / deals.length
    : 0;
  const closedDealsThisMonth = deals?.filter(d => {
    const date = new Date(d.updated_at);
    const now = new Date();
    return d.status === DealStatus.Closed && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear();
  }).length || 0;
  
  // Calculate conversion rate (simplified)
  const totalDeals = deals?.length || 0;
  const closedDeals = deals?.filter(d => d.status === DealStatus.Closed).length || 0;
  const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;
  
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
  
  // Filter deals based on search term
  const filteredDeals = deals?.filter(deal => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      deal.property_address.toLowerCase().includes(term) ||
      deal.seller_name.toLowerCase().includes(term) ||
      (deal.seller_email && deal.seller_email.toLowerCase().includes(term))
    );
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
              {activeTab === "analytics" ? "Deal Analytics" : "Deal Pipeline"}
            </h2>
          </div>
          {activeTab !== "analytics" && (
            <div className="flex mt-4 md:mt-0 space-x-3">
              <Button variant="outline">
                <i className="ri-filter-3-line mr-2"></i>
                Filter
              </Button>
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
              <Tabs defaultValue="30d">
                <TabsList>
                  <TabsTrigger value="7d">7 days</TabsTrigger>
                  <TabsTrigger value="30d">30 days</TabsTrigger>
                  <TabsTrigger value="90d">90 days</TabsTrigger>
                  <TabsTrigger value="all">All time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Stats (only show on kanban and list view) */}
      {activeTab !== "analytics" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 lg:p-8 bg-white border-b border-neutral-200">
          <StatCard 
            title="Total Active Deals" 
            value={totalActiveDeals} 
            change={{ value: 8.1, isPositive: true }}
            subtitle="from last month"
          />
          <StatCard 
            title="Avg. Deal Value" 
            value={formatCurrency(avgDealValue)} 
            change={{ value: 3.2, isPositive: true }}
            subtitle="from last month"
          />
          <StatCard 
            title="Deals Closed (MTD)" 
            value={closedDealsThisMonth} 
            change={{ value: 2.3, isPositive: false }}
            subtitle="from last month"
          />
          <StatCard 
            title="Conversion Rate" 
            value={`${conversionRate.toFixed(1)}%`} 
            change={{ value: 5.4, isPositive: true }}
            subtitle="from last month"
          />
        </div>
      )}

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
