/**
 * Utility functions for handling JWT tokens
 */

/**
 * Decode a JWT token to extract the payload
 * @param {string} token - The JWT token to decode
 * @returns {object|null} The decoded payload or null if invalid
 */
export const decodeJwt = (token) => {
    try {
      // JWT tokens have three parts separated by dots: header.payload.signature
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        console.error('Invalid JWT format');
        return null;
      }
      
      // The payload is the second part, base64 encoded
      const base64Payload = parts[1];
      
      // Replace characters for proper base64 encoding
      const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode the base64 string
      const payload = atob(base64);
      
      // Parse the JSON
      return JSON.parse(payload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };
  
  /**
   * Extract user ID from JWT token
   * @param {string} token - The JWT token
   * @returns {string|null} The user ID or null if not found
   */
  export const getUserIdFromToken = (token) => {
    const payload = decodeJwt(token);
    
    if (!payload) {
      return null;
    }
    
    // Different JWT implementations might use different fields for the user ID
    // Check common fields for user identification
    return payload.sub || payload.userId || payload.user_id || payload.id || null;
  };
  
  /**
   * Check if a JWT token is expired
   * @param {string} token - The JWT token
   * @returns {boolean} True if token is expired, false otherwise
   */
  export const isTokenExpired = (token) => {
    const payload = decodeJwt(token);
    
    if (!payload || !payload.exp) {
      // If there's no expiration claim, consider it expired for safety
      return true;
    }
    
    // exp claim is in seconds, convert to milliseconds
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  };
  
  /**
   * Get the token expiration date
   * @param {string} token - The JWT token
   * @returns {Date|null} The expiration date or null if not found
   */
  export const getTokenExpirationDate = (token) => {
    const payload = decodeJwt(token);
    
    if (!payload || !payload.exp) {
      return null;
    }
    
    // exp claim is in seconds, convert to milliseconds
    const expirationTime = payload.exp * 1000;
    return new Date(expirationTime);
  };
  
  /**
   * Check if token will expire soon (within specified minutes)
   * @param {string} token - The JWT token
   * @param {number} minutesThreshold - Minutes threshold (default: 5)
   * @returns {boolean} True if token will expire soon, false otherwise
   */
  export const willTokenExpireSoon = (token, minutesThreshold = 5) => {
    const payload = decodeJwt(token);
    
    if (!payload || !payload.exp) {
      return true;
    }
    
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const thresholdInMs = minutesThreshold * 60 * 1000;
    
    return expirationTime - currentTime < thresholdInMs;
  };
  
  /**
   * Extract user roles from token (if available)
   * @param {string} token - The JWT token
   * @returns {Array|null} Array of roles or null if not found
   */
  export const getUserRoles = (token) => {
    const payload = decodeJwt(token);
    
    if (!payload) {
      return null;
    }
    
    // Check common fields for roles
    return payload.roles || payload.role || payload.permissions || null;
  };