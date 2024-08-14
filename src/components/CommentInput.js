import React, { useState } from 'react';
import styles from '../styles/CommentInput.module.css';
import Button from './Button';

const CommentInput = ({ onSubmitComment, onCancel }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmitComment(text);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>Qual o comentário que deseja inserir?</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite seu comentário..."
          className={styles.textarea}
        />
        <div className={styles.buttonGroup}>
          <Button onClick={handleSubmit}>Enviar</Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
