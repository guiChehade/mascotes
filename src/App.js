import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Controle from './pages/Controle';
import Creche from './pages/Creche';
import Financas from './pages/Financas';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import EditarPet from './pages/EditarPet';
import Usuarios from './pages/Usuarios';
import { auth, firestore } from './firebase';
import './styles/global.css';

function App() {
  const [theme, setTheme] = useState('dark-mode');
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    setTheme(savedTheme);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setAuthenticated(true);
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        setIsAdmin(userDoc.data().isAdmin);
      } else {
        setAuthenticated(false);
        setIsAdmin(false);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={theme}>
      <Router>
        <Header toggleTheme={toggleTheme} isAdmin={isAdmin} />
        <div className="container" style={{ marginTop: '100px', marginBottom: '60px' }}>
          <Routes>
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/cadastro" element={isAuthenticated ? <Cadastro /> : <Navigate to="/login" />} />
            <Route path="/controle" element={isAuthenticated ? <Controle /> : <Navigate to="/login" />} />
            <Route path="/financas" element={isAuthenticated && isAdmin ? <Financas /> : <Navigate to="/login" />} />
            <Route path="/editar-pet/:id" element={isAuthenticated ? <EditarPet /> : <Navigate to="/login" />} />
            <Route path="/creche" element={isAuthenticated ? <Creche /> : <Navigate to="/login" />} />
            <Route path="/usuarios" element={isAuthenticated ? <Usuarios /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
