import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "../firebase";
import RegistroTable from "../components/RegistroTable";
import Filtro from "../components/Filtro";
import styles from '../styles/Registros.module.css';

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [filtros, setFiltros] = useState({ petId: '', data: '', mes: '', ano: '' });

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const registrosRef = collection(firestore, "registros");
        const petsRef = collection(firestore, "pets");

        const q = query(registrosRef, orderBy("data", "desc"));
        const registrosSnapshot = await getDocs(q);

        const registrosData = await Promise.all(
          registrosSnapshot.docs.map(async (registroDoc) => {
            const registro = registroDoc.data();
            const petDoc = await getDocs(query(petsRef));
            const petData = petDoc.docs.find((doc) => doc.id === registro.petId)?.data() || {};
            return {
              ...registro,
              foto: petData.foto || '',
              mascotinho: petData.mascotinho || '',
              raca: petData.raca || '',
              tutor: petData.tutor || '',
              data: formatData(registro.data),
            };
          })
        );

        setRegistros(registrosData);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    };

    fetchRegistros();
  }, []);

  const handleFiltroChange = (filtro) => {
    setFiltros(filtro);
  };

  const registrosFiltrados = registros.filter((registro) => {
    const { petId, data, mes, ano } = filtros;
    const matchPetId = petId ? registro.petId.includes(petId) : true;
    const matchData = data ? registro.data === formatData(data) : true;
    const matchMes = mes ? registro.data.split('/')[1] === mes : true;
    const matchAno = ano ? registro.data.split('/')[2] === ano : true;
    return matchPetId && matchData && matchMes && matchAno;
  });

  return (
    <div className={styles.registrosContainer}>
      <h1>Registros dos Pets</h1>
      <Filtro onChange={handleFiltroChange} />
      <RegistroTable registros={registrosFiltrados} />
    </div>
  );
};

const formatData = (data) => {
  const [dia, mes, ano] = data.split('_');
  return `${dia}/${mes}/${ano}`;
};

export default Registros;
