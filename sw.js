const CACHE_CGOMES = "cgomes-vendas-v1.0.9";
const ARQUIVOS_INICIAIS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icone-cgomes.png"
];

self.addEventListener("install", function(evento) {
  evento.waitUntil(
    caches.open(CACHE_CGOMES).then(function(cache) {
      return cache.addAll(ARQUIVOS_INICIAIS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(evento) {
  evento.waitUntil(
    caches.keys().then(function(chaves) {
      return Promise.all(chaves.filter(function(chave) {
        return chave !== CACHE_CGOMES;
      }).map(function(chave) {
        return caches.delete(chave);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(evento) {
  if (evento.request.method !== "GET") return;
  const url = new URL(evento.request.url);
  if (url.origin !== self.location.origin) return;
  evento.respondWith(
    fetch(evento.request).then(function(resposta) {
      const copia = resposta.clone();
      caches.open(CACHE_CGOMES).then(function(cache) {
        cache.put(evento.request, copia);
      });
      return resposta;
    }).catch(function() {
      return caches.match(evento.request);
    })
  );
});
