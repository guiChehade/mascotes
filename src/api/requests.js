// src/api/requests.js

import axios from 'axios';

// Função para obter o token do backend
export const getTokenFromBackend = async () => {
  try {
    const response = await axios.get('http://localhost:5000/generate-token'); // Chama o backend para obter o token
    return response.data.access_token; // Retorna o token
  } catch (error) {
    console.error('Erro ao obter o token do backend:', error);
    throw error;
  }
};

// Função para gerar o QR Code usando o token obtido
export const generateQrCodePix = async (token) => {
  try {
    const response = await axios.post(
      'https://matls-clients.api.stage.cora.com.br/pix/qrcodes',
      {
        valor: {
          original: "10.00", // Exemplo de valor
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar o QR Code Pix:', error);
    throw error;
  }
};
