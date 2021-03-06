const CACHE_NAME = 'v1';
const urlsToCache = [
  'index.html',
  './',
  "pictures/",
  "https://cdn.jsdelivr.net/gh/ireade/caniuse-embed/public/caniuse-embed.min.js",
  "https://caniuse.bitsofco.de/image/",
  "shower/",
  "data/"
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