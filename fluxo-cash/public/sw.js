const CACHE_NAME = 'fluxo-cash-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        console.log('Alguns assets não puderam ser cacheados')
      })
    })
  )
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Estratégia de fetch - Network First, Fall back to Cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições de extensões do browser
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://')) {
    return
  }

  // Para requisições de API Firebase, tentar rede primeiro
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('identitytoolkit.googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            return response
          }
          return caches.match(event.request)
        })
        .catch(() => {
          return caches.match(event.request)
        })
    )
    return
  }

  // Para outros recursos, usar cache first
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response
            }
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache)
            })
            return response
          })
          .catch(() => {
            // Retornar página offline se disponível
            return new Response('Aplicação offline. Verifique sua conexão.', {
              status: 503,
              statusText: 'Offline',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            })
          })
      })
  )
})

// Push Notifications (opcional)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    self.registration.showNotification('Fluxo Cash', {
      body: data.message || 'Você tem uma notificação',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%2310b981" width="192" height="192" rx="45"/><text x="96" y="142" font-size="140" text-anchor="middle">💰</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><text x="96" y="142" font-size="140" text-anchor="middle">💰</text></svg>'
    })
  }
})
