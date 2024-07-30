import React, { useState } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Register = ({ isOwner }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('None');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(firestore, 'users', username);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setError('Nome de usuário já existe');
        return;
      }

      let roles = {
        isOwner: false,
        isAdmin: false,
        isEmployee: false,
        isTutor: false
      };

      switch(role) {
        case 'Owner':
          roles = { isOwner: true, isAdmin: true, isEmployee: true, isTutor: true };
          break;
        case 'Admin':
          roles = { isOwner: false, isAdmin: true, isEmployee: true, isTutor: true };
          break;
        case 'Employee':
          roles = { isOwner: false, isAdmin: false, isEmployee: true, isTutor: true };
          break;
        case 'Tutor':
          roles = { isOwner: false, isAdmin: false, isEmployee: false, isTutor: true };
          break;
        default:
          roles = { isOwner: false, isAdmin: false, isEmployee: false, isTutor: false };
      }

      await setDoc(userDocRef, {
        username,
        password,
        ...roles
      });

      alert("Usuário registrado com sucesso!");
      setUsername('');
      setPassword('');
      setRole('None');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Registrar</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nome de usuário"
          required
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Owner">Proprietário</option>
          <option value="Admin">Gerente</option>
          <option value="Employee">Funcionário</option>
          <option value="Tutor">Tutor</option>
          <option value="None">Nenhum</option>
        </select>
        <button type="submit">Registrar</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
