import React, { useState } from 'react';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import PhotoEditor from '../components/PhotoEditor';
import Container from '../components/Container';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from '../styles/CadastroTutor.module.css';

const CadastroTutor = ({ currentUser }) => {
  const [tutor, setTutor] = useState({
    foto: '',
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
    nomeVet: '',
    crmvVet: '',
    telefonePrincipalVet: '',
    telefoneSecundarioVet: '',
    nomeClinicaVet: '',
    enderecoVet: ''
  });

  const [image, setImage] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTutor((prevTutor) => ({
      ...prevTutor,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setEditorOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fotoURL = '';
    if (image instanceof File) {
      const fotoRef = ref(storage, `tutores/${Date.now()}_${image.name}`);
      await uploadBytes(fotoRef, image);
      fotoURL = await getDownloadURL(fotoRef);
    }

    await addDoc(collection(firestore, 'tutores'), {
      ...tutor,
      foto: fotoURL,
      createdBy: currentUser.name,
    });

    alert('Tutor cadastrado com sucesso!');
    setTutor({
      foto: '',
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
      nomeVet: '',
      crmvVet: '',
      telefonePrincipalVet: '',
      telefoneSecundarioVet: '',
      nomeClinicaVet: '',
      enderecoVet: ''
    });
  };

  return (
    <Container className={styles.cadastroContainer}>
      <h2>Cadastro de Tutor</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Foto do Tutor" type="file" accept="image/*" onChange={handleFileChange} />
        <Input label="Nome Completo" type="text" name="nome" value={tutor.nome} onChange={handleChange} required placeholder="João Pereira" />
        <Input label="Data de Nascimento" type="date" name="dataNascimento" value={tutor.dataNascimento} onChange={handleChange} placeholder="01/01/2000" />
        <Input label="Idade" type="number" name="idade" value={tutor.idade} onChange={handleChange} disabled />
        <Input label="Nacionalidade" type="text" name="nacionalidade" value={tutor.nacionalidade} onChange={handleChange} placeholder="Brasileiro" />
        <div className={styles.selectContainer}>
          <label>Gênero</label>
          <select className={styles.cadastroSelect} name="genero" value={tutor.genero} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não informar">Prefiro não informar</option>
          </select>
        </div>
        <div className={styles.selectContainer}>
          <label>Estado Civil</label>
          <select className={styles.cadastroSelect} name="estadoCivil" value={tutor.estadoCivil} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
          </select>
        </div>
        <Input label="CPF" type="text" name="cpf" value={tutor.cpf} onChange={handleChange} placeholder="999.999.999-99" mask="999.999.999-99" />
        <Input label="E-mail" type="email" name="email" value={tutor.email} onChange={handleChange} placeholder="joaopereira@email.com" />
        <Input label="Celular" type="text" name="celular" value={tutor.celular} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="Outro Número" type="text" name="outroNumero" value={tutor.outroNumero} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="CEP" type="text" name="cep" value={tutor.cep} onChange={handleChange} placeholder="99999-999" mask="99999-999" />
        <Input label="Endereço" type="text" name="endereco" value={tutor.endereco} onChange={handleChange} placeholder="Rua dos Tutores, 10" />
        <Input label="Número" type="text" name="numero" value={tutor.numero} onChange={handleChange} placeholder="10" />
        <Input label="Complemento" type="text" name="complemento" value={tutor.complemento} onChange={handleChange} placeholder="Apto 101" />
        <Input label="Bairro" type="text" name="bairro" value={tutor.bairro} onChange={handleChange} placeholder="Bairro dos Tutores" />
        <Input label="Cidade" type="text" name="cidade" value={tutor.cidade} onChange={handleChange} placeholder="São Paulo" />
        <Input label="UF" type="text" name="uf" value={tutor.uf} onChange={handleChange} placeholder="SP" />
        <Input label="Nome do Veterinário" type="text" name="nomeVet" value={tutor.nomeVet} onChange={handleChange} placeholder="Dr. Vet" />
        <Input label="CRMV do Veterinário" type="text" name="crmvVet" value={tutor.crmvVet} onChange={handleChange} placeholder="1234" />
        <Input label="Telefone Principal do Veterinário" type="text" name="telefonePrincipalVet" value={tutor.telefonePrincipalVet} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="Telefone Secundário do Veterinário" type="text" name="telefoneSecundarioVet" value={tutor.telefoneSecundarioVet} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="Nome da Clínica/Hospital Veterinário" type="text" name="nomeClinicaVet" value={tutor.nomeClinicaVet} onChange={handleChange} placeholder="Clínica Melhor Vet" />
        <Input label="Endereço do Veterinário" type="text" name="enderecoVet" value={tutor.enderecoVet} onChange={handleChange} placeholder="Rua Veterinária, 123" />
        <Button type="submit">Cadastrar</Button>
        

      </form>
      {editorOpen && <PhotoEditor image={image} setImage={(img) => setTutor((prevTutor) => ({ ...prevTutor, foto: img }))} setEditorOpen={setEditorOpen} />}
    </Container>
  );
};

export default CadastroTutor;
