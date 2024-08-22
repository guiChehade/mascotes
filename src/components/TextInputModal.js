import React, { useState } from 'react';
import Button from './Button';
import styles from '../styles/TextInputModal.module.css';

const TextInputModal = ({ onSubmit, onClose }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>Registrar Pertences</h2>
        <textarea
          placeholder="Descreva os pertences do pet..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.textarea}
        />
        <div className={styles.buttonGroup}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Enviar</Button>
        </div>
      </div>
    </div>
  );
};

export default TextInputModal;
