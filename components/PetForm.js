// src/components/PetForm.js
import React, { useState } from 'react';
import firebase from '../firebase'; // Certifique-se de configurar o Firebase no projeto

const PetForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    raca: '',
    frequencia: '',
    valor: '',
    inspecao: '',
    banho: '',
    hotel: '',
    passeio: '',
    adestramento: '',
    vet: '',
    tutor: '',
    rg: '',
    cpf: '',
    endereco: '',
    email: '',
    celular_tutor: '',
    veterinario: '',
    endereco_vet: '',
    celular_vet_comercial: '',
    celular_vet_pessoal: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase.database().ref('pets').push(formData)
      .then(() => alert('Mascotinho adicionado com sucesso!'))
      .catch((error) => alert('Erro ao adicionar mascotinho: ', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => (
        <div className="form-group" key={key}>
          <label>{key}</label>
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit">Inserir</button>
    </form>
  );
};

export default PetForm;
