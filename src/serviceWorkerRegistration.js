// serviceWorkerRegistration.js

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] é o endereço IPv6 localhost.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 são considerados localhost para IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    // O URL do Service Worker
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    if (publicUrl.origin !== window.location.origin) {
      // Nosso Service Worker não funcionará se PUBLIC_URL estiver em um
      // origem diferente do que a página atual. Isso pode acontecer se um CDN
      // for usado para servir ativos; veja https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Isso está rodando em localhost. Vamos verificar se um Service Worker ainda existe ou não.
        checkValidServiceWorker(swUrl, config);

        // Adicione alguns logs adicionais ao localhost, apontando para o Service Worker/ PWA documentação.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Este aplicativo está sendo servido em cache pelo Service Worker.'
          );
        });
      } else {
        // Não é localhost. Basta registrar o Service Worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Verifica se há um Service Worker esperando para ser ativado
      if (registration.waiting) {
        // Executa a função de atualização
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
                // Novo conteúdo está disponível; executa callback
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // Conteúdo pré-cacheado foi instalado pela primeira vez
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        }
      };
    })
    .catch((error) => {
      console.error('Erro ao registrar o Service Worker:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Verifica se o Service Worker pode ser encontrado. Se não puder recarregar a página.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Certifique-se de que o Service Worker existe e que realmente estamos recebendo um arquivo JavaScript.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Nenhum Service Worker encontrado. Provavelmente um aplicativo diferente. Recarrega a página.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service Worker encontrado. Prossegue normalmente.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'Sem conexão com a internet. O aplicativo está rodando no modo offline.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
