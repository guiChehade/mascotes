import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc, getDocs, query, collection, orderBy, limit } from "firebase/firestore";
import Container from "../components/Container";
import Button from "../components/Button";
import LoginModal from "../components/LoginModal";
import ActionOptions from "../components/ActionOptions";
import CommentSelection from "../components/CommentSelection";
import TextInputModal from "../components/TextInputModal";
import logoLarge from '../assets/logo/logo-large.png';
import styles from '../styles/Controle.module.css';

const Controle = ({ currentUser, setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPertenceInput, setShowPertenceInput] = useState(false);

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
    setSelectedOption(null);
    setShowPertenceInput(false);
  };

  const handleOptionSelection = async (option) => {
    const now = new Date();
    const formattedDate = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}`;
    const documentId = `${petId}_${formattedDate}`;

    if (currentAction === "entrada" || currentAction === "saida") {
      const record = {
        tipo: currentAction,
        opcao: option,
        data: formattedDate,
        hora: now.toLocaleTimeString(),
        usuario: currentUser.name,
      };

      await setDoc(doc(firestore, "registros", documentId), {
        ...record,
        [currentAction + option]: record.hora,
        [currentAction + option + "Usuario"]: record.usuario,
      }, { merge: true });

      if (currentAction === "entrada" && (option === "Creche" || option === "Hotel")) {
        setShowPertenceInput(true);
      } else {
        alert(`Registro de ${currentAction} para ${option} foi efetuado com sucesso.`);
        navigate("/mascotes");
      }
    } else if (currentAction === "comentario") {
      setSelectedOption(option);
    }
  };

  const handleComentarioSubmit = async (tipoComentario, comentario) => {
    const now = new Date();
    const formattedDate = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}`;
    const documentId = `${petId}_${formattedDate}`;

    await setDoc(doc(firestore, "registros", documentId), {
      [`${tipoComentario.toLowerCase()}`]: comentario,
      data: formattedDate,
      hora: now.toLocaleTimeString(),
      usuario: currentUser.name,
    }, { merge: true });

    alert(`Comentário sobre ${tipoComentario} foi registrado com sucesso.`);
    navigate("/mascotes");
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

  const getLastEntry = async (petId) => {
    const q = query(
      collection(firestore, "registros"),
      orderBy("data", "desc"),
      orderBy("hora", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  };
  

  const checkLastEntryForPertences = async () => {
    const lastEntry = await getLastEntry(petId);

    if (lastEntry && lastEntry.pertence) {
      alert(`O pet tem o(s) seguinte(s) pertence(s): ${lastEntry.pertence}`);
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
                  <Button onClick={checkLastEntryForPertences}>Saída</Button>
                  <Button onClick={() => handleActionSelection("comentario")}>Comentário</Button>
                  <Button onClick={handleEditar}>Editar</Button>
                </div>
              ) : currentAction && !showPertenceInput ? (
                currentAction === "comentario" ? (
                  <CommentSelection
                    onSubmit={handleComentarioSubmit}
                    onClose={() => setCurrentAction(null)}
                  />
                ) : (
                  <ActionOptions
                    actionType={currentAction}
                    onSelectOption={handleOptionSelection}
                    onBack={() => setCurrentAction(null)}
                  />
                )
              ) : (
                <TextInputModal
                  placeholder="Descreva os pertences..."
                  onSubmit={(text) => handleComentarioSubmit('Pertences', text)}
                  onClose={() => setShowPertenceInput(false)}
                  onCancel={() => setShowPertenceInput(false)}
                />
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
