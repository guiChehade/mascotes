import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/controle.css';

const Controle = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const petsCollection = collection(firestore, 'pets');
      const petsSnapshot = await getDocs(petsCollection);
      const petsList = petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsList);
    };

    fetchPets();
  }, []);

  return (
    <div className="controle">
      <h1>Controle</h1>
      <div className="pets-list">
        {pets.map(pet => (
          <div key={pet.id} className="pet-card">
            <h2>{pet.mascotinho}</h2>
            <p>Tutor: {pet.tutor}</p>
            <button>Selecionar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Controle;
