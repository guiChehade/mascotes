import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import styles from '../styles/UserMenu.module.css';

const UserMenu = ({ currentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div className={styles.userMenuContainer}>
      <button className={styles.userButton} onClick={handleMenuClick}>
        {currentUser?.name || 'Usuário'}
      </button>
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
