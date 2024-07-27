import React from 'react';
import '../styles/button.css';

const Button = ({ children, onClick }) => (
  <button className="button" onClick={onClick}>
    {children}
  </button>
);

export default Button;
