import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import Container from "../components/Container";
import Table from "../components/Table";
import Modal from "../components/Modal";
import styles from '../styles/Registros.module.css'; // Reaproveitando estilos de registros
import iconClick from "../assets/icon/click.png";

const NoLocal = () => {
  const [pets, setPets] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      const services = ["Creche", "Hotel", "Adestramento", "Passeio", "Banho", "Veterinário"];
      const petsRef = collection(firestore, "pets");
      const petsSnapshot = await getDocs(petsRef);

      const petData = await Promise.all(petsSnapshot.docs.map(async (petDoc) => {
        const petData = petDoc.data();

        // Only proceed if the pet is in an active service
        if (services.includes(petData.localAtual)) {
          // Fetch the latest 'controle' entry
          const controleRef = collection(firestore, "pets", petDoc.id, "controle");
          const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"));
          const controleSnapshot = await getDocs(controleQuery);

          // Process the latest entry if it exists
          if (!controleSnapshot.empty) {
            const latestEntry = controleSnapshot.docs[0];
            const entryData = latestEntry.data();

            // Get comments if they exist
            const comentarios = {
              pertences: await fetchComments(latestEntry.ref, "comentarioPertences"),
              vet: await fetchComments(latestEntry.ref, "comentarioVet"),
              comportamento: await fetchComments(latestEntry.ref, "comentarioComportamento")
            };

            return {
              ...petData,
              ...entryData,
              comentarios
            };
          }
        }
        return null;
      }));

      setPets(petData.filter(p => p)); // Filter out null entries
    };

    fetchPets();
  }, []);

  const fetchComments = async (controleRef, subCollection) => {
    const commentsRef = collection(controleRef, subCollection);
    const snapshot = await getDocs(commentsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const handleCommentClick = (comments, type) => {
    const sortedComments = comments.sort((a, b) => a.horario.localeCompare(b.horario));
    setSelectedComment({ comments: sortedComments, type });
  };

  const handleCloseModal = () => {
    setSelectedComment(null);
  };

  return (
    <Container className={styles.registrosContainer}>
      <h1>Pets No Local</h1>
      <Table
        headers={['Foto', 'Nome', 'Local', 'Data Entrada', 'Almoço', 'Janta', 'Veterinário', 'Comportamento', 'Pertences']}
        data={pets.map(pet => ({
          foto: pet.foto ? <img src={pet.foto} alt={pet.mascotinho} className={styles.petThumbnail} /> : "Sem foto",
          nome: pet.mascotinho,
          local: pet.localAtual,
          dataEntrada: pet.dataEntrada,
          almoço: pet.almoco ? <img src={iconClick} alt="Almoço" className={styles.commentIcon} /> : null,
          janta: <img src={iconClick} alt="Janta" className={styles.commentIcon} />,
          veterinario: pet.comentariosVet ? <img src={iconClick} alt="Veterinário" className={styles.commentIcon} onClick={() => handleCommentClick(pet.comentariosVet, 'Veterinário')} /> : null,
          comportamento: pet.comentariosComportamento ? <img src={iconClick} alt="Comportamento" className={styles.commentIcon} onClick={() => handleCommentClick(pet.comentariosComportamento, 'Comportamento')} /> : null,
          pertences: pet.comentariosPertences ? <img src={iconClick} alt="Pertences" className={styles.commentIcon} onClick={() => handleCommentClick(pet.comentariosPertences, 'Pertences')} /> : null,
        }))}
      />
      {selectedComment && (
        <Modal isOpen={!!selectedComment} onClose={handleCloseModal} title={`Comentários de ${selectedComment.type}`}>
          <Table 
            headers={['Comentário', 'Usuário', 'Horário']}
            data={selectedComment.comments.map(comment => ({
              comentario: comment.comentario,
              usuario: comment.usuario,
              horario: comment.horario,
            }))}
          />
        </Modal>
      )}
    </Container>
  );
};

export default NoLocal;
