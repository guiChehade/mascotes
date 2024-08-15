import React from "react";
import styles from '../styles/PopupUsuario.module.css';

const PopupUsuario = ({ children }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        {children}
      </div>
    </div>
  );
};

export default PopupUsuario;
