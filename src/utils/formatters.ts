// Format currency in Indian Rupees
export const formatINR = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Format date
  export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  // Format a simple date (without time)
  export const formatSimpleDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(new Date(date));
  };
  
  // Convert camelCase or snake_case to Title Case
  export const formatTitle = (text: string): string => {
    // Handle snake_case
    const withoutSnake = text.replace(/_/g, ' ');
    
    // Handle camelCase
    const withoutCamel = withoutSnake.replace(/([A-Z])/g, ' $1');
    
    // Title case
    return withoutCamel.charAt(0).toUpperCase() + withoutCamel.slice(1).toLowerCase();
  };
  
  // Format tracking status
  export const formatTrackingStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  