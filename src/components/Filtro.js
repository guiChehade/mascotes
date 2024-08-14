import React, { useState } from "react";
import styles from '../styles/Filtro.module.css';

const Filtro = ({ onChange }) => {
  const [petId, setPetId] = useState('');
  const [data, setData] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  const handleFiltroChange = () => {
    onChange({ petId, data, mes, ano });
  };

  return (
    <div className={styles.filtroContainer}>
      <input
        type="text"
        placeholder="Pet ID"
        value={petId}
        onChange={(e) => setPetId(e.target.value)}
        onBlur={handleFiltroChange}
      />
      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        onBlur={handleFiltroChange}
      />
      <input
        type="text"
        placeholder="Mês (MM)"
        value={mes}
        onChange={(e) => setMes(e.target.value)}
        onBlur={handleFiltroChange}
      />
      <input
        type="text"
        placeholder="Ano (AAAA)"
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        onBlur={handleFiltroChange}
      />
    </div>
  );
};

export default Filtro;
