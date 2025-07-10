// Handle invoice download functionality
export const downloadInvoice = (invoiceUrl: string, orderId: string): void => {
  const link = document.createElement('a');
  link.href = invoiceUrl;
  link.download = `invoice-${orderId}.pdf`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object after download
  setTimeout(() => {
    URL.revokeObjectURL(invoiceUrl);
  }, 1000);
};
