import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import styles from '../styles/Registros.module.css';
import Button from "../components/Button";
import PopupUsuario from "../components/PopupUsuario"; // Componente de popup

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // Para armazenar o registro selecionado para o popup
  const [filterMascotinho, setFilterMascotinho] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const petsSnapshot = await getDocs(collection(firestore, "pets"));

        // Para cada pet, buscar os registros na subcoleção 'controle'
        const registrosData = await Promise.all(
          petsSnapshot.docs.map(async (petDoc) => {
            const petData = petDoc.data();
            const controleRef = collection(firestore, "pets", petDoc.id, "controle");
            const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"));

            const controleSnapshot = await getDocs(controleQuery);
            const registrosPorPet = await Promise.all(
              controleSnapshot.docs.map(async (controleDoc) => {
                const controleData = controleDoc.data();

                // Coletar comentários de subcoleções
                const comentariosPertencesRef = collection(firestore, "pets", petDoc.id, "controle", controleDoc.id, "comentarioPertences");
                const comentariosVetRef = collection(firestore, "pets", petDoc.id, "controle", controleDoc.id, "comentarioVet");
                const comentariosComportamentoRef = collection(firestore, "pets", petDoc.id, "controle", controleDoc.id, "comentarioComportamento");

                const comentariosPertencesSnapshot = await getDocs(comentariosPertencesRef);
                const comentariosVetSnapshot = await getDocs(comentariosVetRef);
                const comentariosComportamentoSnapshot = await getDocs(comentariosComportamentoRef);

                return {
                  ...controleData,
                  foto: petData.foto || null,
                  mascotinho: petData.mascotinho || "Desconhecido",
                  raca: petData.raca || "Desconhecida",
                  tutor: petData.tutor || "Desconhecido",
                  comentarioPertences: comentariosPertencesSnapshot.docs.map(doc => doc.data().comentario).join(', ') || "N/A",
                  comentarioVet: comentariosVetSnapshot.docs.map(doc => doc.data().comentario).join(', ') || "N/A",
                  comentarioComportamento: comentariosComportamentoSnapshot.docs.map(doc => doc.data().comentario).join(', ') || "N/A",
                };
              })
            );

            return registrosPorPet;
          })
        );

        // Flatten the array of arrays
        setRegistros(registrosData.flat());
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    };

    fetchRegistros();
  }, [filterMascotinho, filterDate]);

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
      {/* <div className={styles.filters}>
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
      </div> */}

      <table className={styles.registrosTable}>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Mascote</th>
            <th>Raça</th>
            <th>Serviço</th>
            <th>Data de Entrada</th>
            <th>Horário de Entrada</th>
            <th>Data de Saída</th>
            <th>Horário de Saída</th>
            <th>Comentário Saúde</th>
            <th>Comentário Comportamento</th>
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
              <td>{registro.servico}</td>
              <td onClick={() => handleClick(registro, "usuarioEntrada")}>{registro.dataEntrada}</td>
              <td onClick={() => handleClick(registro, "usuarioEntrada")}>{registro.horarioEntrada}</td>
              <td onClick={() => handleClick(registro, "usuarioSaida")}>{registro.dataSaida}</td>
              <td onClick={() => handleClick(registro, "usuarioSaida")}>{registro.horarioSaida}</td>
              <td onClick={() => handleClick(registro, "comentarioVet")}>{registro.comentarioVet}</td>
              <td onClick={() => handleClick(registro, "comentarioComportamento")}>{registro.comentarioComportamento}</td>
              <td onClick={() => handleClick(registro, "comentarioPertences")}>{registro.comentarioPertences}</td>
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
