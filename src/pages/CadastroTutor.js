import React, { useState, useEffect } from 'react';
import { firestore, storage, auth as firebaseAuth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
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
    telefoneSecundario: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const [image, setImage] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  // Função para calcular a idade
  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} anos, ${months} meses e ${days} dias`;
  }

  // Atualiza a idade sempre que a data de nascimento mudar
  useEffect(() => {
    if (tutor.dataNascimento) {
      const age = calculateAge(tutor.dataNascimento);
      setTutor((prevTutor) => ({
        ...prevTutor,
        idade: age,
      }));
    }
  }, [tutor.dataNascimento]);

  // Busca o endereço pelo CEP
  useEffect(() => {
    const cep = tutor.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setTutor((prevTutor) => ({
              ...prevTutor,
              endereco: data.logradouro || '',
              bairro: data.bairro || '',
              cidade: data.localidade || '',
              uf: data.uf || '',
            }));
          } else {
            alert('CEP não encontrado.');
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar CEP:', error);
        });
    }
  }, [tutor.cep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTutor((prevTutor) => ({
      ...prevTutor,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setEditorOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let fotoURL = '';

      if (image) {
        if (typeof image === 'string' && image.startsWith('data:image')) {
          // Caso em que a imagem é uma data URL (imagem recortada)
          const response = await fetch(image);
          const blob = await response.blob();
          const fotoName = `tutor_${Date.now()}.jpg`;
          const fotoRef = ref(storage, `tutores/${fotoName}`);
          await uploadBytes(fotoRef, blob);
          fotoURL = await getDownloadURL(fotoRef);
        } else if (image instanceof File) {
          // Caso em que a imagem é um arquivo (File)
          const fotoRef = ref(storage, `tutores/${Date.now()}_${image.name}`);
          await uploadBytes(fotoRef, image);
          fotoURL = await getDownloadURL(fotoRef);
        }
      }

      // Verifica se o usuário já existe na coleção 'users' do Firestore
      const usersCollection = collection(firestore, 'users');
      const userDocRef = doc(usersCollection, tutor.email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Usuário existe, atualiza o campo 'isTutor' para true
        await updateDoc(userDocRef, { isTutor: true });
      } else {
        // Usuário não existe, cria um novo documento na coleção 'users'
        const newUser = {
          createdBy: currentUser.name,
          email: tutor.email,
          name: tutor.nome,
          role: 'isTutor',
          isTutor: true,
        };
        await setDoc(userDocRef, newUser);

        // Cria um novo usuário na Firebase Authentication
        const signInMethods = await fetchSignInMethodsForEmail(firebaseAuth, tutor.email);
        if (signInMethods.length === 0) {
          // Usuário não existe na Authentication, cria um novo
          const tempPassword = Math.random().toString(36).slice(-8); // Gera uma senha temporária
          await createUserWithEmailAndPassword(firebaseAuth, tutor.email, tempPassword);

          // Envia e-mail para redefinição de senha
          await sendPasswordResetEmail(firebaseAuth, tutor.email);

          alert('E-mail enviado para o tutor definir a senha.');
        } else {
          alert('O usuário já possui e-mail e senha de acesso.');
        }
      }

      // Adiciona o tutor à coleção 'tutores'
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
        telefoneSecundario: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
      });
      setImage(null);
    } catch (error) {
      console.error('Erro ao cadastrar o tutor:', error);
      alert('Ocorreu um erro ao cadastrar o tutor.');
    }
  };

  return (
    <Container className={styles.cadastroContainer}>
      <h2>Cadastro de Tutor</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Foto do Tutor" type="file" accept="image/*" onChange={handleFileChange} />
        <Input label="Nome Completo" type="text" name="nome" value={tutor.nome} onChange={handleChange} required placeholder="João Pereira" />
        <Input label="Data de Nascimento" type="date" name="dataNascimento" value={tutor.dataNascimento} onChange={handleChange} placeholder="01/01/2000" />
        <Input label="Idade" type="text" name="idade" value={tutor.idade} disabled />
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
        <Input label="Telefone Secundário" type="text" name="telefoneSecundario" value={tutor.telefoneSecundario} onChange={handleChange} placeholder="(11) 99999-9999" mask="(99) 99999-9999" />
        <Input label="CEP" type="text" name="cep" value={tutor.cep} onChange={handleChange} placeholder="99999-999" mask="99999-999" />
        <Input label="Endereço" type="text" name="endereco" value={tutor.endereco} onChange={handleChange} placeholder="Rua dos Tutores" />
        <Input label="Número" type="text" name="numero" value={tutor.numero} onChange={handleChange} />
        <Input label="Complemento" type="text" name="complemento" value={tutor.complemento} onChange={handleChange} />
        <Input label="Bairro" type="text" name="bairro" value={tutor.bairro} onChange={handleChange} />
        <Input label="Cidade" type="text" name="cidade" value={tutor.cidade} onChange={handleChange} />
        <Input label="UF" type="text" name="uf" value={tutor.uf} onChange={handleChange} />
        <div className={styles.buttonContainer}>
          <Button className={styles.button} type="submit">
            Cadastrar
          </Button>
        </div>
      </form>
      {editorOpen && (
        <PhotoEditor
          image={image}
          setImage={(img) => {
            setImage(img);
            setTutor((prevTutor) => ({ ...prevTutor, foto: img }));
          }}
          setEditorOpen={setEditorOpen}
        />
      )}
    </Container>
  );
};

export default CadastroTutor;
