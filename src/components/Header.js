import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ toggleTheme, userRoles }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <button className="hamburger" onClick={toggleMenu}>☰</button>
      <div className="logo">🐶</div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className="ul">
          <li className="li"><Link className="link" to="/">Início</Link></li>
          {(userRoles.isAdmin || userRoles.isOwner) && <li className="li"><Link className="link" to="/cadastro">Cadastro</Link></li>}
          {(userRoles.isAdmin || userRoles.isOwner) && <li className="li"><Link className="link" to="/controle">Controle</Link></li>}
          {userRoles.isOwner && <li className="li"><Link className="link" to="/financas">Finanças</Link></li>}
          {(userRoles.isEmployee || userRoles.isOwner) && <li className="li"><Link className="link" to="/creche">Creche</Link></li>}
          {userRoles.isOwner && <li className="li"><Link className="link" to="/usuarios">Usuários</Link></li>}
        </ul>
      </nav>
      <button className="themeToggle" onClick={toggleTheme}>🌗</button>
    </header>
  );
};

export default Header;
