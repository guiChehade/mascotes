import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/controle.css';

const Controle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleEntrada = () => {
    navigate(`/controle/entrada/${id}`);
  };

  const handleSaida = () => {
    navigate(`/controle/saida/${id}`);
  };

  const handleComentario = () => {
    navigate(`/controle/comentario/${id}`);
  };

  const handleEditar = () => {
    navigate(`/editar/${id}`);
  };

  return (
    <div className="controle-container">
      <h2>Controle do Pet</h2>
      <div className="controle-buttons">
        <button onClick={handleEntrada}>Entrada</button>
        <button onClick={handleSaida}>Saída</button>
        <button onClick={handleComentario}>Comentário</button>
        <button onClick={handleEditar}>Editar</button>
      </div>
    </div>
  );
};

export default Controle;
