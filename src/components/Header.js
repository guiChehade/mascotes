import React from 'react';
import logoLarge from '../assets/logo-large.png';
import logoSmall from '../assets/logo-small.png';
import styles from '../styles/Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <img src={window.innerWidth > 768 ? logoLarge : logoSmall} alt="Logo" />
    </div>
  </header>
);

export default Header;
