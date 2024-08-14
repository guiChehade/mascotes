import React from 'react';
import Button from './Button';
import styles from '../styles/SummaryModal.module.css';

const SummaryModal = ({ summaryInfo, onClose }) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>Resumo da Operação</h2>
        <div className={styles.summaryContent}>
          <p><strong>Pet:</strong> {summaryInfo.pet}</p>
          <p><strong>Tipo:</strong> {summaryInfo.tipo}</p>
          <p><strong>Opção:</strong> {summaryInfo.opcao}</p>
          {summaryInfo.pertences && <p><strong>Pertences:</strong> {summaryInfo.pertences}</p>}
          {summaryInfo.comentario && <p><strong>Comentário:</strong> {summaryInfo.comentario}</p>}
          <p><strong>Data:</strong> {summaryInfo.data}</p>
          <p><strong>Hora:</strong> {summaryInfo.hora}</p>
          <p><strong>Usuário:</strong> {summaryInfo.usuario}</p>
        </div>
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
};

export default SummaryModal;
