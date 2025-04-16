import { useState } from "react";
import { DealCard } from "./deal-card";
import { DealDetailModal } from "./deal-detail-modal";
import { Deal, DealStatus, Document } from "@shared/schema";
import { useDeals } from "@/hooks/use-deals";
import { getStatusColor } from "@/lib/utils/status-colors";

type KanbanBoardProps = {
  deals: Deal[];
  loading: boolean;
  onUpdateStatus: (dealId: string, status: DealStatus, notes?: string) => Promise<void>;
  onUploadDocument: (dealId: string, file: File) => Promise<Document>;
};

export const KanbanBoard = ({ 
  deals, 
  loading, 
  onUpdateStatus,
  onUploadDocument
}: KanbanBoardProps) => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const newDeals = deals.filter(deal => deal.status === DealStatus.New);
  const underContractDeals = deals.filter(deal => deal.status === DealStatus.UnderContract);
  const closedDeals = deals.filter(deal => deal.status === DealStatus.Closed);
  
  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setDetailModalOpen(true);
  };
  
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedDeal(null);
  };
  
  const handleStatusUpdate = async (dealId: string, status: DealStatus, notes?: string) => {
    await onUpdateStatus(dealId, status, notes);
  };
  
  const handleDocumentUpload = async (file: File) => {
    if (!selectedDeal) return;
    await onUploadDocument(selectedDeal.deal_id, file);
  };
  
  const renderColumn = (
    title: string, 
    statusDeals: Deal[], 
    status: DealStatus
  ) => {
    const { dotColor } = getStatusColor(status);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 flex flex-col">
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center">
            <span className={`w-3 h-3 rounded-full ${dotColor} mr-2`}></span>
            {title}
            <span className="ml-2 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full px-2 py-0.5">
              {statusDeals.length}
            </span>
          </h3>
          <div className="text-neutral-500 hover:text-neutral-700 cursor-pointer">
            <i className="ri-more-2-fill"></i>
          </div>
        </div>
        <div className="p-2 flex-1 overflow-y-auto kanban-column">
          {loading ? (
            <div className="text-center p-4 text-neutral-500">Loading deals...</div>
          ) : statusDeals.length > 0 ? (
            statusDeals.map(deal => (
              <DealCard
                key={deal.deal_id}
                deal={deal}
                onClick={handleDealClick}
              />
            ))
          ) : (
            <div className="text-center p-4 text-neutral-500">No deals in this column</div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderColumn("New", newDeals, DealStatus.New)}
        {renderColumn("Under Contract", underContractDeals, DealStatus.UnderContract)}
        {renderColumn("Closed", closedDeals, DealStatus.Closed)}
      </div>
      
      <DealDetailModal
        deal={selectedDeal}
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        onUpdateStatus={handleStatusUpdate}
        onUploadDocument={handleDocumentUpload}
      />
      
      <style jsx>{`
        .kanban-column {
          min-height: calc(100vh - 230px);
        }
      `}</style>
    </>
  );
};
