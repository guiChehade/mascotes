import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Nenhum');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before new attempt

    try {
      const userDocRef = doc(firestore, 'users', username);
      await setDoc(userDocRef, {
        password,
        isOwner: role === 'Proprietário',
        isAdmin: role === 'Gerente' || role === 'Proprietário',
        isEmployee: role === 'Funcionário' || role === 'Gerente' || role === 'Proprietário',
        isTutor: role === 'Tutor',
      });
      alert('Usuário registrado com sucesso!');
    } catch (error) {
      console.error("Register Error:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Registrar Usuário</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nome de usuário"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Nenhum">Nenhum</option>
          <option value="Proprietário">Proprietário</option>
          <option value="Gerente">Gerente</option>
          <option value="Funcionário">Funcionário</option>
          <option value="Tutor">Tutor</option>
        </select>
        <button type="submit">Registrar</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
