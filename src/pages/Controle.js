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
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import TextInputModal from "../components/TextInputModal";
import ActionOptions from "../components/ActionOptions";
import ComentarioOptions from "../components/ComentarioOptions";
import logoLarge from '../assets/logo/logo-large.png';
import styles from '../styles/Controle.module.css';

const Controle = ({ currentUser, setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPertenceQuestion, setShowPertenceQuestion] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);
  const [selectedComentarioType, setSelectedComentarioType] = useState(null);

  useEffect(() => {
    const fetchPetData = async () => {
      if (petId) {
        const petDoc = await getDoc(doc(firestore, "pets", petId));
        if (petDoc.exists()) {
          setPet(petDoc.data());
        } else {
          console.error("Pet não encontrado");
        }
      }
    };

    const fetchLastRecord = async () => {
      const controleRef = collection(firestore, "pets", petId, "controle");
      const q = query(controleRef, orderBy("dataEntrada", "asc"), orderBy("horarioEntrada", "asc"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setLastRecord(querySnapshot.docs[0].data());
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
      showPertenceInfo();
    }
  };

  const showPertenceInfo = async () => {
    if (lastRecord) {
      const comentariosRef = collection(firestore, "pets", petId, "controle", lastRecord.dataEntrada, "comentarioPertences");
      const comentariosSnapshot = await getDocs(comentariosRef);
      const comentarios = comentariosSnapshot.docs.map(doc => doc.data().comentario);
      if (comentarios.length > 0) {
        alert(`Pertences registrados na entrada: ${comentarios.join(', ')}`);
      } else {
        alert("Nenhum pertence registrado na entrada.");
      }
    }
    registerSaida();
  };

  const handleComentario = () => {
    setShowComentarioModal(true); // Abre o modal de seleção de comentário
  };

  const handleComentarioSubmit = async (comentario) => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; // Offset de São Paulo em minutos (-3 horas)
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const formattedTime = localTime.toTimeString().split(' ')[0]; // Formato HH:MM:SS
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
      await addDoc(comentariosRef, { comentario, usuario: currentUser.name, horario: formattedTime });
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
    const saoPauloOffset = -3 * 60; // Offset de São Paulo em minutos (-3 horas)
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const formattedTime = localTime.toTimeString().split(' ')[0]; // Formato HH:MM:SS

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
    const formattedTime = localTime.toTimeString().split(' ')[0]; // Formato HH:MM:SS
    const pernoites = calculatePernoites(lastRecord?.dataEntrada, formattedDate);

    const controleRef = doc(firestore, "pets", petId, "controle", lastRecord.dataEntrada);
    await updateDoc(controleRef, {
      dataSaida: formattedDate,
      horarioSaida: formattedTime,
      usuarioSaida: currentUser.name,
      pernoites,
      localAtual: "Casa",
    });

    setPet(prev => ({ ...prev, localAtual: "Casa" }));
    alert("Saída registrada com sucesso.");
    navigate("/registros");
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
    </Container>
  );
};

export default Controle;
