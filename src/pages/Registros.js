import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, orderBy, getDocs, doc } from "firebase/firestore";
import styles from '../styles/Registros.module.css';
import Modal from "../components/Modal"; // Importa o modal
import Table from "../components/Table"; // Importa o componente de tabela
import Button from "../components/Button";
import iconClick from "../assets/icon/click.png"; // Ícone de clique

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null); // Para armazenar o comentário selecionado
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
                  comentarioPertences: comentariosPertencesSnapshot.docs.map(doc => ({ ...doc.data(), tipo: 'Pertences' })) || [],
                  comentarioVet: comentariosVetSnapshot.docs.map(doc => ({ ...doc.data(), tipo: 'Vet' })) || [],
                  comentarioComportamento: comentariosComportamentoSnapshot.docs.map(doc => ({ ...doc.data(), tipo: 'Comportamento' })) || [],
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

  const handleCommentClick = (comentarios, tipo) => {
    const comentariosOrdenados = comentarios.sort((a, b) => a.horario.localeCompare(b.horario)); // Ordena por horário
    setSelectedComment({ comentarios: comentariosOrdenados, tipo });
  };

  const handleCloseModal = () => {
    setSelectedComment(null);
  };

  return (
    <div className={styles.registrosContainer}>
      <h1>Registros</h1>

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
            <th>Comentário Veterinário</th>
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
              <td>{registro.dataEntrada}</td>
              <td>{registro.horarioEntrada}</td>
              <td>{registro.dataSaida}</td>
              <td>{registro.horarioSaida}</td>
              <td>
                {registro.comentarioVet.length > 0 && (
                  <img 
                    src={iconClick} 
                    alt="Ver Comentários" 
                    className={styles.commentIcon} 
                    onClick={() => handleCommentClick(registro.comentarioVet, 'Vet')}
                  />
                )}
              </td>
              <td>
                {registro.comentarioComportamento.length > 0 && (
                  <img 
                    src={iconClick} 
                    alt="Ver Comentários" 
                    className={styles.commentIcon} 
                    onClick={() => handleCommentClick(registro.comentarioComportamento, 'Comportamento')}
                  />
                )}
              </td>
              <td>
                {registro.comentarioPertences.length > 0 && (
                  <img 
                    src={iconClick} 
                    alt="Ver Comentários" 
                    className={styles.commentIcon} 
                    onClick={() => handleCommentClick(registro.comentarioPertences, 'Pertences')}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para exibir comentários */}
      {selectedComment && (
        <Modal isOpen={!!selectedComment} onClose={handleCloseModal} title={`Comentários de ${selectedComment.tipo}`}>
          <Table 
            headers={['Comentário', 'Usuário', 'Horário']}
            data={selectedComment.comentarios.map(comentario => ({
              comentario: comentario.comentario,
              usuario: comentario.usuario,
              horario: comentario.horario,
            }))}
          />
        </Modal>
      )}
    </div>
  );
};

export default Registros;
