import React from 'react';
import logoLarge from '../assets/logo-large.png';
import styles from '../styles/CrecheCard.module.css';

const CrecheCard = ({ pet, onSelect }) => {
  return (
    <div className={styles.card}>
      <div className={styles.petName}>{pet.mascotinho}</div>
      <img
        className={styles.petPhoto}
        src={pet.foto || logoLarge}
        alt={pet.mascotinho}
        style={pet.foto ? {} : { filter: 'grayscale(100%)' }}
      />
      <div className={styles.label}>Tutor</div>
      <div className={styles.value}>{pet.tutor}</div>
      <div className={styles.label}>Raça</div>
      <div className={styles.value}>{pet.raca}</div>
      <button className={styles.selectButton} onClick={onSelect}>Selecionar</button>
    </div>
  );
};

export default CrecheCard;
