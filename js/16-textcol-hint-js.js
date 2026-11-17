      (function () {
        var tip = document.createElement("div"), tmrs = [], ring = null;
        tip.id = "tcG";
        tip.setAttribute("role", "status");
        tip.innerHTML =
          '<span class="tcD">' +
            '<svg class="tcDc" viewBox="0 0 128 70" aria-hidden="true"><path id="tcDp" d="M14 34 Q64 34 114 34" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.5" stroke-dasharray="3 3"/><text font-size="20" font-weight="700" fill="#fff" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"><textPath id="tcDt" href="#tcDp" startOffset="50%">ABCDE</textPath></text></svg>' +
            '<span class="tcDd" aria-hidden="true"><span class="tcDa">Abc</span><span class="tcDs"><span>A</span><span>b</span><span>c</span></span></span>' +
            '<span class="tcDl"></span>' +
          '</span><span class="tcB"></span><i class="tcF"></i>';
        document.body.appendChild(tip);
        var B = tip.querySelector(".tcB"), F = tip.querySelector(".tcF");
        var dPath = tip.querySelector("#tcDp"), dA = tip.querySelector(".tcDa"), dS = tip.querySelector(".tcDs"), dL = tip.querySelector(".tcDl");
        var raf = 0, t0 = 0;
        function sm(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
        function lerp(a, b, k) { return a + (b - a) * k; }
        /* Curve demo (5.7s loop): straight -> arch -> bowl -> straight. Every bend takes a full 1.5s, with a 0.3s rest in between */
        function curveFrame(t) {
          var c;
          if (t < 0.3) c = 0;
          else if (t < 1.8) c = sm((t - 0.3) / 1.5);
          else if (t < 2.1) c = 1;
          else if (t < 3.6) c = lerp(1, -1, sm((t - 2.1) / 1.5));
          else if (t < 3.9) c = -1;
          else if (t < 5.4) c = lerp(-1, 0, sm((t - 3.9) / 1.5));
          else c = 0;
          dPath.setAttribute("d", "M14 34 Q64 " + (34 - c * 36).toFixed(2) + " 114 34");
          dL.textContent = c > 0.12 ? "Curve " + Math.round(c * 100) + " \u25B2 Arch" : c < -0.12 ? "Curve " + Math.round(c * 100) + " \u25BC Bowl" : "Curve 0 \u2014 Straight";
        }
        /* Text direction demo (6.8s loop): Horizontal -> Vertical 1 (turned) -> Vertical 2 (stacked) -> back. Every change takes a full 1.5s */
        function dirFrame(t) {
          var rot = 0, oa = 1, os = 0, name = "Horizontal", k;
          if (t < 1.5) { rot = 0; }
          else if (t < 3.0) { rot = 90 * sm((t - 1.5) / 1.5); name = "Vertical 1 (turned)"; }
          else if (t < 3.4) { rot = 90; name = "Vertical 1 (turned)"; }
          else if (t < 4.9) { rot = 90; k = sm((t - 3.4) / 1.5); oa = 1 - k; os = k; name = "Vertical 2 (stacked)"; }
          else if (t < 5.3) { rot = 90; oa = 0; os = 1; name = "Vertical 2 (stacked)"; }
          else { k = sm((t - 5.3) / 1.5); rot = 0; oa = k; os = 1 - k; name = k > 0.5 ? "Horizontal" : "Vertical 2 (stacked)"; }
          dA.style.transform = "translate(-50%, -50%) rotate(" + rot.toFixed(1) + "deg)";
          dA.style.opacity = oa; dS.style.opacity = os;
          dL.textContent = name;
        }
        function startDemo(kind) {
          stopDemo();
          tip.setAttribute("data-demo", kind);
          t0 = 0;
          var period = kind === "curve" ? 5.7 : 6.8, fn = kind === "curve" ? curveFrame : dirFrame;
          function step(ts) {
            if (!t0) t0 = ts;
            fn((((ts - t0) / 1000) * (period / 1.5)) % period); /* the whole demo runs once in 1.5 seconds */
            raf = requestAnimationFrame(step);
          }
          raf = requestAnimationFrame(step);
        }
        function stopDemo() { if (raf) cancelAnimationFrame(raf); raf = 0; }
        function vis(el) {
          if (!el) return false;
          var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
          return r.width > 4 && r.height > 4 && cs.visibility !== "hidden" && cs.display !== "none";
        }
        function colTarget() {
          var ed = document.getElementById("editor"),
            st = ed && ed.querySelector(".ed-style");
          if (st && st.dataset.sec === "col") {
            var sw = st.querySelector(".sw") || st.querySelector(".cm");
            if (vis(sw)) return sw;
          }
          var c = document.querySelector('#sdock .sdb[data-sds="col"]'),
            d = document.querySelector('#editor .fb[data-fs="col"]');
          return vis(c) ? c : vis(d) ? d : null;
        }
        function curveTarget() {
          var w = document.getElementById("crvW"), b = document.getElementById("crvB");
          return w && w.classList.contains("show") && vis(b) ? b : null;
        }
        function dirTarget() {
          var z = document.getElementById("zb2");
          return z && z.classList.contains("show") && vis(z) ? z : null;
        }
        function onStyle() {
          var cs = document.getElementById("customSec"), c = document.querySelector("#customSec .cust");
          return !!(cs && !cs.hidden && c && c.dataset.tab === "style");
        }
        function later(fn, ms) { tmrs.push(setTimeout(fn, ms)); }
        function hide() {
          stopDemo();
          tip.classList.remove("show");
          if (ring) { ring.classList.remove("tcRing"); ring = null; }
        }
        function abort() {
          tmrs.forEach(clearTimeout); tmrs = [];
          hide();
          window.__guideBusy = false;
        }
        /* below = finger under the target pointing up, box under the finger.
           above = box on top, finger under it pointing down onto the target. */
        function point(t, label, below, ms, done, demo) {
          hide();
          var r = t.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
          B.textContent = label;
          F.innerHTML = below ? "&#128070;" : "&#128071;";
          F.style.marginLeft = "0px";
          if (below) demo = null; /* Color: only the finger + label, no demo */
          tip.className = (below ? "tcu" : "tcd") + (demo ? " tcm" : ""); /* own class names: the page already has a global ".dn" red-button style */
          if (demo) tip.setAttribute("data-demo", demo); else tip.removeAttribute("data-demo");
          tip.style.visibility = "hidden"; tip.style.left = "0px"; tip.style.top = "0px";
          var w = tip.offsetWidth, h = tip.offsetHeight, fw = F.offsetWidth || 30,
            cx = r.left + r.width / 2,
            left = Math.min(W - w - 6, Math.max(6, cx - w / 2)),
            top = below ? r.bottom + 2 : r.top - h - 2;
          if (demo && top < 4) { /* no room above the target for the demo: fall back to finger + label only */
            demo = null; tip.className = "tcd"; tip.removeAttribute("data-demo");
            w = tip.offsetWidth; h = tip.offsetHeight;
            left = Math.min(W - w - 6, Math.max(6, cx - w / 2)); top = r.top - h - 2;
          }
          top = Math.max(4, Math.min(H - h - 4, top));
          tip.style.left = left + "px";
          tip.style.top = top + "px";
          F.style.marginLeft = Math.max(0, Math.min(w - fw, cx - left - fw / 2)) + "px"; /* finger sits exactly on the target */
          tip.style.visibility = "";
          void tip.offsetWidth;
          tip.classList.add("show");
          ring = t; t.classList.add("tcRing");
          if (demo) startDemo(demo);
          later(function () { hide(); if (done) done(); }, ms);
        }
        function waitFor(get, ok, fail) { /* the Curve / direction buttons can appear a moment after the Style tab opens: wait for them */
          var n = 0;
          (function p() {
            if (!onStyle()) { fail(); return; }
            var x = get();
            if (x) { ok(x); return; }
            if (++n > 25) { fail(); return; }
            later(p, 200);
          })();
        }
        function run() {
          tmrs.forEach(clearTimeout); tmrs = [];
          window.__guideBusy = true;
          function end() { window.__guideBusy = false; }
          waitFor(colTarget, function (t) {
            point(t, "Color", true, 1000, function () { /* Color: 1 second */
              later(function () {
                waitFor(curveTarget, function (c) {
                  point(c, "Curve text", false, 1500, function () { /* Curve: one full loop of the bending demo */
                    later(function () {
                      waitFor(dirTarget, function (d) {
                        point(d, "Text direction", false, 1500, end, "dir"); /* last: Text direction, one full loop */
                      }, end);
                    }, 200);
                  }, "curve");
                }, end);
              }, 200);
            });
          }, end);
        }
        window.__textColHint = run;
        var last = "", pend = false, shown = false; /* shown: the guide plays only the FIRST time the person reaches Style */
        function tick() {
          var cs = document.getElementById("customSec"),
            c = document.querySelector("#customSec .cust"),
            tab = cs && !cs.hidden && c ? c.dataset.tab : "",
            typing = !!c && (c.classList.contains("typing") || document.body.classList.contains("kb"));
          if (tab === "style" && last !== "style" && !shown) pend = true; /* arrived on Style: by the Style tab OR by "Continue to Style" */
          if (tab !== "style") { if (last === "style") abort(); pend = false; }
          if (pend && tab === "style" && !typing) { /* keyboard still closing? stay pending and start the moment it is gone */
            pend = false;
            shown = true; /* from now on it never plays again, however often they return to Style */
            window.__guideBusy = true;
            later(run, 350); /* let the Style panel finish drawing first */
          }
          last = tab;
        }
        setInterval(tick, 250);
      })();
    
