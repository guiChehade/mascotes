import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, firestore } from './firebase';
import Header from './components/Header';
import Menu from './components/Menu';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Contrato from './pages/Contrato';
import Creche from './pages/Creche';
import Hotel from './pages/Hotel';
import Financas from './pages/Financas';
import Usuarios from './pages/Usuarios';
import Login from './pages/Login';
import './styles/global.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        setUserRoles(userDoc.data().roles);
      } else {
        setIsAuthenticated(false);
        setUserRoles(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header />
      <Menu isAuthenticated={isAuthenticated} userRoles={userRoles} />
      <div style={{ paddingTop: '100px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {isAuthenticated && userRoles && (
            <>
              {userRoles.isAdmin && <Route path="/cadastro" element={<Cadastro />} />}
              {userRoles.isAdmin && <Route path="/contrato" element={<Contrato />} />}
              {userRoles.isEmployee && <Route path="/creche" element={<Creche />} />}
              {userRoles.isEmployee && <Route path="/hotel" element={<Hotel />} />}
              {userRoles.isOwner && <Route path="/financas" element={<Financas />} />}
              {userRoles.isOwner && <Route path="/usuarios" element={<Usuarios />} />}
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
