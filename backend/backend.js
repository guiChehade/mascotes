const express = require('express');
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const cors = require('cors');

const app = express();
app.use(cors());  // Permitir CORS
app.use(express.json());  // Adicionado para processar JSON no corpo da requisição

// Caminho para os arquivos de chave privada e certificado
const privateKeyPath = 'private-key.key';
const certificatePath = 'certificate.pem';

// Endpoint para gerar o access token
app.get('/generate-token', async (req, res) => {
  try {
    const httpsAgent = new https.Agent({
      cert: fs.readFileSync(certificatePath),
      key: fs.readFileSync(privateKeyPath),
      rejectUnauthorized: false,
    });

    const data = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'int-fZR1DgfdkCUTvPssEjlp0',  // Substitua por seu client_id
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',  // Adicionado conforme o padrão JWT Bearer
    });

    const response = await axios.post('https://matls-clients.api.stage.cora.com.br/token', data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      httpsAgent: httpsAgent,
    });

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Erro ao gerar o token:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao gerar o token');
  }
});

// Novo endpoint para gerar o QR Code Pix
app.post('/generate-qr-code', async (req, res) => {
  // Verifica se o token e os dados de pagamento foram enviados no corpo da requisição
  const { token, valor, descricao, nomePagador, cpfCnpj } = req.body;

  if (!token || !valor || !descricao || !nomePagador || !cpfCnpj) {
    return res.status(400).json({ message: 'Dados de pagamento incompletos' });
  }

  try {
    const response = await axios.post(
      'https://matls-clients.api.stage.cora.com.br/v2/qr-code-pix',
      {
        calendario: {
          expiracao: 3600, // Expira em 1 hora
        },
        devedor: {
          cpf: cpfCnpj, // Ou "cnpj" se for CNPJ
          nome: nomePagador,
        },
        valor: {
          original: valor,
        },
        chave: 'sua_chave_pix_aqui', // Substitua pela sua chave Pix
        solicitacaoPagador: descricao,  // Exemplo: "Pagamento de serviço X"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ qrCode: response.data.qrcode, imagemQrcode: response.data.imagemQrcode });  // Retorna o QR Code e a imagem base64
  } catch (error) {
    console.error('Erro ao gerar o QR Code Pix:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao gerar o QR Code');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
