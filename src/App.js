import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Controle from './pages/Controle';
import Financas from './pages/Financas';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

function App() {
  const [theme, setTheme] = useState('dark-mode');
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={theme}>
      <Router>
        <Header toggleTheme={toggleTheme} />
        <div className="container" style={{ marginTop: '100px', marginBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/controle" element={<Controle />} />
            <Route path="/financas" element={<Financas />} />
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
