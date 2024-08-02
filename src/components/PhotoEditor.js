import React, { useState, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Button from './Button';
import styles from '../styles/PhotoEditor.module.css';

const PhotoEditor = ({ image, setImage, setEditorOpen }) => {
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);

  const handleSave = () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      const imgData = canvas.toDataURL('image/jpeg');
      fetch(imgData)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "photo.jpg", { type: 'image/jpeg' });
          setImage(file);
          setEditorOpen(false);
        });
    }
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
      <Button onClick={handleSave}>Salvar</Button>
    </div>
  );
};

export default PhotoEditor;