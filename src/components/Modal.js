import React from 'react';
import styles from '../styles/Modal.module.css';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.modalContent}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          <Button onClick={onClose} className={styles.cancelButton}>Cancelar</Button>
          <Button onClick={onConfirm} className={styles.confirmButton}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
