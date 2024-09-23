import { firestore } from '../firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

export const useFirestoreTutor = () => {
  // Função para criar ou atualizar um tutor
  const createOrUpdateTutor = async (tutorData, tutorId = null) => {
    const docRef = tutorId
      ? doc(firestore, 'tutores', tutorId)
      : doc(collection(firestore, 'tutores'));

    await setDoc(docRef, tutorData, { merge: true });
  };

  // Função para buscar dados de um tutor
  const fetchTutorData = async (tutorId) => {
    const docRef = doc(firestore, 'tutores', tutorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  };

  return { createOrUpdateTutor, fetchTutorData };
};
