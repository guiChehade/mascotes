import React, { useState, useEffect } from 'react';
import { storage, firestore } from '../firebase';
import '../styles/EditarPet.css';

const EditarPet = ({ petId }) => {
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
  });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPetData = async () => {
      const petDoc = await firestore.collection('pets').doc(petId).get();
      if (petDoc.exists) {
        setFormData(petDoc.data());
      }
    };

    fetchPetData();
  }, [petId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = formData.photoURL;
      if (photo) {
        const storageRef = storage.ref();
        const photoRef = storageRef.child(`photos/${photo.name}`);
        await photoRef.put(photo);
        photoURL = await photoRef.getDownloadURL();
      }
      await firestore.collection('pets').doc(petId).update({
        ...formData,
        photoURL,
      });
      alert('Pet atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar pet: ' + error.message);
    }
  };

  return (
    <div className="editar-pet-container">
      <form onSubmit={handleSubmit}>
        <label>Nome do Mascotinho</label>
        <input type="text" name="mascotinho" value={formData.mascotinho} onChange={handleChange} required />
        
        <label>Aniversário</label>
        <input type="date" name="aniversario" value={formData.aniversario} onChange={handleChange} />
        
        <label>Raça</label>
        <input type="text" name="raca" value={formData.raca} onChange={handleChange} />
        
        <label>Tutor</label>
        <input type="text" name="tutor" value={formData.tutor} onChange={handleChange} required />
        
        <label>RG</label>
        <input type="text" name="rg" value={formData.rg} onChange={handleChange} />
        
        <label>CPF</label>
        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
        
        <label>Endereço</label>
        <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} />
        
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        
        <label>Celular do Tutor</label>
        <input type="text" name="celular_tutor" value={formData.celular_tutor} onChange={handleChange} />
        
        <label>Veterinário</label>
        <input type="text" name="veterinario" value={formData.vet} onChange={handleChange} />
        
        <label>Endereço do Veterinário</label>
        <input type="text" name="endereco_vet" value={formData.endereco_vet} onChange={handleChange} />
        
        <label>Celular Veterinário Comercial</label>
        <input type="text" name="celular_vet_comercial" value={formData.celular_vet_comercial} onChange={handleChange} />
        
        <label>Celular Veterinário Pessoal</label>
        <input type="text" name="celular_vet_pessoal" value={formData.celular_vet_pessoal} onChange={handleChange} />
        
        <label>Foto</label>
        <input type="file" onChange={handlePhotoChange} />

        <button type="submit">Atualizar</button>
      </form>
    </div>
  );
};

export default EditarPet;
