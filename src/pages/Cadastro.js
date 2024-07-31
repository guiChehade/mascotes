import React, { useState } from 'react';
import { firestore, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/cadastro.css';

const Cadastro = () => {
  const [mascotinho, setMascotinho] = useState('');
  const [aniversario, setAniversario] = useState('');
  const [raca, setRaca] = useState('');
  const [tutor, setTutor] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [celularTutor, setCelularTutor] = useState('');
  const [veterinario, setVeterinario] = useState('');
  const [enderecoVet, setEnderecoVet] = useState('');
  const [celularVetComercial, setCelularVetComercial] = useState('');
  const [celularVetPessoal, setCelularVetPessoal] = useState('');
  const [foto, setFoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fotoURL = '';
    if (foto) {
      const fotoRef = ref(storage, `pets/${foto.name}`);
      await uploadBytes(fotoRef, foto);
      fotoURL = await getDownloadURL(fotoRef);
    }

    try {
      await addDoc(collection(firestore, 'pets'), {
        mascotinho,
        aniversario,
        raca,
        tutor,
        rg,
        cpf,
        endereco,
        email,
        celularTutor,
        veterinario,
        enderecoVet,
        celularVetComercial,
        celularVetPessoal,
        foto: fotoURL
      });
      alert('Pet cadastrado com sucesso!');
    } catch (error) {
      alert(`Erro ao cadastrar pet: ${error.message}`);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Pet</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome do Mascotinho</label>
        <input
          type="text"
          value={mascotinho}
          onChange={(e) => setMascotinho(e.target.value)}
          placeholder="Nome do Mascotinho"
          required
        />
        <label>Aniversário</label>
        <input
          type="date"
          value={aniversario}
          onChange={(e) => setAniversario(e.target.value)}
          placeholder="Aniversário"
        />
        <label>Raça</label>
        <input
          type="text"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
          placeholder="Raça"
        />
        <label>Nome do Tutor</label>
        <input
          type="text"
          value={tutor}
          onChange={(e) => setTutor(e.target.value)}
          placeholder="Nome do Tutor"
          required
        />
        <label>RG</label>
        <input
          type="text"
          value={rg}
          onChange={(e) => setRg(e.target.value)}
          placeholder="RG"
        />
        <label>CPF</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
        />
        <label>Endereço</label>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço"
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <label>Celular do Tutor</label>
        <input
          type="tel"
          value={celularTutor}
          onChange={(e) => setCelularTutor(e.target.value)}
          placeholder="Celular do Tutor"
        />
        <label>Veterinário</label>
        <input
          type="text"
          value={veterinario}
          onChange={(e) => setVeterinario(e.target.value)}
          placeholder="Veterinário"
        />
        <label>Endereço do Veterinário</label>
        <input
          type="text"
          value={enderecoVet}
          onChange={(e) => setEnderecoVet(e.target.value)}
          placeholder="Endereço do Veterinário"
        />
        <label>Celular Comercial do Veterinário</label>
        <input
          type="tel"
          value={celularVetComercial}
          onChange={(e) => setCelularVetComercial(e.target.value)}
          placeholder="Celular Comercial do Veterinário"
        />
        <label>Celular Pessoal do Veterinário</label>
        <input
          type="tel"
          value={celularVetPessoal}
          onChange={(e) => setCelularVetPessoal(e.target.value)}
          placeholder="Celular Pessoal do Veterinário"
        />
        <label>Foto do Pet</label>
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
