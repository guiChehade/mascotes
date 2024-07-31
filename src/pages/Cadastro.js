import React, { useState } from 'react';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import PhotoEditor from '../components/PhotoEditor';
import '../styles/cadastro.css';

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
    <div className="cadastro-container">
      <h2>Cadastro de Pet</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome do Mascotinho</label>
        <input type="text" name="mascotinho" value={pet.mascotinho} onChange={handleChange} required />
        <label>Aniversário</label>
        <input type="date" name="aniversario" value={pet.aniversario} onChange={handleChange} />
        <label>Raça</label>
        <input type="text" name="raca" value={pet.raca} onChange={handleChange} />
        <label>Tutor</label>
        <input type="text" name="tutor" value={pet.tutor} onChange={handleChange} required />
        {/* Adicione os demais campos aqui */}
        <label>Foto do Pet</label>
        <input type="file" accept="image/*" onChange={(e) => {
          setImage(e.target.files[0]);
          setEditorOpen(true);
        }} />
        <button type="submit">Cadastrar</button>
      </form>
      {editorOpen && <PhotoEditor image={image} setImage={(img) => setPet((prevPet) => ({ ...prevPet, foto: img }))} setEditorOpen={setEditorOpen} />}
    </div>
  );
};

export default Cadastro;
