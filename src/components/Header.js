import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import { ReactComponent as MoonIcon } from '../assets/moon.svg';
import { ReactComponent as DogIcon } from '../assets/dog.svg';

const Header = ({ toggleTheme }) => (
  <header className="header">
    <div className="header-logo">
      <DogIcon className="dog-icon" />
      <h1>ERP Mascotinhos</h1>
    </div>
    <div className="header-buttons">
      <button onClick={toggleTheme} className="theme-toggle-button">
        <MoonIcon />
      </button>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  </header>
);

export default Header;
