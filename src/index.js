import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Função para notificar o usuário sobre a atualização
const onServiceWorkerUpdate = (registration) => {
  // Verifica se é um dispositivo iOS
  const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  if (isIos) {
    // Mostra uma mensagem personalizada
    alert('Uma nova versão do aplicativo está disponível. Por favor, feche e reabra o aplicativo para atualizar.');
  } else {
    // Para outros dispositivos, atualiza automaticamente
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      registration.waiting.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }
};

serviceWorkerRegistration.register({
  onUpdate: onServiceWorkerUpdate,
});
