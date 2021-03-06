const CACHE_NAME = 'v1';
const urlsToCache = [
  'index.html',
  './',
  "https://cdn.jsdelivr.net/gh/ireade/caniuse-embed/public/caniuse-embed.min.js",
  "pictures/Progressive_Web_Apps_Logo.svg",
  "pictures/avatar.jpeg",
  "pictures/fat-cat.jpg",
  "pictures/Android_logo_2019.svg",
  "pictures/Apple_logo.svg",
  "pictures/Microsoft_Store.svg",
  "pictures/garold.png",
  "pictures/scrooge-mcduck.png",
  "pictures/stark.jpg",
  "https://caniuse.bitsofco.de/image/serviceworkers.jpg",
  "https://caniuse.bitsofco.de/image/push-api.jpg",
  "https://caniuse.bitsofco.de/image/offline-apps.jpg",
  "https://caniuse.bitsofco.de/image/web-app-manifest.jpg",
  "pictures/Chrome.svg",
  "pictures/Opera.svg",
  "pictures/Yandex_Browser.svg",
  "pictures/Samsung_Internet.svg",
  "pictures/install_pwa.gif",
  "pictures/chrome_pwa.png",
  "pictures/firefox_pwa_install.png",
  "pictures/ios_pwa.png",
  "pictures/logo.svg",
  "shower/shower.js",
]

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        urlsToCache.map(function (urlToPrefetch) {
          let req = new Request(urlToPrefetch, {mode: 'no-cors'});
          console.log(req);
          cache.add(req).then(console.log);
        })
      })
  )
  ;
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
}, {credentials: 'include'});

self.addEventListener('activate', function (event) {

  var cacheAllowlist = ['pages-cache-v1', 'blog-posts-cache-v1', 'v1'];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});