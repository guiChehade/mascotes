import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import logoLarge from '../assets/logo-large.png';
import logoSmall from '../assets/logo-small.png';

const Header = ({ isAuthenticated, userRoles }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <div className="logo">
        <img src={window.innerWidth > 768 ? logoLarge : logoSmall} alt="Logo" />
      </div>
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className="ul">
          <li className="li"><Link className="link" to="/">Início</Link></li>
          {isAuthenticated && (
            <>
              {(userRoles.isAdmin || userRoles.isOwner) && <li className="li"><Link className="link" to="/cadastro">Cadastro</Link></li>}
              {(userRoles.isEmployee || userRoles.isOwner) && <li className="li"><Link className="link" to="/contrato">Contrato</Link></li>}
              {(userRoles.isEmployee || userRoles.isOwner) && <li className="li"><Link className="link" to="/creche">Creche</Link></li>}
              {(userRoles.isEmployee || userRoles.isOwner) && <li className="li"><Link className="link" to="/hotel">Hotel</Link></li>}
              {userRoles.isOwner && <li className="li"><Link className="link" to="/financas">Finanças</Link></li>}
              {userRoles.isOwner && <li className="li"><Link className="link" to="/usuarios">Usuários</Link></li>}
            </>
          )}
          {!isAuthenticated && <li className="li"><Link className="link" to="/login">Login</Link></li>}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
