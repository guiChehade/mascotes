import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import InputMask from 'react-input-mask';
import '../styles/petform.css';

const PetForm = () => {
  const [formData, setFormData] = useState({
    mascotinho: '',
    raca: '',
    frequencia: '',
    valor: '',
    inspecao: '',
    banho: '',
    hotel: '',
    passeio: '',
    adestramento: '',
    vet: '',
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petsCollection = collection(firestore, 'pets');
      await addDoc(petsCollection, formData);
      alert("Mascotinho cadastrado com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar mascotinho: " + error.message);
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
        <label className="label">Frequência Semanal</label>
        <input type="number" name="frequencia" value={formData.frequencia} onChange={handleChange} className="input" />
      </div>
      <div className="formGroup">
        <label className="label">Valor</label>
        <InputMask
          mask="R$ 999,99"
          maskChar=""
          type="text"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Inspeção</label>
        <InputMask
          mask="R$ 999,99"
          maskChar=""
          type="text"
          name="inspecao"
          value={formData.inspecao}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Banho</label>
        <InputMask
          mask="R$ 999,99"
          maskChar=""
          type="text"
          name="banho"
          value={formData.banho}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Hotel</label>
        <InputMask
          mask="R$ 999,99"
          maskChar=""
          type="text"
          name="hotel"
          value={formData.hotel}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Passeio</label>
        <InputMask
          mask="R$ 999,99"
          maskChar=""
          type="text"
          name="passeio"
          value={formData.passeio}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Adestramento</label>
        <InputMask
          mask="R$ 999,99"
          maskChar=""
          type="text"
          name="adestramento"
          value={formData.adestramento}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="formGroup">
        <label className="label">Vet</label>
        <InputMask
          mask="R$ 999,99"
          maskChar=""
          type="text"
          name="vet"
          value={formData.vet}
          onChange={handleChange}
          className="input"
        />
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
          className="input"
        />
      </div>
      <button type="submit" className="button">Inserir</button>
    </form>
  );
};

export default PetForm;
