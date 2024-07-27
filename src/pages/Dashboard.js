import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import '../dashboard.css';

const Dashboard = () => (
  <div className="dashboard">
    <h1>Bem-vindo ao ERP Mascotinhos</h1>
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
  </div>
);

export default Dashboard;
