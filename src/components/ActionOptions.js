import React, { useState } from "react";
import Button from "./Button";
import styles from "../styles/ActionOptions.module.css";

const ActionOptions = ({ actionType, onSelectOption, onBack }) => {
  const options = actionType === "comentario" ? 
    ["Comportamento", "Veterinário", "Pertences"] : 
    ["Creche", "Hotel", "Banho", "Adestramento", "Passeio", "Veterinário"];

  return (
    <div className={styles.actionOptionsContainer}>
      <h3>{actionType === "comentario" ? "Selecione uma Opção" : "Selecione o Tipo de Serviço"}</h3>
      {options.map((option) => (
        <Button key={option} onClick={() => onSelectOption(option)}>
          {option}
        </Button>
      ))}
      <Button onClick={onBack}>Voltar</Button>
    </div>
  );
};

export default ActionOptions;
