import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import Button from './Button';

const Header = ({ toggleTheme }) => (
  <header className={styles.header}>
    <div className={styles.logo}>🐶</div>
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li}><Link className={styles.link} to="/">Início</Link></li>
        <li className={styles.li}><Link className={styles.link} to="/cadastro">Cadastro</Link></li>
        <li className={styles.li}><Link className={styles.link} to="/controle">Controle</Link></li>
        <li className={styles.li}><Link className={styles.link} to="/financas">Finanças</Link></li>
      </ul>
    </nav>
    <button className={styles.themeToggle} onClick={toggleTheme}>🌗</button>
  </header>
);

export default Header;
