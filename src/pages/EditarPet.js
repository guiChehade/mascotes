import React, { useState, useEffect } from 'react';
import { storage, firestore } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Input from '../components/Input';
import Button from '../components/Button';
import PhotoEditor from '../components/PhotoEditor';
import Container from '../components/Container';
import styles from '../styles/EditarPet.module.css';

const EditarPet = ({ petId, currentUser }) => {
  const [formData, setFormData] = useState({
    mascotinho: '',
    aniversario: '',
    raca: '',
    tutor: '',
    rg: '',
    cpf: '',
    endereco: '',
    email: '',
    celular_tutor: '',
    veterinario: '',
    endereco_vet: '',
    celular_vet_comercial: '',
    celular_vet_pessoal: '',
    photoURL: ''
  });

  const [photo, setPhoto] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      const petDoc = await getDoc(doc(firestore, 'pets', petId));
      if (petDoc.exists) {
        setFormData(petDoc.data());
      }
    };

    fetchPetData();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handlePhotoChange = (file) => {
    setPhoto(file);
    setEditorOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = formData.photoURL;
      if (photo) {
        const photoRef = ref(storage, `pets/${Date.now()}_${photo.name}`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }
      await updateDoc(doc(firestore, 'pets', petId), {
        ...formData,
        photoURL,
        createdBy: currentUser.name
      });
      alert('Pet atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar pet: ' + error.message);
    }
  };

  return (
    <Container className={styles.editarPetContainer}>
      <form onSubmit={handleSubmit}>
        <Input label="Nome do Mascotinho" type="text" name="mascotinho" value={formData.mascotinho} onChange={handleChange} required />
        <Input label="Aniversário" type="date" name="aniversario" value={formData.aniversario} onChange={handleChange} />
        <Input label="Raça" type="text" name="raca" value={formData.raca} onChange={handleChange} />
        <Input label="Tutor" type="text" name="tutor" value={formData.tutor} onChange={handleChange} required />
        <Input label="RG" type="text" name="rg" value={formData.rg} onChange={handleChange} />
        <Input label="CPF" type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
        <Input label="Endereço" type="text" name="endereco" value={formData.endereco} onChange={handleChange} />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <Input label="Celular do Tutor" type="text" name="celular_tutor" value={formData.celular_tutor} onChange={handleChange} />
        <Input label="Veterinário" type="text" name="veterinario" value={formData.veterinario} onChange={handleChange} />
        <Input label="Endereço do Veterinário" type="text" name="endereco_vet" value={formData.endereco_vet} onChange={handleChange} />
        <Input label="Celular Veterinário Comercial" type="text" name="celular_vet_comercial" value={formData.celular_vet_comercial} onChange={handleChange} />
        <Input label="Celular Veterinário Pessoal" type="text" name="celular_vet_pessoal" value={formData.celular_vet_pessoal} onChange={handleChange} />
        <Input label="Foto" type="file" accept="image/*" onChange={(e) => handlePhotoChange(e.target.files[0])} />
        <Button type="submit">Atualizar</Button>
      </form>
      {editorOpen && <PhotoEditor image={photo} setImage={(img) => setFormData((prevFormData) => ({ ...prevFormData, photoURL: img }))} setEditorOpen={setEditorOpen} />}
    </Container>
  );
};

export default EditarPet;
