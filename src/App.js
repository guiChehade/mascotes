import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Controle from './pages/Controle';
import Financas from './pages/Financas';
import Login from './components/Login';
import './App.module.css';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/cadastro" component={Cadastro} />
        <Route path="/controle" component={Controle} />
        <Route path="/financas" component={Financas} />
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
