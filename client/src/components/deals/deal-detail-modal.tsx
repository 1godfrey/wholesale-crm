import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusTimeline } from "./status-timeline";
import { Deal, DealStatus, DealStatusHistory } from "@shared/schema";
import { formatCurrency, calculateProfit } from "@/lib/utils/deal-utils";
import { useDocuments } from "@/hooks/use-documents";
import { useDealHistory } from "@/hooks/use-deals";
import { getStatusColor } from "@/lib/utils/status-colors";

type DealDetailModalProps = {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (dealId: string, status: DealStatus, notes?: string) => void;
  onUploadDocument: (file: File) => void;
};

export const DealDetailModal = ({ 
  deal, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onUploadDocument 
}: DealDetailModalProps) => {
  const [newStatus, setNewStatus] = useState<DealStatus | "">("");
  const [statusNotes, setStatusNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: history } = useDealHistory(deal?.deal_id || null);
  const { documents, isLoading: isLoadingDocuments } = useDocuments(deal?.deal_id || null);
  
  const profit = deal ? calculateProfit(deal) : 0;
  
  const handleUpdateStatus = async () => {
    if (!deal || !newStatus) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(deal.deal_id, newStatus as DealStatus, statusNotes);
      setNewStatus("");
      setStatusNotes("");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDocument(file);
    }
  };
  
  if (!deal) return null;
  
  const { bgColor, textColor } = getStatusColor(deal.status);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0">
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-900">Deal Details</h3>
          <button 
            type="button" 
            className="text-neutral-500 hover:text-neutral-900"
            onClick={onClose}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 pr-0 md:pr-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-neutral-900">{deal.property_address}</h2>
                  <span className={`${bgColor} ${textColor} text-xs font-semibold rounded-full px-3 py-1`}>
                    {deal.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">
                  {deal.bedrooms} bed, {deal.bathrooms} bath, {deal.square_footage} sqft
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Seller</h4>
                  <p className="text-neutral-800">{deal.seller_name}</p>
                  <p className="text-sm text-neutral-500">{deal.seller_email || "No email provided"}</p>
                  <p className="text-sm text-neutral-500">{deal.seller_phone || "No phone provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Deal Value</h4>
                  <p className="text-neutral-800">Purchase: {formatCurrency(Number(deal.target_price))}</p>
                  {deal.assigned_price ? (
                    <>
                      <p className="text-neutral-800">Assignment: {formatCurrency(Number(deal.assigned_price))}</p>
                      <p className="text-sm text-green-600">Profit: {formatCurrency(profit)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-500">No assignment price set</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Notes</h4>
                <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
                  <p className="text-sm text-neutral-700">{deal.notes || "No notes added yet."}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-neutral-500">Documents</h4>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                    <Button variant="ghost" size="sm" className="text-primary">
                      <i className="ri-upload-2-line mr-1"></i> Upload
                    </Button>
                  </div>
                </div>
                
                {isLoadingDocuments ? (
                  <div className="text-center p-4">Loading documents...</div>
                ) : documents && documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <div key={doc.doc_id} className="flex items-center p-2 rounded border border-neutral-200 bg-neutral-50">
                        <i className="ri-file-pdf-line text-red-500 mr-2 text-lg"></i>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-700">{doc.filename}</p>
                          <p className="text-xs text-neutral-500">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="text-neutral-400 hover:text-neutral-600">
                          <i className="ri-download-line"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-neutral-500 border border-dashed border-neutral-300 rounded">
                    No documents uploaded yet
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-64 mt-6 md:mt-0 border-t pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-neutral-200">
              <h4 className="text-sm font-medium text-neutral-500 mb-3">Status History</h4>
              {history ? (
                <StatusTimeline history={history as DealStatusHistory[]} />
              ) : (
                <div className="text-center p-4">Loading history...</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as DealStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DealStatus.New}>New</SelectItem>
                  <SelectItem value={DealStatus.Negotiating}>Negotiating</SelectItem>
                  <SelectItem value={DealStatus.UnderContract}>Under Contract</SelectItem>
                  <SelectItem value={DealStatus.Assigned}>Assigned</SelectItem>
                  <SelectItem value={DealStatus.Closed}>Closed</SelectItem>
                  <SelectItem value={DealStatus.Dead}>Dead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newStatus && (
              <Textarea
                placeholder="Add notes about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                className="flex-1"
              />
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={onClose}>
                Close
              </Button>
              <Button 
                disabled={!newStatus || isUpdating}
                onClick={handleUpdateStatus}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
