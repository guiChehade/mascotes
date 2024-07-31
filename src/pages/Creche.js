import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/creche.css';

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

  const handleEdit = (id) => {
    navigate(`/editar/${id}`);
  };

  return (
    <div className="creche-container">
      {pets.map((pet) => (
        <div key={pet.id} className="pet-card">
          <div className="pet-info">
            <h3>{pet.mascotinho}</h3>
            <p>{pet.tutor}</p>
            <button onClick={() => handleEdit(pet.id)} className="edit-button">Editar</button>
            <Link to={`/opcoes/${pet.id}`} className="select-button">Selecionar</Link>
          </div>
          {pet.foto && <img src={pet.foto} alt={pet.mascotinho} className="pet-foto" />}
        </div>
      ))}
    </div>
  );
};

export default Creche;
