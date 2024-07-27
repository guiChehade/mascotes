import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import styles from './Controle.module.css';
import Button from '../components/Button';

const Controle = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const snapshot = await database.ref('pets').once('value');
      const petsData = snapshot.val();
      if (petsData) {
        const petsArray = Object.keys(petsData).map(key => ({
          id: key,
          ...petsData[key]
        }));
        setPets(petsArray);
      }
    };
    fetchPets();
  }, []);

  return (
    <div className={styles.controle}>
      <h1>Controle de Mascotinhos</h1>
      <div className={styles.petList}>
        {pets.map(pet => (
          <div key={pet.id} className={styles.petCard}>
            <p><strong>ID:</strong> {pet.id}</p>
            <p><strong>Nome:</strong> {pet.nome}</p>
            <p><strong>Tutor:</strong> {pet.tutor}</p>
            <Button>Selecionar</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Controle;
