import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
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
  const [locations, setLocations] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [selectedAlimentacaoComments, setSelectedAlimentacaoComments] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o modal de registro de alimentação
  const [showAlimentacaoRegistrarModal, setShowAlimentacaoRegistrarModal] = useState(false);
  const [mealTimeSelected, setMealTimeSelected] = useState(false);
  const [selectedMealTime, setSelectedMealTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [feedingData, setFeedingData] = useState({});

  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Passo 1: Buscar as localizações com pets (exceto "Casa")
        const locationsRef = collection(firestore, "locations");
        const locationsSnapshot = await getDocs(locationsRef);

        const locationsData = [];
        const petIdsByLocation = {};

        locationsSnapshot.forEach((locationDoc) => {
          const locationData = locationDoc.data();
          if (locationDoc.id !== "Casa" && locationData.petIds && locationData.petIds.length > 0) {
            locationsData.push(locationDoc.id);
            petIdsByLocation[locationDoc.id] = locationData.petIds;
          }
        });

        setLocations(locationsData);

        // Passo 2: Buscar os dados de cada pet com base nos IDs
        const petDataPromises = [];
        for (const location of locationsData) {
          const petIds = petIdsByLocation[location];
          petDataPromises.push(
            ...petIds.map(async (petId) => {
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
                    (comment) => comment.data === today && !comment.apagado
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
                    location: location,
                    comments: otherComments,
                    alimentacaoCommentsToday,
                    allAlimentacaoComments, // Inclui todos os comentários de alimentação
                    feedingRecordsByMealTime, // Alimentação de hoje organizada por mealTime
                  };
                }
              }
              return null; // Exclui pets que não têm as condições corretas
            })
          );
        }

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
      })).filter(comment => !comment.apagado); // Exclui comentários apagados
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
    setMealTimeSelected(false);
    setSelectedLocation("");
    setSelectedComments([]);
    setSelectedAlimentacaoComments([]);
    setModalTitle("");
  };

  const handlePetClick = (petId) => {
    navigate(`/${petId}`);
  };

  const handleAlimentacaoRegistrarClick = () => {
    setSelectedMealTime("");
    setMealTimeSelected(false);
    setFeedingData({});
    setSelectedLocation("");

    setShowAlimentacaoRegistrarModal(true);
  };

  const handleMealTimeSelect = (value) => {
    setSelectedMealTime(value);
    setMealTimeSelected(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleFeedingStatusChange = async (petId, value) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setFeedingData((prevData) => ({
      ...prevData,
      [petId]: {
        ...prevData[petId],
        feedingStatus: value,
        horario: prevData[petId]?.horario || currentTime,
      },
    }));

    // Salva imediatamente no Firestore
    await saveFeedingData(petId, value, feedingData[petId]?.observations || "", feedingData[petId]?.horario || currentTime);
  };

  const handleObservationChange = async (petId, value) => {
    setFeedingData((prevData) => ({
      ...prevData,
      [petId]: {
        ...prevData[petId],
        observations: value,
      },
    }));

    // Se já houver um status de alimentação selecionado, salva imediatamente
    if (feedingData[petId]?.feedingStatus) {
      await saveFeedingData(petId, feedingData[petId].feedingStatus, value, feedingData[petId]?.horario || "");
    }
  };

  const handleTimeChange = async (petId, value) => {
    setFeedingData((prevData) => ({
      ...prevData,
      [petId]: {
        ...prevData[petId],
        horario: value,
      },
    }));

    // Se já houver um status de alimentação selecionado, salva imediatamente
    if (feedingData[petId]?.feedingStatus) {
      await saveFeedingData(petId, feedingData[petId].feedingStatus, feedingData[petId]?.observations || "", value);
    }
  };

  const saveFeedingData = async (petId, feedingStatus, observations, horario) => {
    // Verifica se o horário da refeição foi selecionado
    if (!selectedMealTime) {
      alert("Por favor, selecione o horário da refeição.");
      return;
    }

    // Prepara os dados para salvar
    const dataToSave = {
      mealTime: selectedMealTime.trim(),
      feedingStatus: feedingStatus,
      observations: observations || "",
      horario: horario || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: today,
      usuario: currentUser.name,
    };

    const normalizedMealTime = selectedMealTime.trim().toLowerCase();

    // Obter a referência para 'mostRecent'
    const mostRecentRef = doc(firestore, "pets", petId, "controle", "mostRecent");
    const alimentacaoRef = collection(mostRecentRef, "comentarioAlimentacao");
  
    // Encontrar o documento existente para o mealTime
    const snapshot = await getDocs(alimentacaoRef);
    const existingDoc = snapshot.docs.find(
      (doc) =>
        doc.data().mealTime.trim().toLowerCase() === normalizedMealTime &&
        doc.data().data === today &&
        !doc.data().apagado
    );
  
    if (existingDoc) {
      // Atualizar o documento existente
      await updateDoc(existingDoc.ref, {
        feedingStatus: dataToSave.feedingStatus,
        observations: dataToSave.observations,
        horario: dataToSave.horario,
        usuario: dataToSave.usuario,
      });
    } else {
      // Criar um novo documento
      const result = await registerComentario(
        petId,
        currentUser,
        "Alimentação",
        dataToSave
      );
  
      if (!result.success) {
        alert("Erro ao registrar alimentação.");
        return;
      }
    }
  
    // Atualiza feedingData para refletir a nova alimentação
    setFeedingData((prevData) => ({
      ...prevData,
      [petId]: {
        ...prevData[petId],
        isSaved: true,
        feedingStatus: dataToSave.feedingStatus,
        observations: dataToSave.observations,
        horario: dataToSave.horario,
      },
    }));
  
    // Atualiza a lista de pets localmente sem recarregar a página
    setPets((prevPets) =>
      prevPets.map((pet) => {
        if (pet.petId === petId) {
          // Atualiza os comentários de alimentação de hoje
          let updatedAlimentacaoCommentsToday = pet.alimentacaoCommentsToday.map((comment) => {
            if (comment.mealTime.trim().toLowerCase() === selectedMealTime.trim().toLowerCase()) {
              return {
                ...comment,
                feedingStatus: dataToSave.feedingStatus,
                observations: dataToSave.observations,
                horario: dataToSave.horario,
                usuario: dataToSave.usuario,
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
              horario: dataToSave.horario,
              usuario: dataToSave.usuario,
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
              horario: dataToSave.horario,
              usuario: dataToSave.usuario,
            },
          };
  
          // Atualiza allAlimentacaoComments
          let updatedAllAlimentacaoComments = pet.allAlimentacaoComments.map((comment) => {
            if (comment.mealTime.trim().toLowerCase() === selectedMealTime.trim().toLowerCase() &&
                comment.data === today &&
                !comment.apagado) {
              return {
                ...comment,
                feedingStatus: dataToSave.feedingStatus,
                observations: dataToSave.observations,
                horario: dataToSave.horario,
                usuario: dataToSave.usuario,
              };
            }
            return comment;
          });
  
          // Se não existir um comentário para o horário selecionado, adiciona um novo
          if (!updatedAllAlimentacaoComments.some(
            (comment) => comment.mealTime.trim().toLowerCase() === selectedMealTime.trim().toLowerCase() && comment.data === today && !comment.apagado
          )) {
            updatedAllAlimentacaoComments.push({
              mealTime: dataToSave.mealTime,
              feedingStatus: dataToSave.feedingStatus,
              observations: dataToSave.observations,
              data: today,
              horario: dataToSave.horario,
              usuario: dataToSave.usuario,
            });
          }
  
          return {
            ...pet,
            alimentacaoCommentsToday: updatedAlimentacaoCommentsToday,
            feedingRecordsByMealTime: updatedFeedingRecordsByMealTime,
            allAlimentacaoComments: updatedAllAlimentacaoComments, // Atualização adicionada
          };
        }
        return pet;
      })
    );
  };

  const handleIconClick = async (petId) => {
    // Atualiza o documento no Firestore para "apagar" o registro
    const mostRecentRef = doc(firestore, "pets", petId, "controle", "mostRecent");
    const alimentacaoRef = collection(mostRecentRef, "comentarioAlimentacao");

    // Encontra o documento correspondente ao horário da refeição
    const snapshot = await getDocs(alimentacaoRef);
    const docToUpdate = snapshot.docs.find(
      (doc) =>
        doc.data().mealTime.trim().toLowerCase() === selectedMealTime.trim().toLowerCase() &&
        doc.data().data === today &&
        !doc.data().apagado
    );

    if (docToUpdate) {
      await updateDoc(docToUpdate.ref, {
        apagado: true,
      });

      // Atualiza o estado localmente
      setFeedingData((prevData) => ({
        ...prevData,
        [petId]: {
          feedingStatus: "",
          observations: "",
          horario: "",
          isSaved: false,
        },
      }));

      setPets((prevPets) =>
        prevPets.map((pet) => {
          if (pet.petId === petId) {
            // Remove o registro do estado
            const updatedAlimentacaoCommentsToday = pet.alimentacaoCommentsToday.filter(
              (comment) => !(comment.mealTime.trim().toLowerCase() === selectedMealTime.trim().toLowerCase())
            );

            const updatedFeedingRecordsByMealTime = { ...pet.feedingRecordsByMealTime };
            delete updatedFeedingRecordsByMealTime[selectedMealTime.trim().toLowerCase()];

            return {
              ...pet,
              alimentacaoCommentsToday: updatedAlimentacaoCommentsToday,
              feedingRecordsByMealTime: updatedFeedingRecordsByMealTime,
            };
          }
          return pet;
        })
      );
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
            horario: feedingRecord.horario || '',
            isSaved: true,
          };
        } else {
          updatedFeedingData[pet.petId] = {
            feedingStatus: '',
            observations: '',
            horario: '',
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

  // Filtra os pets pela localização selecionada
  const petsInSelectedLocation = pets.filter(
    (pet) => pet.location === selectedLocation
  );

  return (
    <Container className={styles.registrosContainer}>
      <div className={styles.header}>
        <h1>Pets No Local</h1>
        <Button
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
        </Button>
      </div>
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
          <div className={styles.modalContent}> {/* Envolvimento adicionado */}
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
          </div>
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
          <div className={styles.modalContent}> {/* Envolvimento adicionado */}
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
          </div>
        </Modal>
      )}
      {/* Modal para registrar alimentação */}
      {showAlimentacaoRegistrarModal && (
        <Modal
          isOpen={showAlimentacaoRegistrarModal}
          onClose={handleCloseModal}
          showFooter={false}
          title="Alimentação"
          className={`${styles.modalAppear}`}
        >
          <div className={styles.modalContent}>
            {/* Seleção de horário da refeição */}
            <div className={styles.mealTimeSelection}>
              <div className={styles.mealTimeRadio}>
                <input
                  type="radio"
                  id="manha"
                  name="mealTime"
                  value="Café da manhã"
                  checked={selectedMealTime === "Café da manhã"}
                  onChange={(e) => handleMealTimeSelect(e.target.value)}
                />
                <label htmlFor="manha">Manhã</label>
              </div>
              <div className={styles.mealTimeRadio}>
                <input
                  type="radio"
                  id="tarde"
                  name="mealTime"
                  value="Almoço"
                  checked={selectedMealTime === "Almoço"}
                  onChange={(e) => handleMealTimeSelect(e.target.value)}
                />
                <label htmlFor="tarde">Tarde</label>
              </div>
              <div className={styles.mealTimeRadio}>
                <input
                  type="radio"
                  id="noite"
                  name="mealTime"
                  value="Janta"
                  checked={selectedMealTime === "Janta"}
                  onChange={(e) => handleMealTimeSelect(e.target.value)}
                />
                <label htmlFor="noite">Noite</label>
              </div>
            </div>
            {/* Exibe as localizações após a seleção do horário */}
            {mealTimeSelected && (
              <div className={styles.locationTabs}>
                {locations.map((location) => (
                  <div
                    key={location}
                    className={`${styles.locationTab} ${
                      selectedLocation === location ? styles.activeLocationTab : ""
                    }`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location}
                  </div>
                ))}
              </div>
            )}
            {/* Exibe os pets após a seleção da localização */}
            {selectedLocation && (
              <div className={styles.petsContainer}>
                {petsInSelectedLocation.map((pet) => (
                  <div key={pet.petId} className={styles.petFeedingItem}>
                    <span>{pet.mascotinho}</span>
                    {feedingData[pet.petId]?.isSaved ? (
                      <>
                        {/* Exibe o ícone correspondente ao status de alimentação */}
                        <div
                          className={styles.feedingStatusDisplay}
                          onClick={() => handleIconClick(pet.petId)}
                        >
                          <img
                            src={getFeedingStatusIcon(feedingData[pet.petId].feedingStatus)}
                            alt={feedingData[pet.petId].feedingStatus}
                            className={styles.feedingIcon}
                          />
                        </div>
                        {/* Campo de horário */}
                        <Input
                          type="time"
                          value={feedingData[pet.petId].horario}
                          onChange={(e) => handleTimeChange(pet.petId, e.target.value)}
                          className={styles.timeInput}
                          containerClassName={styles.timeInputContainer}
                          disabled={!feedingData[pet.petId]?.isSaved}
                          placeholder="hh:mm"
                        />
                        {/* Campo de observação */}
                        <Input
                          type="text"
                          placeholder="Observação"
                          value={feedingData[pet.petId].observations}
                          onChange={(e) => handleObservationChange(pet.petId, e.target.value)}
                          className={styles.observationInput}
                          containerClassName={styles.observationInputContainer}
                          disabled={!feedingData[pet.petId]?.isSaved}
                        />
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
                        {/* Campo de horário e observação desabilitados */}
                        <Input
                          type="time"
                          placeholder="hh:mm"
                          value={feedingData[pet.petId]?.horario || ""}
                          onChange={(e) => handleTimeChange(pet.petId, e.target.value)}
                          className={styles.timeInput}
                          containerClassName={styles.timeInputContainer}
                          disabled
                        />
                        <Input
                          type="text"
                          placeholder="Observação"
                          value={feedingData[pet.petId]?.observations || ""}
                          onChange={(e) => handleObservationChange(pet.petId, e.target.value)}
                          className={styles.observationInput}
                          containerClassName={styles.observationInputContainer}
                          disabled
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
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
