import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/login'; 
  };

  return (
    <nav>
      <div className="left-menu">
        <ul>
          <li><Link to="/home">Home</Link></li> 
          <li><Link to="/browse">Browse</Link></li> 
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </div>
      <div className="right-menu">
        <ul>
          <li><button onClick={handleLogout}>Logout</button></li> 
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
