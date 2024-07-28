import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">🐶</div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className="ul">
          <li className="li"><Link className="link" to="/">Início</Link></li>
          <li className="li"><Link className="link" to="/cadastro">Cadastro</Link></li>
          <li className="li"><Link className="link" to="/controle">Controle</Link></li>
          <li className="li"><Link className="link" to="/financas">Finanças</Link></li>
        </ul>
      </nav>
      <button className="themeToggle" onClick={toggleTheme}>🌗</button>
      <button className="hamburger" onClick={toggleMenu}>☰</button>
    </header>
  );
};

export default Header;
