import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

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
        createdBy: user.uid
      });
      alert('Pet cadastrado com sucesso!');
    } catch (error) {
      alert(`Erro ao cadastrar pet: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Cadastro de Pet</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={mascotinho}
          onChange={(e) => setMascotinho(e.target.value)}
          placeholder="Nome do Mascotinho"
          required
        />
        <input
          type="date"
          value={aniversario}
          onChange={(e) => setAniversario(e.target.value)}
          placeholder="Aniversário do Pet"
          required
        />
        <input
          type="text"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
          placeholder="Raça"
          required
        />
        <input
          type="text"
          value={tutor}
          onChange={(e) => setTutor(e.target.value)}
          placeholder="Nome do Tutor"
          required
        />
        <input
          type="text"
          value={rg}
          onChange={(e) => setRg(e.target.value)}
          placeholder="RG"
          required
        />
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
          required
        />
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={celularTutor}
          onChange={(e) => setCelularTutor(e.target.value)}
          placeholder="Celular do Tutor"
          required
        />
        <input
          type="text"
          value={veterinario}
          onChange={(e) => setVeterinario(e.target.value)}
          placeholder="Veterinário"
          required
        />
        <input
          type="text"
          value={enderecoVet}
          onChange={(e) => setEnderecoVet(e.target.value)}
          placeholder="Endereço do Veterinário"
          required
        />
        <input
          type="text"
          value={celularVetComercial}
          onChange={(e) => setCelularVetComercial(e.target.value)}
          placeholder="Celular Comercial do Veterinário"
          required
        />
        <input
          type="text"
          value={celularVetPessoal}
          onChange={(e) => setCelularVetPessoal(e.target.value)}
          placeholder="Celular Pessoal do Veterinário"
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
