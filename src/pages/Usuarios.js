import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Register from '../components/Register';
import '../styles/usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLoading(false);
    };
    
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    const userDoc = doc(firestore, 'users', userId);
    let updatedRoles = {
      isOwner: false,
      isAdmin: false,
      isEmployee: false,
      isTutor: false
    };

    switch(role) {
      case 'Owner':
        updatedRoles = { isOwner: true, isAdmin: true, isEmployee: true, isTutor: true };
        break;
      case 'Admin':
        updatedRoles = { isOwner: false, isAdmin: true, isEmployee: true, isTutor: true };
        break;
      case 'Employee':
        updatedRoles = { isOwner: false, isAdmin: false, isEmployee: true, isTutor: true };
        break;
      case 'Tutor':
        updatedRoles = { isOwner: false, isAdmin: false, isEmployee: false, isTutor: true };
        break;
      default:
        updatedRoles = { isOwner: false, isAdmin: false, isEmployee: false, isTutor: false };
    }

    await updateDoc(userDoc, updatedRoles);
    setUsers(users.map(user => user.id === userId ? { ...user, ...updatedRoles } : user));
  };

  const handleEditUser = (user) => {
    if (user.username === 'tiaDani' || user.username === 'guiChehade') return;
    setEditUser(user.id);
    setUsername(user.username);
    setPassword(user.password);
  };

  const handleSaveUser = async () => {
    const userDoc = doc(firestore, 'users', editUser);
    await updateDoc(userDoc, { username, password });
    setUsers(users.map(user => user.id === editUser ? { ...user, username, password } : user));
    setEditUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (userId === 'tiaDani' || userId === 'guiChehade') {
      alert("Não é possível excluir este usuário.");
      return;
    }

    await deleteDoc(doc(firestore, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome de Usuário</th>
            <th>Senha</th>
            <th>Tipo de Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {editUser === user.id ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    readOnly={user.username === 'tiaDani' || user.username === 'guiChehade'}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editUser === user.id ? (
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    readOnly={user.username === 'tiaDani' || user.username === 'guiChehade'}
                  />
                ) : (
                  user.password
                )}
              </td>
              <td>
                {user.username === 'tiaDani' || user.username === 'guiChehade' ? 'Proprietário' : (
                  editUser === user.id ? (
                    <select
                      value={
                        user.isOwner ? 'Owner' :
                        user.isAdmin ? 'Admin' :
                        user.isEmployee ? 'Employee' :
                        user.isTutor ? 'Tutor' : 'None'
                      }
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="Owner">Proprietário</option>
                      <option value="Admin">Gerente</option>
                      <option value="Employee">Funcionário</option>
                      <option value="Tutor">Tutor</option>
                      <option value="None">Nenhum</option>
                    </select>
                  ) : (
                    user.isOwner ? 'Proprietário' :
                    user.isAdmin ? 'Gerente' :
                    user.isEmployee ? 'Funcionário' :
                    user.isTutor ? 'Tutor' : 'Nenhum'
                  )
                )}
              </td>
              <td>
                {editUser === user.id ? (
                  <button onClick={handleSaveUser}>Salvar</button>
                ) : (
                  <>
                    <button onClick={() => handleEditUser(user)}>Editar</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Registrar Novo Usuário</h3>
      <Register isOwner={true} />
    </div>
  );
};

export default Usuarios;
