import React from 'react';
import { logout } from '../services/auth.service';

const Navbar = ({ username }) => {
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>GraphQL Profile</h1>
      </div>
      
      <div className="navbar-user">
        {username && (
          <>
            <span className="username">Welcome, {username}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;