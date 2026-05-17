// Aumentamos a versão para v30 para forçar o celular a limpar o erro antigo
const CACHE_NAME = 'glicogabi-v33'; 

// Deixamos APENAS os arquivos que realmente existem no seu projeto agora
const ASSETS = [
  'index.html',
  'manifest.json',
  'ícone (2).png'
];

// Evento de Instalação: Salva os arquivos reais no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Criando novo cache ' + CACHE_NAME);
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Evento de Ativação: Limpa os caches antigos e fantasmas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('SW: Removendo cache antigo:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Evento Fetch: Carrega o app offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
