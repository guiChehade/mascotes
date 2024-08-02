import React, { useState } from 'react';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import PhotoEditor from '../components/PhotoEditor';
import Input from '../components/Input';
import Button from '../components/Button';
import Container from '../components/Container';
import styles from '../styles/Cadastro.module.css';

const Cadastro = () => {
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
      foto: fotoURL
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
      <h2>Cadastro de Mascotinho</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input label="Nome do Mascotinho" type="text" name="mascotinho" value={pet.mascotinho} onChange={handleChange} required placeholder="Max, Preta, Luna..." />
        <Input label="Aniversário" type="date" name="aniversario" value={pet.aniversario} onChange={handleChange} placeholder="Data de nascimento do pet" />
        <Input label="Raça" type="text" name="raca" value={pet.raca} onChange={handleChange} placeholder="Border Collie, SRD, Labrador..." />
        <Input label="Tutor" type="text" name="tutor" value={pet.tutor} onChange={handleChange} required placeholder="José da Silva" />
        <Input label="RG" type="text" name="rg" value={pet.rg} onChange={handleChange} mask="99.999.999-9" placeholder="99.999.999-9" />
        <Input label="CPF" type="text" name="cpf" value={pet.cpf} onChange={handleChange} mask="999.999.999-99" placeholder="999.999.999-99" />
        <Input label="Endereço" type="text" name="endereco" value={pet.endereco} onChange={handleChange} placeholder="Rua dos Bobos, 0" />
        <Input label="Email" type="email" name="email" value={pet.email} onChange={handleChange} placeholder="tutor@mascotes.com.br" />
        <Input label="Celular do Tutor" type="text" name="celularTutor" value={pet.celularTutor} onChange={handleChange} mask="(99) 99999-9999" placeholder="(11) 99999-9999" />
        <Input label="Veterinário" type="text" name="veterinario" value={pet.veterinario} onChange={handleChange} placeholder="Dr. Animal" />
        <Input label="Endereço do Vet" type="text" name="enderecoVet" value={pet.enderecoVet} onChange={handleChange} placeholder="Avenida Vet, 123" />
        <Input label="Celular Vet Comercial" type="text" name="celularVetComercial" value={pet.celularVetComercial} onChange={handleChange} mask="(99) 99999-9999" placeholder="(11) 3456-7890" />
        <Input label="Celular Vet Pessoal" type="text" name="celularVetPessoal" value={pet.celularVetPessoal} onChange={handleChange} mask="(99) 99999-9999" placeholder="(11) 98765-4321" />
        <Input
          label="Foto do Pet"
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setEditorOpen(true);
          }}
          placeholder="Selecione uma foto do pet"
        />
        <Button type="submit">Cadastrar</Button>
      </form>
      {editorOpen && <PhotoEditor image={image} setImage={(img) => setPet((prevPet) => ({ ...prevPet, foto: img }))} setEditorOpen={setEditorOpen} />}
    </Container>
  );
};

export default Cadastro;