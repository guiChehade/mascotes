import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useTransition, animated } from "react-spring";
import Home from "../pages/Home";
import AgendarVisita from "../pages/AgendarVisita";
import Login from "../pages/Login";
import Quiz from "../components/Quiz";
import Cadastro from "../pages/Cadastro";
import Mascotes from "../pages/Mascotes";
import Controle from "../pages/Controle";
import EditarPet from "../pages/EditarPet";
import Registros from "../pages/Registros";
import Financas from "../pages/Financas";
import Usuarios from "../pages/Usuarios";
import ControleRedirect from "../pages/ControleRedirect";

export default function Routes() {
    const location = useLocation();
    const transitions = useTransition(location, {
        // from: { opacity: 0, transform: "translate3d(100%, 0, 0)" },
        // enter: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
        // leave: { opacity: 0, transform: "translate3d(-50%, 0, 0)" },
        from: { opacity: 0, transform: "translateY(50px)", position: "absolute" },
        enter: { opacity: 1, transform: "translateY(0)", position: "relative" },
        leave: { opacity: 0, transform: "translateY(50px)", position: "absolute" },
    });
    
    return transitions((style, item) => (
        <animated.div style={style}>
            <Switch location={item}>
                <Route path="/" exact component={Home} />
                <Route path="/agendar-visita" component={AgendarVisita} />
                <Route path="/login" component={Login} />
                <Route path="/quiz" component={Quiz} />
                <Route path="/cadastro" component={Cadastro} />
                <Route path="/mascotes" component={Mascotes} />
                <Route path="/controle/:petId" component={Controle} />
                <Route path="/editar-pet/:petId" component={EditarPet} />
                <Route path="/registros" component={Registros} />
                <Route path="/financas" component={Financas} />
                <Route path="/usuarios" component={Usuarios} />
                <Route path="/controle" component={ControleRedirect} />
            </Switch>
        </animated.div>
    ));
    };
