import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import styles from '../styles/InstallPromptIOS.module.css';

const InstallPromptIOS = ({ isOpen, onClose }) => {
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    // Detecta se é iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Detecta se está no modo standalone
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsInStandaloneMode(isStandalone);
  }, []);

  // Exibe a mensagem apenas se estiver no iOS e não estiver no modo standalone
  if (isIos && !isInStandaloneMode) {
    return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Instalar em iPhone'
        showFooter={false}
        className={styles.installPromptIOS}
    >
        <p>
          Para instalar o aplicativo, toque no botão <strong>Compartilhar</strong> e selecione{' '}
          <strong>"Adicionar à Tela de Início"</strong>.
        </p>
    </Modal>
    );
  }

  return null;
};

export default InstallPromptIOS;
