import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import logo from '../assets/logo.jpeg';

const Header = ({ toggleTheme }) => (
  <header className="header">
    <div className="header-logo">
      <img src={logo} alt="Logo" />
      <h1>ERP Mascotinhos</h1>
    </div>
    <div className="header-buttons">
      <button onClick={toggleTheme}>Toggle Theme</button>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  </header>
);

export default Header;
