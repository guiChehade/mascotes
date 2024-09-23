import React, { useState, useEffect } from 'react';
import { useFirestoreTutor } from '../hooks/useFirestoreTutor'; // Hook personalizado para Firestore
import { formatCPF, formatPhoneNumber, calculateAge } from '../utils/Validators';
import axios from 'axios';
import { collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Container from '../components/Container'
import Input from '../components/Input'
import Button from '../components/Button'
import styles from '../styles/CadastroTutor.module.css';

const CadastroTutor = ({ tutorId }) => {
    const [tutorData, setTutorData] = useState({
        nome: '',
        dataNascimento: '',
        idade: '',
        nacionalidade: '',
        genero: '',
        estadoCivil: '',
        cpf: '',
        email: '',
        celular: '',
        outroNumero: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        veterinario: {
        nome: '',
        crmv: '',
        telefonePrincipal: '',
        telefoneSecundario: '',
        nomeClinica: '',
        endereco: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { createOrUpdateTutor, fetchTutorData } = useFirestoreTutor(); // Hook personalizado para Firestore

    // Atualiza os campos ao editar tutor existente
    useEffect(() => {
        if (tutorId) {
        fetchTutorData(tutorId).then(data => {
            if (data) {
            setTutorData(data);
            }
        });
        }
    }, [tutorId]);

    // Calcula a idade automaticamente com base na data de nascimento
    useEffect(() => {
        if (tutorData.dataNascimento) {
        const age = calculateAge(tutorData.dataNascimento);
        setTutorData(prev => ({ ...prev, idade: age }));
        }
    }, [tutorData.dataNascimento]);

    // Preenche o endereço automaticamente ao preencher o CEP
    const handleCEPChange = async (cep) => {
        setTutorData(prev => ({ ...prev, cep }));
        if (cep.length === 8) {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data) {
            setTutorData(prev => ({
                ...prev,
                endereco: response.data.logradouro,
                bairro: response.data.bairro,
                cidade: response.data.localidade,
                uf: response.data.uf
            }));
            }
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
        }
        }
    };

    // Manipula a alteração de dados no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTutorData(prev => ({ ...prev, [name]: value }));
    };

    // Manipula a criação ou edição do tutor
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        await createOrUpdateTutor(tutorData, tutorId);
        setLoading(false);
        alert('Cadastro salvo com sucesso!');
        } catch (error) {
        setError('Erro ao salvar os dados.');
        setLoading(false);
        }
    };

    return (
        <Container>
            <form className={styles.cadastroForm} onSubmit={handleSubmit}>
                <h2>Dados Básicos</h2>
                <Container className={styles.cadastroContainer}>
                    <Input className={styles.cadastroInput} label="Nome Completo" name="nome" value={tutorData.nome} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Data de Nascimento" type="date" name="dataNascimento" value={tutorData.dataNascimento} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Idade" name="idade" value={tutorData.idade} onChange={handleInputChange} disabled />
                    <Input className={styles.cadastroInput} label="Nacionalidade" name="nacionalidade" value={tutorData.nacionalidade} onChange={handleInputChange} />
                    <div className={styles.selectContainer}>
                        <label>Gênero</label>
                        <select className={styles.cadastroSelect} name="genero" value={tutorData.genero} onChange={handleInputChange}>
                            <option value="">Selecione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                            <option value="Prefiro não dizer">Prefiro não dizer</option>
                        </select>
                    </div>
                    <div className={styles.selectContainer}>
                        <label>Estado Civil</label>
                        <select className={styles.cadastroSelect} name="estadoCivil" value={tutorData.estadoCivil} onChange={handleInputChange}>
                            <option value="">Selecione</option>
                            <option value="Solteiro(a)">Solteiro(a)</option>
                            <option value="Casado(a)">Casado(a)</option>
                            <option value="Divorciado(a)">Divorciado(a)</option>
                            <option value="Viúvo(a)">Viúvo(a)</option>
                        </select>
                    </div>
                    <Input className={styles.cadastroInput} label="CPF" name="cpf" value={formatCPF(tutorData.cpf)} onChange={handleInputChange} maxLength={14} />
                </Container>
                <h2>Contato</h2>
                <Container className={styles.cadastroContainer}>
                    <Input className={styles.cadastroInput} label="E-mail" name="email" value={tutorData.email} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Celular" name="celular" value={formatPhoneNumber(tutorData.celular)} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Outro Número" name="outroNumero" value={formatPhoneNumber(tutorData.outroNumero)} onChange={handleInputChange} />
                </Container>
                <h2>Endereço</h2>
                <Container className={styles.cadastroContainer}>
                    <Input className={styles.cadastroInput} label="CEP" name="cep" value={tutorData.cep} onChange={(e) => handleCEPChange(e.target.value)} maxLength={8} />
                    <Input className={styles.cadastroInput} label="Endereço" name="endereco" value={tutorData.endereco} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Número" name="numero" value={tutorData.numero} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Complemento" name="complemento" value={tutorData.complemento} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Bairro" name="bairro" value={tutorData.bairro} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Cidade" name="cidade" value={tutorData.cidade} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="UF" name="uf" value={tutorData.uf} onChange={handleInputChange} />
                </Container>
                <h2>Veterinário</h2>
                <Container className={styles.cadastroContainer}>
                    <Input className={styles.cadastroInput} label="Nome Completo" name="veterinario.nome" value={tutorData.veterinario.nome} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="CRMV" name="veterinario.crmv" value={tutorData.veterinario.crmv} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Telefone Principal" name="veterinario.telefonePrincipal" value={formatPhoneNumber(tutorData.veterinario.telefonePrincipal)} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Telefone Secundário" name="veterinario.telefoneSecundario" value={formatPhoneNumber(tutorData.veterinario.telefoneSecundario)} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Clínica/Hospital" name="veterinario.nomeClinica" value={tutorData.veterinario.nomeClinica} onChange={handleInputChange} />
                    <Input className={styles.cadastroInput} label="Endereço" name="veterinario.endereco" value={tutorData.veterinario.endereco} onChange={handleInputChange} />
                </Container>
                <Button className={styles.cadastroButton} type="submit" disabled={loading}>{tutorId ? 'Atualizar Tutor' : 'Cadastrar Tutor'}</Button>
            </form>
        </Container>
    );
};

export default CadastroTutor;
