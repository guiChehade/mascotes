import React, { useState } from 'react';
import Button from './Button';
import TextInputModal from './TextInputModal';
import styles from '../styles/CommentSelection.module.css';

const CommentSelection = ({ onSubmit, onClose }) => {
  const [selectedComment, setSelectedComment] = useState('');
  const [showTextInputModal, setShowTextInputModal] = useState(false);

  const handleCommentSelection = (commentType) => {
    setSelectedComment(commentType);
    setShowTextInputModal(true);
  };

  const handleTextInputSubmit = (text) => {
    onSubmit(selectedComment, text);
    setShowTextInputModal(false);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>Selecionar Tipo de Comentário</h2>
        <div className={styles.buttonGroup}>
          <Button onClick={() => handleCommentSelection('Comportamental')}>Comportamental</Button>
          <Button onClick={() => handleCommentSelection('Veterinário')}>Veterinário</Button>
          <Button onClick={() => handleCommentSelection('Pertences')}>Pertences</Button>
          <Button onClick={onClose}>Voltar</Button>
        </div>
        {showTextInputModal && (
          <TextInputModal
            placeholder={`Descreva o comentário sobre ${selectedComment}...`}
            onSubmit={handleTextInputSubmit}
            onClose={() => setShowTextInputModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSelection;
