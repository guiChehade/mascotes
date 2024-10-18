import React, { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import Button from '../components/Button';
import Container from '../components/Container';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from '../styles/Ponto.module.css';

const Ponto = ({ currentUser }) => {
  const [pontos, setPontos] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [loading, setLoading] = useState(true);

  const headers = ['Data', 'Usuário', 'Entrada', 'Saída Almoço', 'Volta Almoço', 'Saída'];

  const formatDate = (date) => date.toISOString().split('T')[0];
  const formatTime = (date) => date.toTimeString().split(' ')[0];

  const getStartAndEndOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Domingo) a 6 (Sábado)
    const start = new Date(now);
    const end = new Date(now);

    // Ajusta o início para a segunda-feira anterior
    start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    start.setHours(0, 0, 0, 0);

    // Ajusta o fim para o domingo seguinte
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  // Defina definirProximaAcao antes de usá-la
  const definirProximaAcao = useCallback(
    (pontosAtualizados = pontos) => {
      const userId = auth.currentUser?.uid;
      if (!pontosAtualizados || pontosAtualizados.length === 0) {
        setCurrentAction('Registrar Entrada');
        return;
      }

      const hoje = formatDate(new Date());
      const pontoHoje = pontosAtualizados.find(
        (p) => p.usuarioId === userId && p.data === hoje
      );

      if (!pontoHoje) {
        setCurrentAction('Registrar Entrada');
      } else if (!pontoHoje.registrarsaídaparaalmoço) {
        setCurrentAction('Registrar Saída para Almoço');
      } else if (!pontoHoje.registrarvoltadoalmoço) {
        setCurrentAction('Registrar Volta do Almoço');
      } else if (!pontoHoje.registrarsaída) {
        setCurrentAction('Registrar Saída');
      } else {
        setCurrentAction('Ponto Completo');
      }
    },
    [pontos]
  );

  // Agora você pode usar definirProximaAcao dentro de fetchPontos
  const fetchPontos = useCallback(async () => {
    const userId = auth.currentUser?.uid;
    if (!currentUser || !userId) {
      console.error('Usuário atual ou ID não estão definidos corretamente.');
      setLoading(false);
      return;
    }

    try {
      const { start, end } = getStartAndEndOfWeek();
      const startDateStr = formatDate(start);
      const endDateStr = formatDate(end);

      const fetchedPontos = [];

      if (currentUser.role === 'isOwner' || currentUser.role === 'isAdmin') {
        // Proprietário ou gerente visualiza registros de todos os usuários na semana atual
        const usersQuery = query(collection(firestore, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const pontosRef = collection(firestore, 'users', userId, 'pontos');
          const pontosQuery = query(
            pontosRef,
            where('data', '>=', startDateStr),
            where('data', '<=', endDateStr),
            orderBy('data', 'desc')
          );
          const pontosSnapshot = await getDocs(pontosQuery);
          pontosSnapshot.docs.forEach((doc) => {
            fetchedPontos.push({ id: doc.id, usuarioNome: userDoc.data().name, ...doc.data() });
          });
        }
      } else {
        // Usuário visualiza apenas seus registros na semana atual
        const pontosRef = collection(firestore, 'users', userId, 'pontos');
        const pontosQuery = query(
          pontosRef,
          where('data', '>=', startDateStr),
          where('data', '<=', endDateStr),
          orderBy('data', 'desc')
        );
        const querySnapshot = await getDocs(pontosQuery);
        querySnapshot.docs.forEach((doc) => {
          fetchedPontos.push({ id: doc.id, ...doc.data() });
        });
      }

      setPontos(fetchedPontos);
      setLoading(false);
      definirProximaAcao(fetchedPontos);
    } catch (error) {
      console.error('Erro ao buscar pontos: ', error);
      setLoading(false);
    }
  }, [currentUser, definirProximaAcao]);

  const registrarPonto = async () => {
    const userId = auth.currentUser?.uid;

    if (!currentUser || !userId) {
      console.error('Erro: Usuário ou ID não definido.');
      return;
    }

    try {
      const now = new Date();
      const hoje = formatDate(now);
      const pontosRef = collection(firestore, 'users', userId, 'pontos');
      const pontoDocRef = doc(pontosRef, hoje);

      const campoAtualizar = currentAction.toLowerCase().replace(/\s/g, '');

      // Atualizar ou criar o ponto
      await updateDoc(pontoDocRef, {
        [campoAtualizar]: formatTime(now),
      }).catch(async () => {
        const novoPonto = {
          data: hoje,
          usuarioId: userId,
          usuarioNome: currentUser.name,
          [campoAtualizar]: formatTime(now),
        };
        await setDoc(pontoDocRef, novoPonto);
      });

      setConfirmModal(false);
      await fetchPontos();
    } catch (error) {
      console.error('Erro ao registrar ponto: ', error);
    }
  };

  useEffect(() => {
    if (currentUser && auth.currentUser) {
      fetchPontos();
    } else {
      setLoading(false);
    }
  }, [currentUser, fetchPontos]);

  useEffect(() => {
    definirProximaAcao(pontos);
  }, [pontos, definirProximaAcao]);

  if (loading) {
    return (
      <div className={styles.pontoPage}>
        Caso esta página não carregue em instantes verifique se você fez login ou contate um administrador.
      </div>
    );
  }

  if (!currentUser || !auth.currentUser) {
    return <div className={styles.pontoPage}>Usuário não definido corretamente.</div>;
  }

  const mes = new Date().toLocaleString('pt-BR', { month: 'long' });
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

  return (
    <Container className={styles.pontoPage}>
      <Button
        onClick={() => setConfirmModal(true)}
        disabled={currentAction === 'Ponto Completo'}
        className={styles.registerButton}
      >
        {currentAction !== 'Ponto Completo' ? currentAction : 'Ponto do Dia Completo'}
      </Button>

      <h2 className={styles.pontoTitle}>Pontos de {mesCapitalizado}</h2>

      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirmação de Ponto"
        onConfirm={registrarPonto}
        showFooter={true}
      >
        <p className={styles.modalContent}>Você tem certeza que deseja {currentAction}?</p>
      </Modal>

      <div className={styles.tableContainer}>
        <Table
          headers={headers}
          data={pontos.map((ponto) => ({
            data: ponto.data,
            usuarioNome: ponto.usuarioNome || '-',
            entrada: ponto.registrarentrada || '-',
            saidaAlmoco: ponto.registrarsaídaparaalmoço || '-',
            voltaAlmoco: ponto.registrarvoltadoalmoço || '-',
            saida: ponto.registrarsaída || '-',
          }))}
        />
      </div>
    </Container>
  );
};

export default Ponto;
