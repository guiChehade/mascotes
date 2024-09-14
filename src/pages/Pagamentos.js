import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Pagamentos.module.css';
import Button from '../components/Button';
import Input from '../components/Input';
import Container from '../components/Container';

const Pagamentos = () => {
  const [token, setToken] = useState('');
  const [paymentData, setPaymentData] = useState({ valor: '', descricao: '', nomePagador: '', cpfCnpj: '' });
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/generate-token'); // Atualize com a URL correta
        setToken(response.data.access_token);
      } catch (err) {
        setError('Erro ao autenticar. Verifique as credenciais.');
      }
    };

    fetchToken();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateQrCode = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:5000/generate-qr-code',  // Chama o backend para gerar o QR Code
        {
          token: token,  // Inclui o token de autenticação
          valor: paymentData.valor,  // Valor de pagamento
          descricao: paymentData.descricao,  // Descrição
          nomePagador: paymentData.nomePagador,  // Nome do pagador
          cpfCnpj: paymentData.cpfCnpj,  // CPF ou CNPJ do pagador
        },
        {
          headers: {
            'Content-Type': 'application/json',  // Certifique-se de definir o tipo de conteúdo
          },
        }
      );
  
      setQrCode(response.data.qrCode);
    } catch (err) {
      console.error('Erro ao gerar o QR Code de pagamento:', err);
      setError('Erro ao gerar o QR Code de pagamento. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <Container className={styles.pagamentosContainer}>
      <h2>Gerar QR Code de Pagamento</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formContainer}>
        <Input
          type="text"
          name="valor"
          placeholder="Valor"
          value={paymentData.valor}
          onChange={handleInputChange}
          className={styles.input}
        />
        <Input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={paymentData.descricao}
          onChange={handleInputChange}
          className={styles.input}
        />
        <Input
          type="text"
          name="nomePagador"
          placeholder="Nome do Pagador"
          value={paymentData.nomePagador}
          onChange={handleInputChange}
          className={styles.input}
        />
        <Input
          type="text"
          name="cpfCnpj"
          placeholder="CPF/CNPJ do Pagador"
          value={paymentData.cpfCnpj}
          onChange={handleInputChange}
          className={styles.input}
        />
        <Button onClick={generateQrCode} className={styles.button} disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar QR Code'}
        </Button>
      </div>
      {qrCode && (
        <div className={styles.qrCodeContainer}>
          <h3>QR Code Gerado</h3>
          <img src={`data:image/png;base64,${qrCode}`} alt="QR Code de Pagamento" className={styles.qrCode} />
        </div>
      )}
    </Container>
  );
};

export default Pagamentos;
