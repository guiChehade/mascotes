import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import CrecheCard from '../components/CrecheCard';
import '../styles/creche.css';

const Creche = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsSnapshot = await firestore.collection('pets').get();
        const petsData = petsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPets(petsData);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    fetchPets();
  }, []);

  const handleSelect = (id) => {
    navigate(`/controle/${id}`);
  };

  return (
    <div className="creche-container">
      {pets.map(pet => (
        <CrecheCard key={pet.id} pet={pet} onSelect={() => handleSelect(pet.id)} />
      ))}
    </div>
  );
};

export default Creche;
