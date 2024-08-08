import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ControleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para uma rota específica após a montagem
    const petId = "thj7feLnVkh04l5bMhjI";
    navigate(`/controle/${petId}`);
  }, [navigate]);

  return (
    <div>
      <p>Redirecionando...</p>
    </div>
  );
};

export default ControleRedirect;
