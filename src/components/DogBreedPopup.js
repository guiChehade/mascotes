import React from 'react';
import styles from '../styles/DogBreedPopup.module.css';

const DogBreedPopup = ({ breedDetails, onClose }) => {
  // Função para renderizar cada campo de detalhes da raça de cachorro
  const renderDetail = (value) => {
    if (!value) return null; // Se o campo não estiver preenchido, não renderizar nada

    return (
      <div className={styles.detailItem}>
        <span>{value}</span>
      </div>
    );
  };

  const renderFichaTecnica = (label, value) => {
    if (!value) return null; // Se o campo não estiver preenchido, não renderizar nada

    return (
      <div className={styles.detailItem}>
        <strong>{label}: </strong>
        <span>{value}</span>
      </div>
    );
  };

  // Função para renderizar um subtítulo caso haja conteúdo na seção
  const renderSection = (title, content) => {
    if (!content.some(detail => detail)) return null;

    return (
      <>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {content.map((detail, index) => (
          renderDetail(detail)
        ))}
      </>
    );
  };

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h1 className={styles.title}>{breedDetails.nome}</h1>
        <h2 className={styles.subtitle}>{breedDetails.destaque}</h2>

        {/* Ficha Técnica */}
        <h3 className={styles.sectionTitle}>Ficha Técnica</h3>
        {renderFichaTecnica('Porte', breedDetails.porte)}
        {renderFichaTecnica('Nível de Latido', breedDetails.nivel_latido)}
        {renderFichaTecnica('Nível de Energia', breedDetails.nivel_energia)}
        {renderFichaTecnica('Nível de Socialização', breedDetails.nivel_socializacao)}
        {renderFichaTecnica('Nível de Treinamento', breedDetails.nivel_treinamento)}
        {renderFichaTecnica('Grupo', breedDetails.grupo)}
        {renderFichaTecnica('Origem', breedDetails.origem)}
        {renderFichaTecnica('Peso Médio', `${breedDetails.peso_medio} kg`)}
        {renderFichaTecnica('Altura na Cernelha', `${breedDetails.altura_cernelha} cm`)}
        {renderFichaTecnica('Expectativa de Vida', `${breedDetails.expectativa_vida} anos`)}

        {/* Introdução */}
        {renderSection('Introdução', [
          breedDetails.detalhes?.introducao
        ])}
        
        {/* Aparência */}
        {renderSection('Aparência', [
          breedDetails.detalhes?.aparencia?.pelagem,
          breedDetails.detalhes?.aparencia?.tamanho,
          breedDetails.detalhes?.aparencia?.caracteristicas,
        ])}

        {/* Temperamento */}
        {renderSection('Temperamento', [
          breedDetails.detalhes?.temperamento?.caracteristica1,
          breedDetails.detalhes?.temperamento?.caracteristica2,
          breedDetails.detalhes?.temperamento?.caracteristica3,
          breedDetails.detalhes?.temperamento?.caracteristica4,
        ])}

        {/* Cuidados */}
        {renderSection('Cuidados', [
          breedDetails.detalhes?.cuidados?.cuidado1,
          breedDetails.detalhes?.cuidados?.cuidado2,
          breedDetails.detalhes?.cuidados?.cuidado3,
          breedDetails.detalhes?.cuidados?.cuidado4,
          breedDetails.detalhes?.cuidados?.cuidado5,
          breedDetails.detalhes?.cuidados?.cuidado6,
        ])}

        {/* História e Curiosidades */}
        {renderSection('História e Curiosidades', [
          breedDetails.detalhes?.historia,
          breedDetails.detalhes?.curiosidades?.curiosidade1,
          breedDetails.detalhes?.curiosidades?.curiosidade2,
          breedDetails.detalhes?.curiosidades?.curiosidade3,
        ])}

        {/* Considerações finais */}
        {renderSection('Considerações Finais', [
          breedDetails.detalhes?.consideracoes
        ])}
      </div>
    </div>
  );
};

export default DogBreedPopup;
