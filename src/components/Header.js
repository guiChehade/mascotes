import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ toggleTheme }) => (
  <header className="header">
    <div className="logo">🐶</div>
    <nav className="nav">
      <ul className="ul">
        <li className="li"><Link className="link" to="/">Início</Link></li>
        <li className="li"><Link className="link" to="/cadastro">Cadastro</Link></li>
        <li className="li"><Link className="link" to="/controle">Controle</Link></li>
        <li className="li"><Link className="link" to="/financas">Finanças</Link></li>
      </ul>
    </nav>
    <button className="themeToggle" onClick={toggleTheme}>🌗</button>
  </header>
);

export default Header;
