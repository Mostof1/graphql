/**
 * Formats a number as a byte size with appropriate units (B, KB, MB, etc.)
 * @param {number} bytes - The number to format as bytes
 * @param {number} decimals - Number of decimal places to show (default: 2)
 * @returns {string} Formatted string with appropriate byte unit
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  // Calculate the appropriate size unit
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Format with the correct number of decimals
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};