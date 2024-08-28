const fs = require('fs');
const path = require('path');

// Carregar o arquivo JSON
const filePath = path.join(__dirname, 'dogBreeds.json');
const breedsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Contar o número de raças
const numberOfBreeds = breedsData.length;

console.log(`Número de raças de cachorro: ${numberOfBreeds}`);