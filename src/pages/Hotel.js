import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import logoLarge from '../assets/logo-large.png';
import styles from '../styles/Creche.module.css';

const Creche = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'pets'));
      const petsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsList);
    };
    fetchPets();
  }, []);

  const handleSelect = (id) => {
    navigate(`/controle/${id}`);
  };

  return (
    <div className="creche-container">
      {pets.map((pet) => (
        <div key={pet.id} className="pet-card">
          <div className="pet-info">
            <p className="pet-name">{pet.mascotinho}</p>
            <p><strong>Tutor:</strong> {pet.tutor}</p>
            <p><strong>Raça:</strong> {pet.raca}</p>
          </div>
          <div className="pet-photo-select">
            {pet.foto ? (
              <img src={pet.foto} alt={pet.mascotinho} className="pet-foto" />
            ) : (
              <img src={logoLarge} alt="Logo" className="pet-foto bw-photo" />
            )}
            <button onClick={() => handleSelect(pet.id)} className="select-button">Selecionar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Creche;
