import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import CrecheCard from '../components/CrecheCard';
import Input from '../components/Input';
import Button from '../components/Button';
import QrReader from 'react-qr-scanner';
import styles from '../styles/Creche.module.css';

const Creche = () => {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQrReader, setShowQrReader] = useState(false);
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

  const handleQrCodeScan = async (data) => {
    if (data) {
      const id = data.text;
      const petDoc = await getDoc(doc(firestore, 'pets', id));
      if (petDoc.exists) {
        navigate(`/controle/${id}`);
        return;
      }

      const userDoc = await getDoc(doc(firestore, 'users', id));
      if (userDoc.exists) {
        navigate(`/ponto/${id}`);
        return;
      }

      alert('ID não encontrado');
      setShowQrReader(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setShowQrReader(false);
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
        <Button className={styles.cameraButton} onClick={() => setShowQrReader(true)}>
          📷
        </Button>
      </Container>
      {showQrReader && (
        <QrReader
          delay={300}
          style={{ width: '100%' }}
          onError={handleError}
          onScan={handleQrCodeScan}
        />
      )}
      <Container className={styles.cardsContainer}>
      {filteredPets.map(pet => (
        <CrecheCard key={pet.id} pet={pet} onSelect={() => handleSelect(pet.id)} />
      ))}
      </Container>
    </Container>
  );
};

export default Creche;
