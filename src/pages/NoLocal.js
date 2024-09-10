import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, getDocs, doc, orderBy, addDoc } from "firebase/firestore";
import Container from "../components/Container";
import Table from "../components/Table";
import Modal from "../components/Modal";
import TextInputModal from "../components/TextInputModal";
import iconClick from "../assets/icon/click.png";
import styles from '../styles/Registros.module.css';

const NoLocal = () => {
  const [pets, setPets] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentDetails, setCommentDetails] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      const petsRef = collection(firestore, "pets");
      const petsSnapshot = await getDocs(petsRef);
      let petData = [];

      for (const petDoc of petsSnapshot.docs) {
        const pet = petDoc.data();
        if (["Creche", "Hotel", "Adestramento", "Passeio", "Banho", "Veterinário"].includes(pet.localAtual)) {
          const controleRef = collection(firestore, "pets", petDoc.id, "controle");
          const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"), orderBy("horarioEntrada", "desc"));
          const controleSnapshot = await getDocs(controleQuery);
          if (!controleSnapshot.empty) {
            const latestEntry = controleSnapshot.docs[0].data();
            petData.push({
              ...pet,
              ...latestEntry,
              petId: petDoc.id // Store the pet ID for reference
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
    const controleRef = doc(firestore, "pets", petId, "controle", "latestEntryId");
    const comentariosRef = collection(controleRef, type);
    const snapshot = await getDocs(comentariosRef);
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.horario.localeCompare(b.horario));

    setSelectedComment(type);
    setCommentDetails(comments);
  };

  const handleCloseModal = () => {
    setSelectedComment(null);
    setCommentDetails(null);
  };

  const handleAddComment = async (text) => {
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
    const type = "comentarioPertences"; // Replace with actual comment type
    const controleRef = doc(firestore, "pets", petId, "controle", "latestEntryId");
    const comentariosRef = collection(controleRef, type);
    await addDoc(comentariosRef, comment);
    handleCommentClick(petId, type);
  };

  return (
    <Container className={styles.registrosContainer}>
      <h1>Pets No Local</h1>
      <Table
        headers={['Foto', 'Nome', 'Local', 'Data Entrada', 'Almoço', 'Janta', 'Veterinário', 'Comportamento', 'Pertences']}
        data={pets.map(pet => ({
          foto: pet.foto ? <img src={pet.foto} alt="Pet" className={styles.petThumbnail} /> : "No Photo",
          nome: pet.mascotinho,
          local: pet.localAtual,
          dataEntrada: pet.dataEntrada,
          almoço: <img src={iconClick} alt="Almoço" className={styles.commentIcon} />,
          janta: <img src={iconClick} alt="Janta" className={styles.commentIcon} />,
          veterinario: <img src={iconClick} alt="Veterinário" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioVet')} />,
          comportamento: <img src={iconClick} alt="Comportamento" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioComportamento')} />,
          pertences: <img src={iconClick} alt="Pertences" className={styles.commentIcon} onClick={() => handleCommentClick(pet.petId, 'comentarioPertences')} />,
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
