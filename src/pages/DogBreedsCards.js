import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, limit, startAfter } from 'firebase/firestore';
import { firestore } from '../firebase'; // Importando a configuração do Firestore
import Button from '../components/Button';
import fotoDefault from '../assets/dogBreeds/images/border-collie.png';
import styles from '../styles/DogBreedsCards.module.css';

const DogBreedsCards = () => {
  const [breeds, setBreeds] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    porte: '',
    nivelLatido: '',
    nivelEnergia: '',
    nivelSocializacao: '',
    nivelTreinamento: '',
    grupo: '',
    temperamento: '',
  });

  // Função para buscar os dados do Firestore com lazy loading
  const fetchBreeds = useCallback(async (loadMore = false) => {
    setLoading(true);

    try {
      const breedsRef = collection(firestore, 'racas');
      let breedsQuery = query(breedsRef, limit(10));

      if (filters.porte) {
        breedsQuery = query(breedsRef, where('porte', '==', filters.porte));
      }

      // Aplicar outros filtros conforme o selecionado
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          breedsQuery = query(breedsQuery, where(key, '==', filters[key]));
        }
      });

      // Adicionar suporte para lazy loading
      if (loadMore && lastVisible) {
        breedsQuery = query(breedsQuery, startAfter(lastVisible), limit(10));
      }

      const breedSnapshot = await getDocs(breedsQuery);
      const breedsData = breedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastVisible(breedSnapshot.docs[breedSnapshot.docs.length - 1]);

      setBreeds((prevBreeds) => (loadMore ? [...prevBreeds, ...breedsData] : breedsData));
    } catch (error) {
      console.error('Erro ao buscar raças:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, lastVisible]);

  // Carregar dados ao montar o componente ou ao mudar filtros
  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  // Função de handle para mudança de filtros
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Raças de Cachorros</h1>
      
      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <select className={styles.select} name="porte" value={filters.porte} onChange={handleFilterChange}>
          <option value="">Todos os Portes</option>
          <option value="Pequeno">Pequeno</option>
          <option value="Médio">Médio</option>
          <option value="Grande">Grande</option>
        </select>

        <select className={styles.select} name="nivelLatido" value={filters.nivelLatido} onChange={handleFilterChange}>
          <option value="">Nível de Latido</option>
          <option value="Baixo">Baixo</option>
          <option value="Médio">Médio</option>
          <option value="Alto">Alto</option>
        </select>

        <select className={styles.select} name="nivelEnergia" value={filters.nivelEnergia} onChange={handleFilterChange}>
          <option value="">Nível de Energia</option>
          <option value="Baixo">Baixo</option>
          <option value="Médio">Médio</option>
          <option value="Alto">Alto</option>
        </select>

        <select className={styles.select} name="nivelSocializacao" value={filters.nivelSocializacao} onChange={handleFilterChange}>
          <option value="">Nível de Socialização</option>
          <option value="Baixo">Baixo</option>
          <option value="Médio">Médio</option>
          <option value="Alto">Alto</option>
        </select>

        <select className={styles.select} name="nivelTreinamento" value={filters.nivelTreinamento} onChange={handleFilterChange}>
          <option value="">Nível de Treinamento</option>
          <option value="Muito Fácil">Muito Fácil</option>
          <option value="Fácil">Fácil</option>
          <option value="Médio">Médio</option>
          <option value="Difícil">Difícil</option>
          <option value="Teimoso">Teimoso</option>
        </select>

        <select className={styles.select} name="grupo" value={filters.grupo} onChange={handleFilterChange}>
          <option value="">Todos os Grupos</option>
          <option value="Pastoreio">Pastoreio</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Companhia">Companhia</option>
          <option value="Guarda">Guarda</option>
          <option value="Terrier">Terrier</option>
        </select>

        <select className={styles.select} name="temperamento" value={filters.temperamento} onChange={handleFilterChange}>
          <option value="">Todos os Temperamentos</option>
          <option value="Calmo">Calmo</option>
          <option value="Ativo">Ativo</option>
          <option value="Protetor">Protetor</option>
          <option value="Brincalhão">Brincalhão</option>
          <option value="Inteligente">Inteligente</option>
        </select>

      </div>

      {/* Cards das Raças */}
      <div className={styles.cardsContainer}>
        {breeds.map((breed) => (
          <div key={breed.id} className={styles.card}>
            <img
              src={breed.imagem_card || `https://firebasestorage.googleapis.com/v0/b/{bucket}/o/racas%2F${encodeURIComponent(breed.nome)}%2Fcard.png?alt=media`}
              alt={breed.nome}
              className={styles.breedImage}
            />
            <h3>{breed.nome}</h3>
            <p>{breed.destaque}</p>
            <Button to={`/racas/${breed.id}`} className={styles.button}>
              Saiba Mais
            </Button>
          </div>
        ))}
      </div>

      {/* Botão para carregar mais */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Button onClick={() => fetchBreeds(true)} className={styles.loadingButton}>
          Carregar Mais
        </Button>
      )}
    </div>
  );
};

export default DogBreedsCards;
