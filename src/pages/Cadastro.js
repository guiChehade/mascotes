import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    mascotinho: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petsCollection = collection(firestore, 'pets');
      await addDoc(petsCollection, formData);
      alert("Mascotinho cadastrado com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar mascotinho: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Mascotinho</label>
        <input type="text" name="mascotinho" value={formData.mascotinho} onChange={handleChange} className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Raça</label>
        <input type="text" name="raca" value={formData.raca} onChange={handleChange} className={styles.input} />
      </div>
      {/* Adicione os outros campos da mesma forma */}
      <button type="submit" className={styles.button}>Inserir</button>
    </form>
  );
};

export default Cadastro;
