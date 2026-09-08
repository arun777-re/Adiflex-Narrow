import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import {
  NavigationRoute,
  createHandlerBoundToURL,
} from "workbox-routing";

// New service worker ko immediately activate karo
self.skipWaiting();
clientsClaim();

// Vite PWA generated assets
precacheAndRoute(self.__WB_MANIFEST);

// =========================================================
// SPA NAVIGATION
// =========================================================

// React Router ke routes ko index.html par fallback karo
const navigationRoute = new NavigationRoute(
  createHandlerBoundToURL("/index.html"),
  {
    allowlist: [/^\/.*$/],
  }
);

registerRoute(navigationRoute);

// =========================================================
// PUSH NOTIFICATION
// =========================================================

self.addEventListener("push", (event) => {
  console.log("🔥 PUSH EVENT RECEIVED");

  let data = {
    title: "Adiflex ERP",
    message: "New notification",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error("Push data parse error:", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Adiflex ERP",
      {
        body: data.message || "New notification",
        icon: "/pwa.png",
        badge: "/pwa.png",
        data: {
          reference: data.reference || "",
          type: data.type || "",
        },
      }
    )
  );
});

// =========================================================
// NOTIFICATION CLICK
// =========================================================

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clients) => {
        if (clients.length > 0) {
          return clients[0].focus();
        }

        return self.clients.openWindow("/");
      })
  );
});