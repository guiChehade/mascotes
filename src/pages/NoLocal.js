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
import Loading from "../components/Loading";
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Passo 1: Buscar os IDs dos pets em locais específicos na coleção "locations", exceto "Casa"
        const locationsRef = collection(firestore, "locations");
        const locationsSnapshot = await getDocs(locationsRef);

        const petIds = [];
        locationsSnapshot.forEach((locationDoc) => {
          const locationData = locationDoc.data();
          if (locationDoc.id !== "Casa") { // Ignora o documento "Casa"
            petIds.push(...locationData.petIds);
          }
        });

        // Passo 2: Buscar os dados de cada pet com base nos IDs
        const petDataPromises = petIds.map(async (petId) => {
          const petRef = doc(firestore, "pets", petId);
          const petDoc = await getDoc(petRef);

          if (petDoc.exists()) {
            const pet = petDoc.data();

            // Busca o documento 'mostRecent' na subcoleção 'controle'
            const mostRecentRef = doc(firestore, "pets", petId, "controle", "mostRecent");
            const mostRecentDoc = await getDoc(mostRecentRef);

            if (mostRecentDoc.exists()) {
              const latestEntry = mostRecentDoc.data();

              // Buscar todos os comentários das subcoleções
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
          return null; // Exclui pets que não têm as condições corretas
        });

        const petData = (await Promise.all(petDataPromises)).filter(
          (pet) => pet !== null
        );

        // Ordenar os pets
        petData.sort((a, b) => {
          const localOrderA = getLocalAtualOrder(a.localAtual);
          const localOrderB = getLocalAtualOrder(b.localAtual);

          if (localOrderA !== localOrderB) {
            return localOrderA - localOrderB;
          } else {
            const dateComparison = b.dataEntrada.localeCompare(a.dataEntrada);
            if (dateComparison !== 0) return dateComparison;

            return b.horarioEntrada.localeCompare(a.horarioEntrada);
          }
        });

        setPets(petData);
        setIsLoading(false); // Finaliza o estado de carregamento
      } catch (error) {
        console.error("Erro ao buscar os pets:", error);
        setIsLoading(false); // Finaliza o estado de carregamento mesmo em caso de erro
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
      comments.sort((a, b) => {
        const dateA = new Date(`${a.data} ${a.horario}`);
        const dateB = new Date(`${b.data} ${b.horario}`);
        return dateB - dateA;
      });
      return comments;
    };

    fetchPets();
  }, [today]);

  const getLocalAtualOrder = (localAtual) => {
    // Define the order of locations as needed
    const order = {
      "Adestramento": 1,
      "Banho": 2,
      "Passeio": 3,
      "Veterinário": 4,
      "Creche": 5,
      "Hotel": 6,
    };
    return order[localAtual] || 999; // Default to 999 if location is not found
  };

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
    setSelectedAlimentacaoComments(pet.allAlimentacaoComments);
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

  // Exibe o componente de carregamento enquanto os dados estão sendo carregados
  if (isLoading) {
    return <Loading />;
  }

  // Renderiza o Container e a Tabela somente após o carregamento dos pets
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
