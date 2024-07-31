import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/register.css';

const Register = ({ currentUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const roles = {
        isOwner: true,
        isAdmin: true,
        isEmployee: true,
        isTutor: true,
      };

      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        ...roles,
        createdBy: currentUser ? currentUser.name : 'Site'
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
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
        />
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
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
