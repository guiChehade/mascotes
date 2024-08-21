import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
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
      await auth.signOut();
      await auth.updateCurrentUser(currentUser);
      
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
    <Container className={styles.registerContainer}>
      <h2>Registrar</h2>
      <form className={styles.registerForm} onSubmit={handleRegister}>
        <Input
          label="Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o email"
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          required
        />
        <label className={styles.label}>Tipo de Usuário</label>
        <select
          className={styles.select}
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value)}
          required
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="isOwner">Proprietário</option>
          <option value="isAdmin">Gerente</option>
          <option value="isEmployee">Funcionário</option>
          <option value="isTutor">Tutor</option>
        </select>
        <Button type="submit">Registrar</Button>
      </form>
    </Container>
  );
};

export default Register;
