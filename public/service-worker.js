/* eslint-disable no-restricted-globals */

self.addEventListener('install', (event) => {
  // Força o Service Worker a ativar imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Faz com que o Service Worker controle imediatamente as páginas abertas
  event.waitUntil(self.clients.claim());
});

// Escuta por mensagens para atualizar o Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});