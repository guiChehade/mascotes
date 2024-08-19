import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LoginModal from './LoginModal';
import styles from '../styles/Menu.module.css';

const Menu = ({ currentUser, setCurrentUser, userRoles }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    window.location.reload();
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
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
      { to: "/registros", label: "Registros" },
      { to: "/financas", label: "Finanças" },
      { to: "/usuarios", label: "Usuários" },
    ],
    isAdmin: [
      { to: "/", label: "Início" },
      { to: "/cadastro", label: "Cadastro" },
      { to: "/mascotes", label: "Mascotes" },
      { to: "/registros", label: "Registros" },
    ],
    isEmployee: [
      { to: "/", label: "Início" },
      { to: "/mascotes", label: "Mascotes" },
      { to: "/registros", label: "Registros" },
    ],
    isTutor: [
      { to: "/", label: "Início" },
    ],
    none: [
      { to: "/", label: "Início" },
    ],
  };

  return (
    <div className={styles.menuContainer}>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          {rolePages[userRole]?.map((page) => (
            <li className={styles.li} key={page.to}>
              <Link className={styles.link} to={page.to} onClick={handleLinkClick}>
                {page.label}
              </Link>
            </li>
          ))}
          {currentUser ? (
            <>
              <li className={styles.li}>
                <span className={styles.userGreeting}>Olá, {currentUser.name}</span>
              </li>
              <li className={styles.li}>
                <button className={styles.logoutButton} onClick={handleLogout}>Sair</button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.li}>
                <button className={styles.loginButton} onClick={() => setShowLoginModal(true)}>Login</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Menu;