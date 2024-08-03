import React, { useEffect, useState } from 'react';
import Button from './Button';
import styles from '../styles/ThemeToggle.module.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Button className={styles.themeToggle} onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </Button>
  );
};

export default ThemeToggle;