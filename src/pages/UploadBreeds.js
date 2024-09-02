import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import Input from '../components/Input';
import Button from '../components/Button';

const UploadBreeds = () => {
  const [formData, setFormData] = useState({
    id: '', // Campo para buscar ou identificar a raça
    nome: '',
    busca: '',
    destaque: '',
    porte: '',
    nivel_latido: '',
    nivel_energia: '',
    nivel_socializacao: '',
    nivel_treinamento: '',
    grupo: '',
    origem: '',
    peso_medio: '',
    altura_cernelha: '',
    expectativa_vida: '',
    detalhes: {
      introducao: '',
      aparencia: {
        pelagem: '',
        tamanho: '',
        caracteristicas: '',
      },
      temperamento: {
        caracteristica1: '',
        caracteristica2: '',
        caracteristica3: '',
        caracteristica4: '',
      },
      cuidados: {
        cuidado1: '',
        cuidado2: '',
        cuidado3: '',
        cuidado4: '',
        cuidado5: '',
        cuidado6: '',
      },
      historia: '',
      curiosidades: {
        curiosidade1: '',
        curiosidade2: '',
        curiosidade3: '',
      },
      consideracoes: '',
    },
  });

  const [imagemCard, setImagemCard] = useState(null);
  const [imagensCarrossel, setImagensCarrossel] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false); // Controle para saber se estamos atualizando ou adicionando
  const [bulkInput, setBulkInput] = useState(''); // Estado para o input em massa

  // Função para lidar com mudanças no input de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    if (keys.length > 1) {
      setFormData((prevFormData) => {
        let newData = { ...prevFormData };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Função para lidar com o upload de imagem do card
  const handleImagemCardChange = (e) => {
    setImagemCard(e.target.files[0]);
  };

  // Função para lidar com o upload de imagens do carrossel
  const handleImagensCarrosselChange = (e) => {
    setImagensCarrossel([...e.target.files]);
  };

  // Função para processar o input em massa
  const handleBulkInput = () => {
    const fields = bulkInput.split(';');
    if (fields.length >= 21) {
      setFormData((prev) => ({
        ...prev,
        nome: fields[0] || '',
        busca: fields[1] || '',
        destaque: fields[2] || '',
        porte: fields[3] || '',
        nivel_latido: fields[4] || '',
        nivel_energia: fields[5] || '',
        nivel_socializacao: fields[6] || '',
        nivel_treinamento: fields[7] || '',
        grupo: fields[8] || '',
        origem: fields[9] || '',
        peso_medio: fields[10] || '',
        altura_cernelha: fields[11] || '',
        expectativa_vida: fields[12] || '',
        detalhes: {
          introducao: fields[13] || '',
          aparencia: {
            pelagem: fields[14] || '',
            tamanho: fields[15] || '',
            caracteristicas: fields[16] || '',
          },
          temperamento: {
            caracteristica1: fields[17] || '',
            caracteristica2: fields[18] || '',
            caracteristica3: fields[19] || '',
            caracteristica4: fields[20] || '',
          },
          cuidados: {
            cuidado1: fields[21] || '',
            cuidado2: fields[22] || '',
            cuidado3: fields[23] || '',
            cuidado4: fields[24] || '',
            cuidado5: fields[25] || '',
            cuidado6: fields[26] || '',
          },
          historia: fields[27] || '',
          curiosidades: {
            curiosidade1: fields[28] || '',
            curiosidade2: fields[29] || '',
            curiosidade3: fields[30] || '',
          },
          consideracoes: fields[31] || '',
        },
      }));
    } else {
      alert('Por favor, insira todas as informações separadas por ponto e vírgula (;) no formato correto.');
    }
  };

  // Função para buscar raça por ID e preencher os dados no formulário
  const handleSearchById = async () => {
    if (formData.id) {
      const docRef = doc(firestore, 'racas', formData.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
        setIsUpdating(true); // Atualiza o estado para indicar que estamos no modo de atualização
        alert('Raça encontrada e carregada.');
      } else {
        alert('Raça não encontrada.');
      }
    }
  };

  // Função para enviar os dados do formulário para o Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imagemCardUrl = '';
      let imagensCarrosselUrls = [];

      if (imagemCard) {
        const imagemCardRef = ref(storage, `racas/${formData.nome}/card.jpg`);
        await uploadBytes(imagemCardRef, imagemCard);
        imagemCardUrl = await getDownloadURL(imagemCardRef);
      }

      if (imagensCarrossel.length > 0) {
        imagensCarrosselUrls = await Promise.all(
          imagensCarrossel.map(async (imagem) => {
            const imagemRef = ref(storage, `racas/${formData.nome}/${imagem.name}`);
            await uploadBytes(imagemRef, imagem);
            return getDownloadURL(imagemRef);
          })
        );
      }

      if (isUpdating && formData.id) {
        // Atualizar raça existente
        const docRef = doc(firestore, 'racas', formData.id);
        await updateDoc(docRef, {
          ...formData,
          imagem_card: imagemCardUrl || formData.imagem_card,
          imagens_carrossel: imagensCarrosselUrls.length ? imagensCarrosselUrls : formData.imagens_carrossel,
        });
        alert('Raça atualizada com sucesso!');
      } else {
        // Adicionar nova raça
        const docRef = await addDoc(collection(firestore, 'racas'), {
          ...formData,
          imagem_card: imagemCardUrl,
          imagens_carrossel: imagensCarrosselUrls,
        });
        alert('Raça adicionada com sucesso!');
        setFormData((prev) => ({ ...prev, id: docRef.id })); // Define o ID gerado no formulário
      }

      // Resetar o formulário
      setFormData({
        id: '',
        nome: '',
        busca: '',
        destaque: '',
        porte: '',
        nivel_latido: '',
        nivel_energia: '',
        nivel_socializacao: '',
        nivel_treinamento: '',
        grupo: '',
        origem: '',
        peso_medio: '',
        altura_cernelha: '',
        expectativa_vida: '',
        detalhes: {
          introducao: '',
          aparencia: {
            pelagem: '',
            tamanho: '',
            caracteristicas: '',
          },
          temperamento: {
            caracteristica1: '',
            caracteristica2: '',
            caracteristica3: '',
            caracteristica4: '',
          },
          cuidados: {
            cuidado1: '',
            cuidado2: '',
            cuidado3: '',
            cuidado4: '',
            cuidado5: '',
            cuidado6: '',
          },
          historia: '',
          curiosidades: {
            curiosidade1: '',
            curiosidade2: '',
            curiosidade3: '',
          },
          consideracoes: '',
        },
      });
      setImagemCard(null);
      setImagensCarrossel([]);
      setIsUpdating(false);
      setBulkInput('');
    } catch (error) {
      console.error('Erro ao adicionar/atualizar raça:', error);
      alert('Ocorreu um erro ao adicionar ou atualizar a raça. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      {/* Campo de busca por ID */}
      <Input
        type="text"
        name="id"
        value={formData.id}
        onChange={handleChange}
        placeholder="ID da Raça"
      />
      <Button onClick={handleSearchById}>Buscar Raça por ID</Button>

      {/* Input em massa */}
      <textarea
        rows="5"
        value={bulkInput}
        onChange={(e) => setBulkInput(e.target.value)}
        placeholder="Insira os dados da raça separados por ponto e vírgula (;)"
      />
      <Button onClick={handleBulkInput}>Preencher Campos com Dados em Massa</Button>

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome da Raça"
        />
                  <Input
              type="text"
              name="busca"
              value={formData.busca}
              onChange={handleChange}
              placeholder="Busca"
          />
          <Input
              type="text"
              name="destaque"
              value={formData.destaque}
              onChange={handleChange}
              placeholder="Destaque"
          />
          <Input
              type="text"
              name="porte"
              value={formData.porte}
              onChange={handleChange}
              placeholder="Porte"
          />
          <Input
              type="text"
              name="nivel_latido"
              value={formData.nivel_latido}
              onChange={handleChange}
              placeholder="Nível de Latido"
          />
          <Input
              type="text"
              name="nivel_energia"
              value={formData.nivel_energia}
              onChange={handleChange}
              placeholder="Nível de Energia"
          />
          <Input
              type="text"
              name="nivel_socializacao"
              value={formData.nivel_socializacao}
              onChange={handleChange}
              placeholder="Nível de Socialização"
          />
          <Input
              type="text"
              name="nivel_treinamento"
              value={formData.nivel_treinamento}
              onChange={handleChange}
              placeholder="Nível de Treinamento"
          />
          <Input
              type="text"
              name="grupo"
              value={formData.grupo}
              onChange={handleChange}
              placeholder="Grupo"
          />
          <Input
              type="text"
              name="origem"
              value={formData.origem}
              onChange={handleChange}
              placeholder="Origem"
          />
          <Input
              type="text"
              name="peso_medio"
              value={formData.peso_medio}
              onChange={handleChange}
              placeholder="Peso Médio"
          />
          <Input
              type="text"
              name="altura_cernelha"
              value={formData.altura_cernelha}
              onChange={handleChange}
              placeholder="Altura na Cernelha"
          />
          <Input
              type="text"
              name="expectativa_vida"
              value={formData.expectativa_vida}
              onChange={handleChange}
              placeholder="Expectativa de Vida"
          />
          <Input
              type="text"
              name="detalhes.introducao"
              value={formData.detalhes.introducao}
              onChange={handleChange}
              placeholder="Introdução"
          />
          <Input
              type="text"
              name="detalhes.aparencia.pelagem"
              value={formData.detalhes.aparencia.pelagem}
              onChange={handleChange}
              placeholder="Pelagem"
          />
          <Input
              type="text"
              name="detalhes.aparencia.tamanho"
              value={formData.detalhes.aparencia.tamanho}
              onChange={handleChange}
              placeholder="Tamanho"
          />
          <Input
              type="text"
              name="detalhes.aparencia.caracteristicas"
              value={formData.detalhes.aparencia.caracteristicas}
              onChange={handleChange}
              placeholder="Características"
          />
          <Input
              type="text"
              name="detalhes.temperamento.caracteristica1"
              value={formData.detalhes.temperamento.caracteristica1}
              onChange={handleChange}
              placeholder="Característica 1"
          />
          <Input
              type="text"
              name="detalhes.temperamento.caracteristica2"
              value={formData.detalhes.temperamento.caracteristica2}
              onChange={handleChange}
              placeholder="Característica 2"
          />
          <Input
              type="text"
              name="detalhes.temperamento.caracteristica3"
              value={formData.detalhes.temperamento.caracteristica3}
              onChange={handleChange}
              placeholder="Característica 3"
          />
          <Input
              type="text"
              name="detalhes.temperamento.caracteristica4"
              value={formData.detalhes.temperamento.caracteristica4}
              onChange={handleChange}
              placeholder="Característica 4"
          />
          <Input
              type="text"
              name="detalhes.cuidados.cuidado1"
              value={formData.detalhes.cuidados.cuidado1}
              onChange={handleChange}
              placeholder="Cuidado 1"
          />
          <Input
              type="text"
              name="detalhes.cuidados.cuidado2"
              value={formData.detalhes.cuidados.cuidado2}
              onChange={handleChange}
              placeholder="Cuidado 2"
          />
          <Input
              type="text"
              name="detalhes.cuidados.cuidado3"
              value={formData.detalhes.cuidados.cuidado3}
              onChange={handleChange}
              placeholder="Cuidado 3"
          />
          <Input
              type="text"
              name="detalhes.cuidados.cuidado4"
              value={formData.detalhes.cuidados.cuidado4}
              onChange={handleChange}
              placeholder="Cuidado 4"
          />
          <Input
              type="text"
              name="detalhes.cuidados.cuidado5"
              value={formData.detalhes.cuidados.cuidado5}
              onChange={handleChange}
              placeholder="Cuidado 5"
          />
          <Input
              type="text"
              name="detalhes.cuidados.cuidado6"
              value={formData.detalhes.cuidados.cuidado6}
              onChange={handleChange}
              placeholder="Cuidado 6"
          />
          <Input
              type="text"
              name="detalhes.historia"
              value={formData.detalhes.historia}
              onChange={handleChange}
              placeholder="História"
          />
          <Input
              type="text"
              name="detalhes.curiosidades.curiosidade1"
              value={formData.detalhes.curiosidades.curiosidade1}
              onChange={handleChange}
              placeholder="Curiosidade 1"
          />
          <Input
              type="text"
              name="detalhes.curiosidades.curiosidade2"
              value={formData.detalhes.curiosidades.curiosidade2}
              onChange={handleChange}
              placeholder="Curiosidade 2"
          />
          <Input
              type="text"
              name="detalhes.curiosidades.curiosidade3"
              value={formData.detalhes.curiosidades.curiosidade3}
              onChange={handleChange}
              placeholder="Curiosidade 3"
          />
          <Input
              type="text"
              name="detalhes.consideracoes"
              value={formData.detalhes.consideracoes}
              onChange={handleChange}
              placeholder="Considerações"
          />
        <Input type="file" onChange={handleImagemCardChange} />
        <Input type="file" multiple onChange={handleImagensCarrosselChange} />
        <Button type="submit">{isUpdating ? 'Atualizar Raça' : 'Adicionar Raça'}</Button>
      </form>
    </div>
  );
};

export default UploadBreeds;
