import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const PhotoEditor = ({ image, setImage, setEditorOpen }) => {
  const [crop, setCrop] = useState({ aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageLoaded = (image) => {
    setPreviewUrl(image);
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleSave = () => {
    if (completedCrop && previewUrl) {
      const canvas = document.createElement('canvas');
      const scaleX = previewUrl.naturalWidth / previewUrl.width;
      const scaleY = previewUrl.naturalHeight / previewUrl.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        previewUrl,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob((blob) => {
        const file = new File([blob], 'cropped_image.png', { type: 'image/png' });
        setImage(file);
        setEditorOpen(false);
      }, 'image/png');
    }
  };

  return (
    <div>
      <ReactCrop
        src={URL.createObjectURL(image)}
        crop={crop}
        ruleOfThirds
        onImageLoaded={handleImageLoaded}
        onComplete={handleCropComplete}
        onChange={(newCrop) => setCrop(newCrop)}
      />
      <button onClick={handleSave}>Salvar</button>
      <button onClick={() => setEditorOpen(false)}>Cancelar</button>
    </div>
  );
};

export default PhotoEditor;