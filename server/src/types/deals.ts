export interface Deal {
    deal_id: string;
    lead_id?: string;
    property_address: string;
    seller_name: string;
    seller_phone: string;
    status: 'New' | 'Negotiating' | 'Under Contract' | 'Assigned' | 'Closed' | 'Dead';
    target_price?: number;
    assigned_price?: number;
    created_at: Date;
    updated_at: Date;
    notes?: string;
    assigned_to: string;
  }
  
  export interface DealStatusHistory {
    history_id: string;
    deal_id: string;
    old_status: string | null;
    new_status: string;
    changed_by: string;
    timestamp: Date;
    notes?: string;
  }
  
  export interface CreateDealDto {
    lead_id?: string;
    property_address: string;
    seller_name: string;
    seller_phone: string;
    status?: string;
    target_price?: number;
    assigned_to: string;
  }