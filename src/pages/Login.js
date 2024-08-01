import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/login.css';

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
      navigate('/');
       // Fetch roles from Firestore
       const userDoc = await getDoc(doc(firestore, 'users', user.uid));
       if (userDoc.exists()) {
         const userData = userDoc.data();
         setUserRoles(userData);
         setCurrentUser(userData);
       } else {
         console.log('No such document!');
       }
     } catch (error) {
      console.log(`Erro ao fazer login: ${error.message}`);
     }
   };
 
   return (
     <div>
       <h2>Login</h2>
       <form onSubmit={handleLogin}>
        <label>Email</label>
         <input
           type="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Email"
           required
         />
        <label>Senha</label>
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
