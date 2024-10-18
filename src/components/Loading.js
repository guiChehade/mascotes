import React from 'react';
import styles from '../styles/Loading.module.css';
import loadingIcon from '../assets/icons/loading.gif';

const Loading = () => (
    <div className={styles.loading}>
        <img src={loadingIcon} alt="Carregando..." />
    </div>
);

export default Loading;