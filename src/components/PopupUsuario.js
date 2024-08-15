import React from "react";
import styles from '../styles/PopupUsuario.module.css';

const PopupUsuario = ({ children, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        {children}
        <button className={styles.closeButton} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default PopupUsuario;
