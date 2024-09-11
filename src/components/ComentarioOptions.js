import React from 'react';
import Button from '../components/Button';
import styles from '../styles/ComentarioOptions.module.css';

const ComentarioOptions = ({ onSelectOption, onBack }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onBack}>X</button>
        <h2>Adicionar Comentário</h2>
        <div className={styles.options}>
          <Button onClick={() => onSelectOption('Alimentação')}>Alimentação</Button>
          <Button onClick={() => onSelectOption('Veterinário')}>Veterinário</Button>
          <Button onClick={() => onSelectOption('Comportamento')}>Comportamento</Button>
          <Button onClick={() => onSelectOption('Observações')}>Observações</Button>
          <Button onClick={() => onSelectOption('Pertences')}>Pertences</Button>
        </div>
      </div>
    </div>
  );
};

export default ComentarioOptions;
