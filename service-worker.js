const CACHE_NAME = "FBP-caches-v0.1";
var urlsToCache = [
  "/",
  "/manifest.json",
  "/register-sw.js",
  "/fball-logo.ico",
  "/index.html",
  "/assets/css/materialize.min.css",
  "/assets/css/style.css",
  "/assets/js/materialize.min.js",
  "/assets/img/icons/soccerball.png",
  "/assets/img/icons/icon-72x72.png",
  "/assets/img/icons/icon-96x96.png",
  "/assets/img/icons/icon-128x128.png",
  "/assets/img/icons/icon-144x144.png",
  "/assets/img/icons/icon-152x152.png",
  "/assets/img/icons/icon-192x192.png",
  "/assets/img/icons/icon-384x384.png",
  "/assets/img/icons/icon-512x512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// untuk merunning service worker (saat ada permintaan)
self.addEventListener("fetch", function (event) {
  var base_url = "https://readerapi.codepolitan.com/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, {
        ignoreSearch: true
      }).then(function (response) {
        return response || fetch(event.request);
      })
    )
  }
});


// menghapus cache lama (saat activate)
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});