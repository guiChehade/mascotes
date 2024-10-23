import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ children, onClick, type = 'button', className, ...props }) => (
  <button className={`${styles.button} ${className}`} onClick={onClick} type={type} {...props}>
    {children}
  </button>
);

export default Button;