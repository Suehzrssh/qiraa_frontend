const STATIC_CACHE = "qiraa-static-v2";
const DYNAMIC_CACHE = "qiraa-dynamic-v2";

/**
 * App shell & static assets
 * Vite outputs JS/CSS into /assets/*
 */
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",

  // icons
  "/icons/qiraa.png",
  "/icons/qiraat.png",
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key !== STATIC_CACHE && key !== DYNAMIC_CACHE
          )
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // ⛔ ignore non-GET
  if (request.method !== "GET") return;

  // 📡 API requests — Network First
  if (
    request.url.includes("/books") ||
    request.url.includes("/genres")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) =>
            cache.put(request, cloned)
          );
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 🧠 Static assets — Cache First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache Vite-built assets dynamically
        if (request.url.includes("/assets/")) {
          const cloned = response.clone();
          caches.open(STATIC_CACHE).then((cache) =>
            cache.put(request, cloned)
          );
        }
        return response;
      });
    })
  );
});
