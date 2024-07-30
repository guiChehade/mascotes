import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(firestore, 'users', username);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists() || userDoc.data().password !== password) {
        setError('Nome de usuário ou senha incorretos');
        return;
      }

      setAuthenticated(true);
      navigate('/mascotes');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nome de usuário"
          required
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
