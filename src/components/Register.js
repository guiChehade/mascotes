import React, { useState } from 'react';
import { auth } from '../firebase';
import styles from './Register.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert("Usuário registrado com sucesso!");
    } catch (error) {
      alert("Erro ao registrar usuário: " + error.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Registrar</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Registrar</button>
      </form>
    </div>
  );
};

export default Register;
