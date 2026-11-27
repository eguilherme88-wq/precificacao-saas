/* Service worker do Partner Precificação SaaS.
 * Isolado para não conflitar com outros apps hospedados no mesmo domínio
 * (ex.: outros repositórios em eguilherme88-wq.github.io):
 *  - escopo limitado à pasta do app (registrado com scope './');
 *  - caches com prefixo próprio; só apaga caches desse prefixo;
 *  - só intercepta requisições dentro do próprio escopo.
 */
const PREFIXO = 'precificacao-saas-';
const VERSAO = 'v12';
const CACHE = PREFIXO + VERSAO;
const ESCOPO = self.registration.scope;
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(chaves.filter(k => k.startsWith(PREFIXO) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const ehFirebaseSdk = req.url.startsWith('https://www.gstatic.com/firebasejs/');
  if (req.method !== 'GET' || (!req.url.startsWith(ESCOPO) && !ehFirebaseSdk)) return; // fora do app: não mexe

  // Páginas: rede primeiro (sempre pega a versão nova), cache se estiver offline
  if (req.mode === 'navigate') {
    const pagina = new URL(req.url); pagina.search = ''; pagina.hash = '';
    if (pagina.pathname.endsWith('/proposta.html')) return; // página pública do cliente: sempre da rede
    e.respondWith(
      fetch(req).then(r => {
        if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(pagina.href, copia)); }
        return r;
      }).catch(() => caches.match(pagina.href).then(r => r || caches.match('./index.html', { ignoreSearch: true })))
    );
    return;
  }

  // Demais arquivos do app: cache primeiro, atualiza em segundo plano
  e.respondWith(
    caches.match(req).then(emCache => {
      const daRede = fetch(req).then(r => {
        if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
        return r;
      }).catch(() => emCache);
      return emCache || daRede;
    })
  );
});
