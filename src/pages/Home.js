import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import styles from './Home.module.css';

const Home = () => (
  <div className={styles.home}>
    <h1>Bem-vindo ao ERP Mascotinhos</h1>
    <div className={styles.buttons}>
      <Link to="/"><Button>Início</Button></Link>
      <Link to="/cadastro"><Button>Cadastro</Button></Link>
      <Link to="/controle"><Button>Controle</Button></Link>
      <Link to="/financas"><Button>Finanças</Button></Link>
    </div>
  </div>
);

export default Home;
