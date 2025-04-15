import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import { isAuthenticated, getUserIdFromJwt, getToken } from './services/auth.service';
import './styles.css';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Event listener for username updates from the Profile component
    const handleUsernameUpdate = () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    
    window.addEventListener('usernameUpdated', handleUsernameUpdate);
    
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const token = getToken();
          const userId = getUserIdFromJwt(token);
          
          // Check if username is already in localStorage
          const storedUsername = localStorage.getItem('username');
          if (storedUsername) {
            setUsername(storedUsername);
          } else {
            // Use ID until we get the real username
            setUsername(userId);
          }
          
          setAuthenticated(true);
        } catch (error) {
          console.error('Authentication error:', error);
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('usernameUpdated', handleUsernameUpdate);
    };
  }, []);

  const handleLogin = (token) => {
    // Clean the token to ensure it's properly formatted
    const cleanToken = token.replace(/^"(.*)"$/, '$1').trim();
    
    // Extract user info from token if needed
    try {
      const userId = getUserIdFromJwt(cleanToken);
      console.log('User ID from token:', userId);
      setUsername(userId);
      setAuthenticated(true);
    } catch (error) {
      console.error('Error processing token during login:', error);
      setAuthenticated(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app">
      <Navbar username={username} />
      
      <main className="main-content">
        {authenticated ? (
          <Profile />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <p>GraphQL Profile Project © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;