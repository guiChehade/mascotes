import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Menu.module.css';

const Menu = ({ userRoles }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const userRole = userRoles?.role || 'none';

  const rolePages = {
    isOwner: [
      { to: "/", label: "Início" },
      { to: "/cadastro", label: "Cadastro" },
      { to: "/mascotes", label: "Mascotes" },
      { to: "/financas", label: "Finanças" },
      { to: "/usuarios", label: "Usuários" },
    ],
    isAdmin: [
      { to: "/", label: "Início" },
      { to: "/mascotes", label: "Mascotes" },
      { to: "/cadastro", label: "Cadastro" },
    ],
    isEmployee: [
      { to: "/", label: "Início" },
      { to: "/mascotes", label: "Mascotes" },
    ],
    isTutor: [
      { to: "/", label: "Início" },
    ],
    none: [
      { to: "/", label: "Início" },
      { to: "/login", label: "Login" },
    ],
  };

  return (
    <div className={styles.menuContainer}>
      <button className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`} onClick={handleMenuClick}>
        ☰
      </button>
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
