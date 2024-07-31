import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import '../styles/usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    const userDocRef = doc(firestore, 'users', userId);
    const updatedData = {
      isOwner: role === 'Proprietário',
      isAdmin: role === 'Gerente' || role === 'Proprietário',
      isEmployee: role === 'Funcionário' || role === 'Gerente' || role === 'Proprietário',
      isTutor: role === 'Tutor',
    };
    await updateDoc(userDocRef, updatedData);
    setSelectedRole({ ...selectedRole, [userId]: role });
  };

  const handleDeleteUser = async (userId) => {
    if (userId === 'tiaDani' || userId === 'guiChehade') {
      alert("Não é possível excluir este usuário.");
      return;
    }
    const userDocRef = doc(firestore, 'users', userId);
    await deleteDoc(userDocRef);
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div>
      <h2>Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <select
                  value={selectedRole[user.id] || (user.isOwner ? 'Proprietário' : user.isAdmin ? 'Gerente' : user.isEmployee ? 'Funcionário' : user.isTutor ? 'Tutor' : 'Nenhum')}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={user.id === 'tiaDani' || user.id === 'guiChehade'}
                >
                  <option value="Nenhum">Nenhum</option>
                  <option value="Proprietário">Proprietário</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Funcionário">Funcionário</option>
                  <option value="Tutor">Tutor</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)} disabled={user.id === 'tiaDani' || user.id === 'guiChehade'}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => window.location.href = '/register'}>Registrar Novo Usuário</button>
    </div>
  );
};

export default Usuarios;
