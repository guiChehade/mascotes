import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import styles from '../styles/Registros.module.css';
import Modal from "../components/Modal";
import Table from "../components/Table";
import iconClick from "../assets/icon/click.png";

const Registros = () => {
  const [registros, setRegistros] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null); // Para armazenar o comentário selecionado

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const petsSnapshot = await getDocs(collection(firestore, "pets"));

        // Para cada pet, buscar o registro mais recente na subcoleção 'controle'
        const registrosData = await Promise.all(
          petsSnapshot.docs.map(async (petDoc) => {
            const petData = petDoc.data();
            const controleRef = collection(firestore, "pets", petDoc.id, "controle");
            // Buscar apenas o registro mais recente
            const controleQuery = query(controleRef, orderBy("dataEntrada", "desc"), orderBy("horarioEntrada", "desc"), limit(1));
            const controleSnapshot = await getDocs(controleQuery);

            if (!controleSnapshot.empty) {
              const controleDoc = controleSnapshot.docs[0];
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
                mascotinho: petData.mascotinho || "Não cadastrado",
                raca: petData.raca || "Não cadastrada",
                tutor: petData.tutor || "Não cadastrado",
                localAtual: petData.localAtual || "Casa",  // Substituir 'servico' por 'localAtual'
                comentarioPertences: comentariosPertencesSnapshot.docs.map(doc => ({ ...doc.data(), tipo: 'Pertences' })) || [],
                comentarioVet: comentariosVetSnapshot.docs.map(doc => ({ ...doc.data(), tipo: 'Vet' })) || [],
                comentarioComportamento: comentariosComportamentoSnapshot.docs.map(doc => ({ ...doc.data(), tipo: 'Comportamento' })) || [],
              };
            }

            return null; // Caso não tenha registros na subcoleção controle
          })
        );

        // Flatten the array and remove any null entries
        setRegistros(registrosData.flat().filter(registro => registro !== null));
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    };

    fetchRegistros();
  }, []);

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
            <th>Local Atual</th>
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
              <td>{registro.localAtual}</td> {/* Mostrar localAtual em vez de serviço */}
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
