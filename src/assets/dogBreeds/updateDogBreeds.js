const fs = require('fs');
const path = require('path');

// Caminho do arquivo JSON
const filePath = path.join(__dirname, 'dogBreeds.json');

// Carregar o arquivo JSON
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Iterar sobre cada objeto no array
data.forEach(breed => {
  if (breed.reference_image_id) {
    const referenceImageId = breed.reference_image_id;
    breed.image_path = `images/${referenceImageId}.jpg`;
    breed.thumbnail = `images/${referenceImageId}_thumbnail.jpg`;
  }
});

// Salvar o arquivo JSON atualizado
const updatedFilePath = path.join(__dirname, 'dogBreeds_updated.json');
fs.writeFileSync(updatedFilePath, JSON.stringify(data, null, 2));

console.log('Arquivo JSON atualizado com sucesso!');