import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, getDocs, doc, orderBy, addDoc, limit } from "firebase/firestore";
import Container from "../components/Container";
import Table from "../components/Table";
import Modal from "../components/Modal";
import TextInputModal from "../components/TextInputModal";
import iconLapis from "../assets/icon/lapis.png";
import iconInfo from "../assets/icon/informacao.png";
import styles from '../styles/NoLocal.module.css';

const NoLocal = () => {
  const [pets, setPets] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentDetails, setCommentDetails] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const petsRef = collection(firestore, "pets");
      const petsSnapshot = await getDocs(petsRef);
      let petData = [];

      for (const petDoc of petsSnapshot.docs) {
        const pet = petDoc.data();
        if (["Creche", "Hotel", "Adestramento", "Passeio", "Banho", "Veterinário"].includes(pet.localAtual)) {
          const controleRef = collection(firestore, "pets", petDoc.id, "controle");
          const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"), orderBy("horarioEntrada", "desc"), limit(1));
          const controleSnapshot = await getDocs(controleQuery);
          if (!controleSnapshot.empty) {
            const latestEntry = controleSnapshot.docs[0].data();
            petData.push({
              ...pet,
              ...latestEntry,
              petId: petDoc.id, // Store the pet ID for reference
              comentariosAlimentacao: latestEntry.comentarioAlimentacao || [],
              comentariosVet: latestEntry.comentarioVet || [],
              comentariosComportamento: latestEntry.comentarioComportamento || [],
              comentariosPertences: latestEntry.comentarioPertences || [],
              comentariosObservacoes: latestEntry.comentarioObservacoes || [],
            });
          }
        }
      }

      // Now order the array by localAtual
      petData.sort((a, b) => a.localAtual.localeCompare(b.localAtual));
      setPets(petData);
    };

    fetchPets();
  }, []);

  const handleCommentClick = async (petId, type) => {
    const controleRef = collection(firestore, "pets", petId, "controle");
    const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"), orderBy("horarioEntrada", "desc"), limit(1));
    const controleSnapshot = await getDocs(controleQuery);

    if (!controleSnapshot.empty) {
      const latestEntryId = controleSnapshot.docs[0].id;
      const comentariosRef = collection(doc(firestore, "pets", petId, "controle", latestEntryId), type);
      const snapshot = await getDocs(comentariosRef);
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.horario.localeCompare(b.horario));

      setSelectedComment(type);
      setCommentDetails(comments);
    }
  };

  const handleCloseModal = () => {
    setSelectedComment(null);
    setCommentDetails([]);
  };

  const handleAddComment = async (text) => {
    if (selectedComment) {
      // Assuming you have the petId and the type of comment
      const now = new Date();
      const saoPauloOffset = -3 * 60; // Offset de São Paulo em minutos (-3 horas)
      const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
    
      const comment = {
        comentario: text,
        usuario: "Current User", // Replace with actual user
        horario: localTime.toISOString()
      };

      const petId = "petId"; // Replace with actual petId
      const type = selectedComment; // Use selectedComment for type
      const controleRef = collection(firestore, "pets", petId, "controle");
      const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"), orderBy("horarioEntrada", "desc"), limit(1));
      const controleSnapshot = await getDocs(controleQuery);
      
      if (!controleSnapshot.empty) {
        const latestEntryId = controleSnapshot.docs[0].id;
        const comentariosRef = collection(doc(firestore, "pets", petId, "controle", latestEntryId), type);
        await addDoc(comentariosRef, comment);
        handleCommentClick(petId, type); // Refresh comments
      }
    }
  };

  return (
    <Container className={styles.registrosContainer}>
      <h1>Pets No Local</h1>
      <Table
        headers={['Foto', 'Nome', 'Local', 'Data Entrada', 'Alimentação', 'Veterinário', 'Comportamento', 'Observações', 'Pertences']}
        data={pets.map(pet => ({
          foto: pet.foto ? <img src={pet.foto} alt="Pet" className={styles.petThumbnail} /> : "No Photo",
          nome: pet.mascotinho,
          local: pet.localAtual,
          dataEntrada: pet.dataEntrada,
          alimentacao: pet.comentariosAlimentacao.length > 0 ? (
            <img src={iconInfo} alt="Alimentação" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioAlimentacao')} />
          ) : (
            <img src={iconLapis} alt="Adicionar Alimentação" className={styles.commentIcon} />
          ),
          veterinario: pet.comentariosVet.length > 0 ? (
            <img src={iconInfo} alt="Veterinário" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioVet')} />
          ) : (
            <img src={iconLapis} alt="Adicionar Veterinário" className={styles.commentIcon} />
          ),
          comportamento: pet.comentariosComportamento.length > 0 ? (
            <img src={iconInfo} alt="Comportamento" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioComportamento')} />
          ) : (
            <img src={iconLapis} alt="Adicionar Comportamento" className={styles.commentIcon} />
          ),
          pertences: pet.comentariosPertences.length > 0 ? (
            <img src={iconInfo} alt="Pertences" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioPertences')} />
          ) : (
            <img src={iconLapis} alt="Adicionar Pertences" className={styles.commentIcon} />
          ),
          observacoes: pet.comentariosObservacoes.length > 0 ? (
            <img src={iconInfo} alt="Observações" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioObservacoes')} />
          ) : (
            <img src={iconLapis} alt="Adicionar Observações" className={styles.commentIcon} />
          ),
        }))}
      />
      {selectedComment && (
        <Modal isOpen={!!selectedComment} onClose={handleCloseModal} title={`Comentários sobre ${selectedComment}`}>
          <TextInputModal onSubmit={handleAddComment} placeholder={`Adicione um comentário sobre ${selectedComment}...`} />
          <Table
            headers={['Comentário', 'Usuário', 'Horário']}
            data={commentDetails.map(detail => ({
              comentario: detail.comentario,
              usuario: detail.usuario,
              horario: detail.horario
            }))}
          />
        </Modal>
      )}
    </Container>
  );
};

export default NoLocal;
