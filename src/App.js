import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Financas from './pages/Financas';
import Login from './components/Login';
import Register from './components/Register';
import EditarPet from './pages/EditarPet';
import Creche from './pages/Creche';
import Usuarios from './pages/Usuarios';
import Contrato from './pages/Contrato';
import { firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import './styles/global.css';

function App() {
  const [theme, setTheme] = useState('dark-mode');
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState({
    isOwner: false,
    isAdmin: false,
    isEmployee: false,
    isTutor: false
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const fetchUserRoles = async (username) => {
    const userDoc = doc(firestore, 'users', username);
    const userDocSnap = await getDoc(userDoc);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      setUserRoles({
        isOwner: data.isOwner,
        isAdmin: data.isAdmin,
        isEmployee: data.isEmployee,
        isTutor: data.isTutor
      });
    }
  };

  return (
    <div className={theme}>
      <Router>
        <Header toggleTheme={toggleTheme} userRoles={userRoles} />
        <div className="container" style={{ marginTop: '100px', marginBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} fetchUserRoles={fetchUserRoles} />} />
            <Route path="/cadastro" element={isAuthenticated && (userRoles.isAdmin || userRoles.isOwner) ? <Cadastro /> : <Navigate to="/login" />} />
            <Route path="/creche" element={isAuthenticated && (userRoles.isAdmin || userRoles.isOwner) ? <Creche /> : <Navigate to="/login" />} />
            <Route path="/financas" element={isAuthenticated && userRoles.isOwner ? <Financas /> : <Navigate to="/login" />} />
            <Route path="/editar-pet/:id" element={isAuthenticated && (userRoles.isAdmin || userRoles.isOwner) ? <EditarPet /> : <Navigate to="/login" />} />
            <Route path="/contrato" element={isAuthenticated && (userRoles.isEmployee || userRoles.isOwner) ? <Contrato /> : <Navigate to="/login" />} />
            <Route path="/usuarios" element={isAuthenticated && userRoles.isOwner ? <Usuarios /> : <Navigate to="/login" />} />
            <Route path="/register" element={isAuthenticated && userRoles.isOwner ? <Register isOwner={userRoles.isOwner} /> : <Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
