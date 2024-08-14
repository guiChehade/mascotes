import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Container from "../components/Container";
import styles from '../styles/Registros.module.css';

const Registros = () => {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const fetchRegistros = async () => {
      const q = query(collection(firestore, "registros"), orderBy('data', 'desc'), orderBy('hora', 'desc'));
      const querySnapshot = await getDocs(q);
      const registrosList = querySnapshot.docs.map(doc => doc.data());
      setRegistros(registrosList);
    };

    fetchRegistros();
  }, []);

  return (
    <Container className={styles.registrosContainer}>
      <h2>Registros de Todos os Pets</h2>
      {registros.length > 0 ? (
        registros.map((registro, index) => (
          <div key={index} className={styles.registro}>
            <strong>{registro.data} {registro.hora}</strong>: {registro.tipo} - {registro.opcao}
            {registro.comentario && <div>{registro.comentario}</div>}
            <div><em>Usuário: {registro.usuario}</em></div>
          </div>
        ))
      ) : (
        <p>Nenhum registro encontrado.</p>
      )}
    </Container>
  );
};

export default Registros;
