import React from 'react';
import styles from '../styles/Container.module.css';

const Container = ({ children, className }) => {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default Container;