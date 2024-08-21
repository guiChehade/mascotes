import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LoginModal from './LoginModal';
import Quiz from './Quiz';
import Button from './Button';
import styles from '../styles/UserMenu.module.css';

const UserMenu = ({ currentUser, setCurrentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

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

  const handleQuizClick = () => {
    setShowQuiz(true);
  };

  return (
    <div className={styles.userMenuContainer}>
      {currentUser ? (
        <>
          <Button className={styles.userButton} onClick={handleMenuClick}>
            {currentUser.name}
          </Button>
          <div
            className={`${styles.dropdownMenu} ${
              menuOpen ? styles.dropdownMenuOpen : ''
            }`}
          >
            <Button className={styles.userButton} onClick={handleQuizClick}>
              Quiz
            </Button>
            <Button onClick={handleLogout}>Sair</Button>
          </div>
        </>
      ) : (
        <>
          <Button className={styles.userButton} onClick={() => setShowLoginModal(true)}>
            Login
          </Button>
          {showLoginModal && (
            <LoginModal
              onClose={() => setShowLoginModal(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </>
      )}
      {showQuiz && <Quiz onClose={() => setShowQuiz(false)} />}
    </div>
  );
};

export default UserMenu;
