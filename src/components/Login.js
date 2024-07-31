import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth } from '../firebase';
import '../styles/login.css';

const Login = ({ setIsAuthenticated, setUserRoles }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setIsAuthenticated(true);

      // Fetch roles from Firestore
      const userDoc = await firestore.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        setUserRoles(userDoc.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      alert(`Erro ao fazer login: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
