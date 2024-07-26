import React from 'react';
import PetList from '../components/PetList';
import styles from './Controle.module.css';

const Controle = () => (
  <div className={styles.controle}>
    <h1>Controle de Mascotinhos</h1>
    <PetList />
  </div>
);

export default Controle;
