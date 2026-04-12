// ===== WORKBOX PRECACHING (injected by VitePWA build) =====
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute, NavigationRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;

// This line is replaced by VitePWA with the actual file manifest at build time
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// ===== FIREBASE MESSAGING =====
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDutbmjQWIWYQD_swZiOQE9rLRCXqco2VM",
  authDomain: "sprout-sync-2e760.firebaseapp.com",
  projectId: "sprout-sync-2e760",
  storageBucket: "sprout-sync-2e760.appspot.com",
  messagingSenderId: "947217179064",
  appId: "1:947217179064:web:f8bb81328c98dee0eeef4d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);

  if (!payload.notification && payload.data) {
    console.log("[SW] Skipping data-only → Foreground will handle");
    return;
  }

  const title = payload.notification?.title || payload.data?.title || "SPROUT-SYNC";
  const body = payload.notification?.body || payload.data?.body || "New notification";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "sprout-sync",
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: "/dashboard" },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  clients.matchAll({ type: "window", includeUncontrolled: true })
    .then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    });
});

// ===== RUNTIME CACHING =====
// Cache API calls with NetworkFirst (fresh data kung may network, fallback sa cache kung wala)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({ cacheName: 'api-cache' })
);

// Cache static assets with CacheFirst
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({ cacheName: 'image-cache' })
);

// ===== OFFLINE FALLBACK (SPA Navigation) =====
// Lahat ng page navigation ay ibabalik sa index.html para gumana ang React Router offline
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: 'navigation-cache',
      networkTimeoutSeconds: 3,
    })
  )
);

// ===== SW LIFECYCLE =====
self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  self.clients.claim();
});