import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ children, onClick, type = 'button', ...props }) => (
  <button className={styles.button} onClick={onClick} type={type} {...props}>
    {children}
  </button>
);

export default Button;