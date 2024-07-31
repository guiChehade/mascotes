import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Creche from './pages/Creche';
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
      <div style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/register" />} />
          <Route path="/cadastro" element={isAuthenticated ? <Cadastro /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRoles={setUserRoles} />} />
          <Route path="/creche" element={isAuthenticated ? <Creche /> : <Navigate to="/login" />} />
          <Route path="/financas" element={isAuthenticated && userRoles.isOwner ? <Financas /> : <Navigate to="/login" />} />
          <Route path="/usuarios" element={isAuthenticated && userRoles.isOwner ? <Usuarios /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
