import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Register from '../components/Register';
import '../styles/usuarios.css';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

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
    setNewUserRole(user.role);
  };

  const handleUpdateRole = async (id) => {
    await updateDoc(doc(firestore, 'users', id), {
      name: editUserName,
      role: newUserRole
    });
    setEditUserId(null);
  };

  return (
    <div className="usuarios-container">
      <h2>Gerenciamento de Usuários</h2>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nome do Usuário</th>
            <th>Email</th>
            <th>Tipo de Usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {editUserId === user.id ? (
                  <input
                    type="text"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>{user.email}</td>
              <td>
                {editUserId === user.id ? (
                  <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                    <option value="isOwner">Proprietário</option>
                    <option value="isAdmin">Gerente</option>
                    <option value="isEmployee">Funcionário</option>
                    <option value="isTutor">Tutor</option>
                    <option value="">Nenhum</option>
                  </select>
                ) : (
                  user.role === 'isOwner' ? 'Proprietário' :
                  user.role === 'isAdmin' ? 'Gerente' :
                  user.role === 'isEmployee' ? 'Funcionário' :
                  user.role === 'isTutor' ? 'Tutor' : 'Nenhum'
                )}
              </td>
              <td>
                {user.role === 'isOwner' ? (
                  <>
                    <button disabled title="Não é possível editar Proprietários, caso seja necessário contate o Guilherme Chehade">Editar</button>
                    <button disabled title="Não é possível excluir Proprietários, caso seja necessário contate o Guilherme Chehade">Excluir</button>
                  </>
                ) : (
                  editUserId === user.id ? (
                    <button onClick={() => handleUpdateRole(user.id)}>Salvar</button>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)}>Editar</button>
                      <button onClick={() => handleDelete(user.id)}>Excluir</button>
                    </>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Register />
    </div>
  );
};

export default Usuarios;
