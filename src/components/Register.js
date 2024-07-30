import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Register = ({ isOwner }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('None');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const usernameDocRef = doc(firestore, 'usernames', username);
      const usernameDoc = await getDoc(usernameDocRef);
      if (usernameDoc.exists()) {
        setError('Nome de usuário já existe');
        return;
      }

      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

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

      await setDoc(doc(firestore, 'users', user.uid), {
        username,
        email,
        ...roles
      });

      await setDoc(usernameDocRef, {
        uid: user.uid
      });

      alert("Usuário registrado com sucesso!");
      setUsername('');
      setEmail('');
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
