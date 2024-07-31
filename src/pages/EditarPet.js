import React, { useState, useEffect } from 'react';
import { firestore, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/editarPet.css';

const EditarPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [foto, setFoto] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      const petDoc = await getDoc(doc(firestore, 'pets', id));
      if (petDoc.exists()) {
        setPet(petDoc.data());
      }
    };
    fetchPet();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet((prevPet) => ({
      ...prevPet,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fotoURL = pet.foto;
    if (foto) {
      const fotoRef = ref(storage, `pets/${foto.name}`);
      await uploadBytes(fotoRef, foto);
      fotoURL = await getDownloadURL(fotoRef);
    }

    await updateDoc(doc(firestore, 'pets', id), {
      ...pet,
      foto: fotoURL
    });

    alert('Pet atualizado com sucesso!');
    navigate('/creche');
  };

  return (
    <div className="editarPet-container">
      <h2>Editar Pet</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome do Mascotinho</label>
        <input
          type="text"
          name="mascotinho"
          value={pet.mascotinho}
          onChange={handleChange}
          required
        />
        <label>Aniversário</label>
        <input
          type="date"
          name="aniversario"
          value={pet.aniversario}
          onChange={handleChange}
        />
        <label>Raça</label>
        <input
          type="text"
          name="raca"
          value={pet.raca}
          onChange={handleChange}
        />
        <label>Nome do Tutor</label>
        <input
          type="text"
          name="tutor"
          value={pet.tutor}
          onChange={handleChange}
          required
        />
        <label>RG</label>
        <input
          type="text"
          name="rg"
          value={pet.rg}
          onChange={handleChange}
        />
        <label>CPF</label>
        <input
          type="text"
          name="cpf"
          value={pet.cpf}
          onChange={handleChange}
        />
        <label>Endereço</label>
        <input
          type="text"
          name="endereco"
          value={pet.endereco}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={pet.email}
          onChange={handleChange}
        />
        <label>Celular do Tutor</label>
        <input
          type="tel"
          name="celularTutor"
          value={pet.celularTutor}
          onChange={handleChange}
        />
        <label>Veterinário</label>
        <input
          type="text"
          name="veterinario"
          value={pet.veterinario}
          onChange={handleChange}
        />
        <label>Endereço do Veterinário</label>
        <input
          type="text"
          name="enderecoVet"
          value={pet.enderecoVet}
          onChange={handleChange}
        />
        <label>Celular Comercial do Veterinário</label>
        <input
          type="tel"
          name="celularVetComercial"
          value={pet.celularVetComercial}
          onChange={handleChange}
        />
        <label>Celular Pessoal do Veterinário</label>
        <input
          type="tel"
          name="celularVetPessoal"
          value={pet.celularVetPessoal}
          onChange={handleChange}
        />
        <label>Foto do Pet</label>
        <input
          type="file"
          onChange={(e) => setFoto(e.target.files[0])}
        />
        <button type="submit">Atualizar</button>
        <button type="button" onClick={() => navigate('/creche')}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarPet;
