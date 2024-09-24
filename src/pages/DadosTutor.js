import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';

const DadosTutor = ({ currentUser }) => {
  const { tutorId } = useParams();
  const [tutorData, setTutorData] = useState(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      const tutorDoc = await getDoc(doc(firestore, 'tutores', tutorId));
      if (tutorDoc.exists()) {
        setTutorData(tutorDoc.data());
      } else {
        console.error('Tutor não encontrado');
      }
    };

    if (currentUser) {
      fetchTutorData();
    }
  }, [tutorId, currentUser]);

  if (!tutorData) {
    return <p>Carregando...</p>;
  }

  return (
    <Container>
        <h2>Dados do Tutor</h2>
        <Input label='Nome' value={tutorData.nome} disabled> </Input>
        <Input label='Idade' value={tutorData.idade} disabled> </Input>
        <Input label='CPF' value={tutorData.cpf} disabled> </Input>
        <Input label='E-mail' value={tutorData.email} disabled> </Input>
        <Input label='Celular' value={tutorData.celular} disabled> </Input>
        <Input label='Telefone Secundário' value={tutorData.telefoneSecundario} disabled> </Input>
        <Input label='CEP' value={tutorData.cep} disabled> </Input>
        <Input label='Endereço' value={tutorData.endereco} disabled> </Input>
        <Input label='Número' value={tutorData.numero} disabled> </Input>
        <Input label='Complemento' value={tutorData.complemento} disabled> </Input>
        <Input label='Bairro' value={tutorData.bairro} disabled> </Input>
        <Input label='Cidade' value={tutorData.cidade} disabled> </Input>
        <Input label='UF' value={tutorData.uf} disabled> </Input>
        <Button> Editar </Button>
    </Container>
  );
};

export default DadosTutor;
