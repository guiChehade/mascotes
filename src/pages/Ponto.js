import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from '../styles/Ponto.module.css';  // Importa o CSS module

const Ponto = ({ currentUser }) => {
  const [pontos, setPontos] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [loading, setLoading] = useState(true); // Adiciona estado de carregamento

  const headers = ['Data', 'Entrada', 'Saída Almoço', 'Volta Almoço', 'Saída'];
  if (currentUser.role === 'isOwner') headers.splice(1, 0, 'Usuário');

  const formatDate = (date) => date.toISOString().split('T')[0];
  const formatTime = (date) => date.toTimeString().split(' ')[0];

  const fetchPontos = async () => {
    const userId = auth.currentUser?.uid;  
    if (!currentUser || !userId) {
      console.error('Usuário atual ou ID não estão definidos corretamente.');
      setLoading(false); 
      return;
    }

    try {
      let pontosQuery;
      if (currentUser.role === 'isOwner') {
        pontosQuery = query(collection(firestore, 'pontos'), orderBy('data', 'desc'));
      } else {
        pontosQuery = query(
          collection(firestore, 'pontos'),
          where('usuarioId', '==', userId), 
          orderBy('data', 'desc')
        );
      }

      const querySnapshot = await getDocs(pontosQuery);
      const fetchedPontos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPontos(fetchedPontos);
      setLoading(false);
      definirProximaAcao(fetchedPontos);
    } catch (error) {
      console.error('Erro ao buscar pontos: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && auth.currentUser) {
      fetchPontos();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const registrarPonto = async () => {
    const userId = auth.currentUser?.uid;

    if (!currentUser || !userId) {
      console.error('Erro: Usuário ou ID não definido.');
      return;
    }

    try {
      const now = new Date();
      const hoje = formatDate(now); 
      const pontoHoje = pontos.find(p => p.data === hoje && p.usuarioId === userId);
      const campoAtualizar = currentAction.toLowerCase().replace(/\s/g, '');

      if (pontoHoje) {
        const docRef = doc(firestore, 'pontos', pontoHoje.id); 
        await updateDoc(docRef, {
          [campoAtualizar]: formatTime(now),
        });
      } else {
        const novoPonto = {
          data: hoje, 
          horario: formatTime(now), 
          usuarioId: userId, 
          usuarioNome: currentUser.name,
          [campoAtualizar]: formatTime(now),
        };
        await addDoc(collection(firestore, 'pontos'), novoPonto);
      }

      setConfirmModal(false);
      await fetchPontos();
    } catch (error) {
      console.error('Erro ao registrar ponto: ', error);
    }
  };

  const definirProximaAcao = (pontosAtualizados = pontos) => {
    if (pontosAtualizados.length === 0) {
      setCurrentAction('Registrar Entrada');
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    const pontoHoje = pontosAtualizados.find(p => p.data === hoje);

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
  };

  useEffect(() => {
    definirProximaAcao(pontos);
  }, [pontos]);

  if (loading) {
    return <div className={styles.pontoPage}>Esta página exige acesso, caso não carregue em instantes, verifique se você fez Login</div>;
  }

  if (!currentUser || !auth.currentUser) {
    return <div className={styles.pontoPage}>Usuário não definido corretamente.</div>;
  }

  return (
    <div className={styles.pontoPage}>
      <h2 className={styles.pontoTitle}>Pontos de {new Date().toLocaleString('pt-BR', { month: 'long' })}</h2>

      <Button onClick={() => setConfirmModal(true)} disabled={currentAction === 'Ponto Completo'} className={styles.registerButton}>
        {currentAction !== 'Ponto Completo' ? currentAction : 'Ponto do Dia Completo'}
      </Button>

      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Confirmação de Ponto" onConfirm={registrarPonto}>
        <p className={styles.modalContent}>Você tem certeza que deseja {currentAction}?</p>
      </Modal>

      <div className={styles.tableContainer}>
        <Table headers={headers} data={pontos.map(ponto => ({
          data: ponto.data,
          usuarioNome: currentUser.role === 'isOwner' ? ponto.usuarioNome : null,
          entrada: ponto.registrarentrada || '-',
          saidaAlmoco: ponto.registrarsaídaparaalmoço || '-',
          voltaAlmoco: ponto.registrarvoltadoalmoço || '-',
          saida: ponto.registrarsaída || '-',
        }))} />
      </div>
    </div>
  );
};

export default Ponto;
