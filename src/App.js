import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Creche from './pages/Creche';
import Financas from './pages/Financas';
import Usuarios from './pages/Usuarios';
import Controle from './pages/Controle';
import EditarPet from './pages/EditarPet';
import './styles/global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState({});

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} userRoles={userRoles} />
      <Menu isAuthenticated={isAuthenticated} userRoles={userRoles} />
      <div style={{ marginTop: '20vh' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/cadastro" element={isAuthenticated ? <Cadastro /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRoles={setUserRoles} />} />
          <Route path="/creche" element={isAuthenticated ? <Creche /> : <Navigate to="/login" />} />
          <Route path="/financas" element={isAuthenticated && userRoles.isOwner ? <Financas /> : <Navigate to="/login" />} />
          <Route path="/usuarios" element={isAuthenticated && userRoles.isOwner ? <Usuarios /> : <Navigate to="/login" />} />
          <Route path="/controle/:id" element={isAuthenticated ? <Controle /> : <Navigate to="/login" />} />
          <Route path="/editar/:id" element={isAuthenticated ? <EditarPet /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
