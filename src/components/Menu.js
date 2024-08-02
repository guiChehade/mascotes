import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Menu.module.css';

const Menu = ({ isAuthenticated, userRoles }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className={styles.menuContainer}>
      <button className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`} onClick={handleMenuClick}>
        ☰
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        <ul className={styles.ul}>
          <li className={styles.li}><Link className={styles.link} to="/" onClick={handleLinkClick}>Início</Link></li>
          {isAuthenticated && userRoles ? (
            <>
              {userRoles.isAdmin && <li className={styles.li}><Link className={styles.link} to="/cadastro" onClick={handleLinkClick}>Cadastro</Link></li>}
              {userRoles.isOwner && <li className={styles.li}><Link className={styles.link} to="/contrato" onClick={handleLinkClick}>Contrato</Link></li>}
              {userRoles.isEmployee && <li className={styles.li}><Link className={styles.link} to="/creche" onClick={handleLinkClick}>Creche</Link></li>}
              {userRoles.isEmployee && <li className={styles.li}><Link className={styles.link} to="/hotel" onClick={handleLinkClick}>Hotel</Link></li>}
              {userRoles.isOwner && <li className={styles.li}><Link className={styles.link} to="/financas" onClick={handleLinkClick}>Finanças</Link></li>}
              {userRoles.isOwner && <li className={styles.li}><Link className={styles.link} to="/usuarios" onClick={handleLinkClick}>Usuários</Link></li>}
            </>
          ) : (
            <li className={styles.li}><Link className={styles.link} to="/login" onClick={handleLinkClick}>Login</Link></li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
