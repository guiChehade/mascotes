import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Container from '../components/Container';
import rolePages from '../utils/rolePages';
import styles from '../styles/AppHome.module.css';

const AppHome = ({ userRoles }) => {
  const navigate = useNavigate();
  const userRole = userRoles?.role || 'none';

  const pages = rolePages[userRole] || [];

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <Container className={styles.appHomeContainer}>
      <h1>Bem-vindo!</h1>
      <div className={styles.buttonGrid}>
        {pages.map((page) => (
          <Button
            key={page.to}
            className={styles.pageButton}
            onClick={() => handleButtonClick(page.to)}
          >
            {page.label}
          </Button>
        ))}
      </div>
    </Container>
  );
};

export default AppHome;
