/* Customiza.in - repeat-visit speed-up (service worker). 
   Put this file NEXT TO index.html in the GitHub repo (same folder). Nothing else is needed on the server.
   - 1st visit: the site loads as usual and quietly saves itself in the browser.
   - 2nd visit onward: the page, images, fonts and the design list open straight from the browser's saved copy (instant),
     and a fresh copy is fetched quietly in the background for the next time.
   - Firebase / Google / payment / any other website is never touched. Only files from your own site are saved. */

var CACHE = "customiza-v1";          /* change v1 -> v2 (and re-upload) to force every visitor to drop old saved files */
var MAX_ENTRIES = 300;               /* safety limit: oldest saved files are removed after this many */
var FRESH_JSON = true;               /* true: the design list (home.json) is taken from the network first (max 2.5s), saved copy only if slow/offline.
                                        false: it also opens instantly from the saved copy and refreshes in the background */
var SCOPE = self.registration.scope; /* works at the main domain and also at username.github.io/repo/ */
var PRECACHE = ["./", "index.html", "home.json"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(
        PRECACHE.map(function (u) {
          return c.add(new Request(new URL(u, SCOPE).href)).catch(function () {}); /* a missing file never breaks the install */
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
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

/* saved copy now (instant) + fresh copy fetched in the background for next time */
function staleWhileRevalidate(req, opts) {
  return caches.match(req, opts).then(function (hit) {
    var net = fetch(req).then(function (res) { return save(req, res); }).catch(function () { return null; });
    return hit || net.then(function (r) { return r || Response.error(); });
  });
}

/* network first (short wait), saved copy if slow or offline */
function networkFirst(req) {
  return new Promise(function (resolve) {
    var done = false;
    var t = setTimeout(function () {
      caches.match(req).then(function (hit) { if (hit && !done) { done = true; resolve(hit); } });
    }, 2500);
    fetch(req).then(function (res) {
      clearTimeout(t);
      if (!done) { done = true; resolve(save(req, res)); } else save(req, res);
    }).catch(function () {
      clearTimeout(t);
      caches.match(req).then(function (hit) { if (!done) { done = true; resolve(hit || Response.error()); } });
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request, url;
  if (req.method !== "GET" || req.headers.has("range")) return;       /* video / partial downloads: untouched */
  url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                    /* Firebase, Google fonts, payments, etc.: untouched */
  if (/\/sw\.js$/.test(url.pathname)) return;

  /* the page itself */
  if (req.mode === "navigate") {
    e.respondWith(
      staleWhileRevalidate(req, { ignoreSearch: true }).then(function (r) {
        return r && r.type !== "error" ? r : caches.match(new URL("index.html", SCOPE).href).then(function (x) { return x || r; });
      })
    );
    return;
  }

  /* the design list */
  if (/\.json$/.test(url.pathname)) {
    e.respondWith(FRESH_JSON ? networkFirst(req) : staleWhileRevalidate(req));
    return;
  }

  /* images, fonts, scripts, styles from your own site */
  e.respondWith(staleWhileRevalidate(req));
});
