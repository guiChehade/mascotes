const CACHE_NAME = 'Parque dos Mascotes';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.png',
  // Adicione outras URLs que deseja cachear
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retorna a resposta do cache
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
