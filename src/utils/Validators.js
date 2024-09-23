// Formatação de CPF
export const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  // Formatação de telefone (celular ou fixo)
  export const formatPhoneNumber = (phone) => {
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };
  
  // Calcula idade a partir da data de nascimento
  export const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
  
    return `${age} anos`;
  };
  