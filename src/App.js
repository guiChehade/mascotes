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
import Creche from './pages/Creche';
import Usuarios from './pages/Usuarios';
import { auth, firestore } from './firebase';
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

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setAuthenticated(true);
        const userDoc = doc(firestore, 'users', user.uid);
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
      } else {
        setAuthenticated(false);
        setUserRoles({
          isOwner: false,
          isAdmin: false,
          isEmployee: false,
          isTutor: false
        });
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
        <Header toggleTheme={toggleTheme} userRoles={userRoles} />
        <div className="container" style={{ marginTop: '100px', marginBottom: '60px' }}>
          <Routes>
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/cadastro" element={isAuthenticated && (userRoles.isAdmin || userRoles.isOwner) ? <Cadastro /> : <Navigate to="/login" />} />
            <Route path="/controle" element={isAuthenticated && (userRoles.isAdmin || userRoles.isOwner) ? <Controle /> : <Navigate to="/login" />} />
            <Route path="/financas" element={isAuthenticated && userRoles.isOwner ? <Financas /> : <Navigate to="/login" />} />
            <Route path="/editar-pet/:id" element={isAuthenticated && (userRoles.isAdmin || userRoles.isOwner) ? <EditarPet /> : <Navigate to="/login" />} />
            <Route path="/creche" element={isAuthenticated && (userRoles.isEmployee || userRoles.isOwner) ? <Creche /> : <Navigate to="/login" />} />
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
