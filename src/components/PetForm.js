import React, { useState } from 'react';
import { database } from '../firebase';
import styles from './PetForm.module.css';
import InputMask from 'react-input-mask';

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
          <InputMask
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className={styles.input}
            mask={getInputMask(key)}
          />
        </div>
      ))}
      <button type="submit" className={styles.button}>Inserir</button>
    </form>
  );
};

const getInputMask = (key) => {
  switch (key) {
    case 'cpf':
      return '999.999.999-99';
    case 'rg':
      return '99.999.999-9';
    case 'celular_tutor':
    case 'celular_vet_comercial':
    case 'celular_vet_pessoal':
      return '(99) 99999-9999';
    case 'valor':
    case 'inspecao':
    case 'banho':
    case 'hotel':
    case 'passeio':
    case 'adestramento':
    case 'vet':
      return 'R$ 999,99';
    default:
      return '';
  }
};

export default PetForm;
