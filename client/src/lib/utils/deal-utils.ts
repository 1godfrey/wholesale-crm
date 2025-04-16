// Format currency values
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numberValue);
};

// Format date to readable string
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Format date and time to readable string
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

// Calculate time since a date (e.g., "2 hours ago")
export const getTimeSince = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000); // years
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000); // months
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400); // days
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600); // hours
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60); // minutes
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }
  
  return "just now";
};

// Calculate profit for a deal
export const calculateProfit = (
  purchasePrice: number | string | null | undefined, 
  salePrice: number | string | null | undefined
): number => {
  if (!purchasePrice || !salePrice) return 0;
  
  const purchase = typeof purchasePrice === "string" ? parseFloat(purchasePrice) : (purchasePrice || 0);
  const sale = typeof salePrice === "string" ? parseFloat(salePrice) : (salePrice || 0);
  
  return sale - purchase;
};