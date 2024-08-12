import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc, collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import ActionOptions from "../components/ActionOptions";
import logoLarge from '../assets/logo/logo-large.png';
import styles from '../styles/Controle.module.css';

const Controle = ({ currentUser, setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [comentario, setComentario] = useState('');
  const [registros, setRegistros] = useState([]);
  const [showPertenceInput, setShowPertenceInput] = useState(false);

  const fetchRegistros = async () => {
    if (petId) {
      try {
        const registrosRef = collection(firestore, `pets/${petId}/registros`);
        const q = query(registrosRef, orderBy('data', 'desc'), orderBy('hora', 'desc'));
        const querySnapshot = await getDocs(q);
        const registrosList = querySnapshot.docs.map(doc => doc.data());
        setRegistros(registrosList);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    }
  };

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

    const fetchRegistros = async () => {
      if (petId) {
        try {
          const registrosRef = collection(firestore, `pets/${petId}/registros`);
          const q = query(registrosRef, orderBy('data', 'desc'), orderBy('hora', 'desc'));
          const querySnapshot = await getDocs(q);
          const registrosList = querySnapshot.docs.map(doc => doc.data());
          setRegistros(registrosList);
        } catch (error) {
          console.error("Erro ao buscar registros:", error);
        }
      }
    };

    fetchPetData();
    fetchRegistros(); // Chamando fetchRegistros no useEffect
  }, [petId]);

  const handleActionSelection = (actionType) => {
    if (actionType === 'entrada') {
      setCurrentAction(actionType);
      setSelectedOption(null);
      setShowPertenceInput(true);
    } else {
      setCurrentAction(actionType);
    }
  };

  const handleOptionSelection = async (option) => {
    if (currentAction === "entrada" || currentAction === "saida") {
      const now = new Date();
      const record = {
        tipo: currentAction,
        opcao: option,
        data: now.toLocaleDateString(),
        hora: now.toLocaleTimeString(),
        usuario: currentUser.name,
      };

      await setDoc(doc(firestore, `pets/${petId}/registros`, now.getTime().toString()), record);
      fetchRegistros(); // Atualiza os registros após nova entrada/saída

      if (currentAction === "entrada" && option !== "pertence") {
        setShowPertenceInput(true);
      } else {
        setCurrentAction(null);
      }
    } else if (currentAction === "comentario") {
      setSelectedOption(option);
    }
  };

  const handleComentarioSubmit = async (comentario) => {
    const now = new Date();
    const record = {
      tipo: selectedOption || "pertence",
      comentario,
      data: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
      usuario: currentUser.name,
    };

    await setDoc(doc(firestore, `pets/${petId}/registros`, now.getTime().toString()), record);
    setSelectedOption(null);
    setCurrentAction(null);
    setShowPertenceInput(false);
    fetchRegistros(); // Atualiza os registros após novo comentário
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
  }

  const checkLastEntryForPertences = async () => {
    const q = query(collection(firestore, `pets/${petId}/registros`), orderBy('data', 'desc'), orderBy('hora', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const lastRecord = querySnapshot.docs[0].data();
      if (lastRecord.tipo === 'entrada' && lastRecord.comentario) {
        return lastRecord.comentario;
      }
    }
    return null;
  };

  const handleSaida = async () => {
    const pertenceInfo = await checkLastEntryForPertences();

    if (pertenceInfo) {
      alert(`O pet tem o(s) seguinte(s) pertence(s): ${pertenceInfo}`);
    } else {
      alert('O pet não tem pertences registrados.');
    }

    handleActionSelection('saida');
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
              <>
                {!currentAction && !selectedOption && !showPertenceInput ? (
                  <div className={styles.controleButtons}>
                    <Button onClick={() => handleActionSelection("entrada")}>Entrada</Button>
                    <Button onClick={handleSaida}>Saída</Button>
                    <Button onClick={() => handleActionSelection("comentario")}>Comentário</Button>
                    <Button onClick={handleEditar}>Editar</Button>
                  </div>
                ) : currentAction && !showPertenceInput ? (
                  <ActionOptions
                    actionType={currentAction}
                    onSelectOption={handleOptionSelection}
                    onBack={() => setCurrentAction(null)}
                  />
                ) : (
                  <div className={styles.comentarioContainer}>
                    {showPertenceInput ? (
                      <>
                        <p>O pet tem algum pertence?</p>
                        <Button onClick={() => setShowPertenceInput(false)}>Não</Button>
                        <Button onClick={() => handleOptionSelection("pertence")}>Sim</Button>
                      </>
                    ) : (
                      <>
                        <textarea
                          placeholder="Digite seu comentário..."
                          onChange={(e) => setComentario(e.target.value)}
                        />
                        <Button onClick={() => handleComentarioSubmit(comentario)}>Enviar</Button>
                        <Button onClick={() => setSelectedOption(null)}>Voltar</Button>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Button onClick={() => setShowLoginModal(true)}>Entrar</Button>
            )}
          <div className={styles.registrosContainer}>
            {registros.map((registro, index) => (
              <div key={index} className={styles.registro}>
                <strong>{registro.data} {registro.hora}</strong>: {registro.tipo} - {registro.opcao}
                {registro.comentario && <div>{registro.comentario}</div>}
                <div><em>Usuário: {registro.usuario}</em></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Carregando...</p>
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
