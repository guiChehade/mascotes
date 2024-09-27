import React, { useState, useEffect } from 'react';
import { firestore, storage, auth as firebaseAuth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
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

  // Novos estados para gerenciar os pets
  const [availablePets, setAvailablePets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);
  const [petSearchTerm, setPetSearchTerm] = useState('');

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

  // Busca os pets ao carregar o componente
  useEffect(() => {
    const fetchPets = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'pets'));
      const petsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailablePets(petsList);
    };
    fetchPets();
  }, []);

  // Função para lidar com a seleção de pets disponíveis
  const handleSelectPet = (pet) => {
    setAvailablePets((prevAvailablePets) =>
      prevAvailablePets.filter((p) => p.id !== pet.id)
    );
    setSelectedPets((prevSelectedPets) => [...prevSelectedPets, pet]);
  };

  // Função para lidar com a remoção de pets selecionados
  const handleDeselectPet = (pet) => {
    setSelectedPets((prevSelectedPets) =>
      prevSelectedPets.filter((p) => p.id !== pet.id)
    );
    setAvailablePets((prevAvailablePets) => [...prevAvailablePets, pet]);
  };

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

      // Extrai os IDs e nomes dos pets selecionados
      const petIds = selectedPets.map((pet) => pet.id);
      const petNames = selectedPets.map((pet) => pet.mascotinho);

      // Verifica se o usuário já existe na coleção 'users' do Firestore
      const usersCollection = collection(firestore, 'users');
      const q = query(usersCollection, where('email', '==', tutor.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Usuário existe, atualiza o campo 'isTutor' e os pets
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, {
          isTutor: true,
          petIds: petIds,
          petNames: petNames,
        });
      } else {
        // Usuário não existe, cria um novo documento na coleção 'users'
        const newUser = {
          createdBy: currentUser.name,
          email: tutor.email,
          name: tutor.nome,
          role: 'isTutor',
          isTutor: true,
          petIds: petIds,
          petNames: petNames,
        };
        await addDoc(usersCollection, newUser);

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

      // Adiciona o tutor à coleção 'tutores' com os pets vinculados
      await addDoc(collection(firestore, 'tutores'), {
        ...tutor,
        foto: fotoURL,
        createdBy: currentUser.name,
        petIds: petIds,
        petNames: petNames,
      });

      alert('Tutor cadastrado com sucesso!');
      // Reset dos estados
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
      setAvailablePets((prevAvailablePets) => [...prevAvailablePets, ...selectedPets]);
      setSelectedPets([]);
    } catch (error) {
      console.error('Erro ao cadastrar o tutor:', error);
      alert('Ocorreu um erro ao cadastrar o tutor.');
    }
  };

  // Filtro dos pets disponíveis com base no termo de busca
  const filteredAvailablePets = availablePets.filter((pet) =>
    pet.mascotinho.toLowerCase().includes(petSearchTerm.toLowerCase())
  );

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
          
        {/* Seção de seleção de pets */}
        <Input
              label="Buscar Mascotinho"
              type="text"
              value={petSearchTerm}
              onChange={(e) => setPetSearchTerm(e.target.value)}
              placeholder="Digite o nome do mascotinho"
            />
        <div className={styles.petsContainer}>
          {/* Lista de pets disponíveis */}
          <div className={styles.availablePets}>
            <h3>Pets Disponíveis</h3>
            <div className={styles.petList}>
              {filteredAvailablePets.map((pet) => (
                <div key={pet.id} className={styles.petItem}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectPet(pet)}
                    />
                    {pet.mascotinho}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de pets selecionados */}
          <div className={styles.selectedPets}>
            <h3>Pets Selecionados</h3>
            <div className={styles.petList}>
              {selectedPets.map((pet) => (
                <div key={pet.id} className={styles.petItem}>
                  <label>
                    <input
                      type="checkbox"
                      checked
                      onChange={() => handleDeselectPet(pet)}
                    />
                    {pet.mascotinho}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

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
