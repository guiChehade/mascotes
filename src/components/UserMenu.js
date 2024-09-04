import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    navigate('/');
    setMenuOpen(false); // Fechar a navegação após o logout
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    setMenuOpen(false); // Fechar a navegação após o login bem-sucedido
  };

  const handleQuizClick = () => {
    setShowQuiz(true);
    setMenuOpen(false); // Fechar a navegação ao abrir o Quiz
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
            <Button className={styles.navUserButton} onClick={handleQuizClick}>
              Quiz
            </Button>
            <Button className={styles.navUserButton} onClick={handleLogout}>Sair</Button>
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
