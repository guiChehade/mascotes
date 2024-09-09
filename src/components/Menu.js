import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
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
      { to: "/quiz", label: "Quiz" },
      { to: "/racas", label: "Raças" },
      { to: "/cadastro", label: "Cadastro" },
      { to: "/usuarios", label: "Usuários" },
      { to: "/mascotes", label: "Mascotes" },
      { to: "/registros", label: "Registros" },
      { to: "/ponto", label: "Ponto" },
    ],
    isAdmin: [
      { to: "/", label: "Início" },
      { to: "/quiz", label: "Quiz" },
      { to: "/racas", label: "Raças" },
      { to: "/cadastro", label: "Cadastro" },
      { to: "/mascotes", label: "Mascotes" },
      { to: "/registros", label: "Registros" },
      { to: "/ponto", label: "Ponto" },
    ],
    isEmployee: [
      { to: "/", label: "Início" },
      { to: "/quiz", label: "Quiz" },
      { to: "racas", label: "Raças" },
      { to: "/mascotes", label: "Mascotes" },
      { to: "/registros", label: "Registros" },
      { to: "/ponto", label: "Ponto" },
    ],
    isTutor: [
      { to: "/", label: "Início" },
      { to: "/quiz", label: "Quiz" },
      { to: "/racas", label: "Raças" },
    ],
    none: [
      { to: "/", label: "Início" },
      { to: "/quiz", label: "Quiz" },
      { to: "/racas", label: "Raças" },
      { to: "/login", label: "Login" },
    ],
  };

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
