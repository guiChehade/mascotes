import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  limit
} from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import TextInputModal from "../components/TextInputModal";
import ActionOptions from "../components/ActionOptions";
import ComentarioOptions from "../components/ComentarioOptions";
import Modal from "../components/Modal";
import Table from "../components/Table";
import logoLarge from '../assets/logo/logo-large.png';
import styles from '../styles/Controle.module.css';

const Controle = ({ currentUser, setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);
  const [selectedComentarioType, setSelectedComentarioType] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false); // Estado para o modal de comentários
  const [commentsData, setCommentsData] = useState([]); // Estado para os dados dos comentários

  useEffect(() => {
    const fetchPetData = async () => {
      if (petId) {
        const petDoc = await getDoc(doc(firestore, "pets", petId));
        if (petDoc.exists) {
          setPet(petDoc.data());
        } else {
          console.error("Pet não encontrado");
        }
      }
    };

    const fetchLastRecord = async () => {
      if (petId) {
        try {
          const controleRef = collection(firestore, "pets", petId, "controle");
          const q = query(controleRef, orderBy("dataEntrada", "desc"), orderBy("horarioEntrada", "desc"), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const latestRecordDoc = querySnapshot.docs[0];
            setLastRecord({
              id: latestRecordDoc.id,
              ...latestRecordDoc.data()
            });
          } else {
            setLastRecord(null);
          }
        } catch (error) {
          console.error("Erro ao buscar o último registro:", error);
        }
      }
    };

    fetchPetData();
    fetchLastRecord();
  }, [petId]);

  const handleEntrada = () => {
    setSelectedAction("entrada");
    setShowServiceModal(true);
  };

  const handleSaida = () => {
    setSelectedAction("saida");
    setShowServiceModal(true);
  };

  const handleServiceSelection = (service) => {
    setShowServiceModal(false);
    if (selectedAction === "entrada") {
      registerEntrada(service);
    } else if (selectedAction === "saida") {
      showCommentInfo();
    }
  };

  const showCommentInfo = async () => {
    if (lastRecord) {
      const commentTypes = ["comentarioPertences", "comentarioVet", "comentarioComportamento", "comentarioObservacoes", "comentarioAlimentacao"];
      let comments = [];

      for (let type of commentTypes) {
        const comentariosRef = collection(firestore, "pets", petId, "controle", lastRecord.id, type);
        const comentariosSnapshot = await getDocs(comentariosRef);
        const comentarios = comentariosSnapshot.docs.map(doc => ({ tipo: type.replace("comentario", ""), ...doc.data() }));
        comments = [...comments, ...comentarios];
      }

      if (comments.length > 0) {
        setCommentsData(comments);
        setShowCommentsModal(true); // Exibe o modal de comentários
      } else {
        registerSaida(); // Se não houver comentários, registrar a saída diretamente
      }
    }
  };

  const handleComentario = () => {
    setShowComentarioModal(true); // Abre o modal de seleção de comentário
  };

  const handleComentarioSubmit = async (comentario) => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; // Offset de São Paulo em minutos (-3 horas)
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const formattedTime = now.toTimeString().split(' ')[0]; // Formato HH:MM:SS
    let subCollectionPath;

    switch (selectedComentarioType) {
      case "Pertences":
        subCollectionPath = "comentarioPertences";
        break;
      case "Veterinário":
        subCollectionPath = "comentarioVet";
        break;
      case "Comportamento":
        subCollectionPath = "comentarioComportamento";
        break;
      case "Observações":
        subCollectionPath = "comentarioObservacoes";
        break;
      case "Alimentação":
        subCollectionPath = "comentarioAlimentacao";
        break;
      default:
        return;
    }

    try {
      const comentariosRef = collection(firestore, "pets", petId, "controle", formattedDate, subCollectionPath);
      await addDoc(comentariosRef, { comentario, usuario: currentUser.name, horario: formattedTime });
      alert(`${selectedComentarioType} registrado: ${comentario}`);
      setShowComentarioModal(false);
      setSelectedComentarioType(null);
    } catch (error) {
      console.error(`Erro ao adicionar ${selectedComentarioType.toLowerCase()}:`, error);
    }
  };

  const registerEntrada = async (service) => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; // Offset de São Paulo em minutos (-3 horas)
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const formattedTime = now.toTimeString().split(' ')[0]; // Formato HH:MM:SS

    const controleRef = collection(firestore, "pets", petId, "controle");

    const newRecord = {
      servico: service,
      dataEntrada: formattedDate,
      horarioEntrada: formattedTime,
      usuarioEntrada: currentUser.name,
    };

    try {
      await setDoc(doc(controleRef, formattedDate), newRecord, { merge: true });
      setPet((prev) => ({ ...prev, localAtual: service })); // Atualiza o localAtual no pet
      await updateDoc(doc(firestore, "pets", petId), { localAtual: service }); // Salva no Firestore
    } catch (error) {
      console.error("Erro ao registrar entrada:", error);
    }
  };

  const registerSaida = async () => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; // Offset de São Paulo em minutos (-3 horas)
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const formattedTime = now.toTimeString().split(' ')[0]; // Formato HH:MM:SS
    const pernoites = calculatePernoites(lastRecord?.dataEntrada, formattedDate);

    if (lastRecord && lastRecord.id) {
      const controleRef = doc(firestore, "pets", petId, "controle", lastRecord.id);
      await updateDoc(controleRef, {
        dataSaida: formattedDate,
        horarioSaida: formattedTime,
        usuarioSaida: currentUser.name,
        pernoites,
      });

      const petsRef = doc(firestore, "pets", petId);
      await updateDoc(petsRef, {
        localAtual: "Casa"
      });

      setPet(prev => ({ ...prev, localAtual: "Casa" }));
      alert("Saída registrada com sucesso.");
      navigate("/registros");
    } else {
      console.error("Erro: Não foi possível encontrar o registro mais recente para atualizar.");
    }
  };

  const calculatePernoites = (entradaData, saidaData) => {
    if (!entradaData) return 0;

    const entrada = new Date(entradaData);
    const saida = new Date(saidaData);
    const diffTime = Math.abs(saida - entrada);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleLoginSuccess = async (user) => {
    try {
      setIsAuthenticated(true);
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserRoles(userData);
        setCurrentUser(userData);
      }
      setShowLoginModal(false);
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      setShowLoginModal(false);
    }
  };

  const handleEditar = () => {
    navigate(`/editar/${petId}`);
  };

  return (
    <Container className={styles.controleContainer}>
      {pet ? (
        <div className={styles.card}>
          <div className={styles.petName}>{pet.mascotinho}</div>
          <img
            className={styles.petPhoto}
            src={pet.foto || logoLarge}
            alt={pet.mascotinho}
            style={pet.foto ? {} : { filter: 'grayscale(100%)' }}
          />
          <div className={styles.label}>Tutor</div>
          <div className={styles.value}>{pet.tutor}</div>
          <div className={styles.label}>Contato</div>
          <div className={styles.value}>{pet.celularTutor}</div>
          {currentUser && (currentUser.role === 'isEmployee' || currentUser.role === 'isAdmin' || currentUser.role === 'isOwner') ? (
            <div className={styles.controleButtons}>
              {pet.localAtual === "Casa" || pet.localAtual === "Inativo" || pet.localAtual === undefined || pet.localAtual === null ?  (
                <>
                  <Button onClick={handleEntrada}>Entrada</Button>
                  <Button onClick={handleEditar}>Editar</Button>
                </>
              ) : (
                <>
                <Button onClick={handleSaida}>Saída</Button>
                <Button onClick={handleComentario}>Comentário</Button>
                </>
              )}
            </div>
          ) : (
            <Button onClick={() => setShowLoginModal(true)}>Login</Button>
          )}
        </div>
      ) : (
        <p>Esta página exige acesso, verifique se você fez login, aguarde seu nome aparecer e recarregue a página.</p>
      )}

      {showServiceModal && (
        <ActionOptions
          actionType="Selecione o Serviço"
          options={["Creche", "Hotel", "Adestramento"]}
          onSelectOption={handleServiceSelection}
          onBack={() => setShowServiceModal(false)}
        />
      )}

      {showComentarioModal && (
        <ComentarioOptions
          onSelectOption={(type) => setSelectedComentarioType(type)}
          onBack={() => setShowComentarioModal(false)}
        />
      )}

      {selectedComentarioType && (
        <TextInputModal
          placeholder={`Adicione um comentário para ${selectedComentarioType}...`}
          onSubmit={(text) => handleComentarioSubmit(text)}
          onClose={() => setSelectedComentarioType(null)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showCommentsModal && (
        <Modal isOpen={showCommentsModal} onClose={() => setShowCommentsModal(false)} title="Comentários Registrados">
          <Table 
            headers={['Tipo', 'Comentário', 'Usuário', 'Horário']}
            data={commentsData.map(comment => ({
              tipo: comment.tipo,
              comentario: comment.comentario,
              usuario: comment.usuario,
              horario: comment.horario
            }))}
          />
          <Button onClick={registerSaida}>Registrar Saída</Button>
        </Modal>
      )}
    </Container>
  );
};

export default Controle;
