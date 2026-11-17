      /* Colour picker (Instant Studio only): press and hold the "Pick colour" button, drag over anything on the screen,
         lift your finger to apply that colour to the MAIN text only (the signature is never changed). */
      (function () {
        var sec = document.getElementById("nameSec"), API = window.__nsCol;
        if (!sec || !API) return;
        var btn = document.createElement("button"), loupe = null, ring, hexEl, dot, act = false, pid = null, cur = null, raf = 0, px = 0, py = 0;
        btn.type = "button";
        btn.id = "nsPickBtn";
        btn.title = "Press, drag over any colour on the screen, then lift to apply it to your text";
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 5.5l4 4"/><path d="M16 4a2.1 2.1 0 0 1 3 0l1 1a2.1 2.1 0 0 1 0 3l-2.2 2.2-4-4z"/><path d="M13.8 9.2L5.4 17.6a2 2 0 0 0-.5.9L4 21l2.5-.9a2 2 0 0 0 .9-.5l8.4-8.4"/></svg><span>Pick colour</span><small class="pkHint">hold to use</small>';
        function place() {
          var a = document.getElementById("nsTexBtn") || document.getElementById("nsSigBtn") || document.getElementById("nsCols");
          if (a && a.nextSibling !== btn) a.parentNode.insertBefore(btn, a.nextSibling);
        }
        place();
        if (window.MutationObserver) new MutationObserver(place).observe(sec, { childList: true, subtree: true });
        function hex2(n) {
          return (n < 16 ? "0" : "") + n.toString(16);
        }
        /* read the colour of whatever is visible at screen point (x, y) */
        function sample(x, y) {
          var els = document.elementsFromPoint(x, y), i, el, r, cv, g, d, t, cs, m, c2, g2;
          for (i = 0; i < els.length; i++) {
            el = els[i];
            if (el === loupe || el === dot || (loupe && loupe.contains(el))) continue;
            r = el.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            try {
              if (el.tagName === "CANVAS") {
                g = el.getContext("2d");
                if (g) {
                  d = g.getImageData(
                    Math.max(0, Math.min(el.width - 1, Math.floor(((x - r.left) * el.width) / r.width))),
                    Math.max(0, Math.min(el.height - 1, Math.floor(((y - r.top) * el.height) / r.height))),
                    1,
                    1,
                  ).data;
                  if (d[3] > 10) return "#" + hex2(d[0]) + hex2(d[1]) + hex2(d[2]);
                  continue;
                }
              } else if (el.tagName === "IMG" && el.naturalWidth) {
                c2 = document.createElement("canvas");
                c2.width = c2.height = 1;
                g2 = c2.getContext("2d");
                g2.drawImage(
                  el,
                  Math.max(0, Math.min(el.naturalWidth - 1, ((x - r.left) * el.naturalWidth) / r.width)),
                  Math.max(0, Math.min(el.naturalHeight - 1, ((y - r.top) * el.naturalHeight) / r.height)),
                  1,
                  1,
                  0,
                  0,
                  1,
                  1,
                );
                d = g2.getImageData(0, 0, 1, 1).data;
                if (d[3] > 10) return "#" + hex2(d[0]) + hex2(d[1]) + hex2(d[2]);
                continue;
              }
            } catch (e) {
              /* a protected (cross-origin) image: fall through to the CSS colour below */
            }
            cs = getComputedStyle(el).backgroundColor;
            m = cs && cs.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?/);
            if (m && (m[4] === undefined || parseFloat(m[4]) > 0.05)) return "#" + hex2(+m[1]) + hex2(+m[2]) + hex2(+m[3]);
          }
          return null;
        }
        var tut = null, tutT = 0;
        /* 1.5s tutorial: finger presses the button and HOLDS ("Hold", 0.6s), then DRAGS to the centre ("Drag", 0.6s) while a circle shows colours */
        function tutorial() {
          if (!tut) {
            tut = document.createElement("div");
            tut.id = "pkTut";
            tut.setAttribute("aria-hidden", "true");
            tut.innerHTML =
              '<div class="pkT"></div><div class="pkR"></div><div class="pkG"><div class="pkC"></div><div class="pkF">\uD83D\uDC46</div><div class="pkL"><b>Hold</b><b>Drag</b></div></div>';
            document.body.appendChild(tut);
          }
          if (!tut.animate) return;
          var r = btn.getBoundingClientRect(), x0 = r.left + r.width / 2, y0 = r.top + r.height / 2,
            x1 = window.innerWidth / 2, y1 = window.innerHeight / 2, dx = x1 - x0, dy = y1 - y0,
            len = Math.sqrt(dx * dx + dy * dy), ang = Math.atan2(dy, dx) * 180 / Math.PI,
            q = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, D = q ? 1000 : 1500,
            T = tut.querySelector(".pkT"), R = tut.querySelector(".pkR"), G = tut.querySelector(".pkG"),
            C = tut.querySelector(".pkC"), F = tut.querySelector(".pkF"), L = tut.querySelectorAll(".pkL b"),
            o = { duration: D, fill: "forwards" }, P0 = "translate(" + x0 + "px," + y0 + "px)", P1 = "translate(" + x1 + "px," + y1 + "px)";
          clearTimeout(tutT);
          tut.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
          tut.style.display = "block";
          /* group (finger + circle + label): sits on the button while holding (0-40%), then glides to the centre (40-82%) */
          G.animate([
            { transform: P0, offset: 0 },
            { transform: P0, offset: 0.4, easing: "ease-in-out" },
            { transform: P1, offset: 0.82 },
            { transform: P1, offset: 1 },
          ], o);
          G.animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.86 }, { opacity: 0, offset: 1 }], o);
          /* finger presses down while holding, lifts slightly while dragging */
          F.animate([
            { transform: "scale(1.3)", offset: 0 },
            { transform: "scale(.82)", offset: 0.1 },
            { transform: "scale(.82)", offset: 0.4 },
            { transform: "scale(.95)", offset: 0.5 },
            { transform: "scale(.95)", offset: 1 },
          ], o);
          /* pulsing ring on the button = "keep holding" */
          R.animate([
            { transform: P0 + " scale(.5)", opacity: 0.95, offset: 0 },
            { transform: P0 + " scale(1.2)", opacity: 0, offset: 0.2 },
            { transform: P0 + " scale(.5)", opacity: 0.95, offset: 0.22 },
            { transform: P0 + " scale(1.2)", opacity: 0, offset: 0.4 },
            { transform: P0 + " scale(1.2)", opacity: 0, offset: 1 },
          ], o);
          /* dotted trail grows from the button to the centre while dragging */
          T.style.width = len + "px";
          T.animate([
            { transform: P0 + " rotate(" + ang + "deg) scaleX(0)", opacity: 0, offset: 0 },
            { transform: P0 + " rotate(" + ang + "deg) scaleX(0)", opacity: 0.95, offset: 0.4 },
            { transform: P0 + " rotate(" + ang + "deg) scaleX(1)", opacity: 0.95, offset: 0.82, easing: "ease-in-out" },
            { transform: P0 + " rotate(" + ang + "deg) scaleX(1)", opacity: 0, offset: 1 },
          ], o);
          /* label: "Hold" first, then "Drag" */
          L[0].animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.37 }, { opacity: 0, offset: 0.42 }, { opacity: 0, offset: 1 }], o);
          L[1].animate([{ opacity: 0, offset: 0 }, { opacity: 0, offset: 0.4 }, { opacity: 1, offset: 0.46 }, { opacity: 1, offset: 0.8 }, { opacity: 0, offset: 0.9 }, { opacity: 0, offset: 1 }], o);
          /* colour circle above the finger: appears while dragging and flicks through colours = "it reads the colour under your finger" */
          C.animate([
            { opacity: 0, backgroundColor: "#e53935", offset: 0 },
            { opacity: 0, backgroundColor: "#e53935", offset: 0.4 },
            { opacity: 1, backgroundColor: "#e53935", offset: 0.45 },
            { opacity: 1, backgroundColor: "#fdd835", offset: 0.55 },
            { opacity: 1, backgroundColor: "#43a047", offset: 0.65 },
            { opacity: 1, backgroundColor: "#1e88e5", offset: 0.75 },
            { opacity: 1, backgroundColor: "#8e24aa", offset: 0.84 },
            { opacity: 0, backgroundColor: "#8e24aa", offset: 0.92 },
            { opacity: 0, backgroundColor: "#8e24aa", offset: 1 },
          ], o);
          tutT = setTimeout(function () { tut.style.display = "none"; }, D + 60);
        }
        function build() {
          loupe = document.createElement("div");
          loupe.id = "pkLoupe";
          loupe.setAttribute("aria-hidden", "true");
          loupe.innerHTML = '<div class="pkRing"></div><div class="pkHex">#------</div>';
          ring = loupe.firstChild;
          hexEl = loupe.lastChild;
          dot = document.createElement("div");
          dot.id = "pkDot";
          dot.setAttribute("aria-hidden", "true");
          document.body.appendChild(loupe);
          document.body.appendChild(dot);
        }
        function draw() {
          raf = 0;
          if (!act) return;
          var c = sample(px, py), W = window.innerWidth, lx, ly;
          cur = c;
          ring.style.background = c || "transparent";
          hexEl.textContent = c || "no colour";
          dot.style.background = c || "transparent";
          dot.style.transform = "translate(" + px + "px," + py + "px)";
          /* the loupe floats above the finger so the finger never hides it; it flips below near the top edge */
          lx = Math.max(4, Math.min(W - 96, px - 46));
          ly = py - 150;
          if (ly < 4) ly = py + 56;
          loupe.style.transform = "translate(" + lx + "px," + ly + "px)";
        }
        function move(e) {
          if (!act || (pid != null && e.pointerId !== pid)) return;
          px = e.clientX;
          py = e.clientY;
          if (!raf) raf = requestAnimationFrame(draw);
          if (e.cancelable) e.preventDefault();
        }
        function stop(apply) {
          if (!act) return;
          act = false;
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
          if (apply) cur = sample(px, py) || cur;
          loupe.style.display = "none";
          dot.style.display = "none";
          btn.classList.remove("live");
          document.documentElement.classList.remove("pkOn");
          document.removeEventListener("keydown", esc);
          try {
            if (pid != null) btn.releasePointerCapture(pid);
          } catch (x) {}
          pid = null;
          if (apply && cur) API.set(cur);
          cur = null;
        }
        function esc(e) {
          if (e.key === "Escape") stop(false);
        }
        btn.addEventListener("pointerdown", function (e) {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          if (!loupe) build();
          act = true;
          pid = e.pointerId;
          px = e.clientX;
          py = e.clientY;
          try {
            btn.setPointerCapture(pid);
          } catch (x) {}
          btn.classList.add("live");
          document.documentElement.classList.add("pkOn");
          loupe.style.display = "flex";
          dot.style.display = "block";
          document.addEventListener("keydown", esc);
          draw();
          tutorial();
          e.preventDefault();
        });
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerup", function (e) {
          if (e.pointerId !== pid) return;
          px = e.clientX;
          py = e.clientY;
          stop(true);
        });
        btn.addEventListener("pointercancel", function () {
          stop(false);
        });
        btn.addEventListener("lostpointercapture", function () {
          if (act) stop(false);
        });
        btn.addEventListener("contextmenu", function (e) {
          e.preventDefault();
        });
        btn.addEventListener("touchmove", function (e) {
          if (act && e.cancelable) e.preventDefault();
        }, { passive: false });
      })();
    
