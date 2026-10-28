const CACHE = 'analogdj-2026-10-28-09.21';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "fonts/inter-latin-300-normal.woff2", "fonts/inter-latin-400-normal.woff2", "fonts/inter-latin-500-normal.woff2", "fonts/inter-latin-600-normal.woff2", "fonts/cormorant-garamond-latin-400-normal.woff2", "fonts/cormorant-garamond-latin-400-italic.woff2", "fonts/cormorant-garamond-latin-500-normal.woff2", "fonts/cormorant-garamond-latin-500-italic.woff2", "fonts/cormorant-garamond-latin-600-normal.woff2", "fonts/cormorant-garamond-latin-600-italic.woff2"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    const net = fetch(req, { cache: 'no-store' }).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); } return r; });
    const slow = new Promise(res => setTimeout(res, 3000)).then(() => caches.match('index.html'));
    e.respondWith(Promise.race([net.catch(() => caches.match('index.html')), slow.then(hit => hit || net)]));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
