import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from '../styles/Login.module.css';

const Login = ({ setIsAuthenticated, setUserRoles, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setIsAuthenticated(true);
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRoles(userData);
        setCurrentUser(userData);
        navigate('/app');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log(`Erro ao fazer login: ${error.message}`);
    }
  };

  return (
    <Container className={styles.loginContainer}>
      <h2>Login</h2>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
        />
        <Button type="submit">Entrar</Button>
      </form>
    </Container>
  );
};

export default Login;
