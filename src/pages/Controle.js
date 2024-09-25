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
  deleteDoc,
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
import logoLarge from "../assets/logo/logo-large.png";
import { staticRoutes } from "../config/staticRoutes";
import styles from "../styles/Controle.module.css";

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
  const [lastService, setLastService] = useState(null);

  // Estados para controlar modais
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showComentarioModal, setShowComentarioModal] = useState(false);
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [showSaidaModal, setShowSaidaModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  // Estados para ações selecionadas
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedComentarioType, setSelectedComentarioType] = useState(null);
  const [commentsData, setCommentsData] = useState([]);

  // Função para obter a data e hora atual no fuso horário de São Paulo
  const getCurrentDateTime = () => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];
    return { formattedDate, formattedTime };
  };

  // Efeito para buscar dados do pet e último registro
  useEffect(() => {
    const fetchData = async () => {
      await fetchPetData();
      await fetchLastRecord();
    };
    fetchData();
  }, [petId]);

  // Função para buscar dados do pet no Firestore
  const fetchPetData = async () => {
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
  };

  // Função para buscar o último registro de controle do pet
  const fetchLastRecord = async () => {
    if (petId) {
      try {
        const controleRef = collection(firestore, "pets", petId, "controle");

        // Consulta para obter o registro mais recente com base na data e hora de entrada
        const q = query(
          controleRef,
          orderBy("dataEntrada", "desc"),
          orderBy("horarioEntrada", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestRecordDoc = querySnapshot.docs[0];
          const latestData = latestRecordDoc.data();
          setLastRecord({
            id: latestRecordDoc.id,
            ...latestData,
          });
          setLastService(latestData.servico); // Define o serviço mais recente

          // Atualiza o documento 'mostRecent' com os dados mais recentes
          await updateMostRecent(latestRecordDoc.id);
        } else {
          setLastRecord(null);
          setLastService(null);

          // Se não houver registros, limpa 'mostRecent'
          await deleteMostRecent();
        }
      } catch (error) {
        console.error("Erro ao buscar o último registro:", error);
      }
    }
  };

  // Função para deletar 'mostRecent' e suas subcoleções
  const deleteMostRecent = async () => {
    const mostRecentRef = doc(firestore, "pets", petId, "controle", "mostRecent");

    // Verifica se 'mostRecent' existe
    const mostRecentDoc = await getDoc(mostRecentRef);
    if (mostRecentDoc.exists()) {
      // Deleta as subcoleções conhecidas
      const subCollections = [
        "comentarioPertences",
        "comentarioVet",
        "comentarioComportamento",
        "comentarioObservacoes",
        "comentarioAlimentacao",
        "servicoAdestramento",
        "servicoBanho",
        "servicoPasseio",
        "servicoVeterinario",
      ];
      for (let subCol of subCollections) {
        const subColRef = collection(mostRecentRef, subCol);
        const subColDocs = await getDocs(subColRef);
        for (let docSnap of subColDocs.docs) {
          await deleteDoc(docSnap.ref);
        }
      }

      // Deleta o documento 'mostRecent'
      await deleteDoc(mostRecentRef);
    }
  };

  // Função para atualizar o documento 'mostRecent' com os dados do último registro
  const updateMostRecent = async (recordId) => {
    const mostRecentRef = doc(
      firestore,
      "pets",
      petId,
      "controle",
      "mostRecent"
    );

    // Obter os dados do último registro
    const lastRecordRef = doc(
      firestore,
      "pets",
      petId,
      "controle",
      recordId
    );
    const lastRecordData = await getDoc(lastRecordRef);

    if (lastRecordData.exists()) {
      const data = lastRecordData.data();
      await setDoc(mostRecentRef, data);

      // Copiar subcoleções conhecidas para 'mostRecent'
      const knownSubCollections = [
        "comentarioPertences",
        "comentarioVet",
        "comentarioComportamento",
        "comentarioObservacoes",
        "comentarioAlimentacao",
        "servicoAdestramento",
        "servicoBanho",
        "servicoPasseio",
        "servicoVeterinario",
      ];

      // Copiar subcoleções de serviços extras
      // Supondo que os nomes dos serviços extras estejam armazenados em 'serviceNames'
      const serviceNames = data.serviceNames || [];
      const subCollections = [...knownSubCollections, ...serviceNames];

      for (let subCol of subCollections) {
        const subCollectionRef = collection(
          firestore,
          "pets",
          petId,
          "controle",
          recordId,
          subCol
        );
        const subCollectionSnapshot = await getDocs(subCollectionRef);
        if (!subCollectionSnapshot.empty) {
          for (let docSnap of subCollectionSnapshot.docs) {
            const docData = docSnap.data();
            await setDoc(
              doc(mostRecentRef, subCol, docSnap.id),
              docData
            );
          }
        }
      }
    }
  };

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

  const handleVoltaParque = () => {
    if (lastService) {
      registerVolta(lastService); // Usando o serviço mais recente
    } else {
      console.error("Serviço mais recente não encontrado.");
    }
  };

  const handleVoltaCasa = async () => {
    await showCommentInfo(); // Exibe os comentários existentes
  };

  // Função para registrar a seleção de serviço
  const handleServiceSelection = (service) => {
    setShowEntradaModal(false);
    setShowSaidaModal(false);

    if (selectedAction === "entrada") {
      registerEntrada(service);
      setLastService(service);
    } else if (selectedAction === "saida") {
      if (service === "Casa") {
        handleVoltaCasa();
      } else {
        registerSaidaServico(service); // Registrar saída para outro serviço
      }
    }
  };

  // Função para exibir comentários antes da saída
  const showCommentInfo = async () => {
    if (lastRecord) {
      const commentTypes = [
        "comentarioPertences",
        "comentarioVet",
        "comentarioComportamento",
        "comentarioObservacoes",
        "comentarioAlimentacao",
      ];
      let comments = [];

      for (let type of commentTypes) {
        const comentariosRef = collection(
          firestore,
          "pets",
          petId,
          "controle",
          lastRecord.id,
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
    setShowComentarioModal(true);
  };

  // Função para submeter um comentário
  const handleComentarioSubmit = async (comentario) => {
    if (!lastRecord || !lastRecord.id) {
      console.error("Erro: lastRecord ou lastRecord.id é nulo.");
      return; // Evita continuar se lastRecord estiver nulo
    }

    const { formattedDate, formattedTime } = getCurrentDateTime();
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
      // Dados do comentário
      const comentarioData = {
        comentario,
        usuario: currentUser.name,
        horario: formattedTime,
        data: formattedDate,
      };

      // Adiciona comentário na subcoleção da data mais recente
      const comentariosRef = collection(
        firestore,
        "pets",
        petId,
        "controle",
        lastRecord.id,
        subCollectionPath
      );
      await addDoc(comentariosRef, comentarioData);

      // Após registrar, atualiza 'mostRecent' para refletir as mudanças
      await updateMostRecent(lastRecord.id);

      alert(`${selectedComentarioType} registrado: ${comentario}`);
      setShowComentarioModal(false);
      setSelectedComentarioType(null);
      refreshPage(); // Atualiza a página após registrar o comentário
    } catch (error) {
      console.error(
        `Erro ao adicionar ${selectedComentarioType.toLowerCase()}:`,
        error
      );
    }
  };

  // Função para registrar entrada do pet
  const registerEntrada = async (service) => {
    const { formattedDate, formattedTime } = getCurrentDateTime();

    const controleRef = collection(firestore, "pets", petId, "controle");

    const newRecord = {
      servico: service,
      dataEntrada: formattedDate,
      horarioEntrada: formattedTime,
      usuarioEntrada: currentUser.name,
      localAtual: service,
      serviceNames: [], // Inicializa a lista de serviços extras
    };

    try {
      // Registrar a entrada na subcoleção 'controle' com ID de data
      await setDoc(doc(controleRef, formattedDate), newRecord);

      // Deletar 'mostRecent' e suas subcoleções
      await deleteMostRecent();

      // Atualizar 'mostRecent' como cópia do registro mais recente
      await updateMostRecent(formattedDate);

      // Atualizar o estado local do pet e na base de dados (no documento do pet)
      setPet((prev) => ({ ...prev, localAtual: service }));
      await updateDoc(doc(firestore, "pets", petId), { localAtual: service });

      alert(`Entrada para ${service} registrada com sucesso.`);

      refreshPage(); // Atualiza a página
    } catch (error) {
      console.error("Erro ao registrar entrada:", error);
    }
  };

  // Função para registrar saída para um serviço externo
  const registerSaidaServico = async (service) => {
    if (!lastRecord || !lastRecord.id) {
      console.error("Erro: lastRecord ou lastRecord.id é nulo.");
      return; // Evita continuar se lastRecord estiver nulo
    }

    const { formattedDate, formattedTime } = getCurrentDateTime();

    try {
      // Criar subcoleção com o nome do serviço extra
      const servicoSubcollectionName = `servico${service}`;
      const servicoSubcollectionRef = collection(
        firestore,
        "pets",
        petId,
        "controle",
        lastRecord.id,
        servicoSubcollectionName
      );
      const servicoData = {
        dataSaidaServico: formattedDate,
        horarioSaidaServico: formattedTime,
        usuarioSaidaServico: currentUser.name,
      };
      await addDoc(servicoSubcollectionRef, servicoData);

      // Atualizar o documento da data mais recente com 'localAtual' e adicionar o nome do serviço extra
      const controleRef = doc(
        firestore,
        "pets",
        petId,
        "controle",
        lastRecord.id
      );

      // Atualizar a lista de serviços extras
      const updatedServiceNames = lastRecord.serviceNames || [];
      if (!updatedServiceNames.includes(servicoSubcollectionName)) {
        updatedServiceNames.push(servicoSubcollectionName);
      }

      await updateDoc(controleRef, {
        localAtual: service,
        serviceNames: updatedServiceNames, // Atualiza a lista de serviços extras
      });

      // Atualizar 'mostRecent' usando setDoc com merge para evitar erros se não existir
      const mostRecentRef = doc(
        firestore,
        "pets",
        petId,
        "controle",
        "mostRecent"
      );
      await setDoc(
        mostRecentRef,
        {
          localAtual: service,
          serviceNames: updatedServiceNames,
        },
        { merge: true }
      );

      // Após registrar, atualiza 'mostRecent' para refletir as mudanças
      await updateMostRecent(lastRecord.id);

      // Atualizar o estado local do pet e na base de dados (no documento do pet)
      setPet((prev) => ({ ...prev, localAtual: service }));
      await updateDoc(doc(firestore, "pets", petId), { localAtual: service });

      alert(`Saída para ${service} registrada com sucesso.`);
      refreshPage(); // Atualiza a página após registrar a saída para o serviço
    } catch (error) {
      console.error("Erro ao registrar saída para serviço:", error);
    }
  };

  // Função para registrar retorno do serviço externo
  const registerVolta = async (service) => {
    if (!lastRecord || !lastRecord.id) {
      console.error("Erro: lastRecord ou lastRecord.id é nulo.");
      return;
    }

    const { formattedDate, formattedTime } = getCurrentDateTime();

    try {
      // Atualizar o documento da data mais recente com 'localAtual'
      const controleRef = doc(
        firestore,
        "pets",
        petId,
        "controle",
        lastRecord.id
      );
      await updateDoc(controleRef, {
        localAtual: lastService,
      });

      // Atualizar o documento do serviço extra com a data de retorno
      const servicoSubcollectionName = `servico${service}`;
      const servicoSubcollectionRef = collection(
        firestore,
        "pets",
        petId,
        "controle",
        lastRecord.id,
        servicoSubcollectionName
      );

      // Obter o documento do serviço extra mais recente
      const servicoQuery = query(
        servicoSubcollectionRef,
        orderBy("dataSaidaServico", "desc"),
        orderBy("horarioSaidaServico", "desc"),
        limit(1)
      );
      const servicoSnapshot = await getDocs(servicoQuery);
      if (!servicoSnapshot.empty) {
        const servicoDoc = servicoSnapshot.docs[0];
        await updateDoc(servicoDoc.ref, {
          dataVoltaServico: formattedDate,
          horarioVoltaServico: formattedTime,
          usuarioVoltaServico: currentUser.name,
        });
      }

      // Atualizar 'mostRecent' usando setDoc com merge para evitar erros se não existir
      const mostRecentRef = doc(
        firestore,
        "pets",
        petId,
        "controle",
        "mostRecent"
      );
      await setDoc(
        mostRecentRef,
        {
          localAtual: lastService,
        },
        { merge: true }
      );

      // Após registrar, atualiza 'mostRecent' para refletir as mudanças
      await updateMostRecent(lastRecord.id);

      // Atualizar o estado local do pet e na base de dados (no documento do pet)
      setPet((prev) => ({ ...prev, localAtual: lastService }));
      await updateDoc(doc(firestore, "pets", petId), {
        localAtual: lastService,
      });

      alert(`Retorno de ${service} registrado com sucesso.`);
      refreshPage(); // Atualiza a página
    } catch (error) {
      console.error(`Erro ao registrar retorno de ${service}: ${error}`);
    }
  };

  // Função para registrar saída definitiva do pet
  const registerSaida = async () => {
    const { formattedDate, formattedTime } = getCurrentDateTime();

    const pernoites = calculatePernoites(
      lastRecord?.dataEntrada,
      formattedDate
    );

    if (lastRecord && lastRecord.id) {
      const updateData = {
        dataSaida: formattedDate,
        horarioSaida: formattedTime,
        usuarioSaida: currentUser.name,
        pernoites,
        localAtual: "Casa",
        dataVoltaServico: formattedDate,
        horarioVoltaServico: formattedTime,
        usuarioVoltaServico: currentUser.name,
      };

      const controleRef = doc(
        firestore,
        "pets",
        petId,
        "controle",
        lastRecord.id
      );
      await updateDoc(controleRef, updateData);

      // Atualizar 'mostRecent' usando setDoc com merge para evitar erros se não existir
      const mostRecentRef = doc(
        firestore,
        "pets",
        petId,
        "controle",
        "mostRecent"
      );
      await setDoc(mostRecentRef, updateData, { merge: true });

      // Após registrar, atualiza 'mostRecent' para refletir as mudanças
      await updateMostRecent(lastRecord.id);

      // Atualizar o estado local do pet e na base de dados (no documento do pet)
      setPet((prev) => ({ ...prev, localAtual: "Casa" }));
      await updateDoc(doc(firestore, "pets", petId), { localAtual: "Casa" });

      alert("Saída registrada com sucesso.");
      navigate("/no-local");
    } else {
      console.error(
        "Erro: Não foi possível encontrar o registro mais recente para atualizar."
      );
    }
  };

  // Função para calcular o número de pernoites
  const calculatePernoites = (entradaData, saidaData) => {
    if (!entradaData) return 0;

    const entrada = new Date(entradaData);
    const saida = new Date(saidaData);
    const diffTime = Math.abs(saida - entrada);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
          <div className={styles.value}>{pet.celularTutor}</div>

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

      {/* Modal para exibir comentários antes da saída */}
      {showCommentsModal && (
        <Modal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          title="Comentários Registrados"
          onConfirm={async () => {
            await registerSaida(); // Registra a saída somente após a confirmação
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
