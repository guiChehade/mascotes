import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/menu.css';

const Menu = ({ isAuthenticated, userRoles }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  if (!isAuthenticated || userRoles === null) {
    return null;
  }

  return (
    <>
      <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={handleMenuClick}>
        ☰
      </button>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className="ul">
          <li className="li"><Link className="link" to="/" onClick={handleLinkClick}>Início</Link></li>
          {userRoles && userRoles.isAdmin && (
            <>
              <li className="li"><Link className="link" to="/cadastro" onClick={handleLinkClick}>Cadastro</Link></li>
              <li className="li"><Link className="link" to="/contrato" onClick={handleLinkClick}>Contrato</Link></li>
            </>
          )}
          {userRoles && userRoles.isEmployee && (
            <>
              <li className="li"><Link className="link" to="/creche" onClick={handleLinkClick}>Creche</Link></li>
              <li className="li"><Link className="link" to="/hotel" onClick={handleLinkClick}>Hotel</Link></li>
            </>
          )}
          {userRoles && userRoles.isOwner && (
            <>
              <li className="li"><Link className="link" to="/financas" onClick={handleLinkClick}>Finanças</Link></li>
              <li className="li"><Link className="link" to="/usuarios" onClick={handleLinkClick}>Usuários</Link></li>
            </>
          )}
          {!isAuthenticated && (
            <li className="li"><Link className="link" to="/login" onClick={handleLinkClick}>Login</Link></li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Menu;
