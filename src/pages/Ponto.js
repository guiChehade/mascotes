import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import Button from '../components/Button';
import Table from '../components/Table';
import Modal from '../components/Modal';
import styles from '../styles/Ponto.module.css';  // Importa o CSS module

const Ponto = ({ currentUser }) => {
  const [pontos, setPontos] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [loading, setLoading] = useState(true);

  const headers = ['Data', 'Usuário' ,'Entrada', 'Saída Almoço', 'Volta Almoço', 'Saída'];

  const formatDate = (date) => date.toISOString().split('T')[0];
  const formatTime = (date) => date.toTimeString().split(' ')[0];

  // Função para buscar pontos do Firestore
  const fetchPontos = async () => {
    const userId = auth.currentUser?.uid;
    if (!currentUser || !userId) {
      console.error('Usuário atual ou ID não estão definidos corretamente.');
      setLoading(false);
      return;
    }

    try {
      const fetchedPontos = [];

      if (currentUser.role === 'isOwner' || currentUser.role === 'isAdmin') {
        // Proprietário ou gerente visualiza todos os registros de todos os usuários
        const usersQuery = query(collection(firestore, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const pontosRef = collection(firestore, 'users', userId, 'pontos');
          const pontosQuery = query(pontosRef, orderBy('data', 'desc'));
          const pontosSnapshot = await getDocs(pontosQuery);
          pontosSnapshot.docs.forEach((doc) => {
            fetchedPontos.push({ id: doc.id, usuarioNome: userDoc.data().name, ...doc.data() });
          });
        }
      } else {
        // Usuário visualiza apenas seus próprios registros
        const pontosRef = collection(firestore, 'users', userId, 'pontos');
        const pontosQuery = query(pontosRef, orderBy('data', 'desc'));
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
      const pontosRef = collection(firestore, 'users', userId, 'pontos');
      const pontoDocRef = doc(pontosRef, hoje);

      // Obter o ponto do dia de hoje
      const pontoHojeSnapshot = await getDocs(query(pontosRef, where('data', '==', hoje)));
      const pontoHoje = pontoHojeSnapshot.docs.length > 0 ? pontoHojeSnapshot.docs[0].data() : null;
      const campoAtualizar = currentAction.toLowerCase().replace(/\s/g, '');

      if (pontoHoje) {
        // Atualizar o ponto existente
        await updateDoc(pontoDocRef, {
          [campoAtualizar]: formatTime(now),
        });
      } else {
        // Criar um novo ponto
        const novoPonto = {
          data: hoje,
          usuarioId: userId,
          usuarioNome: currentUser.name,
          [campoAtualizar]: formatTime(now),
        };
        await setDoc(pontoDocRef, novoPonto);
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

    // Verificar o último ponto batido para o usuário atual
    const ultimoPonto = pontosAtualizados.find(p => p.usuarioId === auth.currentUser?.uid);
    if (!ultimoPonto) {
      setCurrentAction('Registrar Entrada');
    } else if (!ultimoPonto.registrarsaídaparaalmoço) {
      setCurrentAction('Registrar Saída para Almoço');
    } else if (!ultimoPonto.registrarvoltadoalmoço) {
      setCurrentAction('Registrar Volta do Almoço');
    } else if (!ultimoPonto.registrarsaída) {
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

  const mes = new Date().toLocaleString('pt-BR', { month: 'long' });
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

  return (
    <div className={styles.pontoPage}>
    
      <Button onClick={() => setConfirmModal(true)} disabled={currentAction === 'Ponto Completo'} className={styles.registerButton}>
        {currentAction !== 'Ponto Completo' ? currentAction : 'Ponto do Dia Completo'}
      </Button>

      <h2 className={styles.pontoTitle}>Pontos de {mesCapitalizado}</h2>
      
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Confirmação de Ponto" onConfirm={registrarPonto}>
        <p className={styles.modalContent}>Você tem certeza que deseja {currentAction}?</p>
      </Modal>

      <div className={styles.tableContainer}>
        <Table headers={headers} data={pontos.map(ponto => ({
          data: ponto.data,
          usuarioNome: currentUser.role === 'isOwner' || currentUser.role === 'isManager' ? ponto.usuarioNome : null,
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
