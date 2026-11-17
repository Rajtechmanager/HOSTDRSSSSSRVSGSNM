      /* After the drag / pinch demo: a finger points at the real Curve, Text-direction and Texture buttons (0.75s each);
         while it points, a small card shows what the button does (text bends / turns / gets a gold texture). Existing code is untouched. */
      (function () {
        var sec = document.getElementById("nameSec"), grid = document.getElementById("pvGrid");
        if (!sec || !grid) return;
        var T = [], raf = 0, root = null, fin = null, rings = [], last = "", uid = 0, START = 2900, EACH = 750;
        function later(f, ms) { T.push(setTimeout(f, ms)); }
        function clean() {
          T.forEach(clearTimeout);
          T = [];
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
          if (root) root.remove();
          if (fin) fin.remove();
          root = fin = null;
          rings.forEach(function (r) { r.remove(); });
          rings = [];
          document.removeEventListener("pointerdown", clean, true);
        }
        function label() {
          var n = "";
          try { n = (window.__nsSig && window.__nsSig.name && window.__nsSig.name()) || ""; } catch (e) {}
          n = String(n).trim().toUpperCase().slice(0, 6);
          return n || "TEXT";
        }
        function fsz(n) { return Math.max(14, Math.min(26, Math.floor(100 / (n.length * 0.52)))); }
        function vis(el) {
          if (!el) return null;
          var r = el.getBoundingClientRect();
          return r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > window.innerHeight ? null : r;
        }
        function ring(r) {
          var d = document.createElement("div");
          d.className = "ftRing";
          d.style.left = r.left - 4 + "px";
          d.style.top = r.top - 4 + "px";
          d.style.width = r.width + 8 + "px";
          d.style.height = r.height + 8 + "px";
          document.body.appendChild(d);
          rings.push(d);
          d.animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1.05)", offset: 0.3 }, { opacity: 1, transform: "scale(1)", offset: 0.75 }, { opacity: 0, transform: "scale(1)" }], { duration: EACH - 150, fill: "forwards" });
          later(function () { d.remove(); }, EACH);
        }
        /* the finger glides to the button, taps it, and stays there while the card plays */
        var px = 0, py = 0, first = true;
        function point(r) {
          var x = r.left + r.width / 2, y = r.bottom - r.height * 0.18, sp = fin.firstChild;
          if (first) {
            fin.animate([{ transform: "translate(" + x + "px," + (y + 46) + "px)", opacity: 0 }, { transform: "translate(" + x + "px," + y + "px)", opacity: 1 }], { duration: 230, easing: "ease-out", fill: "forwards" });
            first = false;
          } else {
            fin.animate([{ transform: "translate(" + px + "px," + py + "px)", opacity: 1 }, { transform: "translate(" + x + "px," + y + "px)", opacity: 1 }], { duration: 230, easing: "ease-in-out", fill: "forwards" });
          }
          px = x;
          py = y;
          /* tap: press down then release */
          sp.animate([{ transform: "scale(1)", offset: 0 }, { transform: "scale(1)", offset: 0.3 }, { transform: "scale(.78)", offset: 0.42 }, { transform: "scale(1)", offset: 0.55 }, { transform: "scale(1)" }], { duration: EACH - 100 });
          later(function () { ring(r); }, 260);
        }
        function card(cap, build) {
          root.innerHTML = "";
          var st = document.createElement("div"), c = document.createElement("div"), b = document.createElement("div");
          st.className = "ftS";
          c.className = "ftCap";
          c.textContent = cap;
          b.className = "ftB";
          st.appendChild(c);
          st.appendChild(b);
          root.appendChild(st);
          st.animate([{ opacity: 0, transform: "translateX(-50%) scale(.9)" }, { opacity: 1, transform: "translateX(-50%) scale(1)" }], { duration: 120, fill: "forwards" });
          build(b);
        }
        function pCurve(b) {
          var id = "ftP" + ++uid, ns = "http://www.w3.org/2000/svg", sv = document.createElementNS(ns, "svg"), df = document.createElementNS(ns, "defs"),
            pa = document.createElementNS(ns, "path"), tx = document.createElementNS(ns, "text"), tp = document.createElementNS(ns, "textPath"), n = label();
          sv.setAttribute("viewBox", "0 -10 120 70");
          sv.setAttribute("width", 110);
          sv.setAttribute("height", 64);
          pa.setAttribute("id", id);
          df.appendChild(pa);
          tx.setAttribute("font-size", fsz(n));
          tp.setAttribute("href", "#" + id);
          tp.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + id);
          tp.setAttribute("startOffset", "50%");
          tp.textContent = n;
          tx.appendChild(tp);
          sv.appendChild(df);
          sv.appendChild(tx);
          b.appendChild(sv);
          function set(k) { pa.setAttribute("d", "M4," + (46 - 8 * k) + " Q60," + (46 - 56 * k) + " 116," + (46 - 8 * k)); }
          set(0);
          var t0 = performance.now() + 120;
          (function step(now) {
            var p = Math.max(0, Math.min(1, (now - t0) / 480));
            set(p * p * (3 - 2 * p));
            if (p < 1) raf = requestAnimationFrame(step);
          })(performance.now());
        }
        function pDir(b) {
          var d = document.createElement("div"), n = label();
          d.className = "ftT";
          d.style.fontSize = fsz(n) + "px";
          d.textContent = n;
          b.appendChild(d);
          d.animate([{ transform: "rotate(0deg)", offset: 0 }, { transform: "rotate(0deg)", offset: 0.2 }, { transform: "rotate(-90deg)", offset: 0.8, easing: "ease-in-out" }, { transform: "rotate(-90deg)" }], { duration: EACH - 100, fill: "forwards" });
        }
        function pTex(b) {
          var d = document.createElement("div"), g = document.createElement("i"), n = label();
          d.className = "ftT";
          d.style.fontSize = fsz(n) + "px";
          d.textContent = n;
          g.className = "ftG";
          g.style.fontStyle = "normal";
          g.textContent = n;
          d.appendChild(g);
          b.appendChild(d);
          g.animate([{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1, offset: 0.65 }, { opacity: 1 }], { duration: EACH - 100, fill: "forwards" });
          g.animate([{ backgroundPosition: "0% 0" }, { backgroundPosition: "100% 0" }], { duration: EACH - 100, fill: "forwards", easing: "ease-in-out" });
        }
        function phase(i) {
          var tgt = [document.getElementById("ncW"), document.querySelector("#nsDirs [data-no=\"1\"]") || document.getElementById("nsDirs"), document.getElementById("nsTexBtn")][i],
            r = vis(tgt), cap = ["Curve", "Text direction", "Texture"][i], fn = [pCurve, pDir, pTex][i];
          if (r) point(r);
          later(function () { if (root) card(cap, fn); }, 120);
        }
        function run() {
          var cv = grid.querySelector(".pv.sel canvas") || grid.querySelector("canvas");
          if (!cv || !cv.animate) return;
          var r = cv.getBoundingClientRect();
          if (r.width < 60 || r.height < 60) return;
          clean();
          first = true;
          root = document.createElement("div");
          root.id = "ftDemo";
          root.setAttribute("aria-hidden", "true");
          root.style.left = r.left + "px";
          root.style.top = r.top + "px";
          root.style.width = r.width + "px";
          root.style.height = r.height + "px";
          fin = document.createElement("div");
          fin.id = "ftF";
          fin.setAttribute("aria-hidden", "true");
          fin.innerHTML = "<span>\uD83D\uDC46</span>";
          document.body.appendChild(root);
          document.body.appendChild(fin);
          document.addEventListener("pointerdown", clean, true); /* the user touches the screen: stop the hints */
          phase(0);
          later(function () { phase(1); }, EACH);
          later(function () { phase(2); }, EACH * 2);
          later(function () {
            if (root) root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" });
            if (fin) fin.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" });
            later(clean, 170);
          }, EACH * 3);
        }
        new MutationObserver(function () {
          var s = sec.dataset.wz;
          if (s === "detail" && last !== "detail") {
            /* the drag / pinch demo is over after START ms; keep the "picture on top" hint waiting until these 3 are done too */
            window.__nsAnimEnd = Math.max(window.__nsAnimEnd || 0, Date.now() + START + EACH * 3 + 300);
            clean();
            later(run, START);
          } else if (s !== "detail") clean();
          last = s;
        }).observe(sec, { attributes: true, attributeFilter: ["data-wz"] });
      })();
    
