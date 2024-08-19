import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LoginModal from './LoginModal'; // Importa o LoginModal
import styles from '../styles/UserMenu.module.css';

const UserMenu = ({ currentUser, setCurrentUser }) => {
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

  return (
    <div className={styles.userMenuContainer}>
      {currentUser ? (
        <>
          <button className={styles.userButton} onClick={handleMenuClick}>
            {currentUser.name}
          </button>
          {menuOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleLogout}>Sair</button>
            </div>
          )}
        </>
      ) : (
        <>
          <button className={styles.userButton} onClick={() => setShowLoginModal(true)}>
            Login
          </button>
          {showLoginModal && (
            <LoginModal
              onClose={() => setShowLoginModal(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserMenu;
