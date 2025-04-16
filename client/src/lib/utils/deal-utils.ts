import { Deal } from "@shared/schema";

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

export const getTimeSince = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  return formatDate(date);
};

export const calculateProfit = (deal: Deal): number => {
  if (!deal.target_price || !deal.assigned_price) return 0;
  return Number(deal.assigned_price) - Number(deal.target_price);
};

export const sortDeals = (deals: Deal[], sortBy: string): Deal[] => {
  return [...deals].sort((a, b) => {
    switch (sortBy) {
      case 'dateAsc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'dateDesc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'priceAsc':
        return (Number(a.target_price) || 0) - (Number(b.target_price) || 0);
      case 'priceDesc':
        return (Number(b.target_price) || 0) - (Number(a.target_price) || 0);
      case 'alphabeticalAsc':
        return a.property_address.localeCompare(b.property_address);
      case 'alphabeticalDesc':
        return b.property_address.localeCompare(a.property_address);
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });
};

export const filterDeals = (deals: Deal[], filters: any): Deal[] => {
  return deals.filter(deal => {
    let match = true;
    
    if (filters.status && filters.status !== 'all' && deal.status !== filters.status) {
      match = false;
    }
    
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      const matchesAddress = deal.property_address.toLowerCase().includes(searchLower);
      const matchesSeller = deal.seller_name.toLowerCase().includes(searchLower);
      
      if (!matchesAddress && !matchesSeller) {
        match = false;
      }
    }
    
    if (filters.minPrice && Number(deal.target_price) < filters.minPrice) {
      match = false;
    }
    
    if (filters.maxPrice && Number(deal.target_price) > filters.maxPrice) {
      match = false;
    }
    
    return match;
  });
};
