const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// Carregar o arquivo JSON
const filePath = path.join(__dirname, 'DogBreeds.json');
const breedsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Criar a pasta 'images' se não existir
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Função para fazer o download de uma imagem
const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      } else {
        fs.unlink(dest, () => reject(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', err => {
      fs.unlink(dest, () => reject(err.message));
    });
  });
};

// Função para converter e redimensionar a imagem
const convertAndResizeImage = (src, dest, thumbnailDest, width) => {
  return sharp(src)
    .jpeg()
    .toFile(dest)
    .then(() => {
      return sharp(dest)
        .resize({ width: width })
        .toFile(thumbnailDest);
    });
};

// Verificar quais imagens já existem
const existingImages = fs.readdirSync(imagesDir).reduce((acc, file) => {
  const id = file.split('.')[0].replace('_thumbnail', '');
  acc[id] = true;
  return acc;
}, {});

// Arrays para armazenar os resultados
const downloadedIds = [];
const failedIds = [];

// Log quando o script começa
console.log('Iniciando o download e redimensionamento das imagens...');

// Função principal para processar as imagens
const processImages = async () => {
  for (const breed of breedsData) {
    const imageId = breed.reference_image_id;
    const imageName = path.basename(imageId) + '.png';
    const thumbnailName = path.basename(imageId) + '_thumbnail.png';
    const dest = path.join(imagesDir, imageName);
    const thumbnailDest = path.join(imagesDir, thumbnailName);

    if (!existingImages[imageId]) {
      const imageUrl1280 = breed.image_url.replace('.png', '_1280.png');
      const imageUrl = breed.image_url;

      try {
        await downloadImage(imageUrl1280, dest);
        console.log(`Imagem baixada: ${imageUrl1280}`);
        downloadedIds.push(imageId);
      } catch (err) {
        console.error(`Erro ao baixar a imagem ${imageUrl1280}: ${err}`);
        try {
          await downloadImage(imageUrl, dest);
          console.log(`Imagem baixada: ${imageUrl}`);
          downloadedIds.push(imageId);
        } catch (err) {
          console.error(`Erro ao baixar a imagem ${imageUrl}: ${err}`);
          failedIds.push(imageId);
          continue;
        }
      }

      try {
        await convertAndResizeImage(dest, dest, thumbnailDest, 400);
        console.log(`Imagem convertida e redimensionada: ${dest}`);
      } catch (err) {
        console.error(`Erro ao converter e redimensionar a imagem ${dest}: ${err}`);
      }
    }
  }

  // Log quando o script termina
  console.log('Download e redimensionamento das imagens concluído.');
  console.log(`IDs baixados com sucesso: ${downloadedIds.join(', ')}`);
  console.log(`IDs que falharam: ${failedIds.join(', ')}`);
  console.log(`Total de downloads bem-sucedidos: ${downloadedIds.length}`);
  console.log(`Total de downloads falhados: ${failedIds.length}`);
};

// Executar a função principal
processImages();