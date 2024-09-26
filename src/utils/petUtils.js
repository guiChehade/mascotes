// utils/petUtils.js
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export const getCurrentDateTime = () => {
  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const formattedTime = now.toTimeString().split(" ")[0];
  return { formattedDate, formattedTime };
};

export const calculatePernoites = (entradaData, saidaData) => {
  if (!entradaData) return 0;
  const entrada = new Date(entradaData);
  const saida = new Date(saidaData);
  const diffTime = Math.abs(saida - entrada);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getCommentTypes = () => {
  return [
    "comentarioPertences",
    "comentarioVet",
    "comentarioComportamento",
    "comentarioObservacoes",
    "comentarioAlimentacao",
  ];
};

// Função para obter as subcoleções de um documento
export const getSubCollections = async (docRef) => {
  // Retornar a lista pré-definida de subcoleções
  return [
    "comentarioPertences",
    "comentarioVet",
    "comentarioComportamento",
    "comentarioObservacoes",
    "comentarioAlimentacao",
    "servicoAdestramento",
    "servicoBanho",
    "servicoPasseio",
    "servicoVeterinario",
  ];
};

// Função para copiar uma subcoleção de um documento para outro
export const copySubCollection = async (sourceDocRef, targetDocRef, subColName) => {
  const sourceSubColRef = collection(sourceDocRef, subColName);
  const targetSubColRef = collection(targetDocRef, subColName);
  const subColSnapshot = await getDocs(sourceSubColRef);
  for (let docSnap of subColSnapshot.docs) {
    await setDoc(doc(targetSubColRef, docSnap.id), docSnap.data());
  }
};

// Função para deletar as subcoleções de um documento
export const deleteSubCollections = async (docRef) => {
    const subCollections = await getSubCollections(docRef);
    for (let subColName of subCollections) {
        const subColRef = collection(docRef, subColName);
        const subColSnapshot = await getDocs(subColRef);
        for (let docSnap of subColSnapshot.docs) {
            await deleteDoc(docSnap.ref);
        }
    }
};