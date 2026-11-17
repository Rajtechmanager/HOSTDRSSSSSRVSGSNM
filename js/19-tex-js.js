      /* Texture (Instant Studio only): a "Texture" button under Signature; a blurred full-screen list: None + 5 textures */
      (function () {
        var sec = document.getElementById("nameSec"),
          API = window.__nsTex;
        if (!sec || !API || typeof textCanvas !== "function") return;
        var NAMES = ["None", "Camo", "Gold foil", "Steel", "Fire", "Grunge"];
        function rng(a) {
          return function () {
            a |= 0;
            a = (a + 0x6d2b79f5) | 0;
            var t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          };
        }
        function blob(g, x, y, r, R) {
          var n = 9 + Math.floor(R() * 5), i, a, rr, px, py;
          g.beginPath();
          for (i = 0; i <= n; i++) {
            a = (i / n) * Math.PI * 2;
            rr = r * (0.55 + R() * 0.7);
            px = x + Math.cos(a) * rr;
            py = y + Math.sin(a) * rr * 0.8;
            if (i) g.lineTo(px, py);
            else g.moveTo(px, py);
          }
          g.closePath();
          g.fill();
        }
        function grad(g, x0, y0, x1, y1, stops) {
          var gr = g.createLinearGradient(x0, y0, x1, y1);
          stops.forEach(function (s, i) {
            gr.addColorStop(i / (stops.length - 1), s);
          });
          return gr;
        }
        /* returns a NEW canvas: the text shape filled with texture i (1-5); same size as src */
        function applyTex(src, i) {
          var w = src.width, h = src.height, o = document.createElement("canvas"), g, R = rng(1234 + i * 77), k, n, u = Math.max(8, h);
          o.width = w;
          o.height = h;
          g = o.getContext("2d");
          if (i === 5) {
            /* grunge: the text's own colour, worn away with specks and scratches */
            g.drawImage(src, 0, 0);
            g.globalCompositeOperation = "destination-out";
            n = Math.ceil((w * h) / 90);
            for (k = 0; k < n; k++) {
              g.globalAlpha = 0.5 + R() * 0.5;
              g.beginPath();
              g.arc(R() * w, R() * h, (0.4 + R() * R() * 3.2) * (u / 110), 0, 6.3);
              g.fill();
            }
            g.globalAlpha = 0.8;
            g.lineWidth = Math.max(1, u / 160);
            for (k = 0; k < 16; k++) {
              var x = R() * w, y = R() * h;
              g.beginPath();
              g.moveTo(x, y);
              g.lineTo(x + (R() - 0.3) * w * 0.35, y + (R() - 0.5) * h * 0.25);
              g.stroke();
            }
            return o;
          }
          if (i === 1) {
            /* camo: charcoal base with black / grey blobs */
            g.fillStyle = "#3a3a3a";
            g.fillRect(0, 0, w, h);
            var cols = ["#141414", "#8a8a8a", "#5a5a5a", "#c4c4c4", "#222", "#6e6e6e"], bu = u * 0.3;
            n = Math.ceil(((w * h) / (bu * bu)) * 2.6);
            for (k = 0; k < n; k++) {
              g.fillStyle = cols[Math.floor(R() * cols.length)];
              blob(g, R() * w, R() * h, bu * (0.35 + R() * 0.8), R);
            }
          } else if (i === 2) {
            /* gold foil */
            g.fillStyle = grad(g, 0, 0, w * 0.6, h, ["#7a5a12", "#f7e08a", "#c9962a", "#fff2b3", "#a8741a", "#e9c45a", "#8a6414"]);
            g.fillRect(0, 0, w, h);
            n = Math.ceil((w * h) / 120);
            for (k = 0; k < n; k++) {
              g.fillStyle = R() > 0.5 ? "rgba(255,245,200,.35)" : "rgba(90,60,5,.3)";
              g.fillRect(R() * w, R() * h, 1 + R() * 3, 1);
            }
          } else if (i === 3) {
            /* brushed steel */
            g.fillStyle = grad(g, 0, 0, 0, h, ["#6d7278", "#e8ecef", "#9aa0a6", "#f5f7f8", "#80868c", "#cfd4d8"]);
            g.fillRect(0, 0, w, h);
            n = Math.ceil(h * 2.2);
            for (k = 0; k < n; k++) {
              g.fillStyle = R() > 0.5 ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.14)";
              g.fillRect(R() * w * 0.4, R() * h, w * (0.2 + R() * 0.8), 1);
            }
          } else {
            /* fire */
            g.fillStyle = grad(g, 0, h, 0, 0, ["#ffe34d", "#ff9a1f", "#ff3d12", "#b30d0d", "#5a0505"]);
            g.fillRect(0, 0, w, h);
            n = Math.ceil((w * h) / (u * 3));
            for (k = 0; k < n; k++) {
              g.fillStyle = R() > 0.5 ? "rgba(255,230,120,.35)" : "rgba(120,10,5,.3)";
              g.beginPath();
              g.ellipse(R() * w, R() * h, u * 0.03 + R() * u * 0.05, u * 0.1 + R() * u * 0.2, 0, 0, 6.3);
              g.fill();
            }
          }
          g.globalCompositeOperation = "destination-in";
          g.drawImage(src, 0, 0);
          return o;
        }
        /* the studio draws the text with textCanvas(): add the texture on top of what it builds (main text only) */
        var prev = textCanvas, TXC = {};
        textCanvas = function (t, s) {
          var c = prev(t, s), i = +t.tex || 0;
          if (!i || t.sig || !c) return c;
          if (!c._id) c._id = ++UID;
          var key = c._id + "|" + i, hit = TXC[key];
          if (hit) return hit;
          if (Object.keys(TXC).length > 40) TXC = {};
          var o = applyTex(c, i);
          o._id = ++UID;
          return (TXC[key] = o);
        };
        /* ---- button + overlay ---- */
        var btn = document.createElement("button"), ov = null, list;
        btn.type = "button";
        btn.id = "nsTexBtn";
        btn.title = "Add a texture to your text";
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 12h16M12 4v16M4 8l8-4M12 20l8-8"/></svg><span>Texture</span>';
        function place() {
          var a = document.getElementById("nsSigBtn") || document.getElementById("nsCols");
          if (a && a.nextSibling !== btn) a.parentNode.insertBefore(btn, a.nextSibling);
        }
        place();
        if (window.MutationObserver) new MutationObserver(place).observe(sec, { childList: true, subtree: true });
        function mark() {
          var c = API.cur();
          btn.classList.toggle("on", c > 0);
          if (list)
            [].forEach.call(list.children, function (b, i) {
              b.classList.toggle("on", i === c);
              b.setAttribute("aria-pressed", i === c ? "true" : "false");
            });
        }
        function drawPrev() {
          var col = getComputedStyle(document.body).color || "#ddd";
          [].forEach.call(list.children, function (b, i) {
            var cv = b.querySelector("canvas"), g = cv.getContext("2d"), base = document.createElement("canvas");
            base.width = cv.width;
            base.height = cv.height;
            var bg = base.getContext("2d");
            bg.font = '400 52px Anton, Impact, sans-serif';
            bg.textAlign = "center";
            bg.textBaseline = "middle";
            bg.fillStyle = i === 0 || i === 5 ? col : "#ffffff";
            bg.fillText("TEXT", base.width / 2, base.height / 2 + 2);
            g.clearRect(0, 0, cv.width, cv.height);
            g.drawImage(i === 0 ? base : applyTex(base, i), 0, 0);
          });
        }
        function close() {
          if (ov) ov.hidden = true;
          document.removeEventListener("keydown", esc);
        }
        function esc(e) {
          if (e.key === "Escape") close();
        }
        function build() {
          ov = document.createElement("div");
          ov.id = "txOv";
          ov.hidden = true;
          ov.setAttribute("role", "dialog");
          ov.setAttribute("aria-modal", "true");
          ov.setAttribute("aria-label", "Choose a texture");
          ov.innerHTML =
            '<button type="button" class="txX" aria-label="Close" title="Close">\u2715</button>' +
            '<div class="txBox"><h3 class="txT">Choose a texture</h3><div class="txL"></div></div>';
          list = ov.querySelector(".txL");
          NAMES.forEach(function (n, i) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "txO";
            b.innerHTML = "<span>" + n + '</span><canvas class="txP" width="300" height="88"></canvas>';
            b.onclick = function () {
              API.set(i);
              mark();
              close();
            };
            list.appendChild(b);
          });
          ov.querySelector(".txX").onclick = close;
          ov.addEventListener("click", function (e) {
            if (e.target === ov) close();
          });
          document.body.appendChild(ov);
        }
        btn.onclick = function () {
          if (!ov) build();
          mark();
          ov.hidden = false;
          document.addEventListener("keydown", esc);
          drawPrev();
          if (document.fonts && document.fonts.load) document.fonts.load("400 52px Anton", "TEXT").then(drawPrev).catch(function () {});
        };
        mark();
      })();
    
