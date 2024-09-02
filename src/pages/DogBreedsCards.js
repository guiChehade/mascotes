import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, startAfter, getDoc, doc } from 'firebase/firestore';
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

  // Função para buscar as raças
  const fetchBreeds = useCallback(async (loadMore = false) => {
    setLoading(true);

    try {
      const breedsRef = collection(firestore, 'racas');
      let breedsQuery = query(breedsRef);

      if (loadMore && lastVisible) {
        breedsQuery = query(breedsRef, startAfter(lastVisible));
      }

      const breedSnapshot = await getDocs(breedsQuery);
      const breedsData = breedSnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        imagem_card: doc.data().imagem_card,
        destaque: doc.data().destaque,
        busca: doc.data().busca,
      }));

      setLastVisible(breedSnapshot.docs[breedSnapshot.docs.length - 1]);

      setBreeds((prevBreeds) => (loadMore ? [...prevBreeds, ...breedsData] : breedsData));
      setFilteredBreeds(breedsData);  // Atualiza o estado filtrado inicialmente
    } catch (error) {
      console.error('Erro ao buscar raças:', error);
    } finally {
      setLoading(false);
    }
  }, [lastVisible]);

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = breeds.filter((breed) =>
      breed.busca.toLowerCase().includes(term)
    );

    setFilteredBreeds(filtered); // Atualiza o estado com os resultados filtrados
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
  };

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
          <div key={breed.id} className={styles.card} onClick={() => handleBreedClick(breed.id)}>
            <div className={styles.imageContainer}>
              <img
                src={
                  breed.imagem_card ||
                  `https://firebasestorage.googleapis.com/v0/b/{bucket}/o/racas%2F${encodeURIComponent(breed.nome)}%2Fcard.png?alt=media`
                }
                alt={breed.nome}
                className={styles.breedImage}
                loading="lazy"
              />
            </div>
            <h3 className={styles.raca}>{breed.nome}</h3>
            <p className={styles.destaque}>{breed.destaque}</p>
            <Button className={styles.button} onClick={() => handleBreedClick(breed.id)}>
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
