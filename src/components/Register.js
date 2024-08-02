import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from '../styles/Register.module.css';

const Register = ({ currentUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        role: newUserRole,
        createdBy: currentUser ? currentUser.name : 'Site'
      });

      alert('Usuário registrado com sucesso!');
    } catch (error) {
      alert(`Erro ao registrar usuário: ${error.message}`);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Registrar</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: João da Silva"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ex: joao@gmail.com"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
          <option value="">Selecione o tipo de usuário</option>
          <option value="isOwner">Proprietário</option>
          <option value="isAdmin">Gerente</option>
          <option value="isEmployee">Funcionário</option>
          <option value="isTutor">Tutor</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
