import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import Input from '../components/Input';
import Button from '../components/Button';

const UploadBreeds = () => {
  const [formData, setFormData] = useState({
    nome: '',
    busca: '',
    destaque: '',
    porte: '',
    nivel_latido: '',
    nivel_energia: '',
    nivel_socializacao: '',
    nivel_treinamento: '',
    grupo: '',
    temperamento: '',
  });

  const [imagemCard, setImagemCard] = useState(null);
  const [imagensCarrossel, setImagensCarrossel] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagemCardChange = (e) => {
    setImagemCard(e.target.files[0]);
  };

  const handleImagensCarrosselChange = (e) => {
    setImagensCarrossel([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imagemCardRef = ref(storage, `racas/${formData.nome}/card.jpg`);
      await uploadBytes(imagemCardRef, imagemCard);
      const imagemCardUrl = await getDownloadURL(imagemCardRef);

      const imagensCarrosselUrls = await Promise.all(
        imagensCarrossel.map(async (imagem) => {
          const imagemRef = ref(storage, `racas/${formData.nome}/${imagem.name}`);
          await uploadBytes(imagemRef, imagem);
          return getDownloadURL(imagemRef);
        })
      );

      await addDoc(collection(firestore, 'racas'), {
        ...formData,
        imagem_card: imagemCardUrl,
        imagens_carrossel: imagensCarrosselUrls,
      });

      setFormData({
        nome: '',
        busca: '',
        destaque: '',
        porte: '',
        nivel_latido: '',
        nivel_energia: '',
        nivel_socializacao: '',
        nivel_treinamento: '',
        grupo: '',
        temperamento: '',
      });
      setImagemCard(null);
      setImagensCarrossel([]);

      alert('Raça adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar raça:', error);
      alert('Ocorreu um erro ao adicionar a raça. Por favor, tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <Input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Raça"
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
            name="temperamento"
            value={formData.temperamento}
            onChange={handleChange}
            placeholder="Temperamento"
        />
      <Input type="file" onChange={handleImagemCardChange} />
      <Input type="file" multiple onChange={handleImagensCarrosselChange} />
      <Button type="submit">Adicionar Raça</Button>
    </form>
  );
};

export default UploadBreeds;
