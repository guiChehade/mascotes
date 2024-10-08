import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LoginModal from './LoginModal';
import Quiz from '../pages/Quiz';
import Button from './Button';
import styles from '../styles/UserMenu.module.css';
import InstallPromptIOS from './InstallPromptIOS';

const UserMenu = ({ currentUser, setCurrentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // Armazena o evento de instalação
  const [isAppInstalled, setIsAppInstalled] = useState(false); // Gerencia a visibilidade do botão
  const [showInstallPromptIOS, setShowInstallPromptIOS] = useState(false); // Controla o modal para iOS
  const navigate = useNavigate();

  // Handle do evento de instalação PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // Armazena o evento
    };

    // Adiciona o evento antes da instalação
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detecta quando a PWA é instalada
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
    });

    // Limpa o evento ao desmontar o componente
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Verifica se o app já está instalado
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }
  }, []);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    navigate('/');
    setMenuOpen(false); // Fecha a navegação após o logout
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    setMenuOpen(false); // Fecha a navegação após o login bem-sucedido
  };

  // Função para instalar a PWA ou abrir o modal do iOS
  const handleInstallClick = () => {
    // Detecta se o dispositivo é iOS
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    
    if (isIos) {
      // Mostra o modal para instruções no iOS
      setShowInstallPromptIOS(true);
    } else if (deferredPrompt) {
      // Mostra o prompt de instalação para Android
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
        } else {
          console.log('Usuário rejeitou a instalação');
        }
        setDeferredPrompt(null); // Reseta o prompt para não mostrar múltiplas vezes
      });
    }
  };

  return (
    <div className={styles.userMenuContainer}>
      {/* Mostra o modal para iOS quando necessário */}
      <InstallPromptIOS
        isOpen={showInstallPromptIOS}
        onClose={() => setShowInstallPromptIOS(false)}
      />

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
            {/* Botão para instalar o App, visível apenas se o app não estiver instalado */}
            {!isAppInstalled && (
              <Button className={styles.navUserButton} onClick={handleInstallClick}>
                Instalar App
              </Button>
            )}
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
