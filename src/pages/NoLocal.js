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
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
import iconInfo from "../assets/icons/informacao.png";
import naoIcon from "../assets/icons/nao.png";
import parcialIcon from "../assets/icons/parcial.png";
import simIcon from "../assets/icons/sim.png";
import alimentacaoIcon from "../assets/icons/alimentacao.svg";
import styles from "../styles/NoLocal.module.css";

// Importando a função registerComentario
import { registerComentario } from "../utils/petActions";

const NoLocal = ({ currentUser }) => {
  const [pets, setPets] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedAlimentacaoComments, setSelectedAlimentacaoComments] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Estado para o modal de registro de alimentação
  const [showAlimentacaoRegistrarModal, setShowAlimentacaoRegistrarModal] = useState(false);
  const [selectedMealTime, setSelectedMealTime] = useState("");
  const [feedingData, setFeedingData] = useState({});

  // Novos estados para controlar o loading durante o refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        if (isRefreshing) {
          // Opcional: mostrar um indicador de refresh
        }

        // Passo 1: Buscar os IDs dos pets em locais específicos na coleção "locations", exceto "Casa"
        const locationsRef = collection(firestore, "locations");
        const locationsSnapshot = await getDocs(locationsRef);

        const petIds = [];
        locationsSnapshot.forEach((locationDoc) => {
          const locationData = locationDoc.data();
          if (locationDoc.id !== "Casa") { // Ignora o documento "Casa"
            petIds.push(...(locationData.petIds || []));
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

              // Organizar os comentários de alimentação de hoje por mealTime
              const feedingRecordsByMealTime = {};
              alimentacaoCommentsToday.forEach((comment) => {
                const mealTime = comment.mealTime.trim().toLowerCase();
                feedingRecordsByMealTime[mealTime] = comment;
              });

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
                feedingRecordsByMealTime, // Alimentação de hoje organizada por mealTime
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
  }, [today, isRefreshing]);

  const getLocalAtualOrder = (localAtual) => {
    // Define a ordem dos locais conforme necessário
    const order = {
      "Adestramento": 1,
      "Banho": 2,
      "Passeio": 3,
      "Veterinário": 4,
      "Creche": 5,
      "Hotel": 6,
    };
    return order[localAtual] || 999; // Valor padrão se o local não for encontrado
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
    setShowAlimentacaoRegistrarModal(false);
    setSelectedComments([]);
    setSelectedAlimentacaoComments([]);
    setModalTitle("");
  };

  const handlePetClick = (petId) => {
    navigate(`/${petId}`);
  };

  const handleAlimentacaoRegistrarClick = () => {
    setSelectedMealTime("");
    setFeedingData({});
    // Atraso de 0.3s antes de mostrar o modal
    setTimeout(() => {
      setShowAlimentacaoRegistrarModal(true);
    }, 100);
  };

  const handleFeedingStatusChange = (petId, value) => {
    setFeedingData((prevData) => ({
      ...prevData,
      [petId]: {
        ...prevData[petId],
        feedingStatus: value,
      },
    }));
  };

  const handleObservationChange = (petId, value) => {
    setFeedingData((prevData) => ({
      ...prevData,
      [petId]: {
        ...prevData[petId],
        observations: value,
      },
    }));
  };

  const handleSaveFeeding = async (petId) => {
    const petFeedingData = feedingData[petId];
    // Verifica se o horário da refeição foi selecionado
    if (!selectedMealTime) {
      alert("Por favor, selecione o horário da refeição.");
      return;
    }

    // Verifica se o status de alimentação foi selecionado
    if (!petFeedingData || !petFeedingData.feedingStatus) {
      alert("Por favor, selecione o status de alimentação.");
      return;
    }

    // Prepara os dados para salvar
    const dataToSave = {
      mealTime: selectedMealTime.trim(),
      feedingStatus: petFeedingData.feedingStatus,
      observations: petFeedingData.observations || "",
    };

    // Usa a função registerComentario existente
    const result = await registerComentario(
      petId,
      currentUser,
      "Alimentação",
      dataToSave
    );

    if (result.success) {
      // Atualiza feedingData para refletir a nova alimentação
      setFeedingData((prevData) => ({
        ...prevData,
        [petId]: {
          ...prevData[petId],
          isSaved: true,
          feedingStatus: dataToSave.feedingStatus,
          observations: dataToSave.observations,
        },
      }));

      // Atualiza a lista de pets localmente sem recarregar a página
      setPets((prevPets) =>
        prevPets.map((pet) => {
          if (pet.petId === petId) {
            // Atualiza os comentários de alimentação de hoje
            const updatedAlimentacaoCommentsToday = pet.alimentacaoCommentsToday.map((comment) => {
              if (comment.mealTime.trim().toLowerCase() === selectedMealTime.trim().toLowerCase()) {
                return {
                  ...comment,
                  feedingStatus: dataToSave.feedingStatus,
                  observations: dataToSave.observations,
                };
              }
              return comment;
            });

            // Se não existir um comentário para o horário selecionado, adiciona um novo
            if (!updatedAlimentacaoCommentsToday.some(
              (comment) => comment.mealTime.trim().toLowerCase() === selectedMealTime.trim().toLowerCase()
            )) {
              updatedAlimentacaoCommentsToday.push({
                mealTime: dataToSave.mealTime,
                feedingStatus: dataToSave.feedingStatus,
                observations: dataToSave.observations,
                data: today,
                horario: new Date().toLocaleTimeString(),
              });
            }

            // Atualiza feedingRecordsByMealTime
            const updatedFeedingRecordsByMealTime = {
              ...pet.feedingRecordsByMealTime,
              [selectedMealTime.trim().toLowerCase()]: {
                mealTime: dataToSave.mealTime,
                feedingStatus: dataToSave.feedingStatus,
                observations: dataToSave.observations,
                data: today,
                horario: new Date().toLocaleTimeString(),
              },
            };

            return {
              ...pet,
              alimentacaoCommentsToday: updatedAlimentacaoCommentsToday,
              feedingRecordsByMealTime: updatedFeedingRecordsByMealTime,
            };
          }
          return pet;
        })
      );

      // Opcional: mostrar uma mensagem de sucesso
      alert("Alimentação registrada com sucesso.");
    } else {
      alert("Erro ao registrar alimentação.");
    }
  };

  useEffect(() => {
    if (selectedMealTime) {
      const normalizedMealTime = selectedMealTime.trim().toLowerCase();
      const updatedFeedingData = {};
      pets.forEach((pet) => {
        const feedingRecord = pet.feedingRecordsByMealTime
          ? pet.feedingRecordsByMealTime[normalizedMealTime]
          : null;

        if (feedingRecord) {
          updatedFeedingData[pet.petId] = {
            feedingStatus: feedingRecord.feedingStatus,
            observations: feedingRecord.observations || '',
            isSaved: true,
          };
        } else {
          updatedFeedingData[pet.petId] = {
            feedingStatus: '',
            observations: '',
            isSaved: false,
          };
        }
      });
      setFeedingData(updatedFeedingData);
    }
  }, [selectedMealTime, pets]);

  // Exibe o componente de carregamento enquanto os dados estão sendo carregados
  if (isLoading) {
    return <Loading />;
  }

  // Agrupa os pets por localAtual
  const groupedPets = pets.reduce((acc, pet) => {
    const location = pet.localAtual || 'Sem Local';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(pet);
    return acc;
  }, {});

  return (
    <Container className={styles.registrosContainer}>
      <div className={styles.header}>
        <h1>Pets No Local</h1>
        <button
          className={styles.alimentacaoButton}
          onClick={handleAlimentacaoRegistrarClick}
          aria-label="Registrar Alimentação"
        >
          <div className={styles.inner}>
            <img
              src={alimentacaoIcon}
              alt="Registrar Alimentação"
              className={styles.alimentacaoIcon}
            />
          </div>
        </button>
      </div>
      {/* Indicador de atualização */}
      {isRefreshing && (
        <div className={styles.refreshIndicator}>
          <Loading />
          <span>Atualizando dados...</span>
        </div>
      )}
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
          className={`${styles.modalAppear}`} /* Aplica a classe de animação */
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
          className={`${styles.modalAppear}`} /* Aplica a classe de animação */
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
      {/* Modal para registrar alimentação */}
      {showAlimentacaoRegistrarModal && (
        <Modal
          isOpen={showAlimentacaoRegistrarModal}
          onClose={handleCloseModal}
          showFooter={false}
          title="Alimentação"
          className={`${styles.modalAppear}`} /* Aplica a classe de animação */
        >
          <div className={styles.modalContent}>
            {/* Seleção de horário da refeição */}
            <div className={styles.mealTimeSelection}>
              <label className={styles.mealTimeRadio}>
                <input
                  type="radio"
                  name="mealTime"
                  value="Café da manhã"
                  checked={selectedMealTime === "Café da manhã"}
                  onChange={(e) => setSelectedMealTime(e.target.value)}
                />
                Café da manhã
              </label>
              <label className={styles.mealTimeRadio}>
                <input
                  type="radio"
                  name="mealTime"
                  value="Almoço"
                  checked={selectedMealTime === "Almoço"}
                  onChange={(e) => setSelectedMealTime(e.target.value)}
                />
                Almoço
              </label>
              <label className={styles.mealTimeRadio}>
                <input
                  type="radio"
                  name="mealTime"
                  value="Janta"
                  checked={selectedMealTime === "Janta"}
                  onChange={(e) => setSelectedMealTime(e.target.value)}
                />
                Janta
              </label>
            </div>
            {/* Lista de pets agrupados por localAtual */}
            {Object.keys(groupedPets).map((location) => (
              <div key={location}>
                <h2 className={styles.locationTitle}>{location}</h2>
                {groupedPets[location].map((pet) => (
                  <div key={pet.petId} className={styles.petFeedingItem}>
                    <span>{pet.mascotinho}</span>
                    {feedingData[pet.petId]?.isSaved ? (
                      <>
                        {/* Exibe o ícone correspondente ao status de alimentação */}
                        <div className={styles.feedingStatusDisplay}>
                          <img
                            src={getFeedingStatusIcon(feedingData[pet.petId].feedingStatus)}
                            alt={feedingData[pet.petId].feedingStatus}
                            className={styles.feedingIcon}
                          />
                        </div>
                        {/* Exibe observações em um input desabilitado */}
                        <Input
                          type="text"
                          value={feedingData[pet.petId].observations}
                          className={styles.observationInput}
                          containerClassName={styles.observationInputContainer}
                          disabled
                        />
                        {/* Botão desabilitado com texto "Salvo" */}
                        <Button disabled>{'Salvo'}</Button>
                      </>
                    ) : (
                      <>
                        {/* Seleção de status de alimentação */}
                        <div className={styles.feedingStatusSelection}>
                          <label>
                            <input
                              type="radio"
                              name={`feedingStatus-${pet.petId}`}
                              value="Comeu Tudo"
                              checked={feedingData[pet.petId]?.feedingStatus === "Comeu Tudo"}
                              onChange={(e) => handleFeedingStatusChange(pet.petId, e.target.value)}
                              style={{ display: 'none' }}
                            />
                            <img src={simIcon} alt="Sim" />
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`feedingStatus-${pet.petId}`}
                              value="Comeu Parcial"
                              checked={feedingData[pet.petId]?.feedingStatus === "Comeu Parcial"}
                              onChange={(e) => handleFeedingStatusChange(pet.petId, e.target.value)}
                              style={{ display: 'none' }}
                            />
                            <img src={parcialIcon} alt="Parcial" />
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`feedingStatus-${pet.petId}`}
                              value="Não Comeu"
                              checked={feedingData[pet.petId]?.feedingStatus === "Não Comeu"}
                              onChange={(e) => handleFeedingStatusChange(pet.petId, e.target.value)}
                              style={{ display: 'none' }}
                            />
                            <img src={naoIcon} alt="Não" />
                          </label>
                        </div>
                        {/* Campo de observação */}
                        <Input
                          type="text"
                          placeholder="Observação"
                          value={feedingData[pet.petId]?.observations || ""}
                          onChange={(e) => handleObservationChange(pet.petId, e.target.value)}
                          className={styles.observationInput}
                          containerClassName={styles.observationInputContainer}
                        />
                        {/* Botão Salvar */}
                        <Button
                          onClick={() => handleSaveFeeding(pet.petId)}
                        >
                          {'Salvar'}
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
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
