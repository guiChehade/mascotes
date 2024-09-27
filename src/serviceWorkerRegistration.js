// serviceWorkerRegistration.js

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    // O URL do Service Worker
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      // Em localhost, verifica se o Service Worker existe
      checkValidServiceWorker(swUrl, config);
      navigator.serviceWorker.ready.then(() => {
        console.log('Este aplicativo está sendo servido em cache pelo Service Worker.');
      });
    } else {
      // Registra o Service Worker em produção
      registerValidSW(swUrl, config);
    }
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl).then((registration) => {
    if (registration.waiting) {
      // Há uma atualização esperando para ser ativada
      if (config && config.onUpdate) {
        config.onUpdate(registration);
      }
    }

    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Novo conteúdo está disponível, executa callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Conteúdo pré-cacheado está disponível
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      }
    };
  });
}

function checkValidServiceWorker(swUrl, config) {
  // Verifica se o Service Worker pode ser encontrado
  fetch(swUrl)
    .then((response) => {
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // Nenhum Service Worker encontrado, recarrega a página
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service Worker encontrado, registra novamente
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Sem conexão com a internet. O aplicativo está rodando no modo offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
