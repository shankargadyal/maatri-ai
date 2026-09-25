/* MAATRI service worker — reminders and caregiver alerts, including when the app is closed. */
const CACHE = "maatri-v3";
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/home", "/favicon.png"]).catch(() => {})));
});
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
      await self.clients.claim();
    })(),
  ),
);

// Offline: network first, fall back to the last saved copy (app screens, files and medicine lists).
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const dataRead = url.pathname.startsWith("/rest/v1/");
  if (!sameOrigin && !dataRead) return;
  if (sameOrigin && url.pathname.startsWith("/api/")) return;
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res.ok && res.type !== "opaque") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      } catch (e) {
        const hit = await caches.match(req);
        if (hit) return hit;
        if (req.mode === "navigate") {
          const shell = (await caches.match("/home")) || (await caches.match("/"));
          if (shell) return shell;
        }
        throw e;
      }
    })(),
  );
});

self.addEventListener("push", (event) => {
  let msg = {};
  try {
    msg = event.data ? event.data.json() : {};
  } catch {
    msg = { title: "MAATRI", body: event.data ? event.data.text() : "" };
  }
  const base = {
    body: msg.body || "",
    icon: "/favicon.png",
    badge: "/favicon.png",
    tag: msg.occurrenceId ? `${msg.kind}-${msg.occurrenceId}` : undefined,
    renotify: true,
    requireInteraction: true,
    data: msg,
  };
  let options = base;
  if (msg.kind === "dose") {
    options = {
      ...base,
      vibrate: [300, 150, 300],
      actions: [
        { action: "taken", title: "✓ Taken" },
        { action: "later", title: "Remind in 15 min" },
      ],
    };
  } else if (msg.kind === "caregiver_alert") {
    // Ring-like vibration pattern so the caregiver notices, like an incoming call.
    options = {
      ...base,
      vibrate: [800, 300, 800, 300, 800, 300, 800, 300, 800],
      actions: [
        { action: "call", title: "📞 Call now" },
        { action: "checked", title: "I've checked" },
      ],
    };
  }
  event.waitUntil(self.registration.showNotification(msg.title || "MAATRI", options));
});

self.addEventListener("notificationclick", (event) => {
  const data = event.notification.data || {};
  const action = event.action || "open";
  event.notification.close();
  event.waitUntil(
    (async () => {
      let url = data.url || "/home";
      if (data.kind === "dose" && action === "open") url = "/home?listen=1";
      if (data.kind === "dose" && action !== "open") {
        url = `/home?dose=${encodeURIComponent(data.occurrenceId || "")}&act=${encodeURIComponent(action)}`;
      }
      if (data.kind === "caregiver_alert") {
        url = `/alert/${encodeURIComponent(data.occurrenceId || "")}${action === "call" ? "?call=1" : action === "checked" ? "?checked=1" : ""}`;
      }
      const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      if (data.kind === "dose" && all.length > 0 && action !== "open") {
        all[0].postMessage({ type: "maatri-dose-action", occurrenceId: data.occurrenceId, action });
        return all[0].focus();
      }
      if (all.length > 0) {
        await all[0].navigate(url).catch(() => {});
        return all[0].focus();
      }
      return self.clients.openWindow(url);
    })(),
  );
});
