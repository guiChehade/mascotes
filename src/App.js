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
import Dashboard from './pages/Dashboard';
import './styles/global.css';

function App() {
  const [theme, setTheme] = useState('dark-mode');
  const [isAuthenticated, setAuthenticated] = useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark-mode' ? 'light-mode' : 'dark-mode'));
  };

  return (
    <div className={theme}>
      <Router>
        <Header toggleTheme={toggleTheme} />
        <div className="container" style={{ marginTop: '100px', marginBottom: '60px' }}>
          <Routes>
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/controle" element={<Controle />} />
            <Route path="/financas" element={<Financas />} />
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
