// src/components/PetList.js
import React, { useState, useEffect } from 'react';
import firebase from '../firebase'; // Certifique-se de configurar o Firebase no projeto

const PetList = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const snapshot = await firebase.database().ref('pets').once('value');
      const petsData = snapshot.val();
      const petsArray = Object.keys(petsData).map(key => ({
        id: key,
        ...petsData[key]
      }));
      setPets(petsArray);
    };
    fetchPets();
  }, []);

  return (
    <div>
      <h2>Lista de Mascotinhos</h2>
      {pets.map(pet => (
        <div key={pet.id}>
          <p><strong>ID:</strong> {pet.id}</p>
          <p><strong>Nome:</strong> {pet.nome}</p>
          <p><strong>Tutor:</strong> {pet.tutor}</p>
        </div>
      ))}
    </div>
  );
};

export default PetList;
