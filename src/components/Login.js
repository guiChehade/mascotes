import React, { useState } from 'react';
import { firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import '../styles/login.css';

const Login = ({ setAuthenticated, fetchUserRoles }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before new attempt
    try {
      const userDocRef = doc(firestore, 'users', username);
      const userDoc = await getDoc(userDocRef);

      console.log("User Document:", userDoc);
      if (!userDoc.exists()) {
        setError('Nome de usuário ou senha incorretos');
        return;
      }

      const userData = userDoc.data();
      console.log("User Data:", userData);
      if (userData.password !== password) {
        setError('Nome de usuário ou senha incorretos');
        return;
      }

      await fetchUserRoles(username);
      setAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error("Login Error:", error);
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
