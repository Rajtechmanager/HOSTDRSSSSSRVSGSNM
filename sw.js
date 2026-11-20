/* Customiza.in - service worker (v3: always-fresh).
   Put this file NEXT TO index.html in the GitHub repo (same folder), replacing the old sw.js.
   - The page (index.html), scripts, styles and design list (.json) are ALWAYS taken from the network first,
     so every update you upload reaches users on their next open / refresh. The saved copy is used only if the
     network is slow (more than 4 seconds) or offline.
   - Images and fonts from your own site still open instantly from the saved copy (and refresh in the background).
   - When this new version installs, it automatically reloads any already-open tab ONCE, so users who are stuck on an
     old saved version get the latest site without clearing cache.
   - Firebase / Google / payment / any other website is never touched. */

var CACHE = "customiza-v3";          /* changing this name (v3 -> v4) and re-uploading wipes every visitor's saved files */
var MAX_ENTRIES = 300;
var WAIT_MS = 4000;                  /* how long to wait for the network before falling back to the saved copy */

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) {
        return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
      .then(function () { return self.clients.matchAll({ type: "window" }); })
      .then(function (cs) {
        /* reload open tabs once so they leave the old saved version */
        return Promise.all(cs.map(function (c) { return c.navigate(c.url).catch(function () {}); }));
      })
  );
});

function trim(c) {
  return c.keys().then(function (ks) {
    var extra = ks.length - MAX_ENTRIES, i, p = [];
    for (i = 0; i < extra; i++) p.push(c.delete(ks[i]));
    return Promise.all(p);
  });
}

function save(req, res) {
  if (!res || res.status !== 200 || res.type === "opaque") return res;
  var copy = res.clone();
  caches.open(CACHE).then(function (c) { return c.put(req, copy).then(function () { return trim(c); }); }).catch(function () {});
  return res;
}

/* network first (bypasses the browser's own HTTP cache too); saved copy only if slow or offline */
function networkFirst(req, opts) {
  return new Promise(function (resolve) {
    var done = false;
    var t = setTimeout(function () {
      caches.match(req, opts).then(function (hit) { if (hit && !done) { done = true; resolve(hit); } });
    }, WAIT_MS);
    var fresh = new Request(req, { cache: "no-cache" });
    fetch(fresh).then(function (res) {
      clearTimeout(t);
      if (!done) { done = true; resolve(save(req, res)); } else save(req, res);
    }).catch(function () {
      clearTimeout(t);
      caches.match(req, opts).then(function (hit) { if (!done) { done = true; resolve(hit || Response.error()); } });
    });
  });
}

/* saved copy now (instant) + fresh copy fetched in the background for next time: images and fonts only */
function staleWhileRevalidate(req) {
  return caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (res) { return save(req, res); }).catch(function () { return null; });
    return hit || net.then(function (r) { return r || Response.error(); });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request, url;
  if (req.method !== "GET" || req.headers.has("range")) return;
  url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/\/sw\.js$/.test(url.pathname)) return;

  if (/\.(png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname)) {
    e.respondWith(staleWhileRevalidate(req));
    return;
  }
  /* page, scripts, styles, design list: always fresh */
  e.respondWith(networkFirst(req, req.mode === "navigate" ? { ignoreSearch: true } : undefined));
});
