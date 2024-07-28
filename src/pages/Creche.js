import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import InputMask from 'react-input-mask';
import '../styles/creche.css';

const Creche = () => {
  const [ano, setAno] = useState('2023');
  const [mes, setMes] = useState('01');
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const petsCollection = collection(firestore, 'pets');
      const petsSnapshot = await getDocs(petsCollection);
      const petsList = petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsList);
    };

    fetchPets();
  }, []);

  const handleCheck = (index) => {
    const newPets = [...pets];
    newPets[index].ativo = !newPets[index].ativo;
    setPets(newPets);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newPets = [...pets];
    newPets[index][name] = value;
    setPets(newPets);
  };

  const handleSave = async () => {
    try {
      const crecheCollection = collection(firestore, 'creche');
      for (const pet of pets) {
        if (pet.ativo) {
          const crecheDoc = doc(crecheCollection, `${ano}-${mes}-${pet.id}`);
          await setDoc(crecheDoc, {
            ...pet,
            ano,
            mes,
            frequencia: pet.frequencia || '',
            valor: pet.valor || ''
          });
        }
      }
      alert("Dados salvos com sucesso!");
    } catch (error) {
      alert("Erro ao salvar dados: " + error.message);
    }
  };

  return (
    <div className="creche">
      <h2>Selecione o Ano e Mês</h2>
      <div className="selectors">
        <select value={ano} onChange={(e) => setAno(e.target.value)} className="selector">
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <select value={mes} onChange={(e) => setMes(e.target.value)} className="selector">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={(i + 1).toString().padStart(2, '0')}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <table className="creche-table">
        <thead>
          <tr>
            <th>Mês</th>
            <th>Mascotinho</th>
            <th>Tutor</th>
            <th>Ativo</th>
            <th>Frequência Semanal</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet, index) => (
            <tr key={pet.id}>
              <td>{mes}</td>
              <td>{pet.mascotinho}</td>
              <td>{pet.tutor}</td>
              <td>
                <input
                  type="checkbox"
                  checked={pet.ativo || false}
                  onChange={() => handleCheck(index)}
                />
              </td>
              <td>
                {pet.ativo && (
                  <input
                    type="number"
                    name="frequencia"
                    value={pet.frequencia || ''}
                    onChange={(e) => handleChange(e, index)}
                    className="input"
                  />
                )}
              </td>
              <td>
                {pet.ativo && (
                  <InputMask
                    mask="R$ 999,999.99"
                    maskChar=""
                    type="text"
                    name="valor"
                    value={pet.valor || ''}
                    onChange={(e) => handleChange(e, index)}
                    className="input"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} className="button save-button">Salvar</button>
    </div>
  );
};

export default Creche;
