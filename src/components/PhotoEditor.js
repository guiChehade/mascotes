import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Button from './Button';
import styles from '../styles/PhotoEditor.module.css';

const PhotoEditor = ({ image, setImage, setEditorOpen }) => {
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);

  const handleSave = () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], "photo.jpg", { type: 'image/jpeg' });
        setImage(resizedFile);
        setEditorOpen(false);
      }, 'image/jpeg');
    }
  };

  const handleBackClick = () => {
    setImage('');
    setEditorOpen(false);
  };

  return (
    <div className={styles.photoEditorContainer}>
      <AvatarEditor
        ref={setEditor}
        image={image}
        width={200}
        height={200}
        border={50}
        borderRadius={100}
        scale={scale}
      />
      <input
        type="range"
        min="1"
        max="2"
        step="0.01"
        value={scale}
        onChange={(e) => setScale(parseFloat(e.target.value))}
      />
      <div className={styles.buttonsContainer}>
        <Button onClick={handleBackClick}>Voltar</Button>
        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </div>
  );
};

export default PhotoEditor;
