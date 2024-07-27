import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/petlist.css';
import Button from '../components/Button';

const PetList = ({ onSelectPet }) => {
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
    <div className="petList">
      {pets.map(pet => (
        <div key={pet.id} className="petCard">
          <p><strong>Mascotinho:</strong> {pet.mascotinho}</p>
          <p><strong>Tutor:</strong> {pet.tutor}</p>
          <Button onClick={() => onSelectPet(pet.id)}>Selecionar</Button>
        </div>
      ))}
    </div>
  );
};

export default PetList;
