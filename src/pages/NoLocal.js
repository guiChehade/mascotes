import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Table from "../components/Table";
import Modal from "../components/Modal";
import iconLapis from "../assets/icon/lapis.png";
import iconInfo from "../assets/icon/informacao.png";
import styles from "../styles/NoLocal.module.css";

const NoLocal = ({ currentUser }) => {
  const [pets, setPets] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsRef = collection(firestore, "pets");
        const petsSnapshot = await getDocs(petsRef);

        const petDataPromises = petsSnapshot.docs.map(async (petDoc) => {
          const pet = petDoc.data();
          const petId = petDoc.id;

          if (
            [
              "Creche",
              "Hotel",
              "Adestramento",
              "Passeio",
              "Banho",
              "Veterinário",
            ].includes(pet.localAtual)
          ) {
            // Busca a entrada mais recente na subcoleção 'controle'
            const controleRef = collection(firestore, "pets", petId, "controle");
            const controleQuery = query(
              controleRef,
              orderBy("dataEntrada", "desc"),
              orderBy("horarioEntrada", "desc"),
              limit(1)
            );
            const controleSnapshot = await getDocs(controleQuery);

            if (!controleSnapshot.empty) {
              const latestEntryDoc = controleSnapshot.docs[0];
              const latestEntry = latestEntryDoc.data();

              // Busca todos os comentários das subcoleções
              const commentTypes = [
                "comentarioAlimentacao",
                "comentarioVet",
                "comentarioComportamento",
                "comentarioPertences",
                "comentarioObservacoes",
              ];

              const commentsPromises = commentTypes.map((type) =>
                fetchComments(latestEntryDoc.ref, type)
              );

              const commentsArrays = await Promise.all(commentsPromises);
              const allComments = commentsArrays.flat();

              return {
                ...pet,
                ...latestEntry,
                petId: petId,
                comments: allComments,
              };
            }
          }
          return null; // Exclui pets que não estão em um estado válido
        });

        const petData = (await Promise.all(petDataPromises)).filter(
          (pet) => pet !== null
        );
        petData.sort((a, b) => a.localAtual.localeCompare(b.localAtual));
        setPets(petData);
      } catch (error) {
        console.error("Erro ao buscar os pets:", error);
      }
    };

    const fetchComments = async (controleRef, subCollection) => {
      const commentsRef = collection(controleRef, subCollection);
      const snapshot = await getDocs(commentsRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        type: subCollection,
        ...doc.data(),
      }));
    };

    fetchPets();
  }, []);

  const handleCommentClick = (pet) => {
    setSelectedComments(pet.comments);
    setModalTitle(`Comentários de ${pet.mascotinho}`);
  };

  const handleCloseModal = () => {
    setSelectedComments([]);
    setModalTitle("");
  };

  const handlePetClick = (petId) => {
    navigate(`/${petId}`);
  };

  return (
    <Container className={styles.registrosContainer}>
      <h1>Pets No Local</h1>
      <Table
        headers={["Foto", "Nome", "Local", "Data Entrada", "Comentários"]}
        data={pets.map((pet) => ({
          foto: pet.foto ? (
            <img
              src={pet.foto}
              alt="Pet"
              className={styles.petThumbnail}
              onClick={() => handlePetClick(pet.petId)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            "Sem Foto"
          ),
          nome: (
            <span
              className={styles.petName}
              onClick={() => handlePetClick(pet.petId)}
              style={{ cursor: "pointer" }}
            >
              {pet.mascotinho}
            </span>
          ),
          local: pet.localAtual,
          dataEntrada: pet.dataEntrada,
          comentarios:
            pet.comments && pet.comments.length > 0 ? (
              <img
                src={iconInfo}
                alt="Comentários"
                className={styles.commentIcon}
                onClick={() => handleCommentClick(pet)}
              />
            ) : null,
        }))}
      />
      {selectedComments.length > 0 && (
        <Modal
          isOpen={selectedComments.length > 0}
          onClose={handleCloseModal}
          showFooter={false}
          title={modalTitle}
        >
          <Table
            headers={["Tipo", "Comentário", "Usuário", "Horário", "Data"]}
            data={selectedComments.map((detail) => ({
              tipo: getCommentTypeName(detail.type),
              comentario: detail.comentario,
              usuario: detail.usuario,
              horario: detail.horario,
              data: detail.data,
            }))}
          />
        </Modal>
      )}
    </Container>
  );
};

// Função para mapear o nome da subcoleção para um nome amigável
const getCommentTypeName = (type) => {
  switch (type) {
    case "comentarioAlimentacao":
      return "Alimentação";
    case "comentarioVet":
      return "Veterinário";
    case "comentarioComportamento":
      return "Comportamento";
    case "comentarioPertences":
      return "Pertences";
    case "comentarioObservacoes":
      return "Observações";
    default:
      return "Comentário";
  }
};

export default NoLocal;
