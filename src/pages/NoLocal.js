import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Table from "../components/Table";
import Modal from "../components/Modal";
import iconInfo from "../assets/icons/informacao.png";
import naoIcon from "../assets/icons/nao.png";
import parcialIcon from "../assets/icons/parcial.png";
import simIcon from "../assets/icons/sim.png";
import styles from "../styles/NoLocal.module.css";

const NoLocal = ({ currentUser }) => {
  const [pets, setPets] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedAlimentacaoComments, setSelectedAlimentacaoComments] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

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
            // Busca o documento 'mostRecent' na subcoleção 'controle'
            const mostRecentRef = doc(
              firestore,
              "pets",
              petId,
              "controle",
              "mostRecent"
            );
            const mostRecentDoc = await getDoc(mostRecentRef);
            if (mostRecentDoc.exists()) {
              const latestEntry = mostRecentDoc.data();

              // Busca todos os comentários das subcoleções
              const commentTypes = [
                "comentarioAlimentacao",
                "comentarioVet",
                "comentarioComportamento",
                "comentarioPertences",
                "comentarioObservacoes",
              ];

              const commentsPromises = commentTypes.map((type) =>
                fetchComments(mostRecentRef, type)
              );

              const commentsArrays = await Promise.all(commentsPromises);
              const allComments = commentsArrays.flat();

              // Separar todos os comentários de Alimentação (para o modal)
              const allAlimentacaoComments = allComments.filter(
                (comment) => comment.type === "comentarioAlimentacao"
              );

              // Separar comentários de Alimentação do dia atual (para exibir os ícones)
              const alimentacaoCommentsToday = allAlimentacaoComments.filter(
                (comment) => comment.data === today
              );

              const otherComments = allComments.filter(
                (comment) => comment.type !== "comentarioAlimentacao"
              );

              return {
                ...pet,
                ...latestEntry,
                petId: petId,
                comments: otherComments,
                alimentacaoCommentsToday,
                allAlimentacaoComments, // Inclui todos os comentários de alimentação
              };
            }
          }
          return null; // Exclui pets que não estão em um estado válido
        });

        const petData = (await Promise.all(petDataPromises)).filter(
          (pet) => pet !== null
        );

        // Definir a ordem desejada para 'localAtual'
        const desiredOrder = [
          "Adestramento",
          "Banho",
          "Passeio",
          "Veterinário",
          "Creche",
          "Hotel",
        ];

        // Função para obter o índice da ordem desejada
        const getLocalAtualOrder = (localAtual) => {
          const index = desiredOrder.indexOf(localAtual);
          return index !== -1 ? index : desiredOrder.length;
        };

        // Ordenar os pets
        petData.sort((a, b) => {
          const localOrderA = getLocalAtualOrder(a.localAtual);
          const localOrderB = getLocalAtualOrder(b.localAtual);

          if (localOrderA !== localOrderB) {
            return localOrderA - localOrderB;
          } else {
            // Se o localAtual for o mesmo, ordenar por dataEntrada e horarioEntrada (decrescente)
            const dateComparison = b.dataEntrada.localeCompare(a.dataEntrada);
            if (dateComparison !== 0) return dateComparison;

            return b.horarioEntrada.localeCompare(a.horarioEntrada);
          }
        });

        setPets(petData);
      } catch (error) {
        console.error("Erro ao buscar os pets:", error);
      }
    };

    const fetchComments = async (docRef, subCollection) => {
      const commentsRef = collection(docRef, subCollection);
      const snapshot = await getDocs(commentsRef);
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: subCollection,
        ...doc.data(),
      }));
      // Ordenar os comentários por data e horário (mais recentes primeiro)
      comments.sort((a, b) => {
        const dateA = new Date(`${a.data} ${a.horario}`);
        const dateB = new Date(`${b.data} ${b.horario}`);
        return dateB - dateA;
      });
      return comments;
    };

    fetchPets();
  }, [today]);

  const getFeedingStatusIcon = (feedingStatus) => {
    switch (feedingStatus) {
      case "Não Comeu":
        return naoIcon;
      case "Comeu Parcial":
        return parcialIcon;
      case "Comeu Tudo":
        return simIcon;
      default:
        return null;
    }
  };

  const handleCommentClick = (pet) => {
    setSelectedComments(pet.comments);
    setModalTitle(`Comentários de ${pet.mascotinho}`);
  };

  const handleAlimentacaoClick = (pet) => {
    setSelectedAlimentacaoComments(pet.allAlimentacaoComments); // Agora inclui todos os comentários
    setModalTitle(`Alimentação de ${pet.mascotinho}`);
  };

  const handleCloseModal = () => {
    setSelectedComments([]);
    setSelectedAlimentacaoComments([]);
    setModalTitle("");
  };

  const handlePetClick = (petId) => {
    navigate(`/${petId}`);
  };

  return (
    <Container className={styles.registrosContainer}>
      <h1>Pets No Local</h1>
      <Table
        headers={[
          "Foto",
          "Nome",
          "Local",
          "Data Entrada",
          "Alimentação",
          "Comentários",
        ]}
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
          alimentacao:
            pet.alimentacaoCommentsToday.length > 0 ? (
              <div className={styles.alimentacaoIcons}>
                {pet.alimentacaoCommentsToday
                  .slice()
                  .reverse()
                  .map((comment, index) => (
                    <img
                      key={index}
                      src={getFeedingStatusIcon(comment.feedingStatus)}
                      alt={comment.feedingStatus}
                      className={styles.feedingIcon}
                      onClick={() => handleAlimentacaoClick(pet)}
                    />
                  ))}
              </div>
            ) : null,
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
      {/* Modal para comentários gerais */}
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
      {/* Modal para comentários de alimentação */}
      {selectedAlimentacaoComments.length > 0 && (
        <Modal
          isOpen={selectedAlimentacaoComments.length > 0}
          onClose={handleCloseModal}
          showFooter={false}
          title={modalTitle}
        >
          <Table
            headers={["Data", "Horário", "Usuário", "Refeição", "Status", "Observações"]}
            data={selectedAlimentacaoComments.map((comment) => ({
              data: comment.data,
              horario: comment.horario,
              usuario: comment.usuario,
              refeicao: comment.mealTime,
              status: (
                <img
                  src={getFeedingStatusIcon(comment.feedingStatus)}
                  alt={comment.feedingStatus}
                  className={styles.feedingIcon}
                />
              ),
              observacoes: comment.observations,
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
