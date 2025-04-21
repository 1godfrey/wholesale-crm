import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Deal, InsertDeal, DealStatus } from "@shared/schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useDeals() {
  const queryClient = useQueryClient();
  
  // Get all deals
  const { data: deals, isLoading, error } = useQuery<Deal[]>({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await apiRequest('GET', `${API_BASE_URL}/deals`);
      return await response.json();
    }
  });
  
  // Get deals by status
  const getByStatus = (status: string) => {
    return deals?.filter(deal => deal.status === status) || [];
  };
  
  // Get a single deal
  const useGetDeal = (id: string) => {
    return useQuery<Deal>({
      queryKey: ['deal', id],
      queryFn: async () => {
        const response = await apiRequest('GET', `${API_BASE_URL}/deals/${id}`);
        return await response.json();
      },
      enabled: !!id
    });
  };
  
  // Create a new deal
  const createDeal = useMutation({
    mutationFn: async (deal: InsertDeal) => {
      const response = await apiRequest('POST', `${API_BASE_URL}/deals`, deal);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });
  
  // Update a deal
  const updateDeal = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertDeal> }) => {
      const response = await apiRequest('PATCH', `${API_BASE_URL}/deals/${id}`, data);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.id] });
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
      const response = await apiRequest(
        'POST', 
        `${API_BASE_URL}/deals/${id}/status`, 
        { status, notes, changed_by }
      );
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dealHistory', variables.id] });
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
    queryKey: ['dealHistory', dealId],
    queryFn: async () => {
      const response = await apiRequest('GET', `${API_BASE_URL}/deals/${dealId}/history`);
      return await response.json();
    },
    enabled: !!dealId
  });
}