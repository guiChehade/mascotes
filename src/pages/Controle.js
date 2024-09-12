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
  limit,
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
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [showSaidaModal, setShowSaidaModal] = useState(false);
  const [showVoltaModal, setShowVoltaModal] = useState(false);
  const [lastService, setLastService] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);
  const [selectedComentarioType, setSelectedComentarioType] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsData, setCommentsData] = useState([]); 

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
              ...latestRecordDoc.data(),
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
    setShowEntradaModal(true);
  };

  const handleSaida = () => {
    setSelectedAction("saida");
    setShowSaidaModal(true);
  };

  const handleVolta = () => {
    setSelectedAction("volta");
    setShowVoltaModal(true);
  };

  const handleServiceSelection = (service) => {
    setShowEntradaModal(false);
    setShowSaidaModal(false);
    setShowVoltaModal(false);

    if (selectedAction === "entrada") {
      registerEntrada(service);
      setLastService(service);
    } else if (selectedAction === "saida") {
      if (service === "Casa") {
        showCommentInfo();
      } else {
        registerSaidaParaServico(service); // Registrar saída para outro serviço
      }
    } else if (selectedAction === "volta") {
      registerVoltaParaParque(service); // Registrar volta para a Creche/Hotel
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
        setShowCommentsModal(true); 
      } else {
        registerSaida(); 
      }
    }
  };

  const handleComentario = () => {
    setShowComentarioModal(true);
  };

  const handleComentarioSubmit = async (comentario) => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; 
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; 
    const formattedTime = now.toTimeString().split(' ')[0]; 
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
      const comentariosRef = collection(firestore, "pets", petId, "controle", lastRecord.id, subCollectionPath);
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
    const saoPauloOffset = -3 * 60; 
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; 
    const formattedTime = now.toTimeString().split(' ')[0]; 

    const controleRef = collection(firestore, "pets", petId, "controle");

    const newRecord = {
      servico: service,
      dataEntrada: formattedDate,
      horarioEntrada: formattedTime,
      usuarioEntrada: currentUser.name,
    };

    try {
      await setDoc(doc(controleRef, formattedDate), newRecord, { merge: true });
      setPet((prev) => ({ ...prev, localAtual: service }));
      await updateDoc(doc(firestore, "pets", petId), { localAtual: service, dataEntrada: formattedDate, horarioEntrada: formattedTime });
    } catch (error) {
      console.error("Erro ao registrar entrada:", error);
    }
  };

  const registerSaidaParaServico = async (service) => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; 
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; 
    const formattedTime = now.toTimeString().split(' ')[0]; 

    try {
      // Criar nova subcoleção do serviço dentro do documento da data atual na subcoleção de controle
      const serviceRef = collection(doc(firestore, "pets", petId, "controle", lastRecord.id), service);
      await addDoc(serviceRef, {
        dataEntrada: formattedDate,
        horarioEntrada: formattedTime,
        usuarioEntrada: currentUser.name,
      });

      // Atualizar o localAtual no documento do pet
      const petsRef = doc(firestore, "pets", petId);
      await updateDoc(petsRef, { localAtual: service });

      setPet((prev) => ({ ...prev, localAtual: service }));
      alert(`Entrada para ${service} registrada com sucesso.`);
    } catch (error) {
      console.error("Erro ao registrar saída para serviço:", error);
    }
  };

  const registerVoltaParaParque = async (service) => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; 
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; 
    const formattedTime = now.toTimeString().split(' ')[0]; 

    try {
      // Registrar o retorno na subcoleção do serviço atual
      const serviceRef = collection(firestore, "pets", petId, "controle", lastRecord.id, pet.localAtual);
      await addDoc(serviceRef, {
        dataVolta: formattedDate,
        horarioVolta: formattedTime,
        usuarioVolta: currentUser.name,
      });

      // Atualizar o localAtual para o último serviço (Creche ou Hotel)
      const petsRef = doc(firestore, "pets", petId);
      await updateDoc(petsRef, { localAtual: service });

      setPet((prev) => ({ ...prev, localAtual: service }));
      alert(`Retorno para ${service} registrado com sucesso.`);
    } catch (error) {
      console.error("Erro ao registrar retorno para o Parque:", error);
    }
  };

  const registerSaida = async () => {
    const now = new Date();
    const saoPauloOffset = -3 * 60; 
    const localTime = new Date(now.getTime() + (saoPauloOffset * 60 * 1000));
  
    const formattedDate = localTime.toISOString().split('T')[0]; 
    const formattedTime = now.toTimeString().split(' ')[0]; 
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
        localAtual: "Casa",
        dataSaida: formattedDate,
        horarioSaida: formattedTime,
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
              {pet.localAtual === "Casa" || pet.localAtual === "Inativo" || pet.localAtual === undefined || pet.localAtual === null ? (
                <>
                  <Button onClick={handleEntrada}>Entrada</Button>
                  <Button onClick={handleEditar}>Editar</Button>
                </>
              ) : pet.localAtual === "Adestramento" || pet.localAtual === "Passeio" || pet.localAtual === "Banho" || pet.localAtual === "Veterinário" ? (
                <>
                  <Button onClick={handleVolta}>Volta pro Parque</Button>
                  <Button onClick={handleSaida}>Saída pra Casa</Button>
                  <Button onClick={handleComentario}>Comentário</Button>
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

      {showVoltaModal && (
        <ActionOptions
          actionType="O Pet está voltando ou indo embora?"
          options={[lastService || "Casa"]}
          onSelectOption={handleServiceSelection}
          onBack={() => setShowVoltaModal(false)}
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
