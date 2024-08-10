import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Menu from "./components/Menu";
import Header from "./components/Header";
import Main from "./components/Main";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Mascotes from "./pages/Mascotes";
import Controle from "./pages/Controle";
import ControleRedirect from "./pages/ControleRedirect";
import EditarPet from "./pages/EditarPet";
import AgendarVisita from "./pages/AgendarVisita";
import Financas from "./pages/Financas";
import Usuarios from "./pages/Usuarios";
import styles from "./styles/App.module.css";
import "./styles/global.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
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

  const userRole = userRoles?.role || "none";

  return (
    <Router>
      <Menu isAuthenticated={isAuthenticated} userRoles={userRoles} />
      <Header isAuthenticated={isAuthenticated} userRoles={userRoles} />
      <ThemeToggle />
      <Main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} userRoles={userRoles} />} />
          <Route path="/controle" element={<ControleRedirect />} />
          <Route path="/:petId" element={<Controle currentUser={currentUser} />} />
          <Route path="/agendar-visita" element={<AgendarVisita />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRoles={setUserRoles} setCurrentUser={setCurrentUser} />} />
          {isAuthenticated && (
            <>
              {(userRole === "isAdmin" || userRole === "isOwner") && (
                <Route path="/cadastro" element={<Cadastro currentUser={currentUser} />} />
              )}
              {(userRole === "isEmployee" || userRole === "isAdmin" || userRole === "isOwner") && (
                <Route path="/mascotes" element={<Mascotes currentUser={currentUser} />} />
              )}
              {(userRole === "isAdmin" || userRole === "isOwner") && (
                <Route path="/editar/:petId" element={<EditarPet currentUser={currentUser} />} />
              )}
              {userRole === "isOwner" && (
                <Route path="/financas" element={<Financas currentUser={currentUser} />} />
              )}
              {userRole === "isOwner" && (
                <Route path="/usuarios" element={<Usuarios currentUser={currentUser} />} />
              )}
            </>
          )}
        </Routes>
      </Main>
      <Footer />
    </Router>
  );
};

export default App;
