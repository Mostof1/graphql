// auth.service.js

// Function to parse JWT token
export const parseJwt = (token) => {
    try {
      // Check if token exists
      if (!token) {
        console.error('No token provided to parseJwt');
        return null;
      }
      
      // Validate token format
      if (typeof token !== 'string') {
        console.error('Token is not a string:', typeof token);
        return null;
      }
      
      // Check for proper JWT format (should have 3 parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format. Expected 3 parts, got:', parts.length);
        return null;
      }
      
      // Get the payload part of the JWT (second part)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Try to decode the base64
      let jsonPayload;
      try {
        jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
        );
      } catch (decodeError) {
        console.error('Error decoding JWT payload:', decodeError);
        return null;
      }
  
      // Parse the JSON
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT', e);
      return null;
    }
  };
  
  // Function to get the authenticated user ID from JWT
  export const getUserIdFromJwt = (token) => {
    // Validate token before attempting to parse
    if (!token) {
      console.error('No token provided to getUserIdFromJwt');
      return null;
    }
    
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
      console.error('Failed to decode token in getUserIdFromJwt');
      return null;
    }
    
    // Check various common properties where user ID might be stored
    const userId = decodedToken.sub || 
                   decodedToken.userId || 
                   decodedToken.user_id || 
                   decodedToken.id;
                   
    if (!userId) {
      console.warn('No user ID found in token payload:', decodedToken);
    }
    
    return userId || null;
  };
  
  // Check if user is authenticated (token exists and is not expired)
  export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    try {
      const decodedToken = parseJwt(token);
      
      // Check if token is expired
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Log out user by removing the token
  export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  
  // Get the authentication token
  export const getToken = () => {
    const token = localStorage.getItem('token');
    
    // Make sure we clean the token - remove any quotes or whitespace
    if (token) {
      return token.trim().replace(/^"(.*)"$/, '$1');
    }
    
    return null;
  };