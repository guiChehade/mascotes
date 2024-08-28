import React, { useState, useEffect } from 'react';
import breedsData from '../assets/dogBreeds/dogBreeds.json'; // Importar o JSON local
import styles from '../styles/DogBreeds.module.css';

const DogBreeds = () => {
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState('all');

  useEffect(() => {
    // Usar os dados do JSON local
    const fetchBreeds = async () => {
      try {
        const translatedBreeds = breedsData.map(breed => ({
          ...breed,
          breed_group: translateGroup(breed.breed_group),
          size: determineSize(breed.weight.metric),
          energy_level: determineEnergyLevel(breed.temperament),
          image_url: breed.image_url || '/default.jpg' // Usar image_url do JSON ou um default
        }));
        setBreeds(translatedBreeds);
        setFilteredBreeds(translatedBreeds); // Inicialmente mostrar todas as raças
      } catch (error) {
        console.error('Erro ao processar as raças de cachorros:', error);
      }
    };

    fetchBreeds();
  }, []);

  // Traduzir grupos para português
  const translateGroup = (group) => {
    const groups = {
      "Toy": "Companhia",
      "Hound": "Caça",
      "Working": "Trabalho",
      "Herding": "Pastoreio"
    };
    return groups[group] || group;
  };

  // Determinar o porte baseado no peso
  const determineSize = (weight) => {
    const weightValue = parseInt(weight.split(' - ')[1]);
    if (weightValue <= 10) return 'small';
    if (weightValue <= 25) return 'medium';
    return 'large';
  };

  // Determinar nível de energia baseado no temperamento
  const determineEnergyLevel = (temperament) => {
    if (!temperament) return 'medium';
    const energyWords = temperament.split(', ');
    if (energyWords.includes('Active') || energyWords.includes('Energetic')) return 'high';
    if (energyWords.includes('Calm') || energyWords.includes('Lazy')) return 'low';
    return 'medium';
  };

  // Aplicar os filtros
  const applyFilters = () => {
    let filtered = breeds;

    if (selectedSize !== 'all') {
      filtered = filtered.filter(breed => breed.size === selectedSize);
    }

    if (selectedGroup !== 'all') {
      filtered = filtered.filter(breed => breed.breed_group === selectedGroup);
    }

    if (selectedEnergyLevel !== 'all') {
      filtered = filtered.filter(breed => breed.energy_level === selectedEnergyLevel);
    }

    setFilteredBreeds(filtered);
  };

  // Atualizar os filtros ao alterar as seleções
  useEffect(() => {
    applyFilters();
  }, [selectedSize, selectedGroup, selectedEnergyLevel]);

  return (
    <div className={styles.breedsContainer}>
      <h1>Raças de Cachorro</h1>
      
      <div className={styles.filterContainer}>
        <label htmlFor="sizeFilter">Porte:</label>
        <select className={styles.selectFilter} id="sizeFilter" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          <option value="all">Todos os Portes</option>
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>

        <label htmlFor="groupFilter">Função:</label>
        <select className={styles.selectFilter} id="groupFilter" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="all">Todos os Grupos</option>
          <option value="Companhia">Companhia</option>
          <option value="Pastoreio">Pastoreio</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Caça">Caça</option>
        </select>

        <label htmlFor="energyFilter">Nível de Energia:</label>
        <select className={styles.selectFilter} id="energyFilter" value={selectedEnergyLevel} onChange={(e) => setSelectedEnergyLevel(e.target.value)}>
          <option value="all">Todos os Níveis</option>
          <option value="low">Baixo</option>
          <option value="medium">Médio</option>
          <option value="high">Alto</option>
        </select>
      </div>

      <div className={styles.breedsGrid}>
        {filteredBreeds.map(breed => (
          <div key={breed.id} className={styles.breedCard}>
            <img src={breed.image_url} alt={breed.name} loading="lazy" />
            <h3>{breed.name}</h3>
            <p>{breed.temperament || 'Temperamento não disponível'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogBreeds;