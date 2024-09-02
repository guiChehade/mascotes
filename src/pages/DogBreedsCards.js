import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, limit, startAfter, getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Button from '../components/Button';
import DogBreedPopup from '../components/DogBreedPopup';
import styles from '../styles/DogBreedsCards.module.css';

const DogBreedsCards = () => {
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);

  const fetchBreeds = useCallback(async(loadMore = false) => {
    setLoading(true);

    try {
      const breedsRef = collection(firestore, 'racas');
      let breedsQuery = query(breedsRef, limit(12));

      if (loadMore && lastVisible) {
        breedsQuery = query(breedsRef, startAfter(lastVisible), limit(12));
      }

      const breedSnapshot = await getDocs(breedsQuery);
      const breedsData = breedSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        imagem_card: doc.data().imagem_card,
        destaque: doc.data().destaque,
        busca: doc.data().busca,
      }));

      setLastVisible(breedSnapshot.docs[breedSnapshot.docs.length - 1]);

      setBreeds((prevBreeds) => (loadMore ? [...prevBreeds, ...breedsData] : breedsData));
    } catch (error) {
      console.error('Erro ao buscar raças:', error);
    } finally {
      setLoading(false);
    }
  }, [lastVisible]);

  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  // Função para aplicar a pesquisa localmente com base no campo 'busca'
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filtrando localmente com base no campo 'busca'
    const filtered = breeds.filter((breed) =>
      breed.busca.toLowerCase().includes(term)
    );

    setFilteredBreeds(filtered);
  };

  const fetchBreedDetails = useCallback(async (breedId) => {
    setLoading(true);

    try {
      const breedDoc = await getDoc(doc(firestore, 'racas', breedId));
      if (breedDoc.exists()) {
        setSelectedBreed({ id: breedDoc.id, ...breedDoc.data() });
      } else {
        console.error('Erro ao encontrar raça com este ID');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da raça:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBreedClick = (breedId) => {
    fetchBreedDetails(breedId);
  }

  return (
    <div className={styles.pageContainer}>
      <h1>Raças de Cachorros</h1>

      {/* Caixa de texto para pesquisa */}
      <input
        type="text"
        placeholder="Pesquise raças..."
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.searchBox}
      />

      {/* Cards das Raças */}
      <div className={styles.cardsContainer}>
        {filteredBreeds.map((breed) => (
          <div key={breed.id} className={styles.card} onClick={() => handleBreedClick(breed)}>
            <div className={styles.imageContainer}>
              {/* <svg className={styles.overlayImage} width='100%' height='100%'>
                <rect width='100%' height='100%' fill='transparent'/>
              </svg> */}
              <img
                src={
                  breed.imagem_card ||
                  `https://firebasestorage.googleapis.com/v0/b/{bucket}/o/racas%2F${encodeURIComponent(breed.nome)}%2Fcard.png?alt=media`
                }
                alt={breed.nome}
                className={styles.breedImage}
                loading="lazy" // Lazy loading da imagem
              />
            </div>
            <h3 className={styles.raca}>{breed.nome}</h3>
            <p className={styles.destaque}>{breed.destaque}</p>
            <Button className={styles.button} onClick={handleBreedClick}>
              Saiba Mais
            </Button>
          </div>
        ))}
      </div>

      {loading && <p>Carregando...</p>}
      {selectedBreed && (
        <DogBreedPopup
          breedDetails={selectedBreed}
          onClose={() => setSelectedBreed(null)}
        />
      )}
    </div>
  );
};

export default DogBreedsCards;
