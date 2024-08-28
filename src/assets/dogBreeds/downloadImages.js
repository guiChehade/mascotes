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

// Função para fazer o download de uma imagem com verificação de status e repetição em caso de falha
const downloadImage = (url, dest, retries = 3) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve());
        });
      } else {
        fs.unlink(dest, () => {});
        if (retries > 0) {
          console.log(`Retrying download for ${url} (${retries} retries left)`);
          resolve(downloadImage(url, dest, retries - 1));
        } else {
          reject(`Failed to download image: ${response.statusCode}`);
        }
      }
    });

    request.on('error', err => {
      fs.unlink(dest, () => {});
      if (retries > 0) {
        console.log(`Retrying download for ${url} (${retries} retries left)`);
        resolve(downloadImage(url, dest, retries - 1));
      } else {
        reject(err.message);
      }
    });

    request.setTimeout(10000, () => {
      request.abort();
      fs.unlink(dest, () => {});
      if (retries > 0) {
        console.log(`Retrying download for ${url} (${retries} retries left)`);
        resolve(downloadImage(url, dest, retries - 1));
      } else {
        reject('Download timed out');
      }
    });
  });
};

// Função para redimensionar a imagem
const resizeImage = (src, dest, width) => {
  return new Promise((resolve, reject) => {
    sharp(src)
      .resize({ width: width })
      .toFile(dest, (err, info) => {
        if (err) {
          reject(`Erro ao redimensionar a imagem ${src}: ${err}`);
        } else {
          console.log(`Imagem redimensionada: ${dest}`);
          resolve(info);
        }
      });
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

// Função principal para processar as imagens
const processImages = async () => {
  console.log('Iniciando o download e redimensionamento das imagens...');

  for (const breed of breedsData) {
    const imageUrl = breed.image_url;
    const imageId = breed.reference_image_id;
    const imageName = path.basename(imageId) + '.jpg';
    const thumbnailName = path.basename(imageId) + '_thumbnail.jpg';
    const dest = path.join(imagesDir, imageName);
    const thumbnailDest = path.join(imagesDir, thumbnailName);

    if (!existingImages[imageId]) {
      try {
        await downloadImage(imageUrl, dest);
        console.log(`Imagem baixada: ${imageUrl}`);
        downloadedIds.push(imageId);
        await resizeImage(dest, thumbnailDest, 400);
      } catch (err) {
        console.error(`Erro ao baixar a imagem ${imageUrl}: ${err}`);
        failedIds.push(imageId);
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