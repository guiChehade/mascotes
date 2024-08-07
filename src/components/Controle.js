import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "./Button";
import styles from "../styles/Controle.module.css";

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
    <div className={styles.controleContainer}>
      {pet && (
        <div className={styles.petInfo}>
          <h2>{pet.mascotinho}</h2>
          <img
            className={styles.petPhoto}
            src={pet.photoURL}
            alt={pet.mascotinho}
          />
        </div>
      )}
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
