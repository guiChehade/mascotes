import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storage, firestore } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Container from "../components/Container";
import Input from "../components/Input";
import Button from "../components/Button";
import PhotoEditor from "../components/PhotoEditor";
import ampulheta from "../assets/icon/ampulheta.png";
import styles from '../styles/EditarPet.module.css';

const EditarPet = ({ currentUser }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
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
    foto: '',
    local: ''
  });

  const [photo, setPhoto] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      if (petId) {
        const petDoc = await getDoc(doc(firestore, 'pets', petId));
        if (petDoc.exists) {
          const data = petDoc.data();
          setFormData({
            mascotinho: data.mascotinho || '',
            aniversario: data.aniversario || '',
            raca: data.raca || '',
            tutor: data.tutor || '',
            rg: data.rg || '',
            cpf: data.cpf || '',
            endereco: data.endereco || '',
            email: data.email || '',
            celular_tutor: data.celular_tutor || '',
            veterinario: data.veterinario || '',
            endereco_vet: data.endereco_vet || '',
            celular_vet_comercial: data.celular_vet_comercial || '',
            celular_vet_pessoal: data.celular_vet_pessoal || '',
            foto: data.foto || '',
            local: data.local || 'Casa',
          });
        } else {
          navigate('/not-found');
        }
      } else {
        console.error('Pet ID is undefined');
      }
    };

    fetchPetData();
  }, [petId, navigate]);

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

    if (!currentUser || !currentUser.name) {
      alert('Usuário não autenticado.');
      return;
    }

    try {
      let foto = formData.foto;

      // Verifique se há uma nova foto a ser enviada
      if (photo instanceof File) {
        const photoRef = ref(storage, `pets/${Date.now()}_${photo.name}`);
        await uploadBytes(photoRef, photo);
        foto = await getDownloadURL(photoRef);
        console.log('File available at', foto);
      } else if (photo) { // This block handles the case where a resized image is set using data URL
        const photoBlob = await fetch(photo); // Fetch the image from data URL
        const photoData = await photoBlob.blob();
        const photoRef = ref(storage, `pets/${Date.now()}_${photo.name}`); // Assuming 'photo' contains the filename
        await uploadBytes(photoRef, photoData);
        foto = await getDownloadURL(photoRef);
        console.log('File available at', foto);
      }

      // Atualize o documento no Firestore com a URL da foto
      const updatedData = {
        ...formData,
        foto, // URL da foto ou o valor atual
        updatedBy: currentUser.name,
      };

      await updateDoc(doc(firestore, 'pets', petId), updatedData);

      alert('Pet atualizado com sucesso!');
      navigate("/mascotes");
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      alert('Erro ao atualizar pet: ' + error.message);
    }
  };

  const handleInactivate = async () => {
    try {
      await updateDoc(doc(firestore, "pets", petId), { local: "Inativo" });
      alert("Pet marcado como Inativo.");
      navigate("/mascotes");
    } catch (error) {
      console.error("Erro ao inativar pet:", error);
      alert("Erro ao inativar pet.");
    }
  };

  return (
    <Container className={styles.editarPetContainer}>
      <h1>Editar Pet</h1>
      {currentUser ? (
        <form className={styles.editarPetForm} onSubmit={handleSubmit}>
          <Input label="Nome do Mascotinho" type="text" name="mascotinho" value={formData.mascotinho || ''} onChange={handleChange} required />
          <Input label="Aniversário" type="date" name="aniversario" value={formData.aniversario || ''} onChange={handleChange} />
          <Input label="Raça" type="text" name="raca" value={formData.raca || ''} onChange={handleChange} />
          <Input label="Tutor" type="text" name="tutor" value={formData.tutor || ''} onChange={handleChange} required />
          <Input label="RG" type="text" name="rg" value={formData.rg || ''} onChange={handleChange} mask="99.999.999-9" />
          <Input label="CPF" type="text" name="cpf" value={formData.cpf || ''} onChange={handleChange} mask="999.999.999-99" />
          <Input label="Endereço" type="text" name="endereco" value={formData.endereco || ''} onChange={handleChange} />
          <Input label="Email" type="email" name="email" value={formData.email || ''} onChange={handleChange} />
          <Input label="Celular do Tutor" type="text" name="celular_tutor" value={formData.celular_tutor || ''} onChange={handleChange} mask="(99) 99999-9999" />
          <Input label="Veterinário" type="text" name="veterinario" value={formData.veterinario || ''} onChange={handleChange} />
          <Input label="Endereço do Veterinário" type="text" name="endereco_vet" value={formData.endereco_vet || ''} onChange={handleChange} />
          <Input label="Celular Veterinário Comercial" type="text" name="celular_vet_comercial" value={formData.celular_vet_comercial || ''} onChange={handleChange} mask="(99) 99999-9999" />
          <Input label="Celular Veterinário Pessoal" type="text" name="celular_vet_pessoal" value={formData.celular_vet_pessoal || ''} onChange={handleChange} mask="(99) 99999-9999" />
          <Input label="Foto" type="file" accept="image/*" onChange={(e) => handlePhotoChange(e.target.files[0])} />
          <Button onClick={handleInactivate} className={styles.buttonNao}>Inativar Pet</Button>
          <Button  className={styles.buttonSim} type="submit">Salvar</Button>
        </form>
      ) : (
        <div className={styles.loadingContainer}>
          <img src={ampulheta} alt="Loading" />
        </div>
      )}
      {editorOpen && <PhotoEditor image={photo} setImage={(img) => setFormData((prevFormData) => ({ ...prevFormData, foto: img }))} setEditorOpen={setEditorOpen} />}
    </Container>
  );
};

export default EditarPet;
