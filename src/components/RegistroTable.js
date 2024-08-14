import React from "react";
import styles from '../styles/RegistroTable.module.css';

const RegistroTable = ({ registros }) => {
  return (
    <table className={styles.registroTable}>
      <thead>
        <tr>
          <th>Foto</th>
          <th>Nome do Pet</th>
          <th>Raça</th>
          <th>Tutor</th>
          <th>Data</th>
          <th>Entrada Creche</th>
          <th>Saída Creche</th>
          <th>Entrada Hotel</th>
          <th>Saída Hotel</th>
          <th>Comentário Comportamento</th>
          <th>Comentário Veterinário</th>
          <th>Pertences</th>
        </tr>
      </thead>
      <tbody>
        {registros.map((registro, index) => (
          <tr key={index}>
            <td>
              <img src={registro.foto} alt={registro.mascotinho} className={styles.thumbnail} />
            </td>
            <td>{registro.mascotinho}</td>
            <td>{registro.raca}</td>
            <td>{registro.tutor}</td>
            <td>{registro.data}</td>
            <td>{registro.entradaCreche || '-'}</td>
            <td>{registro.saidaCreche || '-'}</td>
            <td>{registro.entradaHotel || '-'}</td>
            <td>{registro.saidaHotel || '-'}</td>
            <td>{registro.comportamento || '-'}</td>
            <td>{registro.veterinario || '-'}</td>
            <td>{registro.pertences || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RegistroTable;
