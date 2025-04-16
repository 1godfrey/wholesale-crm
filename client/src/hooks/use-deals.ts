import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Deal, InsertDeal, DealStatus } from "@shared/schema";

export function useDeals() {
  const queryClient = useQueryClient();
  
  // Get all deals
  const { data: deals, isLoading, error } = useQuery<Deal[]>({
    queryKey: ['/api/deals']
  });
  
  // Get deals by status
  const getByStatus = (status: string) => {
    return deals?.filter(deal => deal.status === status) || [];
  };
  
  // Get a single deal
  const useGetDeal = (id: string) => {
    return useQuery<Deal>({
      queryKey: [`/api/deals/${id}`],
      enabled: !!id
    });
  };
  
  // Create a new deal
  const createDeal = useMutation({
    mutationFn: async (deal: InsertDeal) => {
      const response = await apiRequest('POST', '/api/deals', deal);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
    }
  });
  
  // Update a deal
  const updateDeal = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertDeal> }) => {
      const response = await apiRequest('PATCH', `/api/deals/${id}`, data);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      queryClient.invalidateQueries({ queryKey: [`/api/deals/${variables.id}`] });
    }
  });
  
  // Update deal status
  const updateStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes, 
      changed_by 
    }: { 
      id: string; 
      status: DealStatus; 
      notes?: string; 
      changed_by?: string; 
    }) => {
      const response = await apiRequest('POST', `/api/deals/${id}/status`, {
        status,
        notes,
        changed_by
      });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      queryClient.invalidateQueries({ queryKey: [`/api/deals/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/deals/${variables.id}/history`] });
    }
  });

  return {
    deals,
    isLoading,
    error,
    getByStatus,
    useGetDeal,
    createDeal,
    updateDeal,
    updateStatus
  };
}

// Hook to get deal history
export function useDealHistory(dealId: string | null) {
  return useQuery({
    queryKey: [`/api/deals/${dealId}/history`],
    enabled: !!dealId
  });
}
