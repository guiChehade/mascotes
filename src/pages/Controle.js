import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import AlimentacaoModal from "../components/AlimentacaoModal";
import TextInputModal from "../components/TextInputModal";
import ActionOptions from "../components/ActionOptions";
import ComentarioOptions from "../components/ComentarioOptions";
import Modal from "../components/Modal";
import Table from "../components/Table";
import logoLarge from "../assets/logo/logo-large.png";
import { staticRoutes } from "../config/staticRoutes";
import styles from "../styles/Controle.module.css";

// Importar funções utilitárias
import { getCommentTypes } from "../utils/petUtils";

// Importar as funções de ações
import {
  registerEntrada,
  registerSaidaServico,
  registerVoltaServico,
  registerComentario,
  registerSaida,
} from "../utils/petActions";

const Controle = ({
    currentUser,
    setIsAuthenticated,
    setUserRoles,
    setCurrentUser,
  }) => {
  const { petId } = useParams();
  const navigate = useNavigate();

  // Estados para armazenar dados do pet e controle
  const [pet, setPet] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);

  // Estados para controlar modais
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [showSaidaModal, setShowSaidaModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showTextInputModal, setShowTextInputModal] = useState(false);
  const [showAlimentacaoModal, setShowAlimentacaoModal] = useState(false);

  // Estados para ações selecionadas
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedComentarioType, setSelectedComentarioType] = useState(null);
  const [commentsData, setCommentsData] = useState([]);

  // Função para buscar dados do pet no Firestore
  const fetchPetData = useCallback(async () => {
    if (petId) {
      if (staticRoutes.includes(petId)) {
        navigate(`/${petId}`);
        return;
      }
      const petDoc = await getDoc(doc(firestore, "pets", petId));
      if (petDoc.exists()) {
        setPet(petDoc.data());
      } else {
        navigate("/not-found");
      }
    }
  }, [petId, navigate]);

  // Função para buscar o registro mais recente (mostRecent)
  const fetchLastRecord = useCallback(async () => {
    if (petId) {
      const mostRecentRef = doc(
        firestore,
        "pets",
        petId,
        "controle",
        "mostRecent"
      );
      const mostRecentDoc = await getDoc(mostRecentRef);
      if (mostRecentDoc.exists()) {
        setLastRecord({ id: mostRecentDoc.id, ...mostRecentDoc.data() });
      } else {
        setLastRecord(null);
      }
    }
  }, [petId]);

  // Efeito para buscar dados do pet e último registro
  useEffect(() => {
    const fetchData = async () => {
      await fetchPetData();
      await fetchLastRecord();
    };
    fetchData();
  }, [fetchPetData, fetchLastRecord]);

  // Função para atualizar a página
  const refreshPage = () => {
    fetchPetData();
    fetchLastRecord();
  };

  // Handlers para ações do usuário
  const handleEntrada = () => {
    setSelectedAction("entrada");
    setShowEntradaModal(true);
  };

  const handleSaida = () => {
    setSelectedAction("saida");
    setShowSaidaModal(true);
  };

  const handleVoltaParque = async () => {
    const currentService = pet.localAtual;
    if (
      currentService &&
      currentService !== "Creche" &&
      currentService !== "Hotel"
    ) {
      const result = await registerVoltaServico(petId, currentUser, currentService);
      if (result.success) {
        alert(result.message);
        setPet((prev) => ({ ...prev, localAtual: lastRecord.servico }));
        refreshPage();
      } else {
        alert("Erro ao registrar retorno.");
      }
    } else {
      console.error("Serviço atual não é um serviço externo.");
    }
  };

  const handleVoltaCasa = async () => {
    await showCommentInfo(); // Exibe os comentários existentes
  };

  // Função para registrar a seleção de serviço
  const handleServiceSelection = async (service) => {
    setShowEntradaModal(false);
    setShowSaidaModal(false);

    if (selectedAction === "entrada") {
      const result = await registerEntrada(petId, currentUser, service);
      if (result.success) {
        alert(result.message);
        setPet((prev) => ({ ...prev, localAtual: service }));
        refreshPage();
      } else {
        alert("Erro ao registrar entrada.");
      }
    } else if (selectedAction === "saida") {
      if (service === "Casa") {
        handleVoltaCasa();
      } else {
        const result = await registerSaidaServico(petId, currentUser, service);
        if (result.success) {
          alert(result.message);
          setPet((prev) => ({ ...prev, localAtual: service }));
          refreshPage();
        } else {
          alert("Erro ao registrar saída para serviço.");
        }
      }
    }
  };

  // Função para exibir comentários antes da saída
  const showCommentInfo = async () => {
    if (lastRecord) {
      const commentTypes = getCommentTypes().filter(type => type !== "comentarioAlimentacao");
      let comments = [];

      for (let type of commentTypes) {
        const comentariosRef = collection(
          firestore,
          "pets",
          petId,
          "controle",
          "mostRecent",
          type
        );
        const comentariosSnapshot = await getDocs(comentariosRef);
        const comentarios = comentariosSnapshot.docs.map((doc) => ({
          tipo: type.replace("comentario", ""),
          ...doc.data(),
        }));
        comments = [...comments, ...comentarios];
      }

      if (comments.length > 0) {
        setCommentsData(comments);
      } else {
        setCommentsData([]);
      }
      // Exibe o modal de comentários para confirmação
      setShowCommentsModal(true);
    }
  };

  const handleComentario = () => {
    setShowComentarioModal(true); // Abre o modal para selecionar o tipo de comentário
  };

  // Função para submeter o comentário de Alimentação
  const handleAlimentacaoSubmit = async (data) => {
    const result = await registerComentario(
      petId,
      currentUser,
      selectedComentarioType,
      data
    );
    if (result.success) {
      alert(result.message);
      setSelectedComentarioType(null);
      setShowAlimentacaoModal(false);
      refreshPage();
    } else {
      alert('Erro ao registrar comentário.');
    }
  };

  // Função para submeter um comentário
  const handleComentarioSubmit = async (comentario) => {
    const result = await registerComentario(
      petId,
      currentUser,
      selectedComentarioType,
      comentario
    );
    if (result.success) {
      alert(result.message);
      setShowComentarioModal(false);
      setSelectedComentarioType(null);
      refreshPage();
    } else {
      alert("Erro ao registrar comentário.");
    }
  };

  // Função de sucesso no login
  const handleLoginSuccess = async (user) => {
    try {
      setIsAuthenticated(true);
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRoles(userData);
        setCurrentUser(userData);
      }
      setShowLoginModal(false);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      setShowLoginModal(false);
    }
  };

  // Função para editar o pet
  const handleEditar = () => {
    navigate(`/editar/${petId}`);
  };

  // Renderização do componente
  return (
    <Container className={styles.controleContainer}>
      {pet ? (
        <div className={styles.card}>
          <div className={styles.petName}>{pet.mascotinho}</div>
          <img
            className={styles.petPhoto}
            src={pet.foto || logoLarge}
            alt={pet.mascotinho}
            style={pet.foto ? {} : { filter: "grayscale(100%)" }}
          />
          <div className={styles.label}>Tutor</div>
          <div className={styles.value}>{pet.tutor}</div>
          <div className={styles.label}>Contato</div>
          {/* procurar celularTutor, se não encontrar, procurar celular_tutor */}
          <div className={styles.value}>{pet.celularTutor || pet.celular_tutor}</div>

          {/* Botões de ação baseados no papel do usuário e local atual do pet */}
          {currentUser &&
          (currentUser.role === "isEmployee" ||
            currentUser.role === "isAdmin" ||
            currentUser.role === "isManager" ||
            currentUser.role === "isOwner") ? (
            <div className={styles.controleButtons}>
              {pet.localAtual === "Casa" ||
              pet.localAtual === "Inativo" ||
              pet.localAtual === undefined ||
              pet.localAtual === null ? (
                <>
                  <Button onClick={handleEntrada}>Entrada</Button>
                  <Button onClick={handleComentario}>Comentário</Button>
                  <Button onClick={handleEditar}>Editar</Button>
                </>
              ) : pet.localAtual === "Adestramento" ||
                pet.localAtual === "Passeio" ||
                pet.localAtual === "Banho" ||
                pet.localAtual === "Veterinário" ? (
                <>
                  <Button onClick={handleVoltaParque}>
                    Retorno pro Parque
                  </Button>
                  <Button onClick={handleVoltaCasa}>Saída pra Casa</Button>
                  <Button onClick={handleComentario}>Comentário</Button>
                  <Button onClick={handleEditar}>Editar</Button>
                </>
              ) : (
                <>
                  <Button onClick={handleSaida}>Saída</Button>
                  <Button onClick={handleComentario}>Comentário</Button>
                  <Button onClick={handleEditar}>Editar</Button>
                </>
              )}
            </div>
          ) : (
            <p>
              Se você for tutor ou funcionário, faça login para acessar mais opções.
            </p>
          )}
        </div>
      ) : (
        <p>
          Esta página exige acesso. Verifique se você fez login, aguarde seu nome
          aparecer e recarregue a página.
        </p>
      )}

      {/* Modais para seleção de ações e comentários */}
      {showEntradaModal && (
        <ActionOptions
          actionType="Qual o motivo da Entrada?"
          options={["Creche", "Hotel"]}
          onSelectOption={handleServiceSelection}
          onBack={() => setShowEntradaModal(false)}
        />
      )}

      {showSaidaModal && (
        <ActionOptions
          actionType="Para onde o Pet está saindo?"
          options={["Casa", "Adestramento", "Banho", "Passeio", "Veterinário"]}
          onSelectOption={handleServiceSelection}
          onBack={() => setShowSaidaModal(false)}
        />
      )}

      {showComentarioModal && (
        <ComentarioOptions
          onSelectOption={(type) => {
            setSelectedComentarioType(type);
            setShowComentarioModal(false);
            if (type === 'Alimentação') {
              setShowAlimentacaoModal(true);
            } else {
              setShowTextInputModal(true);
            }
          }}
          onBack={() => setShowComentarioModal(false)}
        />
      )}

      {selectedComentarioType === 'Alimentação' && showAlimentacaoModal && (
        <AlimentacaoModal
          onSubmit={handleAlimentacaoSubmit}
          onClose={() => {
            setSelectedComentarioType(null);
            setShowAlimentacaoModal(false);
          }}
        />
      )}

      {selectedComentarioType && showTextInputModal && (
        <TextInputModal
          placeholder={`Adicione um comentário para ${selectedComentarioType}...`}
          onSubmit={(text) => handleComentarioSubmit(text)}
          onClose={() => {
            setSelectedComentarioType(null);
            setShowTextInputModal(false);
          }}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Modal para exibir comentários antes da saída */}
      {showCommentsModal && (
        <Modal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          showFooter={true}
          title="Comentários Registrados"
          onConfirm={async () => {
            const result = await registerSaida(petId, currentUser); // Usando a função de petActions
            if (result.success) {
              alert(result.message);
              navigate("/no-local");
            } else {
              alert("Erro ao registrar saída.");
            }
            setShowCommentsModal(false); // Fecha o modal após a confirmação
          }}
        >
          {commentsData.length > 0 ? (
            <Table
              headers={["Tipo", "Comentário", "Usuário", "Horário"]}
              data={commentsData.map((comment) => ({
                tipo: comment.tipo,
                comentario: comment.comentario,
                usuario: comment.usuario,
                horario: comment.horario,
              }))}
            />
          ) : (
            <p>Não há comentários registrados.</p>
          )}
        </Modal>
      )}
    </Container>
  );
};

export default Controle;
