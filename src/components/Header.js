import React from 'react';
import '../styles/header.css';
import logoLarge from '../assets/logo-large.png';
import logoSmall from '../assets/logo-small.png';

const Header = () => (
  <header className="header">
    <div className="logo">
      <img src={window.innerWidth > 768 ? logoLarge : logoSmall} alt="Logo" />
    </div>
  </header>
);

export default Header;
