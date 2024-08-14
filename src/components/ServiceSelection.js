import React from 'react';
import styles from '../styles/ServiceSelection.module.css';
import Button from './Button';

const ServiceSelection = ({ onSelectService, onCancel }) => {
  const services = ["Creche", "Hotel", "Banho", "Adestramento", "Passeio", "Veterinário"];

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>Selecione o Serviço</h2>
        <div className={styles.gridContainer}>
          {services.map((service, index) => (
            <Button key={index} onClick={() => onSelectService(service)}>
              {service}
            </Button>
          ))}
        </div>
        <Button onClick={onCancel} className={styles.cancelButton}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
