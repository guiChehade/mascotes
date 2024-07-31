import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import '../styles/usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRoleSelect, setNewUserRoleSelect] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Você tem certeza que quer excluir este usuário?')) {
      await deleteDoc(doc(firestore, 'users', id));
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditUserName(user.name);
    setNewUserRole(user.roles);
  };

  const handleSave = async (id) => {
    await updateDoc(doc(firestore, 'users', id), { name: editUserName, roles: newUserRole });
    setEditUserId(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(firestore, 'users'), {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        roles: newUserRoleSelect,
        createdBy: 'currentUserName', // Ajuste conforme necessário
      });
      console.log('Document written with ID: ', docRef.id);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRoleSelect('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="usuarios-container">
      <h2>Usuários Registrados</h2>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo de Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{editUserId === user.id ? <input value={editUserName} onChange={(e) => setEditUserName(e.target.value)} /> : user.name}</td>
              <td>{user.email}</td>
              <td>{editUserId === user.id ? <input value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} /> : user.roles}</td>
              <td>
                {editUserId === user.id ? (
                  <button onClick={() => handleSave(user.id)}>Salvar</button>
                ) : (
                  <button onClick={() => handleEdit(user)}>Editar</button>
                )}
                <button onClick={() => handleDelete(user.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Registrar Novo Usuário</h2>
      <form onSubmit={handleRegister}>
        <label>Nome do Usuário</label>
        <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
        <label>Senha</label>
        <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
        <label>Tipo de Usuário</label>
        <select value={newUserRoleSelect} onChange={(e) => setNewUserRoleSelect(e.target.value)}>
          <option value="Owner">Proprietário</option>
          <option value="Admin">Gerente</option>
          <option value="Employee">Funcionário</option>
          <option value="Tutor">Tutor</option>
          <option value="None">Nenhum</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Usuarios;
