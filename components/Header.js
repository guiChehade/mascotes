import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to="/">Início</Link></li>
        <li><Link to="/cadastro">Cadastro</Link></li>
        <li><Link to="/controle">Controle</Link></li>
        <li><Link to="/financas">Finanças</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;
