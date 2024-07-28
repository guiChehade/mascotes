import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Controle from './pages/Controle';
import Financas from './pages/Financas';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import EditarPet from './pages/EditarPet';
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
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/cadastro" element={isAuthenticated ? <Cadastro /> : <Navigate to="/login" />} />
            <Route path="/controle" element={isAuthenticated ? <Controle /> : <Navigate to="/login" />} />
            <Route path="/financas" element={isAuthenticated ? <Financas /> : <Navigate to="/login" />} />
            <Route path="/editar-pet/:id" element={isAuthenticated ? <EditarPet /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
