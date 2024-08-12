import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

  const handleActionSelection = (actionType) => {
    setCurrentAction(actionType);
  };

  const handleOptionSelection = async (option) => {
    if (currentAction === "entrada" || currentAction === "saida") {
      // Registrar entrada/saída
      const now = new Date();
      const record = {
        tipo: option,
        data: now.toLocaleDateString(),
        hora: now.toLocaleTimeString(),
        usuario: currentUser.name,
      };

      await setDoc(doc(firestore, `pets/${petId}/registros`, now.getTime().toString()), record);
    }

    if (currentAction === "comentario") {
      setSelectedOption(option);
    } else {
      setCurrentAction(null);
    }
  };

  const handleComentarioSubmit = async (comentario) => {
    const now = new Date();
    const record = {
      tipo: selectedOption,
      comentario,
      data: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
      usuario: currentUser.name,
    };

    await setDoc(doc(firestore, `pets/${petId}/comentarios`, now.getTime().toString()), record);
    setSelectedOption(null);
    setCurrentAction(null);
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
                {!currentAction && !selectedOption ? (
                  <div className={styles.controleButtons}>
                    <Button onClick={() => handleActionSelection("entrada")}>Entrada</Button>
                    <Button onClick={() => handleActionSelection("saida")}>Saída</Button>
                    <Button onClick={() => handleActionSelection("comentario")}>Comentário</Button>
                    <Button onClick={handleEditar}>Editar</Button>
                  </div>
                ) : currentAction ? (
                  <ActionOptions
                    actionType={currentAction}
                    onSelectOption={handleOptionSelection}
                    onBack={() => setCurrentAction(null)}
                  />
                ) : (
                  <div className={styles.comentarioContainer}>
                    <textarea
                      placeholder="Digite seu comentário..."
                      onChange={(e) => setComentario(e.target.value)}
                    />
                    <Button onClick={() => handleComentarioSubmit(comentario)}>Enviar</Button>
                    <Button onClick={() => setSelectedOption(null)}>Voltar</Button>
                  </div>
                )}
              </>
            ) : (
              <Button onClick={() => setShowLoginModal(true)}>Entrar</Button>
            )}
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
