import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Menu from "./components/Menu";
import Header from "./components/Header";
import Main from "./components/Main";
import UserMenu from "./components/UserMenu";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AgendarVisita from "./pages/AgendarVisita";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import CadastroPet from "./pages/CadastroPet";
import CadastroTutor from "./pages/CadastroTutor";
import Mascotes from "./pages/Mascotes";
import Controle from "./pages/Controle";
import DogBreedsCards from "./pages/DogBreedsCards";
import UploadBreeds from "./pages/UploadBreeds";
import EditarPet from "./pages/EditarPet";
import Pagamentos from "./pages/Pagamentos";
import Registros from "./pages/Registros";
import Ponto from "./pages/Ponto";
import NoLocal from "./pages/NoLocal";
import Usuarios from "./pages/Usuarios";
import DadosTutor from "./pages/DadosTutor";
import NotFound from "./pages/NotFound";
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
      <div className={styles.pageContainer}>
        <Menu isAuthenticated={isAuthenticated} userRoles={userRoles} />
        <Header isAuthenticated={isAuthenticated} userRoles={userRoles} />
        <UserMenu currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <Main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} userRoles={userRoles} />} />
            <Route path="/racas" element={<DogBreedsCards />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/agendar-visita" element={<AgendarVisita />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRoles={setUserRoles} setCurrentUser={setCurrentUser} />} />
            {isAuthenticated && (
              <>
                <Route path="/tutor/:tutorId" element={<DadosTutor currentUser={currentUser} />} />
                {(userRole === "isEmployee" || userRole === "isAdmin" || userRole === "isManager" || userRole === "isOwner") && (
                  <Route path="/ponto" element={<Ponto currentUser={currentUser} />} />
                )}
                {(userRole === "isAdmin" || userRole === "isManager" || userRole === "isOwner") && (
                  <Route path="/cadastro-tutor" element={<CadastroTutor currentUser={currentUser} />} />
                )}
                {(userRole === "isAdmin" || userRole === "isManager" || userRole === "isOwner") && (
                  <Route path="/cadastro-pet" element={<CadastroPet currentUser={currentUser} />} />
                )}
                {(userRole === "isOwner") && (
                  <Route path="/upload-racas" element={<UploadBreeds />} />
                )}
                {(userRole === "isEmployee" || userRole === "isManager" || userRole === "isAdmin" || userRole === "isOwner") && (
                  <Route path="/mascotes" element={<Mascotes currentUser={currentUser} />} />
                )}
                {(userRole === "isEmployee" || userRole === "isManager" || userRole === "isAdmin" || userRole === "isOwner") && (
                  <Route path="/no-local" element={<NoLocal currentUser={currentUser} />} />
                )}
                {(userRole === "isManager" || userRole === "isTutor" || userRole === "isOwner") && (
                  <Route path="/pagamentos" element={<Pagamentos currentUser={currentUser} />} />
                )}
                {(userRole === "isAdmin" || userRole === "isManager" || userRole === "isOwner") && (
                  <Route path="/editar/:petId" element={<EditarPet currentUser={currentUser} />} />
                )}
                {(userRole === "isEmployee" || userRole === "isManager" || userRole === "isAdmin" || userRole === "isOwner") && (
                  <Route path="/registros" element={<Registros currentUser={currentUser} />} />
                )}
                {(userRole === "isManager" || userRole === "isOwner") && (
                  <Route path="/usuarios" element={<Usuarios currentUser={currentUser} />} />
                )}
              </>
            )}
            <Route path="/:petId" element={<Controle currentUser={currentUser} />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Main>
        <Footer />
      </div>
      <SpeedInsights />
    </Router>
  );
};

export default App;
