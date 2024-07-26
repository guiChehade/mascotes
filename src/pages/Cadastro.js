import React from 'react';
import PetForm from '../components/PetForm';
import styles from './Cadastro.module.css';

const Cadastro = () => (
  <div className={styles.cadastro}>
    <h1>Cadastro de Mascotinhos</h1>
    <PetForm />
  </div>
);

export default Cadastro;
