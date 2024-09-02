import React from 'react';
import styles from '../styles/DogBreedPopup.module.css';

const DogBreedPopup = ({ breedDetails, onClose }) => {
  // Função para renderizar cada campo de detalhes da raça de cachorro
  const renderDetail = (label, value) => {
    if (!value) return null; // Se o campo não estiver preenchido, não renderizar nada

    return (
      <div className={styles.detailItem}>
        <strong>{label}: </strong>
        <span>{value}</span>
      </div>
    );
  };

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h1 className={styles.title}>{breedDetails.raca}</h1>
        <h2 className={styles.subtitle}>{breedDetails.destaque}</h2>

        {/* Renderizando os detalhes da raça */}
        {renderDetail('Porte', breedDetails.porte)}
        {renderDetail('Nível de Latido', breedDetails.nivel_latido)}
        {renderDetail('Nível de Energia', breedDetails.nivel_energia)}
        {renderDetail('Nível de Socialização', breedDetails.nivel_socializacao)}
        {renderDetail('Nível de Treinamento', breedDetails.nivel_treinamento)}
        {renderDetail('Grupo', breedDetails.grupo)}
        {renderDetail('Origem', breedDetails.origem)}
        {renderDetail('Peso Médio', `${breedDetails.peso_medio} kg`)}
        {renderDetail('Altura na Cernelha', `${breedDetails.altura_cernelha} cm`)}
        {renderDetail('Expectativa de Vida', `${breedDetails.expectativa_vida} anos`)}
        {renderDetail('Introdução', breedDetails.detalhes?.introducao)}
        
        {/* Detalhes sobre aparência */}
        {renderDetail('Pelagem', breedDetails.detalhes?.aparencia?.pelagem)}
        {renderDetail('Tamanho', breedDetails.detalhes?.aparencia?.tamanho)}
        {renderDetail('Características', breedDetails.detalhes?.aparencia?.caracteristicas)}
        
        {/* Temperamento */}
        {renderDetail('Temperamento 1', breedDetails.detalhes?.temperamento?.caracteristica1)}
        {renderDetail('Temperamento 2', breedDetails.detalhes?.temperamento?.caracteristica2)}
        {renderDetail('Temperamento 3', breedDetails.detalhes?.temperamento?.caracteristica3)}
        {renderDetail('Temperamento 4', breedDetails.detalhes?.temperamento?.caracteristica4)}

        {/* Cuidados */}
        {renderDetail('Cuidados 1', breedDetails.detalhes?.cuidados?.cuidado1)}
        {renderDetail('Cuidados 2', breedDetails.detalhes?.cuidados?.cuidado2)}
        {renderDetail('Cuidados 3', breedDetails.detalhes?.cuidados?.cuidado3)}
        {renderDetail('Cuidados 4', breedDetails.detalhes?.cuidados?.cuidado4)}
        {renderDetail('Cuidados 5', breedDetails.detalhes?.cuidados?.cuidado5)}
        {renderDetail('Cuidados 6', breedDetails.detalhes?.cuidados?.cuidado6)}

        {/* História e Curiosidades */}
        {renderDetail('História', breedDetails.detalhes?.historia)}
        {renderDetail('Curiosidade 1', breedDetails.detalhes?.curiosidades?.curiosidade1)}
        {renderDetail('Curiosidade 2', breedDetails.detalhes?.curiosidades?.curiosidade2)}
        {renderDetail('Curiosidade 3', breedDetails.detalhes?.curiosidades?.curiosidade3)}

        {/* Considerações finais */}
        {renderDetail('Considerações', breedDetails.detalhes?.consideracoes)}
      </div>
    </div>
  );
};

export default DogBreedPopup;