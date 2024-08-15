import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from '../styles/Detalhes.module.css';

const Detalhes = () => {
  const [petsByLocal, setPetsByLocal] = useState({
    Creche: [],
    Adestramento: [],
    Passeio: [],
    Banho: [],
    Veterinário: [],
    Inativo: []
  });

  useEffect(() => {
    const fetchPetsByLocal = async () => {
      const petsSnapshot = await getDocs(collection(firestore, "pets"));
      const petsData = petsSnapshot.docs.map(doc => doc.data());

      const groupedByLocal = petsData.reduce((acc, pet) => {
        const local = pet.local || "Casa";
        if (!acc[local]) acc[local] = [];
        acc[local].push(pet);
        return acc;
      }, {});

      setPetsByLocal(groupedByLocal);
    };

    fetchPetsByLocal();
  }, []);

  return (
    <div className={styles.detalhesContainer}>
      <h1>Detalhes dos Pets por Local</h1>
      <div className={styles.columnsContainer}>
        {Object.keys(petsByLocal).map(local => (
          <div key={local} className={styles.column}>
            <h2>{local}</h2>
            {petsByLocal[local].map((pet, index) => (
              <div key={index} className={styles.petItem}>
                <img src={pet.photoURL} alt={pet.mascotinho} className={styles.petThumbnail} />
                <div>{pet.mascotinho}</div>
                <div>{pet.raca}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detalhes;
