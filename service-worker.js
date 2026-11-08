/* RadioTrack Pro PWA service worker.
 * Network-only by design: never cache Firebase data, authentication, or app HTML.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    "<!doctype html><html lang='id'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>RadioTrack Pro</title><body style='font-family:Arial,sans-serif;padding:2rem;background:#0f172a;color:white'><h2>RadioTrack Pro</h2><p>Koneksi internet diperlukan untuk membuka aplikasi dan menyinkronkan data.</p><p>Periksa koneksi internet, lalu buka kembali RadioTrack Pro.</p></body></html>",
    {headers:{"Content-Type":"text/html; charset=utf-8"}}
  )));
});