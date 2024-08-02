import React from 'react';
import logoLarge from '../assets/logo-large.png';
import styles from '../styles/CrecheCard.module.css';

const CrecheCard = ({ pet, onSelect }) => {
  return (
    <div className="card">
      <div className="pet-name">{pet.mascotinho}</div>
      <img
        className="pet-photo"
        src={pet.photoURL || logoLarge}
        alt={pet.mascotinho}
        style={pet.photoURL ? {} : { filter: 'grayscale(100%)' }}
      />
      <div className="label">Tutor</div>
      <div className="value">{pet.tutor}</div>
      <div className="label">Raça</div>
      <div className="value">{pet.raca}</div>
      <button className="select-button" onClick={onSelect}>Selecionar</button>
    </div>
  );
};

export default CrecheCard;
