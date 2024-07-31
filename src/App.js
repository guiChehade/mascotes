import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Controle from './pages/Controle';
import Financas from './pages/Financas';
import Usuarios from './pages/Usuarios';
import Register from './components/Register';
import './styles/global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState({});

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} userRoles={userRoles} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRoles={setUserRoles} />} />
        <Route path="/controle" element={isAuthenticated ? <Controle /> : <Navigate to="/login" />} />
        <Route path="/financas" element={isAuthenticated && userRoles.isOwner ? <Financas /> : <Navigate to="/login" />} />
        <Route path="/usuarios" element={isAuthenticated && userRoles.isOwner ? <Usuarios /> : <Navigate to="/login" />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
