import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Nenhum');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const roles = {
        isOwner: role === 'Proprietário',
        isAdmin: role === 'Gerente' || role === 'Proprietário',
        isEmployee: role === 'Funcionário' || role === 'Gerente' || role === 'Proprietário',
        isTutor: role === 'Tutor',
      };

      await setDoc(doc(firestore, 'users', user.uid), {
        email,
        ...roles,
        createdBy: user.uid
      });

      alert('Usuário registrado com sucesso!');
    } catch (error) {
      alert(`Erro ao registrar usuário: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Registrar</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="Nenhum">Nenhum</option>
          <option value="Proprietário">Proprietário</option>
          <option value="Gerente">Gerente</option>
          <option value="Funcionário">Funcionário</option>
          <option value="Tutor">Tutor</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
