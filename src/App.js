import { React, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { auth, firestore } from './firebase';
import { doc, getDoc } from "firebase/firestore";
import './styles/global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState({
    isOwner: false,
    isAdmin: false,
    isEmployee: false,
    isTutor: false,
  });

  const fetchUserRoles = async (userId) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        const roles = userDoc.data().roles;
        setUserRoles(roles);
      }
    } catch (error) {
      console.error("Erro ao buscar papéis do usuário:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchUserRoles(user.uid).then(setUserRoles);
      } else {
        setIsAuthenticated(false);
        setUserRoles({
          isOwner: false,
          isAdmin: false,
          isEmployee: false,
          isTutor: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header />
      <Menu isAuthenticated={isAuthenticated} userRoles={userRoles} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/contrato" element={<Contrato />} />
          <Route path="/creche" element={<Creche />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/financas" element={isAuthenticated && userRoles.isOwner ? <Financas /> : <Home />} />
          <Route path="/usuarios" element={isAuthenticated && userRoles.isOwner ? <Usuarios /> : <Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRoles={setUserRoles} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
