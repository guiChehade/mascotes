import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import TextInputModal from "../components/TextInputModal";
import ActionOptions from "../components/ActionOptions";
import logoLarge from '../assets/logo/logo-large.png';
import styles from '../styles/Controle.module.css';

const Controle = ({ currentUser, setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPertenceQuestion, setShowPertenceQuestion] = useState(false);
  const [showPertenceModal, setShowPertenceModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

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

    fetchPetData();
  }, [petId]);

  const handleEntrada = () => {
    setShowServiceModal(true);
  };

  const handleServiceSelection = (service) => {
    if (service === "Creche") {
      setShowServiceModal(false);
      setShowPertenceQuestion(true);
    }
  };

  const handlePertenceSubmit = async (pertences) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // meses começam em 0
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`; // Data no formato YYYYMMDD
    const formattedTime = now.toLocaleTimeString();

    const record = {
      petId,
      data: `${day}/${month}/${year}`, // Data no formato DD/MM/YYYY para exibição
      entradaCreche: formattedTime,
      entradaCrecheUsuario: currentUser.name,
      pertences: pertences || null,
      pertencesUsuario: pertences ? currentUser.name : null,
    };

    await setDoc(doc(firestore, "registros", `${petId}_${formattedDate}`), record, { merge: true });

    alert(`Entrada na Creche registrada com sucesso.\n${pertences ? 'Pertences: ' + pertences : 'Sem pertences.'}`);
    setShowPertenceModal(false);
    setShowPertenceQuestion(false);
    navigate("/mascotes");
  };

  const handleNoPertence = () => {
    handlePertenceSubmit(null);
    setShowPertenceQuestion(false);
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
              <Button onClick={handleEntrada}>Entrada</Button>
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

      {showPertenceQuestion && (
        <ActionOptions
          actionType="O pet possui pertences?"
          options={["Sim", "Não"]}
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
