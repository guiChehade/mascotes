import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Função para mostrar a notificação de atualização
const onServiceWorkerUpdate = (registration) => {
  if (window.confirm('Uma nova versão está disponível. Deseja atualizar?')) {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
};

// Registra o Service Worker com a função de callback
serviceWorkerRegistration.register({
  onUpdate: onServiceWorkerUpdate,
});
