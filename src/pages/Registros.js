import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, orderBy, getDocs, limit, doc } from "firebase/firestore";
import styles from '../styles/Registros.module.css';
import Modal from "../components/Modal";
import Table from "../components/Table";
import iconLapis from "../assets/icons/lapis.png";

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // Para armazenar o registro selecionado

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const petsSnapshot = await getDocs(collection(firestore, "pets"));

        // Para cada pet, buscar o registro mais recente na subcoleção 'controle'
        const registrosData = await Promise.all(
          petsSnapshot.docs.map(async (petDoc) => {
            const petData = petDoc.data();
            const controleRef = collection(firestore, "pets", petDoc.id, "controle");
            const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"), orderBy("horarioEntrada", "desc"), limit(1));
            const controleSnapshot = await getDocs(controleQuery);

            if (!controleSnapshot.empty) {
              const controleDoc = controleSnapshot.docs[0];
              const controleData = controleDoc.data();

              return {
                ...controleData,
                foto: petData.foto || null,
                mascotinho: petData.mascotinho || "Não cadastrado",
                raca: petData.raca || "Não cadastrada",
                tutor: petData.tutor || "Não cadastrado",
                localAtual: petData.localAtual || "Casa",
                petId: petDoc.id, // Guardar o ID do pet para referência
                controleId: controleDoc.id, // Guardar o ID do controle
              };
            }

            return null; // Caso não tenha registros na subcoleção controle
          })
        );

        // Ordenar pelos últimos registros de entrada e horário em ordem decrescente
        const sortedRegistros = registrosData
          .flat()
          .filter(registro => registro !== null)
          .sort((a, b) => {
            const dateComparison = b.dataEntrada.localeCompare(a.dataEntrada);
            if (dateComparison !== 0) return dateComparison;
            return b.horarioEntrada.localeCompare(a.horarioEntrada);
          });

        setRegistros(sortedRegistros);
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    };

    fetchRegistros();
  }, []);

  const handleDateOrTimeClick = async (petId, controleId) => {
    const controleRef = doc(firestore, "pets", petId, "controle", controleId);
    const controleSnapshot = await getDocs(collection(controleRef));
    const data = controleSnapshot.docs.map(doc => doc.data());

    setSelectedRecord(data);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  return (
    <div className={styles.registrosContainer}>
      <h1>Registros</h1>

      <Table
        headers={['Foto', 'Mascote', 'Raça', 'Local Atual', 'Data de Entrada', 'Horário de Entrada', 'Data de Saída', 'Horário de Saída']}
        data={registros.map((registro, index) => ({
          foto: registro.foto ? (
            <img src={registro.foto} alt={registro.mascotinho} className={styles.petThumbnail} />
          ) : (
            "Sem foto"
          ),
          mascote: registro.mascotinho,
          raca: registro.raca,
          localAtual: registro.localAtual,
          dataEntrada: (
            <span onClick={() => handleDateOrTimeClick(registro.petId, registro.controleId)}>
              {registro.dataEntrada || <img src={iconLapis} alt="Editar Data de Entrada" className={styles.commentIcon} />}
            </span>
          ),
          horarioEntrada: (
            <span onClick={() => handleDateOrTimeClick(registro.petId, registro.controleId)}>
              {registro.horarioEntrada || <img src={iconLapis} alt="Editar Horário de Entrada" className={styles.commentIcon} />}
            </span>
          ),
          dataSaida: (
            <span onClick={() => handleDateOrTimeClick(registro.petId, registro.controleId)}>
              {registro.dataSaida || <img src={iconLapis} alt="Editar Data de Saída" className={styles.commentIcon} />}
            </span>
          ),
          horarioSaida: (
            <span onClick={() => handleDateOrTimeClick(registro.petId, registro.controleId)}>
              {registro.horarioSaida || <img src={iconLapis} alt="Editar Horário de Saída" className={styles.commentIcon} />}
            </span>
          ),
        }))}
      />

      {/* Modal para exibir todos os campos preenchidos da subcoleção */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={handleCloseModal}
          title="Detalhes do Registro"
          showFooter={true}
        >
          <Table
            headers={['Campo', 'Valor']}
            data={selectedRecord.map((record, index) => ({
              campo: Object.keys(record).map((key) => <div key={key}>{key}</div>),
              valor: Object.values(record).map((value) => <div key={value}>{value}</div>),
            }))}
          />
        </Modal>
      )}
    </div>
  );
};

export default Registros;
