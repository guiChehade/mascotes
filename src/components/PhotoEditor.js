import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';

const PhotoEditor = ({ image, setImage, setEditorOpen }) => {
  const [scale, setScale] = useState(1);
  const editorRef = useRef();

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImage();
      const dataUrl = canvas.toDataURL();
      setImage(dataUrl);
      setEditorOpen(false);
    }
  };

  return (
    <div className="photo-editor-container">
      <AvatarEditor
        ref={editorRef}
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
      <button onClick={handleSave}>Salvar</button>
      <button onClick={() => setEditorOpen(false)}>Cancelar</button>
    </div>
  );
};

export default PhotoEditor;
