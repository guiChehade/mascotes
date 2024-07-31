import React, { useState } from 'react';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('none');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(firestore, 'users', username), {
        password,
        isOwner: role === 'owner',
        isAdmin: role === 'admin',
        isEmployee: role === 'employee',
        isTutor: role === 'tutor'
      });
      alert('Usuário registrado com sucesso!');
      navigate('/usuarios');
    } catch (error) {
      setError('Erro ao registrar usuário: ' + error.message);
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="none">Selecione o tipo de usuário</option>
          <option value="owner">Proprietário</option>
          <option value="admin">Gerente</option>
          <option value="employee">Funcionário</option>
          <option value="tutor">Tutor</option>
        </select>
        <button type="submit">Registrar</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
