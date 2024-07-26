import React, { useState } from 'react';
import { database } from '../firebase';
import styles from './PetForm.module.css';

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
    database.ref('pets').push(formData)
      .then(() => alert('Mascotinho adicionado com sucesso!'))
      .catch((error) => alert('Erro ao adicionar mascotinho: ', error));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {Object.keys(formData).map((key) => (
        <div className={styles.formGroup} key={key}>
          <label className={styles.label}>{key}</label>
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      ))}
      <button type="submit" className={styles.button}>Inserir</button>
    </form>
  );
};

export default PetForm;
