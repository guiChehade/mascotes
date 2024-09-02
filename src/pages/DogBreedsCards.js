import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import Button from '../components/Button';
import fotoDefault from '../assets/dogBreeds/images/border-collie.png';
import styles from '../styles/DogBreedsCards.module.css';

const DogBreedsCards = () => {
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar todos os documentos de uma vez
  const fetchAllBreeds = useCallback(async () => {
    setLoading(true);

    try {
      const breedsRef = collection(firestore, 'racas');
      const breedSnapshot = await getDocs(breedsRef);
      const breedsData = breedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBreeds(breedsData);
      setFilteredBreeds(breedsData); // Inicializa com todos os dados
    } catch (error) {
      console.error('Erro ao buscar raças:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    fetchAllBreeds();
  }, [fetchAllBreeds]);

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
          <div key={breed.id} className={styles.card}>
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
            <Button to={`/racas/${breed.id}`} className={styles.button}>
              Saiba Mais
            </Button>
          </div>
        ))}
      </div>

      {loading && <p>Carregando...</p>}
    </div>
  );
};

export default DogBreedsCards;
