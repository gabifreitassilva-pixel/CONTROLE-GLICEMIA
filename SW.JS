// Aumente a versão (ex: v13, v14...) para atualizar o app no celular
const CACHE_NAME = 'glicogabi-v14'; 

const ASSETS = [
  'index.html',
  'ICONE.png', // Verifique se o seu arquivo de imagem se chama exatamente assim, com .png
  'manifest.json' // Mudei para minúsculo, garanta que o arquivo no git está minúsculo também
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Criando novo cache ' + CACHE_NAME);
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
