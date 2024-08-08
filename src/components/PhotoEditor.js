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
      const resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = 200;
      resizedCanvas.height = 200;
      const resizedContext = resizedCanvas.getContext('2d');
      resizedContext.drawImage(canvas, 0, 0, 200, 200);

      resizedCanvas.toBlob(blob => {
        const file = new File([blob], "photo.jpg", { type: 'image/jpeg' });
        setImage(file);
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
        width={250}
        height={250}
        border={50}
        borderRadius={125}
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
