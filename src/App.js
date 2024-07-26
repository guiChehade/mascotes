import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Controle from './pages/Controle';
import Financas from './pages/Financas';
import Login from './components/Login';
import './App.module.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/controle" element={<Controle />} />
        <Route path="/financas" element={<Financas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
