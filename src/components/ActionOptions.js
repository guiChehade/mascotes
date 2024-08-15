import React from 'react';
import Button from './Button';
import styles from '../styles/ActionOptions.module.css';

const ActionOptions = ({ actionType, options, onSelectOption, onBack }) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>{actionType}</h2>
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <Button key={index} onClick={() => onSelectOption(option)} className={styles.optionButton}>
              {option}
            </Button>
          ))}
        </div>
        <Button onClick={onBack} className={styles.backButton}>Voltar</Button>
      </div>
    </div>
  );
};

export default ActionOptions;
