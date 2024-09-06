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
} from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import TextInputModal from "../components/TextInputModal";
import ActionOptions from "../components/ActionOptions";
import ComentarioOptions from "../components/ComentarioOptions"; // Novo componente
import logoLarge from '../assets/logo/logo-large.png';
import styles from '../styles/Controle.module.css';
import { v4 as uuidv4 } from 'uuid';

const Controle = ({ currentUser, setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPertenceQuestion, setShowPertenceQuestion] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false); // Alterado de showPertenceModal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);
  const [selectedComentarioType, setSelectedComentarioType] = useState(null); // Tipo de comentário

  useEffect(() => {
    const fetchPetData = async () => {
      if (petId) {
        try {
          const petDoc = await getDoc(doc(firestore, "pets", petId));
          if (petDoc.exists) {
            setPet(petDoc.data());
          } else {
            console.error("Pet não encontrado");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do pet:", error);
        }
      }
    };

    const fetchLastRecord = async () => {
      if (petId) {
        try {
          const controleRef = collection(firestore, "pets", petId, "controle");
          const q = query(controleRef, orderBy("dataEntrada", "desc"));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const latestRecord = querySnapshot.docs[0].data();
            setLastRecord(latestRecord);
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
    if (service === "Creche" || service === "Hotel") {
      setShowServiceModal(false);
      if (selectedAction === "entrada") {
        registerEntrada(service);
        setShowPertenceQuestion(true);
      } else if (selectedAction === "saida") {
        showPertenceInfo();
      }
    }
  };

  const showPertenceInfo = () => {
    if (lastRecord && lastRecord.comentarioPertences) {
      alert(`Pertences registrados na entrada: ${lastRecord.comentarioPertences.join(', ')}`);
    } else {
      alert("Nenhum pertence registrado na entrada.");
    }
    registerSaida();
  };

  const handleComentario = () => {
    setShowComentarioModal(true); // Abre o modal de seleção de comentário
  };

  const handleComentarioSubmit = async (comentario) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
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
      default:
        return;
    }

    try {
      const comentariosRef = collection(firestore, "pets", petId, "controle", formattedDate, subCollectionPath);
      await addDoc(comentariosRef, { comentario, usuario: currentUser.name });
      alert(`${selectedComentarioType} registrado: ${comentario}`);
      setShowComentarioModal(false);
      setSelectedComentarioType(null); // Reseta o tipo de comentário
    } catch (error) {
      console.error(`Erro ao adicionar ${selectedComentarioType.toLowerCase()}:`, error);
    }
  };

  const handleNoPertence = () => {
    handleComentarioSubmit(null);
    setShowPertenceQuestion(false);
  };

  const registerEntrada = async (service) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
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
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(' ')[0]; // Formato HH:MM:SS
    const pernoites = calculatePernoites(lastRecord?.dataEntrada, formattedDate);

    try {
      const controleRef = doc(firestore, "pets", petId, "controle", lastRecord.dataEntrada);
      await updateDoc(controleRef, {
        dataSaida: formattedDate,
        horarioSaida: formattedTime,
        usuarioSaida: currentUser.name,
        pernoites,
      });

      setPet((prev) => ({ ...prev, localAtual: null })); // Remove o localAtual
      await updateDoc(doc(firestore, "pets", petId), { localAtual: null }); // Atualiza no Firestore
      alert(`Saída registrada com sucesso. Pernoites: ${pernoites}`);
      navigate("/mascotes");
    } catch (error) {
      console.error("Erro ao registrar saída:", error);
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
              {pet.localAtual ? (
                <>
                  <Button onClick={handleSaida}>Saída</Button>
                  <Button onClick={handleComentario}>Comentário</Button>
                </>
              ) : (
                <>
                  <Button onClick={handleEntrada}>Entrada</Button>
                  <Button onClick={handleEditar}>Editar</Button>
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
          options={["Creche", "Hotel"]}
          onSelectOption={handleServiceSelection}
          onBack={() => setShowServiceModal(false)}
        />
      )}

      {showPertenceQuestion && selectedAction === "entrada" && (
        <ActionOptions
          actionType="O pet possui pertences?"
          options={["Não", "Sim"]}
          onSelectOption={(option) => {
            if (option === "Sim") {
              setShowComentarioModal(true); // Exibe modal de comentário
            } else {
              handleNoPertence();
            }
            setShowPertenceQuestion(false);
          }}
          onBack={() => setShowPertenceQuestion(false)}
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
    </Container>
  );
};

export default Controle;
