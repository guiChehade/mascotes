import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Button from '../components/Button';
import LoginModal from '../components/LoginModal';
import styles from '../styles/NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();
    
    return (
        <Container className={styles.notFoundContainer}>
            <p>Oops! Parece que você se perdeu...</p>
            <p>Mas não se preocupe, até os melhores cães farejadores perdem o rastro de vez em quando!</p>
            <ul>
                <p>O que pode ter acontecido?</p>
                <li>O endereço digitado pode estar errado.</li>
                <li>Você ainda não fez login e essa página exige acesso.</li>
                <li>Você não tem permissão para acessar essa página.</li>
                <li>A página que você procura foi removida ou não existe mais.</li>
                <li>O criador desse sistema errou e você tem direito a dar uma bronca nele.</li>
            </ul>
            <Button className={styles.button} onClick={() => navigate('/')}>Página Inicial</Button>
        </Container>
    );
};

export default NotFound;