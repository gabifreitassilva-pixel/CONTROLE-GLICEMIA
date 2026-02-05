// Aumente o número da versão (ex: v11, v12...) sempre que fizer um Push no Git
// Isso avisa ao celular que há um código novo para baixar.
const CACHE_NAME = 'glicogabi-v11'; 

const ASSETS = [
  'index.html',
  'HOME.HTML',
  'CONSULTA E EXAMES.HTML',
  'HISTORICO.HTML',
  'ESTOQUES.HTML',
  'AJUSTES.HTML',
  'LEMBRETES.HTML',
  'ICONE.PNG',
  'MANIFEST.JSON'
];

// Evento de Instalação: Salva os arquivos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Criando novo cache ' + CACHE_NAME);
      return cache.addAll(ASSETS);
    })
  );
  // Força o Service Worker recém-instalado a se tornar o ativo imediatamente
  self.skipWaiting();
});

// Evento de Ativação: Limpa o lixo (caches antigos)
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
  // Garante que o SW controle a página imediatamente sem precisar de um reload extra
  return self.clients.claim();
});

// Evento Fetch: Tenta buscar no cache, se não tiver, busca na rede
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});