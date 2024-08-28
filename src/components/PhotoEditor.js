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
      const context = resizedCanvas.getContext('2d');
  
      resizedCanvas.width = 200;
      resizedCanvas.height = 200;
  
      context.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 200, 200);
  
      const resizedDataURL = resizedCanvas.toDataURL('image/jpeg'); // Get data URL
  
      // Update photo state with data URL
      setImage(resizedDataURL);
      setEditorOpen(false);
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
