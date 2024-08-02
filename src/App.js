import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Menu from './components/Menu';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Contrato from './pages/Contrato';
import Creche from './pages/Creche';
import Hotel from './pages/Hotel';
import Financas from './pages/Financas';
import Usuarios from './pages/Usuarios';
import styles from './styles/App.module.css';
import './styles/global.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRoles(userData);
          setCurrentUser(userData);
        }
      } else {
        setIsAuthenticated(false);
        setUserRoles(null);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const userRole = userRoles?.role || 'none';

  return (
    <Router>
      <div className={styles.main}>
        <Menu isAuthenticated={isAuthenticated} userRoles={userRoles} />
        <Header isAuthenticated={isAuthenticated} userRoles={userRoles} />
        <main>
        <div className={styles.header}>
        </div>
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} userRoles={userRoles} />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRoles={setUserRoles} setCurrentUser={setCurrentUser} />} />
            {isAuthenticated && (
              <>
                {(userRole === 'isAdmin' || userRole === 'isOwner') && <Route path="/cadastro" element={<Cadastro currentUser={currentUser} />} />}
                {userRole === 'isOwner' && <Route path="/contrato" element={<Contrato currentUser={currentUser} />} />}
                {(userRole === 'isEmployee' || userRole === 'isAdmin' || userRole === 'isOwner') && <Route path="/creche" element={<Creche currentUser={currentUser} />} />}
                {(userRole === 'isEmployee' || userRole === 'isAdmin' || userRole === 'isOwner') && <Route path="/hotel" element={<Hotel currentUser={currentUser} />} />}
                {userRole === 'isOwner' && <Route path="/financas" element={<Financas currentUser={currentUser} />} />}
                {userRole === 'isOwner' && <Route path="/usuarios" element={<Usuarios currentUser={currentUser} />} />}
              </>
            )}
          </Routes>
          <div className={styles.footer}>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
