import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Controle from './pages/Controle';
import Financas from './pages/Financas';
import Login from './components/Login';
import Register from './components/Register';
import './styles/global.css';

function App() {
  const [theme, setTheme] = useState('dark-mode');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark-mode' ? 'light-mode' : 'dark-mode'));
  };

  return (
    <div className={theme}>
      <Router>
        <Header toggleTheme={toggleTheme} />
        <div className="container">
          <Routes>
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/controle" element={<Controle />} />
            <Route path="/financas" element={<Financas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
