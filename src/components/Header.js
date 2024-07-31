import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import logoLarge from '../assets/logo-large.png'; // Adicione sua imagem para telas grandes
import logoSmall from '../assets/logo-small.png'; // Adicione sua imagem para telas pequenas

const Header = ({ toggleTheme, userRoles }) => (
  <header className="header">
    <div className="logo">
      <img src={window.innerWidth > 768 ? logoLarge : logoSmall} alt="Logo" />
    </div>
    <nav className="nav">
      <ul className="ul">
        <li className="li"><Link className="link" to="/">Início</Link></li>
        {userRoles.isAuthenticated && (
          <>
            {(userRoles.isAdmin || userRoles.isOwner) && <li className="li"><Link className="link" to="/cadastro">Cadastro</Link></li>}
            {(userRoles.isAdmin || userRoles.isOwner) && <li className="li"><Link className="link" to="/creche">Creche</Link></li>}
            {(userRoles.isEmployee || userRoles.isOwner) && <li className="li"><Link className="link" to="/contrato">Contrato</Link></li>}
            {userRoles.isOwner && <li className="li"><Link className="link" to="/financas">Finanças</Link></li>}
            {userRoles.isOwner && <li className="li"><Link className="link" to="/usuarios">Usuários</Link></li>}
          </>
        )}
        {!userRoles.isAuthenticated && <li className="li"><Link className="link" to="/login">Login</Link></li>}
      </ul>
    </nav>
  </header>
);

export default Header;
