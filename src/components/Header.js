import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../assets/logo.png';

const Header = ({ toggleTheme }) => (
  <header className={styles.header}>
    <div className={styles.headerLogo}>
      <img src={logo} alt="Logo" />
      <h1>ERP Mascotinhos</h1>
    </div>
    <div className={styles.headerButtons}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  </header>
);

export default Header;
