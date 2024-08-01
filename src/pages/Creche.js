import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/creche.css';
import CrecheCard from '../components/CrecheCard';

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
      {pets.map(pet => (
        <CrecheCard key={pet.id} pet={pet} onSelect={() => handleSelect(pet.id)} />
      ))}
    </div>
  );
};

export default Creche;
