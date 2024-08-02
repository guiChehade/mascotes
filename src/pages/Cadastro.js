import React, { useState } from 'react';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import PhotoEditor from '../components/PhotoEditor';
import Container from '../components/Container';
import Input from '../components/Input';
import styles from '../styles/Cadastro.module.css';

const Cadastro = ({ currentUser }) => {
  const [pet, setPet] = useState({
    mascotinho: '',
    aniversario: '',
    raca: '',
    tutor: '',
    rg: '',
    cpf: '',
    endereco: '',
    email: '',
    celularTutor: '',
    veterinario: '',
    enderecoVet: '',
    celularVetComercial: '',
    celularVetPessoal: '',
    foto: ''
  });

  const [image, setImage] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet((prevPet) => ({
      ...prevPet,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setEditorOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fotoURL = '';
    if (image) {
      const fotoRef = ref(storage, `pets/${Date.now()}_${image.name}`);
      await uploadBytes(fotoRef, image);
      fotoURL = await getDownloadURL(fotoRef);
    }

    await addDoc(collection(firestore, 'pets'), {
      ...pet,
      foto: fotoURL,
      createdBy: currentUser.name,
    });

    alert('Pet cadastrado com sucesso!');
    setPet({
      mascotinho: '',
      aniversario: '',
      raca: '',
      tutor: '',
      rg: '',
      cpf: '',
      endereco: '',
      email: '',
      celularTutor: '',
      veterinario: '',
      enderecoVet: '',
      celularVetComercial: '',
      celularVetPessoal: '',
      foto: ''
    });
  };

  return (
    <Container className={styles.cadastroContainer}>
      <h2>Cadastro de Mascotinhos</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Nome do Mascotinho" type="text" name="mascotinho" value={pet.mascotinho} onChange={handleChange} required placeholder="Max, Preta, Luna..." />
        <Input label="Aniversário" type="date" name="aniversario" value={pet.aniversario} onChange={handleChange} placeholder="01/01/2020" />
        <Input label="Raça" type="text" name="raca" value={pet.raca} onChange={handleChange} placeholder="Border Collie, SRD, Labrador..." />
        <Input label="Tutor" type="text" name="tutor" value={pet.tutor} onChange={handleChange} required placeholder="José da Silva" />
        <Input label="RG" type="text" name="rg" value={pet.rg} onChange={handleChange} placeholder="99.999.999-9" mask="99.999.999-9" />
        <Input label="CPF" type="text" name="cpf" value={pet.cpf} onChange={handleChange} placeholder="999.999.999-99" mask="999.999.999-99" />
        <Input label="Endereço" type="text" name="endereco" value={pet.endereco} onChange={handleChange} placeholder="Rua dos Mascotes, 10" />
        <Input label="Email" type="email" name="email" value={pet.email} onChange={handleChange} placeholder="tutor@exemplo.com" />
        <Input label="Celular do Tutor" type="text" name="celularTutor" value={pet.celularTutor} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="Veterinário" type="text" name="veterinario" value={pet.veterinario} onChange={handleChange} placeholder="Dr. Vet" />
        <Input label="Endereço do Vet" type="text" name="enderecoVet" value={pet.enderecoVet} onChange={handleChange} placeholder="Rua Veterinária, 123" />
        <Input label="Celular Vet Comercial" type="text" name="celularVetComercial" value={pet.celularVetComercial} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="Celular Vet Pessoal" type="text" name="celularVetPessoal" value={pet.celularVetPessoal} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="Foto do Pet" type="file" accept="image/*" onChange={handleFileChange} />
        <button className={styles.button} type="submit">Cadastrar</button>
      </form>
      {editorOpen && <PhotoEditor image={image} setImage={(img) => setPet((prevPet) => ({ ...prevPet, foto: img }))} setEditorOpen={setEditorOpen} />}
    </Container>
  );
};

export default Cadastro;
