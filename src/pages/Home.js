import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import styles from './Home.module.css';

const Home = ({ isAuthenticated }) => (
  <div className={styles.home}>
    <h1>Bem-vindo ao ERP Mascotinhos</h1>
    {isAuthenticated && (
      <div className={styles.buttons}>
        <div className={styles.buttonWrapper}>
          <Link to="/"><Button>Início</Button></Link>
          <Link to="/cadastro"><Button>Cadastro</Button></Link>
        </div>
        <div className={styles.buttonWrapper}>
          <Link to="/controle"><Button>Controle</Button></Link>
          <Link to="/financas"><Button>Finanças</Button></Link>
        </div>
      </div>
    )}
  </div>
);

export default Home;
