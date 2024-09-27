import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import styles from '../styles/Menu.module.css';
import rolePages from '../utils/rolePages';

const Menu = ({ userRoles }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const userRole = userRoles?.role || 'none';

  return (
    <div className={styles.menuContainer}>
      <Button className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`} onClick={handleMenuClick}>
        ☰
      </Button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        <ul className={styles.ul}>
          {rolePages[userRole]?.map((page) => (
            <li className={styles.li} key={page.to}>
              <Link className={styles.link} to={page.to} onClick={handleLinkClick}>
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
