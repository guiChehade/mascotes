import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Pagamentos.module.css';
import Button from '../components/Button';
import Input from '../components/Input';
import Container from '../components/Container';

const Pagamentos = () => {
  const [token, setToken] = useState('');
  const [paymentData, setPaymentData] = useState({
    customerName: '',
    customerEmail: '',
    customerDocumentType: 'CPF',
    customerDocumentIdentity: '',
    servicesName: 'Creche',
    servicesDescription: '',
    servicesAmount: '',
    paymentTermsDueDate: '',
    notificationName: '',
    notificationContact: '',
    notificationChannel: 'EMAIL',
    notificationRules: 'NOTIFY_ON_DUE_DATE',
  });
  const [qrCode, setQrCode] = useState(null);
  const [invoiceId, setInvoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/generate-token'); // Atualize com a URL correta
        setToken(response.data.token);
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
        'http://localhost:5000/generate-qrcode',  // Chama o backend para gerar o QR Code
        {
          token: token,  // Inclui o token de autenticação
          customerName: paymentData.customerName,
          customerEmail: paymentData.customerEmail,
          customerDocumentType: paymentData.customerDocumentType,
          customerDocumentIdentity: paymentData.customerDocumentIdentity,
          servicesName: paymentData.servicesName,
          servicesDescription: paymentData.servicesDescription,
          servicesAmount: paymentData.servicesAmount,
          paymentTermsDueDate: paymentData.paymentTermsDueDate,
          notificationName: paymentData.notificationName,
          notificationContact: paymentData.notificationContact,
          notificationChannel: paymentData.notificationChannel,
          notificationRules: paymentData.notificationRules,
        },
        {
          headers: {
            'Content-Type': 'application/json',  // Certifique-se de definir o tipo de conteúdo
          },
        }
      );
  
      setQrCode(response.data.qrCode);
      setInvoiceId(response.data.invoiceId);
    } catch (err) {
      console.error('Erro ao gerar o QR Code de pagamento:', err);
      let errorMessage = 'Erro ao gerar o QR Code de pagamento. Tente novamente.';
      if (err.response && err.response.data) {
        if (typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data.message === 'string') {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      }
      setError(errorMessage);
    }
    setLoading(false);
  };

  const consultaPagamento = async () => {
    if (!invoiceId) {
      setError('ID da fatura não encontrado. Gere um QR Code primeiro.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        'http://localhost:5000/check-payment',  // Chama o backend para consultar o pagamento
        {
          params: {
            token: token,  // Inclui o token de autenticação
            invoiceId: invoiceId,
          },
          headers: {
            'Content-Type': 'application/json',  // Certifique-se de definir o tipo de conteúdo
          },
        }
      );

      console.log(response.data.status);
      console.log(response.data);
    }
    catch (err) {
      console.error('Erro ao consultar o pagamento:', err);
      let errorMessage = 'Erro ao consultar o pagamento. Tente novamente.';
      if (err.response && err.response.data) {
        if (typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data.message === 'string') {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      }
      setError(errorMessage);
    }
    setLoading(false);
  }

  return (
    <Container className={styles.pagamentosContainer}>
      <h2>Gerar QR Code de Pagamento</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formContainer}>
        <Input
          type="text"
          name="customerName"
          value={paymentData.customerName}
          placeholder="Nome do Tutor"
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name='customerEmail'
          value={paymentData.customerEmail}
          placeholder="E-mail do Tutor"
          onChange={handleInputChange}
        />
        <select
          name="customerDocumentType"
          type="text"
          className={styles.select}
          value={paymentData.customerDocumentType}
          onChange={handleInputChange}
        >
          <option value="CPF">CPF</option>
          <option value="CNPJ">CNPJ</option>
        </select>
        <Input
          type="text"
          name="customerDocumentIdentity"
          value={paymentData.customerDocumentIdentity}
          placeholder="CPF/CNPJ do Tutor"
          onChange={handleInputChange}
        />
        <select
          name="servicesName"
          type="text"
          className={styles.select}
          value={paymentData.servicesName}
          onChange={handleInputChange}
        >
          <option value="Creche">Creche</option>
          <option value="Hotel">Hotel</option>
          <option value="Outros">Outros</option>
        </select>
        <Input
          type="text"
          name="servicesDescription"
          value={paymentData.servicesDescription}
          placeholder="Descrição do Serviço"
          onChange={handleInputChange}
        />
        <Input
          type="number"
          name="servicesAmount"
          value={paymentData.servicesAmount}
          placeholder="Valor em centavos (ex: Para R$ 5,00 digite 500)"
          onChange={handleInputChange}
        />
        <Input
          type="string"
          name="paymentTermsDueDate"
          value={paymentData.paymentTermsDueDate}
          placeholder="Data de Vencimento (Digite no formato AAAA-MM-DD)"
          onChange={handleInputChange}
        />
        <Input
          type="string"
          name="notificationName"
          value={paymentData.notificationName}
          placeholder="Nome para Notificação"
          onChange={handleInputChange}
        />
        <Input
          type="string"
          name="notificationContact"
          value={paymentData.notificationContact}
          placeholder="E-mail para Notificação"
          onChange={handleInputChange}
        />
        <Input
          type="string"
          name="notificationChannel"
          value={paymentData.notificationChannel}
          placeholder="EMAIL"
          onChange={handleInputChange}
        />
        <Input
          type="string"
          name="notificationRules"
          value={paymentData.notificationRules}
          placeholder="NOTIFY_ON_DUE_DATE"
          onChange={handleInputChange}
        />
        <Button onClick={generateQrCode} className={styles.button} disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar QR Code'}
        </Button>
        <Button onClick={consultaPagamento} className={styles.button} disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar Pagamento'}
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
