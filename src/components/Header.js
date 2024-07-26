import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li}><Link className={styles.link} to="/">Início</Link></li>
        <li className={styles.li}><Link className={styles.link} to="/cadastro">Cadastro</Link></li>
        <li className={styles.li}><Link className={styles.link} to="/controle">Controle</Link></li>
        <li className={styles.li}><Link className={styles.link} to="/financas">Finanças</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;
