const CACHE_NAME = "FBP-caches-v0.4";
let urlsToCache = [
  "/",
  "/manifest.json",
  "/register-sw.js",
  "/fball-logo.ico",
  "/nav.html",
  "/index.html",
  "/team.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "assets/css/materialize.min.css",
  "assets/css/style.css",
  "assets/css/material-icons.css",
  "assets/js/materialize.min.js",
  "assets/js/api.js",
  "assets/js/db.js",
  "assets/js/idb.js",
  "assets/js/nav.js",
  "assets/fonts/MaterialIcons-Regular.woff2",
  "assets/fonts/MaterialIcons-Regular.woff",
  "assets/fonts/MaterialIcons-Regular.ttf",
  "assets/fonts/MaterialIcons-Regular.eot",
  "assets/images/icons/icon-72x72.png",
  "assets/images/icons/icon-96x96.png",
  "assets/images/icons/icon-128x128.png",
  "assets/images/icons/icon-144x144.png",
  "assets/images/icons/icon-152x152.png",
  "assets/images/icons/icon-192x192.png",
  "assets/images/icons/icon-384x384.png",
  "assets/images/icons/icon-512x512.png"
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
  let base_url = "http://api.football-data.org/v2/";
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