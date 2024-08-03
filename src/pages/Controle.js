import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import styles from '../styles/Controle.module.css';

const Controle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleEntrada = () => {
    // lógica para entrada
  };

  const handleSaida = () => {
    // lógica para saída
  };

  const handleComentario = () => {
    // lógica para comentário
  };

  const handleEditar = () => {
    navigate(`/editar/${id}`);
  };

  return (
    <div className={styles.controleContainer}>
      <h2>Controle do Pet</h2>
      <div className={styles.controleButtons}>
        <Button onClick={handleEntrada}>Entrada</Button>
        <Button onClick={handleSaida}>Saída</Button>
        <Button onClick={handleComentario}>Comentário</Button>
        <Button onClick={handleEditar}>Editar</Button>
      </div>
    </div>
  );
};

export default Controle;