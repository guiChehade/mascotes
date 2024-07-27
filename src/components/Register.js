import React, { useState } from 'react';
import { auth } from '../firebase';
import '../styles/register.css';

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
    <div className="register-container">
      <h2>Registrar</h2>
      <form onSubmit={handleRegister} className="form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="input"
        />
        <button type="submit" className="button">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
