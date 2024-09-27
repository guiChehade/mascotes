/* eslint-disable no-restricted-globals */

// Escuta por mensagens para atualizar o Service Worker imediatamente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
