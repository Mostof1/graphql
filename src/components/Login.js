import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    identifier: '', // Can be either username or email
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Basic auth header
      const base64Credentials = btoa(`${credentials.identifier}:${credentials.password}`);
      
      console.log('Attempting to login with credentials:', credentials.identifier);
      
      // Make request to signin endpoint
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      // Get response as text first to inspect
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let token;
      
      // Try to parse as JSON if it's JSON
      if (responseText.trim().startsWith('{')) {
        const data = JSON.parse(responseText);
        console.log('Parsed JSON:', data);
        token = data.token || data;
      } else {
        // If not JSON, the response might be the token itself
        token = responseText.trim();
        // Remove any quotes if the token is returned as a quoted string
        token = token.replace(/^"(.*)"$/, '$1');
      }
      
      console.log('Token obtained:', token ? token.substring(0, 20) + '...' : 'none');
      console.log('Token length:', token ? token.length : 0);
      console.log('Token parts:', token ? token.split('.').length : 0);
      
      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token in localStorage
      // Make sure to store the raw token without any quotes
      token = token.replace(/^"(.*)"$/, '$1').trim();
      localStorage.setItem('token', token);
      
      // Verify what was stored
      const storedToken = localStorage.getItem('token');
      console.log('Stored token (first 20 chars):', storedToken.substring(0, 20) + '...');
      console.log('Stored token length:', storedToken.length);
      
      // Notify parent component about successful login
      onLogin(token);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Login to Your Profile</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;