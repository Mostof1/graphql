// graphql.service.js
import { getToken } from './auth.service';

const GRAPHQL_ENDPOINT = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';

// Function to execute GraphQL queries
export const executeQuery = async (query, variables = {}) => {
  let token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  // Clean the token - remove any quotes or extra whitespace
  token = token.replace(/^"(.*)"$/, '$1').trim();
  
  console.log('Using token for GraphQL (first 20 chars):', token.substring(0, 20) + '...');
  console.log('Token parts:', token.split('.').length);
  
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    // Log the status for debugging
    console.log('GraphQL response status:', response.status);
    
    // If the status is 401 or 403, it's likely an authentication issue
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication issue with GraphQL request');
      // Try to read the error response
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Authentication failed for GraphQL request');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GraphQL error response:', errorText);
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL response errors:', data.errors);
      throw new Error(data.errors[0].message || 'GraphQL error');
    }
    
    return data.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

// Query to get user basic information
export const getUserQuery = `
  query GetUser {
    user {
      id
      login
    }
  }
`;

// Query to get user XP information
export const getUserXpQuery = `
  query GetUserXp {
    transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
      id
      amount
      objectId
      createdAt
      path
    }
  }
`;

// Query to get projects and their results
export const getUserProgressQuery = `
  query GetUserProgress {
    progress {
      id
      objectId
      grade
      createdAt
      path
      object {
        name
        type
      }
    }
  }
`;

// Query to get audit ratio data
export const getAuditRatioQuery = `
  query GetAuditRatio {
    transaction(where: {type: {_in: ["up", "down"]}}) {
      id
      type
      amount
      createdAt
    }
  }
`;

// Query to get specific object details
export const getObjectQuery = `
  query GetObject($objectId: Int!) {
    object(where: {id: {_eq: $objectId}}) {
      id
      name
      type
      attrs
    }
  }
`;

// Query to get project results
export const getProjectResultsQuery = `
  query GetProjectResults {
    result {
      id
      objectId
      grade
      createdAt
      path
      object {
        name
        type
      }
    }
  }
`;