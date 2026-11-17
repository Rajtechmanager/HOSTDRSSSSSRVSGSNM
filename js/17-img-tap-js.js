      /* Image step tutorial: plays the FIRST time the person reaches the Image step (by the Image tab or by "Continue to Image").
         1 second tapping "Upload your photo", then 1 second tapping "Choose from our designs". Touching the screen ends it. */
      (function () {
        var tap = document.createElement("div"), tm = [], marked = null, running = false;
        tap.id = "imgTap";
        tap.setAttribute("aria-hidden", "true");
        tap.innerHTML = '<span class="itr"></span><i class="itf">&#128070;</i>';
        document.body.appendChild(tap);
        function later(fn, ms) { tm.push(setTimeout(fn, ms)); }
        function vis(el) {
          if (!el) return false;
          var r = el.getBoundingClientRect(), c = getComputedStyle(el);
          return r.width > 4 && r.height > 4 && c.display !== "none" && c.visibility !== "hidden";
        }
        function onImage() {
          var cs = document.getElementById("customSec"), c = document.querySelector("#customSec .cust");
          return !!(cs && !cs.hidden && c && c.dataset.tab === "image");
        }
        function unmark() { if (marked) { marked.classList.remove("itOn"); marked = null; } }
        function stop() {
          tm.forEach(clearTimeout); tm = [];
          tap.classList.remove("show", "go");
          unmark();
          running = false;
          window.__guideBusy = false;
        }
        function inView(el, cb) { /* bring the button into the visible part of the panel first */
          var ctl = document.getElementById("ctl"), acts = document.querySelector("#customSec .acts");
          if (!ctl) { cb(); return; }
          var r = el.getBoundingClientRect(), cr = ctl.getBoundingClientRect(),
            bot = Math.min(cr.bottom, acts && acts.offsetHeight ? acts.getBoundingClientRect().top : cr.bottom);
          if (r.top < cr.top + 4 || r.bottom > bot - 4) {
            ctl.scrollBy({ top: r.top + r.height / 2 - (cr.top + bot) / 2, behavior: "smooth" });
            later(cb, 450);
          } else cb();
        }
        function tapOn(el, ms, done) {
          inView(el, function () {
            if (!onImage() || !vis(el)) { stop(); return; }
            var r = el.getBoundingClientRect();
            tap.style.left = r.left + r.width / 2 + "px";
            tap.style.top = r.top + r.height / 2 + "px";
            tap.classList.remove("go");
            void tap.offsetWidth; /* restart the animation */
            tap.classList.add("show", "go");
            unmark(); marked = el; el.classList.add("itOn");
            later(function () { tap.classList.remove("show", "go"); unmark(); done(); }, ms);
          });
        }
        function waitFor(id, ok) {
          var n = 0;
          (function p() {
            if (!onImage()) { stop(); return; }
            var el = document.getElementById(id);
            if (vis(el)) { ok(el); return; }
            if (++n > 25) { stop(); return; }
            later(p, 200);
          })();
        }
        function run() {
          running = true;
          window.__guideBusy = true;
          waitFor("upP", function (up) {
            tapOn(up, 1000, function () { /* 1 second: Upload your photo */
              later(function () {
                waitFor("addP", function (ds) {
                  tapOn(ds, 1000, stop); /* then 1 second: Choose from our designs */
                });
              }, 150);
            });
          });
        }
        /* any touch ends the tutorial straight away */
        ["pointerdown", "touchstart", "keydown"].forEach(function (e) {
          document.addEventListener(e, function () { if (running) stop(); }, true);
        });
        var last = "", pend = false, shown = false; /* shown: only the FIRST time the Image step is reached */
        function tick() {
          var cs = document.getElementById("customSec"), c = document.querySelector("#customSec .cust"),
            tab = cs && !cs.hidden && c ? c.dataset.tab : "",
            typing = !!c && (c.classList.contains("typing") || document.body.classList.contains("kb"));
          if (tab === "image" && last !== "image" && !shown) pend = true;
          if (tab !== "image") { if (last === "image") stop(); pend = false; }
          if (pend && tab === "image" && !typing && !window.__guideBusy) {
            pend = false; shown = true;
            window.__guideBusy = true;
            later(run, 400); /* let the Image panel finish drawing first */
          }
          last = tab;
        }
        setInterval(tick, 250);
      })();
    
