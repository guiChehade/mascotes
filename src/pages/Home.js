import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/Home.css';

const Home = ({ isAuthenticated }) => (
  <div className="home">
    <h1>Bem-vindo ao ERP Mascotinhos</h1>
    {isAuthenticated && (
      <div className="buttons">
        <div className="buttonWrapper">
          <Link to="/"><Button>Início</Button></Link>
          <Link to="/cadastro"><Button>Cadastro</Button></Link>
        </div>
        <div className="buttonWrapper">
          <Link to="/controle"><Button>Controle</Button></Link>
          <Link to="/financas"><Button>Finanças</Button></Link>
        </div>
      </div>
    )}
  </div>
);

export default Home;
