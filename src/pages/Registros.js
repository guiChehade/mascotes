import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, orderBy, getDocs, where, getDoc, doc } from "firebase/firestore";
import styles from '../styles/Registros.module.css';
import Button from "../components/Button";
import PopupUsuario from "../components/PopupUsuario"; // Componente de popup

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // Para armazenar o registro selecionado para o popup
  const [filterMascotinho, setFilterMascotinho] = useState("");
  const [filterMonth] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        let q = query(collection(firestore, "registros"), orderBy("dataEntrada", "desc"));

        if (filterMascotinho) {
          q = query(q, where("mascotinho", "==", filterMascotinho));
        }

        if (filterMonth) {
          q = query(q, where("dataEntrada", ">=", `01/${filterMonth}`), where("dataEntrada", "<=", `31/${filterMonth}`));
        }

        if (filterDate) {
          q = query(q, where("dataEntrada", "==", filterDate));
        }

        const querySnapshot = await getDocs(q);

        const registrosData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const registro = docSnapshot.data();

            // Busca as informações do pet na coleção "pets"
            const petDoc = await getDoc(doc(firestore, "pets", registro.petId));
            const petData = petDoc.exists ? petDoc.data() : {};

            return {
              ...registro,
              foto: petData.foto || null,
              mascotinho: petData.mascotinho || "Desconhecido",
              raca: petData.raca || "Desconhecida",
              tutor: petData.tutor || "Desconhecido",
            };
          })
        );

        setRegistros(registrosData);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    };

    fetchRegistros();
  }, [filterMascotinho, filterMonth, filterDate]);

  const handleClick = (record, field) => {
    setSelectedRecord({ record, field });
  };

  const handleClosePopup = () => {
    setSelectedRecord(null);
  };

  return (
    <div className={styles.registrosContainer}>
      <h1>Registros</h1>
      {/* Filtros */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Mascotinho"
          value={filterMascotinho}
          onChange={(e) => setFilterMascotinho(e.target.value)}
        />
        <input
          type="date"
          placeholder="Data"
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <table className={styles.registrosTable}>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Mascotinho</th>
            <th>Raça</th>
            <th>Tutor</th>
            <th>Data de Entrada</th>
            <th>Entrada Creche</th>
            <th>Data de Saída</th>
            <th>Saída Creche</th>
            <th>Comentário Comportamento</th>
            <th>Comentário Veterinário</th>
            <th>Pertences</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <tr key={index}>
              <td>
                {registro.foto ? (
                  <img src={registro.foto} alt={registro.mascotinho} className={styles.petThumbnail} />
                ) : (
                  "Sem foto"
                )}
              </td>
              <td>{registro.mascotinho}</td>
              <td>{registro.raca}</td>
              <td>{registro.tutor}</td>
              <td onClick={() => handleClick(registro, "entradaCrecheUsuario")}>{registro.dataEntrada}</td>
              <td onClick={() => handleClick(registro, "entradaCrecheUsuario")}>{registro.entradaCreche}</td>
              <td onClick={() => handleClick(registro, "saidaCrecheUsuario")}>{registro.saidaData}</td>
              <td onClick={() => handleClick(registro, "saidaCrecheUsuario")}>{registro.saidaCreche}</td>
              <td onClick={() => handleClick(registro, "comportamentoUsuario")}>{registro.comportamento || "N/A"}</td>
              <td onClick={() => handleClick(registro, "veterinarioUsuario")}>{registro.veterinario || "N/A"}</td>
              <td onClick={() => handleClick(registro, "pertencesUsuario")}>{registro.pertences || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup para exibir detalhes do usuário */}
      {selectedRecord && (
        <PopupUsuario onClose={handleClosePopup}>
          <h2>Detalhes do Registro</h2>
          <p>
            <strong>Campo:</strong> {selectedRecord.field.replace("Usuario", "")}
          </p>
          <p>
            <strong>Usuário:</strong> {selectedRecord.record[selectedRecord.field]}
          </p>
          <Button onClick={handleClosePopup}>Fechar</Button>
        </PopupUsuario>
      )}
    </div>
  );
};

export default Registros;
