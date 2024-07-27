import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ toggleTheme }) => (
  <header className="header">
    <div className="header-logo">
      <span role="img" aria-label="dog">🐶</span>
      <h1>ERP Mascotinhos</h1>
    </div>
    <div className="header-buttons">
      <button onClick={toggleTheme} className="theme-toggle-button">
        <span role="img" aria-label="moon">🌙</span>
      </button>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  </header>
);

export default Header;
