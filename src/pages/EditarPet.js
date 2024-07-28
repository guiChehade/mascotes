import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import InputMask from 'react-input-mask';
import '../styles/editarPet.css';

const EditarPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mascotinho: '',
    raca: '',
    tutor: '',
    rg: '',
    cpf: '',
    endereco: '',
    email: '',
    celular_tutor: '',
    veterinario: '',
    endereco_vet: '',
    celular_vet_comercial: '',
    celular_vet_pessoal: ''
  });

  useEffect(() => {
    const fetchPet = async () => {
      const petDoc = await getDoc(doc(firestore, 'pets', id));
      if (petDoc.exists()) {
        setFormData(petDoc.data());
      } else {
        alert("Mascotinho não encontrado");
        navigate('/controle');
      }
    };

    fetchPet();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petDoc = doc(firestore, 'pets', id);
      await updateDoc(petDoc, formData);
      alert("Informações do mascotinho atualizadas com sucesso!");
      navigate('/controle');
    } catch (error) {
      alert("Erro ao atualizar informações do mascotinho: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="formGroup">
        <label className="label">Mascotinho</label>
        <input type="text" name="mascotinho" value={formData.mascotinho} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">Raça</label>
        <input type="text" name="raca" value={formData.raca} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">Tutor</label>
        <input type="text" name="tutor" value={formData.tutor} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">RG</label>
        <InputMask
          mask="99.999.999-9"
          maskChar=""
          type="text"
          name="rg"
          value={formData.rg}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">CPF</label>
        <InputMask
          mask="999.999.999-99"
          maskChar=""
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Endereço</label>
        <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">Celular Tutor</label>
        <InputMask
          mask="(99) 99999-9999"
          maskChar=""
          type="text"
          name="celular_tutor"
          value={formData.celular_tutor}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Veterinário</label>
        <input type="text" name="veterinario" value={formData.veterinario} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">Endereço Veterinário</label>
        <input type="text" name="endereco_vet" value={formData.endereco_vet} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">Celular Vet Comercial</label>
        <InputMask
          mask="(99) 99999-9999"
          maskChar=""
          type="text"
          name="celular_vet_comercial"
          value={formData.celular_vet_comercial}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Celular Vet Pessoal</label>
        <InputMask
          mask="(99) 99999-9999"
          maskChar=""
          type="text"
          name="celular_vet_pessoal"
          value={formData.celular_vet_pessoal}
          onChange={handleChange}
          className="input" />
      </div>
      <button type="submit" className="button">Salvar</button>
    </form>
  );
};

export default EditarPet;
