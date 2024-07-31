import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import '../styles/register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Nenhum');

  const handleRegister = async (e) => {
    e.preventDefault();
    const functions = getFunctions();
    const createUser = httpsCallable(functions, 'createUser');

    const roles = {
      isOwner: role === 'Proprietário',
      isAdmin: role === 'Gerente' || role === 'Proprietário',
      isEmployee: role === 'Funcionário' || role === 'Gerente' || role === 'Proprietário',
      isTutor: role === 'Tutor' || 'Funcionário' || role === 'Gerente' || role === 'Proprietário',
    };

    try {
      const result = await createUser({
        username,
        password,
        ...roles
      });
      alert(result.data.message);
    } catch (error) {
      alert(`Erro ao registrar usuário: ${error.message}`);
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
          placeholder="Nome de Usuário"
          required
        />
        <input
          type="text"
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
