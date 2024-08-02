import React from 'react';
// import { Link } from 'react-router-dom';
// import Button from '../components/Button';
import styles from '../styles/Home.module.css';

const Home = ({ isAuthenticated, userRoles }) => {
  const userRole = userRoles?.role || 'none';

//   const rolePages = {
//     isOwner: [
//       { to: "/", label: "Início" },
//       { to: "/cadastro", label: "Cadastro" },
//       { to: "/contrato", label: "Contrato" },
//       { to: "/creche", label: "Creche" },
//       { to: "/hotel", label: "Hotel" },
//       { to: "/financas", label: "Financas" },
//       { to: "/usuarios", label: "Usuários" },
//     ],
//     isAdmin: [
//       { to: "/", label: "Início" },
//       { to: "/creche", label: "Creche" },
//       { to: "/cadastro", label: "Cadastro" },
//     ],
//     isEmployee: [
//       { to: "/", label: "Início" },
//       { to: "/creche", label: "Creche" },
//     ],
//     isTutor: [
//       { to: "/", label: "Início" },
//     ],
//     none: [
//       { to: "/", label: "Início" }
//     ],
//   };

  return (
    <div className={styles.home}>
      <h1>Bem-vindo ao ERP Mascotinhos</h1>
      {/* {isAuthenticated && userRoles && (
        <div className={styles.buttons}>
          {rolePages[userRole]?.map((page) => (
            <div className={styles.buttonWrapper} key={page.to}>
              <Link to={page.to}>
                <Button>{page.label}</Button>
              </Link>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Home;
