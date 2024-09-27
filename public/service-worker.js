/* eslint-disable no-undef */
// Importa o Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('Workbox carregado com sucesso.');

  workbox.setConfig({ debug: false });

  // Precache dos assets gerados pelo build
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Lógica adicional para cachear recursos, se necessário

  // Evento para escutar mensagens do Service Worker
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
} else {
  console.log('Falha ao carregar o Workbox.');
}
