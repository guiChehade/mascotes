import React from 'react';
import styles from '../styles/PertenceSelection.module.css';
import Button from './Button';

const PertenceSelection = ({ onSelectPertence, onCancel }) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <p>O pet tem algum pertence?</p>
        <div className={styles.gridContainer}>
          <Button onClick={() => onSelectPertence(false)}>Não</Button>
          <Button onClick={() => onSelectPertence(true)}>Sim</Button>
        </div>
        <Button onClick={onCancel} className={styles.cancelButton}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default PertenceSelection;
