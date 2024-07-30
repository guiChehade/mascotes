import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import '../styles/login.css';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usernameDocRef = doc(firestore, 'usernames', username);
      const usernameDoc = await getDoc(usernameDocRef);
      if (!usernameDoc.exists()) {
        setError('Nome de usuário ou senha incorretos');
        return;
      }

      const userDocRef = doc(firestore, 'users', usernameDoc.data().uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      await auth.signInWithEmailAndPassword(userData.email, password);

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
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
          <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
