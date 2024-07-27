import React, { useState } from 'react';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert("Login bem-sucedido!");
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className={styles.form}>
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
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p>Não tem uma conta? <Link to="/register" className={styles.link}>Registrar</Link></p>
    </div>
  );
};

export default Login;
