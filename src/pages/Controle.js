import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import logoLarge from '../assets/logo-large.png';
import styles from '../styles/Controle.module.css';

const Controle = ({ currentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const fetchPetData = async () => {
      if (petId) {
        const petDoc = await getDoc(doc(firestore, "pets", petId));
        if (petDoc.exists) {
          setPet(petDoc.data());
        } else {
          console.error("Pet não encontrado");
        }
      }
    };

    fetchPetData();
  }, [petId]);

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
    navigate(`/editar/${petId}`);
  };

  return (
    <Container className={styles.controleContainer}>
      {pet ? (
        <div className={styles.card}>
          <div className={styles.petName}>{pet.mascotinho}</div>
          <img
            className={styles.petPhoto}
            src={pet.foto || logoLarge}
            alt={pet.mascotinho}
            style={pet.foto ? {} : { filter: 'grayscale(100%)' }}
          />
          <div className={styles.label}>Tutor</div>
          <div className={styles.value}>{pet.tutor}</div>
          <div className={styles.label}>Contato</div>
          <div className={styles.value}>{pet.celularTutor}</div>
          <div className={styles.controleButtons}>
            <Button className={styles.buttons} onClick={handleEntrada}>Entrada</Button>
            <Button className={styles.buttons} onClick={handleSaida}>Saída</Button>
          </div>
          <div className={styles.controleButtons}>
            <Button className={styles.buttons} onClick={handleComentario}>Comentário</Button>
            <Button className={styles.buttons} onClick={handleEditar}>Editar</Button>
          </div>
            
          
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </Container>
  );
};

export default Controle;
