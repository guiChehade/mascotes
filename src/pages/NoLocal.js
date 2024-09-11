import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, getDocs, doc, orderBy, addDoc, limit } from "firebase/firestore";
import Container from "../components/Container";
import Table from "../components/Table";
import Modal from "../components/Modal";
import iconLapis from "../assets/icon/lapis.png";
import iconInfo from "../assets/icon/informacao.png";
import styles from '../styles/NoLocal.module.css';

const NoLocal = ({ currentUser }) => {
  const [pets, setPets] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentDetails, setCommentDetails] = useState([]);
  const [currentPetId, setCurrentPetId] = useState(null);

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
            const latestEntryDoc = controleSnapshot.docs[0];
            const latestEntry = latestEntryDoc.data();
            const petId = petDoc.id;

            // Fetch comments for the latest entry
            const comentariosAlimentacao = await fetchComments(latestEntryDoc.ref, "comentarioAlimentacao");
            const comentariosVet = await fetchComments(latestEntryDoc.ref, "comentarioVet");
            const comentariosComportamento = await fetchComments(latestEntryDoc.ref, "comentarioComportamento");
            const comentariosPertences = await fetchComments(latestEntryDoc.ref, "comentarioPertences");
            const comentariosObservacoes = await fetchComments(latestEntryDoc.ref, "comentarioObservacoes");

            petData.push({
              ...pet,
              ...latestEntry,
              petId: petId,
              comentariosAlimentacao,
              comentariosVet,
              comentariosComportamento,
              comentariosPertences,
              comentariosObservacoes,
            });
          }
        }
      }

      // Now order the array by localAtual
      petData.sort((a, b) => a.localAtual.localeCompare(b.localAtual));
      setPets(petData);
    };

    const fetchComments = async (controleRef, subCollection) => {
      const commentsRef = collection(controleRef, subCollection);
      const snapshot = await getDocs(commentsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.horario.localeCompare(b.horario));
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
      setCurrentPetId(petId); // Store the current petId for later use if needed
    }
  };

  const handleCloseModal = () => {
    setSelectedComment(null);
    setCommentDetails([]);
    setCurrentPetId(null);
  };

  return (
    <Container className={styles.registrosContainer}>
      <h1>Pets No Local</h1>
      <Table
        headers={['Foto', 'Nome', 'Local', 'Data Entrada', 'Alimentação', 'Veterinário', 'Comportamento', 'Pertences', 'Observações']}
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