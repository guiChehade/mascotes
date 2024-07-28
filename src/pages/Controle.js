import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'pets', id));
      setPets(pets.filter(pet => pet.id !== id));
      alert("Mascotinho excluído com sucesso!");
    } catch (error) {
      alert("Erro ao excluir mascotinho: " + error.message);
    }
  };

  return (
    <div className="controle">
      {pets.map((pet) => (
        <div key={pet.id} className="card">
          <h3>{pet.mascotinho}</h3>
          <p>Tutor: {pet.tutor}</p>
          <button onClick={() => handleDelete(pet.id)} className="button delete-button">Excluir</button>
        </div>
      ))}
    </div>
  );
};

export default Controle;
