import home from '../assets/icons/home.png';
import quiz from '../assets/icons/quiz.png';
import breeds from '../assets/icons/breeds.png';
import cadastroTutor from '../assets/icons/cadastro-tutor.png';
import cadastroPet from '../assets/icons/cadastro-pet.png';
import usuarios from '../assets/icons/usuarios.png';
import mascotes from '../assets/icons/mascotes.png';
import registros from '../assets/icons/registros.png';
import noLocal from '../assets/icons/no-local.png';
import ponto from '../assets/icons/ponto.png';

const rolePages = {
    isOwner: [
        { to: "/", label: "Início", icon: home },
        { to: "/quiz", label: "Quiz", icon: quiz },
        { to: "/racas", label: "Raças", icon: breeds },
        { to: "/cadastro-tutor", label: "Cadastro Tutor", icon: cadastroTutor },
        { to: "/cadastro-pet", label: "Cadastro Pet", icon: cadastroPet },
        { to: "/usuarios", label: "Usuários", icon: usuarios },
        { to: "/mascotes", label: "Mascotes", icon: mascotes },
        { to: "/registros", label: "Registros", icon: registros },
        { to: "/no-local", label: "No Local", icon: noLocal },
        { to: "/ponto", label: "Ponto", icon: ponto },
    ],
    isManager: [
        { to: "/", label: "Início", icon: home },
        { to: "/quiz", label: "Quiz", icon: quiz },
        { to: "/racas", label: "Raças", icon: breeds },
        { to: "/cadastro-tutor", label: "Cadastro Tutor", icon: cadastroTutor },
        { to: "/cadastro-pet", label: "Cadastro Pet", icon: cadastroPet },
        { to: "/mascotes", label: "Mascotes", icon: mascotes },
        { to: "/registros", label: "Registros", icon: registros },
        { to: "/no-local", label: "No Local", icon: noLocal },
        { to: "/ponto", label: "Ponto", icon: ponto },
    ],
    isAdmin: [
        { to: "/", label: "Início", icon: home },
        { to: "/quiz", label: "Quiz", icon: quiz },
        { to: "/racas", label: "Raças", icon: breeds },
        { to: "/cadastro-tutor", label: "Cadastro Tutor", icon: cadastroTutor },
        { to: "/cadastro-pet", label: "Cadastro Pet", icon: cadastroPet },
        { to: "/mascotes", label: "Mascotes", icon: mascotes },
        { to: "/registros", label: "Registros", icon: registros },
        { to: "/no-local", label: "No Local", icon: noLocal },
        { to: "/ponto", label: "Ponto", icon: ponto },
    ],
    isEmployee: [
        { to: "/", label: "Início", icon: home },
        { to: "/quiz", label: "Quiz", icon: quiz },
        { to: "/racas", label: "Raças", icon: breeds },
        { to: "/mascotes", label: "Mascotes", icon: mascotes },
        { to: "/registros", label: "Registros", icon: registros },
        { to: "/no-local", label: "No Local", icon: noLocal },
        { to: "/ponto", label: "Ponto", icon: ponto },
    ],
    isTutor: [
        { to: "/", label: "Início", icon: home },
        { to: "/quiz", label: "Quiz", icon: quiz },
        { to: "/racas", label: "Raças", icon: breeds },
    ],
    none: [
        { to: "/", label: "Início", icon: home },
        { to: "/quiz", label: "Quiz", icon: quiz },
        { to: "/racas", label: "Raças", icon: breeds },
        { to: "/login", label: "Login" },
    ],
};

export default rolePages;