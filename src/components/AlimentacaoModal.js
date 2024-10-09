import React, { useState } from 'react';
import Modal from './Modal';
import naoIcon from '../assets/icons/nao.png';
import parcialIcon from '../assets/icons/parcial.png';
import simIcon from '../assets/icons/sim.png';
import styles from '../styles/AlimentacaoModal.module.css';

const AlimentacaoModal = ({ onSubmit, onClose }) => {
  const [mealTime, setMealTime] = useState('Café da Manhã');
  const [feedingStatus, setFeedingStatus] = useState('Não Comeu');
  const [observations, setObservations] = useState('');

  const handleSubmit = () => {
    onSubmit({
      mealTime,
      feedingStatus,
      observations,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} onConfirm={handleSubmit} title="Registrar Alimentação" className={styles.alimentacaoContainer}>
      <div className={styles.alimentacaoModal}>
        <h3>Horário da Refeição</h3>
        <div className={styles.mealTimeOptions}>
          <label className={styles.alimentacaoLabel}>
            <input
              type="radio"
              name="mealTime"
              value="Café da Manhã"
              checked={mealTime === 'Café da Manhã'}
              onChange={() => setMealTime('Café da Manhã')}
              className={styles.alimentacaoInput}
            />
            Café da Manhã
          </label>
          <label className={styles.alimentacaoLabel}>
            <input
              type="radio"
              name="mealTime"
              value="Almoço"
              checked={mealTime === 'Almoço'}
              onChange={() => setMealTime('Almoço')}
              className={styles.alimentacaoInput}
            />
            Almoço
          </label>
          <label className={styles.alimentacaoLabel}>
            <input
              type="radio"
              name="mealTime"
              value="Janta"
              checked={mealTime === 'Janta'}
              onChange={() => setMealTime('Janta')}
              className={styles.alimentacaoInput}
            />
            Janta
          </label>
        </div>
        <h3>Status da Alimentação</h3>
        <div className={styles.feedingStatusOptions}>
          <label className={styles.alimentacaoLabel}>
            <input
              type="radio"
              name="feedingStatus"
              value="Não Comeu"
              checked={feedingStatus === 'Não Comeu'}
              onChange={() => setFeedingStatus('Não Comeu')}
              className={styles.alimentacaoInput}
            />
            <img
                src={naoIcon}
                alt="Não Comeu"
                className={styles.alimentacaoIcon}
            />
            Não Comeu
          </label>
          <label className={styles.alimentacaoLabel}>
            <input
              type="radio"
              name="feedingStatus"
              value="Comeu Parcial"
              checked={feedingStatus === 'Comeu Parcial'}
              onChange={() => setFeedingStatus('Comeu Parcial')}
              className={styles.alimentacaoInput}
            />
            <img
                src={parcialIcon}
                alt="Comeu Parcial"
                className={styles.alimentacaoIcon}
            />
            Comeu Parcial
          </label>
          
          <label className={styles.alimentacaoLabel}>
            <input
              type="radio"
              name="feedingStatus"
              value="Comeu Tudo"
              checked={feedingStatus === 'Comeu Tudo'}
              onChange={() => setFeedingStatus('Comeu Tudo')}
              className={styles.alimentacaoInput}
            />
            <img
                src={simIcon}
                alt="Comeu Tudo"
                className={styles.alimentacaoIcon}
            />
            Comeu Tudo
          </label>
        </div>
        <h3>Observações</h3>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Digite observações se necessário..."
          className={styles.observations}
        />
      </div>
    </Modal>
  );
};

export default AlimentacaoModal;
