import React from 'react';
import '../styles/crecheCard.css';

const CrecheCard = ({ pet, onSelect }) => {
  return (
    <div className="card">
      <div className="pet-name">{pet.name}</div>
      <img
        className="pet-photo"
        src={pet.photoURL || '../assets/logo-large.png'}
        alt={pet.name}
      />
      <div className="label">Tutor</div>
      <div className="value">{pet.tutor}</div>
      <div className="label">Raça</div>
      <div className="value">{pet.breed}</div>
      <button className="select-button" onClick={onSelect}>Selecionar</button>
    </div>
  );
};

export default CrecheCard;
