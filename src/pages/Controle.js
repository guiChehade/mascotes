import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc, query, where, collection, getDocs } from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import TextInputModal from "../components/TextInputModal";
import ActionOptions from "../components/ActionOptions";
import logoLarge from '../assets/logo/logo-large.png';
import styles from '../styles/Controle.module.css';
import { v4 as uuidv4 } from 'uuid';

const Controle = ({ currentUser, setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPertenceQuestion, setShowPertenceQuestion] = useState(false);
  const [showPertenceModal, setShowPertenceModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); // Para diferenciar entre entrada e saída
  const [lastRecord, setLastRecord] = useState(null); // Armazena o último registro de entrada

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
          const q = query(collection(firestore, "registros"), where("petId", "==", petId), where("local", "==", "Creche"));
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
    if (service === "Creche") {
      setShowServiceModal(false);
      if (selectedAction === "entrada") {
        setShowPertenceQuestion(true);
      } else if (selectedAction === "saida") {
        showPertenceInfo();
      }
    }
  };

  const showPertenceInfo = () => {
    if (lastRecord && lastRecord.pertences) {
      alert(`Pertences registrados na entrada: ${lastRecord.pertences}`);
    } else {
      alert("Nenhum pertence registrado na entrada.");
    }
    registerSaida();
  };

  const handlePertenceSubmit = async (pertences) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // meses começam em 0
    const day = String(now.getDate()).padStart(2, '0');
    const formattedTime = now.toLocaleTimeString();

    // Gerar um ID único para cada período de permanência
    const recordId = lastRecord ? lastRecord.recordId : uuidv4();

    const record = {
      petId,
      recordId, // ID único para esta estadia
      local: "Creche",
      dataEntrada: `${day}/${month}/${year}`, // Data no formato DD/MM/YYYY para exibição
      entradaCreche: formattedTime,
      entradaCrecheUsuario: currentUser.name,
      pertences: pertences || null,
      pertencesUsuario: pertences ? currentUser.name : null,
    };

    await setDoc(doc(firestore, "registros", recordId), record, { merge: true });

    alert(`Entrada na Creche registrada com sucesso.\n${pertences ? 'Pertences: ' + pertences : 'Sem pertences.'}`);
    setShowPertenceModal(false);
    setShowPertenceQuestion(false);
    navigate("/mascotes");
  };

  const handleNoPertence = () => {
    handlePertenceSubmit(null);
    setShowPertenceQuestion(false);
  };

  const registerSaida = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // meses começam em 0
    const day = String(now.getDate()).padStart(2, '0');
    const formattedTime = now.toLocaleTimeString();

    const diarias = calculateDiarias(lastRecord?.dataEntrada, `${day}/${month}/${year}`);

    const record = {
      saidaData: `${day}/${month}/${year}`,
      saidaCreche: formattedTime,
      saidaCrecheUsuario: currentUser.name,
      diarias,
      local: null, // Pet não está mais na creche
    };

    await setDoc(doc(firestore, "registros", lastRecord.recordId), record, { merge: true });

    alert(`Saída da Creche registrada com sucesso. Diárias: ${diarias}`);
    navigate("/mascotes");
  };

  const calculateDiarias = (entradaData, saidaData) => {
    if (!entradaData) return 0;

    const [entradaDia, entradaMes, entradaAno] = entradaData.split("/");
    const [saidaDia, saidaMes, saidaAno] = saidaData.split("/");

    const entrada = new Date(`${entradaAno}-${entradaMes}-${entradaDia}`);
    const saida = new Date(`${saidaAno}-${saidaMes}-${saidaDia}`);

    const diffTime = Math.abs(saida - entrada);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
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
              {!lastRecord || lastRecord.local !== "Creche" ? (
                <Button onClick={handleEntrada}>Entrada</Button>
              ) : (
                <Button onClick={handleSaida}>Saída</Button>
              )}
              <Button onClick={handleEditar}>Editar</Button>
            </div>
          ) : (
            <Button onClick={() => setShowLoginModal(true)}>Login</Button>
          )}
        </div>
      ) : (
        <p>Carregando...</p>
      )}

      {showServiceModal && (
        <ActionOptions
          actionType="Selecione o Serviço"
          options={["Creche"]}
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
              setShowPertenceModal(true);
            } else {
              handleNoPertence();
            }
            setShowPertenceQuestion(false);
          }}
          onBack={() => setShowPertenceQuestion(false)}
        />
      )}

      {showPertenceModal && (
        <TextInputModal
          placeholder="Descreva os pertences do pet (se houver)..."
          onSubmit={(text) => handlePertenceSubmit(text)}
          onClose={() => setShowPertenceModal(false)}
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
