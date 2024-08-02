import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import CrecheCard from '../components/CrecheCard';
import Input from '../components/Input';
import styles from '../styles/Creche.module.css';

const Creche = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredPets = pets.filter(pet =>
    pet.mascotinho && pet.mascotinho.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className={styles.crecheContainer}>
      <Container className={styles.searchContainer}>
        <Input
        label="Buscar Mascotinho"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite o nome do mascotinho"
        />
      </Container>
      <Container className={styles.cardsContainer}>
        {filteredPets.map(pet => (
          <CrecheCard key={pet.id} pet={pet} onSelect={() => handleSelect(pet.id)} />
        ))}
      </Container>
    </Container>
  );
};

export default Creche;
