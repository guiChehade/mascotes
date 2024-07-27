import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Controle.module.css';
import Button from '../components/Button';

const Controle = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const petsCollection = collection(firestore, 'pets');
      const petsSnapshot = await getDocs(petsCollection);
      const petsList = petsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPets(petsList);
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
