import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import '../styles/usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleAdminChange = async (index) => {
    const newUsers = [...users];
    newUsers[index].isAdmin = !newUsers[index].isAdmin;
    setUsers(newUsers);
    try {
      const userDoc = doc(firestore, 'users', newUsers[index].id);
      await updateDoc(userDoc, { isAdmin: newUsers[index].isAdmin });
    } catch (error) {
      alert("Erro ao atualizar permissões de administrador: " + error.message);
    }
  };

  const handleDelete = async (id, email) => {
    if (email === "gui_chehade@hotmail.com" || email === "dani.maurano74@gmail.com") {
      alert("Não é possível excluir este usuário.");
      return;
    }
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário? Esta ação é definitiva.");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(firestore, 'users', id));
        setUsers(users.filter(user => user.id !== id));
        alert("Usuário excluído com sucesso!");
      } catch (error) {
        alert("Erro ao excluir usuário: " + error.message);
      }
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const userDoc = doc(firestore, 'users', userCredential.user.uid);
      await setDoc(userDoc, {
        email,
        isAdmin: false
      });
      alert("Usuário registrado com sucesso!");
      const newUser = { id: userCredential.user.uid, email, isAdmin: false };
      setUsers([...users, newUser]);
    } catch (error) {
      alert("Erro ao registrar usuário: " + error.message);
    }
  };

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    handleRegister(newUserEmail, newUserPassword);
    setNewUserEmail('');
    setNewUserPassword('');
  };

  return (
    <div className="usuarios">
      <h2>Gerenciamento de Usuários</h2>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Admin</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isAdmin}
                  onChange={() => handleAdminChange(index)}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(user.id, user.email)} className="button delete-button">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Registrar Novo Usuário</h3>
      <form onSubmit={handleRegisterSubmit} className="register-form">
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Email"
          required
          className="input"
        />
        <input
          type="password"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
          placeholder="Senha"
          required
          className="input"
        />
        <button type="submit" className="button">Registrar</button>
      </form>
    </div>
  );
};

export default Usuarios;
