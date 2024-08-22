import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Button from './Button';
import styles from '../styles/PhotoEditor.module.css';

const PhotoEditor = ({ image, setImage, setEditorOpen }) => {
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);

  const handleSave = () => {
    if (editor) {
      // Cria o canvas com as dimensões desejadas
      const canvas = editor.getImageScaledToCanvas();
      const resizedCanvas = document.createElement('canvas');
      const context = resizedCanvas.getContext('2d');

      resizedCanvas.width = 200;
      resizedCanvas.height = 200;

      // Redimensiona e desenha a imagem no novo canvas
      context.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 200, 200);

      // Converte o canvas redimensionado em um blob e, em seguida, em um arquivo
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
