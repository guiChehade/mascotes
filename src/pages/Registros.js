import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '../firebase';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from '../styles/Registros.module.css';

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [filtroPet, setFiltroPet] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroMes, setFiltroMes] = useState('');

  useEffect(() => {
    const fetchRegistros = async () => {
      const registrosQuery = query(
        collection(firestore, 'registros'),
        orderBy('data'),
        orderBy('horario')
      );
      const registrosSnapshot = await getDocs(registrosQuery);
      const registrosList = registrosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistros(registrosList);
      setFilteredRegistros(registrosList);
    };

    fetchRegistros();
  }, []);

  const handleFiltroChange = () => {
    let filtered = registros;

    if (filtroPet) {
      filtered = filtered.filter(reg => reg.petNome.toLowerCase().includes(filtroPet.toLowerCase()));
    }

    if (filtroData) {
      filtered = filtered.filter(reg => reg.data === filtroData);
    }

    if (filtroMes) {
      filtered = filtered.filter(reg => reg.data.startsWith(filtroMes));
    }

    setFilteredRegistros(filtered);
  };

  useEffect(() => {
    handleFiltroChange();
  }, [filtroPet, filtroData, filtroMes]);

  const renderRegistrosPorDia = () => {
    const registrosPorDia = filteredRegistros.reduce((acc, reg) => {
      if (!acc[reg.data]) acc[reg.data] = [];
      acc[reg.data].push(reg);
      return acc;
    }, {});

    return Object.keys(registrosPorDia).map(dia => (
      <div key={dia} className={styles.diaContainer}>
        <h3>{dia}</h3>
        {registrosPorDia[dia].map(reg => (
          <div key={reg.id} className={styles.registroContainer}>
            <div className={styles.horario}>{reg.horario}</div>
            <div className={styles.tipo}>{reg.tipo}</div>
            <div className={styles.petNome}>{reg.petNome}</div>
            <div className={styles.comentario}>{reg.comentario}</div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <Container>
      <h2>Registros dos Pets</h2>
      <div className={styles.filtros}>
        <Input
          label="Filtrar por Pet"
          type="text"
          value={filtroPet}
          onChange={e => setFiltroPet(e.target.value)}
          placeholder="Digite o nome do pet"
        />
        <Input
          label="Filtrar por Data"
          type="date"
          value={filtroData}
          onChange={e => setFiltroData(e.target.value)}
        />
        <Input
          label="Filtrar por Mês"
          type="month"
          value={filtroMes}
          onChange={e => setFiltroMes(e.target.value)}
        />
      </div>
      {renderRegistrosPorDia()}
    </Container>
  );
};

export default Registros;
