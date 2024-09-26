import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
  } from "firebase/firestore";
import { firestore } from "../firebase";
import { getCurrentDateTime, getSubCollections, copySubCollection, deleteSubCollections } from "./petUtils";
import { calculatePernoites } from "./petUtils";
  
// Função para registrar entrada do pet
export const registerEntrada = async (petId, currentUser, service) => {
    const { formattedDate, formattedTime } = getCurrentDateTime();
  
    const mostRecentRef = doc(
      firestore,
      "pets",
      petId,
      "controle",
      "mostRecent"
    );
  
    try {
      // Obter os dados atuais de 'mostRecent' para arquivamento
      const mostRecentDoc = await getDoc(mostRecentRef);
      if (mostRecentDoc.exists()) {
        const dataToArchive = mostRecentDoc.data();
  
        // Usar dataEntrada como ID do documento de arquivamento
        const archiveId = dataToArchive.dataEntrada;
  
        if (!archiveId) {
          console.error("dataEntrada está faltando em mostRecent, não é possível arquivar.");
          return { success: false, message: "dataEntrada ausente no documento atual." };
        }
  
        // Arquivar o documento 'mostRecent' na coleção 'controle' com ID da dataEntrada
        const archiveRef = doc(
          firestore,
          "pets",
          petId,
          "controle",
          archiveId
        );
        await setDoc(archiveRef, dataToArchive);
  
        // Copiar subcoleções de 'mostRecent' para o documento arquivado
        const subCollections = await getSubCollections(mostRecentRef);
        for (let subCol of subCollections) {
          await copySubCollection(
            mostRecentRef,
            archiveRef,
            subCol
          );
        }
  
        // Deletar subcoleções de 'mostRecent' antes de resetar
        await deleteSubCollections(mostRecentRef);
      }
  
      // Resetar 'mostRecent' com os novos dados de entrada
      const newRecord = {
        servico: service,
        dataEntrada: formattedDate,
        horarioEntrada: formattedTime,
        usuarioEntrada: currentUser.name,
        localAtual: service,
        serviceNames: [],
      };
      await setDoc(mostRecentRef, newRecord);
  
      // Atualizar o estado local do pet no banco de dados
      await updateDoc(doc(firestore, "pets", petId), { localAtual: service });
  
      return { success: true, message: `Entrada para ${service} registrada com sucesso.` };
    } catch (error) {
      console.error("Erro ao registrar entrada:", error);
      return { success: false, error };
    }
};
  
// Função para registrar saída para um serviço externo
export const registerSaidaServico = async (petId, currentUser, service) => {
    const { formattedDate, formattedTime } = getCurrentDateTime();
  
    const mostRecentRef = doc(
      firestore,
      "pets",
      petId,
      "controle",
      "mostRecent"
    );
  
    try {
      const mostRecentDoc = await getDoc(mostRecentRef);
      if (!mostRecentDoc.exists()) {
        console.error("mostRecent não encontrado.");
        return { success: false, message: "Registro mais recente não encontrado." };
      }
  
      const mostRecentData = mostRecentDoc.data();
  
      // Criar subcoleção com o nome do serviço extra em 'mostRecent'
      const servicoSubcollectionName = `servico${service}`;
      const servicoSubcollectionRef = collection(
        mostRecentRef,
        servicoSubcollectionName
      );
  
      // Criar um ID determinístico para o documento do serviço
      const serviceDocId = formattedDate + formattedTime.replace(/:/g, "");
  
      const servicoData = {
        dataSaidaServico: formattedDate,
        horarioSaidaServico: formattedTime,
        usuarioSaidaServico: currentUser.name,
      };
  
      // Usar setDoc para definir o ID do documento
      await setDoc(
        doc(servicoSubcollectionRef, serviceDocId),
        servicoData
      );
  
      // Atualizar 'mostRecent' com 'localAtual' e adicionar o nome do serviço extra
      // Atualizar a lista de serviços extras
      const updatedServiceNames = mostRecentData.serviceNames || [];
      if (!updatedServiceNames.includes(servicoSubcollectionName)) {
        updatedServiceNames.push(servicoSubcollectionName);
      }
  
      // Armazenar o ID do documento do serviço em 'mostRecent'
      await updateDoc(mostRecentRef, {
        localAtual: service,
        serviceNames: updatedServiceNames,
        [`${servicoSubcollectionName}Id`]: serviceDocId,
      });
  
      // Atualizar o estado local do pet no banco de dados
      await updateDoc(doc(firestore, "pets", petId), { localAtual: service });
  
      return { success: true, message: `Saída para ${service} registrada com sucesso.` };
    } catch (error) {
      console.error("Erro ao registrar saída para serviço:", error);
      return { success: false, error };
    }
};
  
// Função para registrar retorno do serviço externo
export const registerVoltaServico = async (petId, currentUser, service) => {
    const { formattedDate, formattedTime } = getCurrentDateTime();

    const mostRecentRef = doc(
      firestore,
      "pets",
      petId,
      "controle",
      "mostRecent"
    );
  
    try {
      const mostRecentDoc = await getDoc(mostRecentRef);
      if (!mostRecentDoc.exists()) {
        console.error("mostRecent não encontrado.");
        return { success: false, message: "Registro mais recente não encontrado." };
      }
  
      const mostRecentData = mostRecentDoc.data();
  
      // Obter o serviço inicial
      const initialService = mostRecentData.servico || "Creche";
  
      // Atualizar o 'localAtual' para o serviço inicial
      await updateDoc(mostRecentRef, {
        localAtual: initialService,
      });
  
      // Obter o ID do documento do serviço armazenado anteriormente
      const servicoSubcollectionName = `servico${service}`;
      const serviceDocId = mostRecentData[`${servicoSubcollectionName}Id`];
  
      if (serviceDocId) {
        // Referenciar o documento do serviço diretamente usando o ID
        const servicoDocRef = doc(
          mostRecentRef,
          servicoSubcollectionName,
          serviceDocId
        );
  
        // Atualizar o documento do serviço com os dados de retorno
        await updateDoc(servicoDocRef, {
          dataVoltaServico: formattedDate,
          horarioVoltaServico: formattedTime,
          usuarioVoltaServico: currentUser.name,
        });
      } else {
        console.error("ID do documento do serviço não encontrado.");
        return { success: false, message: "ID do serviço não encontrado." };
      }
  
      // Atualizar o estado local do pet no banco de dados
      await updateDoc(doc(firestore, "pets", petId), {
        localAtual: initialService,
      });
  
      return { success: true, message: `Retorno de ${service} registrado com sucesso.` };
    } catch (error) {
      console.error(`Erro ao registrar retorno de ${service}: ${error}`);
      return { success: false, error };
    }
};
  
// Função para registrar um comentário
export const registerComentario = async (
    petId,
    currentUser,
    selectedComentarioType,
    comentario
  ) => {
    const { formattedDate, formattedTime } = getCurrentDateTime();
  
    let subCollectionPath;
  
    switch (selectedComentarioType) {
      case "Pertences":
        subCollectionPath = "comentarioPertences";
        break;
      case "Veterinário":
        subCollectionPath = "comentarioVet";
        break;
      case "Comportamento":
        subCollectionPath = "comentarioComportamento";
        break;
      case "Observações":
        subCollectionPath = "comentarioObservacoes";
        break;
      case "Alimentação":
        subCollectionPath = "comentarioAlimentacao";
        break;
      default:
        return { success: false, message: "Tipo de comentário inválido." };
    }
  
    const comentariosRef = collection(
      firestore,
      "pets",
      petId,
      "controle",
      "mostRecent",
      subCollectionPath
    );
  
    const comentarioData = {
      comentario,
      usuario: currentUser.name,
      horario: formattedTime,
      data: formattedDate,
    };
  
    try {
      await addDoc(comentariosRef, comentarioData);
      return { success: true, message: `${selectedComentarioType} registrado com sucesso.` };
    } catch (error) {
      console.error(
        `Erro ao adicionar ${selectedComentarioType.toLowerCase()}:`,
        error
      );
      return { success: false, error };
    }
};
  
// Função para registrar saída definitiva do pet
export const registerSaida = async (petId, currentUser) => {
    const { formattedDate, formattedTime } = getCurrentDateTime();
  
    const mostRecentRef = doc(
      firestore,
      "pets",
      petId,
      "controle",
      "mostRecent"
    );
  
    try {
      const mostRecentDoc = await getDoc(mostRecentRef);
      if (!mostRecentDoc.exists()) {
        console.error("mostRecent não encontrado.");
        return { success: false, message: "Registro mais recente não encontrado." };
      }
  
      const mostRecentData = mostRecentDoc.data();
  
      // Calcular pernoites
      const pernoites = calculatePernoites(
        mostRecentData.dataEntrada,
        formattedDate
      );
  
      // Atualizar 'mostRecent' com os dados de saída
      const updateData = {
        dataSaida: formattedDate,
        horarioSaida: formattedTime,
        usuarioSaida: currentUser.name,
        pernoites,
        localAtual: "Casa",
      };
  
      await updateDoc(mostRecentRef, updateData);
  
      // Atualizar o estado local do pet no banco de dados
      await updateDoc(doc(firestore, "pets", petId), { localAtual: "Casa" });
  
      return { success: true, message: "Saída registrada com sucesso." };
    } catch (error) {
      console.error("Erro ao registrar saída:", error);
      return { success: false, error };
    }
};
