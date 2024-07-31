import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import '../styles/cadastro.css';

const Cadastro = () => {
  const [mascotinho, setMascotinho] = useState('');
  const [tutor, setTutor] = useState('');
  const [raca, setRaca] = useState('');
  const [foto, setFoto] = useState(null);
  const [aniversario, setAniversario] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(firestore, 'pets'), {
        mascotinho,
        tutor,
        raca,
        foto,
        aniversario,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Mascotinho</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome do Mascotinho</label>
        <input
          type="text"
          value={mascotinho}
          onChange={(e) => setMascotinho(e.target.value)}
          required
        />
        <label>Nome do Tutor</label>
        <input
          type="text"
          value={tutor}
          onChange={(e) => setTutor(e.target.value)}
          required
        />
        <label>Raça</label>
        <input
          type="text"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
        />
        <label>Aniversário</label>
        <input
          type="date"
          value={aniversario}
          onChange={(e) => setAniversario(e.target.value)}
        />
        <label>Foto do Mascotinho</label>
        <input
          type="file"
          onChange={(e) => setFoto(e.target.files[0])}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
