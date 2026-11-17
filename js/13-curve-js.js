      (function () {
        if (typeof textCanvas !== "function" || !document.getElementById("shirt")) return;
        var cv0 = document.getElementById("shirt"),
          stage = cv0.parentNode;

        /* ---------- 1. bend the text (pure pixel maths: v = -100 .. +100, + = arch up, - = bowl down) ---------- */
        function warpData(sd, w, h, v) {
          var a = Math.min(1, Math.abs(v) / 100),
            arch = v > 0,
            phi = Math.min(1.25 * a, w / 2 / h), /* radius never smaller than the text height */
            R = w / 2 / phi,
            sg = arch ? -1 : 1,
            minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, i, j, s, m, th, r, X, Y;
          for (i = 0; i <= 80; i++) {
            s = -w / 2 + (w * i) / 80;
            th = s / R;
            for (j = 0; j < 2; j++) {
              m = j ? h / 2 : -h / 2;
              r = arch ? R - m : R + m;
              X = r * Math.sin(th);
              Y = sg * r * Math.cos(th);
              if (X < minX) minX = X; if (X > maxX) maxX = X;
              if (Y < minY) minY = Y; if (Y > maxY) maxY = Y;
            }
          }
          var ow = Math.ceil(maxX - minX) + 2,
            oh = Math.ceil(maxY - minY) + 2,
            od = new Uint8ClampedArray(ow * oh * 4),
            ox, oy, k, px, py, sx, sy, x0, y0, fx, fy, o, wgt, A, Rr, G, B, p, q, wa;
          for (oy = 0; oy < oh; oy++) {
            for (ox = 0; ox < ow; ox++) {
              X = ox + minX - 0.5;
              Y = oy + minY - 0.5;
              r = Math.sqrt(X * X + Y * Y);
              if (!r) continue;
              if (arch) { th = Math.atan2(X, -Y); m = R - r; }
              else { th = Math.atan2(X, Y); m = r - R; }
              sx = w / 2 + th * R - 0.5;
              sy = h / 2 + m - 0.5;
              if (sx < -1 || sy < -1 || sx > w || sy > h) continue;
              x0 = Math.floor(sx); y0 = Math.floor(sy);
              fx = sx - x0; fy = sy - y0;
              A = Rr = G = B = 0;
              for (k = 0; k < 4; k++) {
                px = x0 + (k & 1); py = y0 + (k >> 1);
                if (px < 0 || py < 0 || px >= w || py >= h) continue;
                wgt = (k & 1 ? fx : 1 - fx) * (k >> 1 ? fy : 1 - fy);
                p = (py * w + px) * 4;
                wa = (sd[p + 3] / 255) * wgt;
                A += wa; Rr += sd[p] * wa; G += sd[p + 1] * wa; B += sd[p + 2] * wa;
              }
              if (A > 0.003) {
                q = (oy * ow + ox) * 4;
                od[q] = Rr / A; od[q + 1] = G / A; od[q + 2] = B / A; od[q + 3] = A * 255;
              }
            }
          }
          return { d: od, w: ow, h: oh };
        }
        window.__curveWarp = warpData; /* for testing */

        function turn(src, back) {
          var c = document.createElement("canvas"), g;
          c.width = src.height; c.height = src.width;
          g = c.getContext("2d");
          if (back) { g.translate(src.height, 0); g.rotate(Math.PI / 2); }
          else { g.translate(0, src.width); g.rotate(-Math.PI / 2); }
          g.drawImage(src, 0, 0);
          return c;
        }
        function bend(src, v, vertical) {
          var base = vertical ? turn(src, false) : src,
            w = base.width, h = base.height,
            sd = base.getContext("2d").getImageData(0, 0, w, h).data,
            r = warpData(sd, w, h, v),
            out = document.createElement("canvas");
          out.width = r.w; out.height = r.h;
          var g = out.getContext("2d"), im = g.createImageData(r.w, r.h);
          im.data.set(r.d);
          g.putImageData(im, 0, 0);
          return vertical ? turn(out, true) : out;
        }

        /* Instant Studio only (flag set while its Curve slider is being dragged): bend a half-size copy (4x less work),
           then hand back a full-size canvas so the layout stays the same. The crisp full-size bend is drawn when the slider rests. */
        function bendLive(src, v, vertical) {
          var hs = document.createElement("canvas"), g0;
          hs.width = Math.max(1, Math.round(src.width / 2));
          hs.height = Math.max(1, Math.round(src.height / 2));
          g0 = hs.getContext("2d");
          g0.imageSmoothingQuality = "high";
          g0.drawImage(src, 0, 0, hs.width, hs.height);
          var half = bend(hs, v, vertical),
            full = document.createElement("canvas"),
            gv = null;
          full.width = half.width * 2;
          full.height = half.height * 2;
          var gf = full.getContext("2d");
          gf.imageSmoothingQuality = "high";
          gf.drawImage(half, 0, 0, full.width, full.height);
          /* empty rows above the letters are only measured if somebody asks (and on the small copy) */
          Object.defineProperty(full, "_gt", {
            configurable: true,
            get: function () { if (gv == null) gv = gapTop(half) * 2; return gv; },
            set: function (x) { gv = x; },
          });
          return full;
        }
        var CC = {}, CN = 0, plain = textCanvas;
        textCanvas = function (t, s) {
          var c = plain(t, s), v = Math.round(+t.cv || 0);
          if (!v || !c || !c.width) return c;
          var lo = !!window.__nsCurveLive,
            key = (lo ? "h|" : "") + c._id + "|" + v + "|" + ((t.o || 0) > 0 ? 1 : 0), hit = CC[key];
          if (hit) return hit;
          if (CN > 30) { CC = {}; CN = 0; }
          var out;
          try { out = lo ? bendLive(c, v, (t.o || 0) > 0) : bend(c, v, (t.o || 0) > 0); } catch (e) { return c; }
          out._id = ++UID;
          CN++;
          return (CC[key] = out);
        };

        /* ---------- 2. the Curve button + slider ---------- */
        var W = document.createElement("div");
        W.id = "crvW";
        W.innerHTML =
          '<button type="button" id="crvB" aria-label="Curve text" title="Curve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17C6 6 18 6 21 17"/><path d="M8.5 15.5l.8-2.2M12 14.2v-2.6M15.5 15.5l-.8-2.2" stroke-width="1.8"/></svg></button><span class="crvl">Curve</span>';
        var P = document.createElement("div");
        P.id = "crvP";
        P.setAttribute("role", "group");
        P.setAttribute("aria-label", "Curve the text");
        P.innerHTML =
          '<div class="crvh"><span>Curve</span><b id="crvV">0</b></div><span class="crva">&#9650; Arch</span><div class="crvr"><input id="crvS" type="range" min="-100" max="100" step="1" value="0" aria-label="Curve amount"></div><span class="crvb">Bowl &#9660;</span><button type="button" id="crvZ">Reset</button>';
        stage.appendChild(W);
        stage.appendChild(P);
        var B = W.querySelector("#crvB"),
          S = P.querySelector("#crvS"),
          V = P.querySelector("#crvV");

        /* keep the stage's own drag / pinch handlers away from these controls */
        ["pointerdown", "pointermove", "pointerup", "pointercancel", "touchstart", "touchmove", "mousedown"].forEach(function (n) {
          W.addEventListener(n, function (e) { e.stopPropagation(); });
          P.addEventListener(n, function (e) { e.stopPropagation(); });
        });

        function cur() {
          var i = typeof tIdx === "function" ? tIdx() : -1;
          return sel === "i" || i < 0 ? null : T[i];
        }
        function paint(t) {
          var v = Math.round((t && +t.cv) || 0);
          S.value = v;
          V.textContent = v;
          W.classList.toggle("set", !!v);
        }
        function sync() {
          var cs = document.getElementById("customSec"),
            c = document.querySelector("#customSec .cust"),
            t = cs && !cs.hidden && c ? cur() : null,
            tab = c && c.dataset.tab,
            typing = !!c && (c.classList.contains("typing") || document.body.classList.contains("kb")),
            ok = !!t && tab === "style" && !typing && t.txt && t.txt.trim();
          W.classList.toggle("show", !!ok);
          if (!ok) { P.classList.remove("open"); B.classList.remove("on"); return; }
          if (document.activeElement !== S) paint(t);
        }
        B.addEventListener("click", function () {
          var o = !P.classList.contains("open");
          P.classList.toggle("open", o);
          B.classList.toggle("on", o);
          sync();
        });
        function apply(v) {
          var t = cur();
          if (!t) return;
          if (Math.abs(v) < 4) v = 0; /* snaps back to the centre = straight text */
          t.cv = v;
          S.value = v;
          V.textContent = v;
          W.classList.toggle("set", !!v);
          draw();
        }
        S.addEventListener("input", function () { apply(+S.value); });
        P.querySelector("#crvZ").addEventListener("click", function () { apply(0); });
        /* tap anywhere else on the picture area closes the slider */
        document.addEventListener("pointerdown", function (e) {
          if (P.classList.contains("open") && !P.contains(e.target) && !W.contains(e.target)) {
            P.classList.remove("open");
            B.classList.remove("on");
          }
        });
        document.addEventListener("click", function () { setTimeout(sync, 0); });
        setInterval(sync, 350);
        sync();
      })();
    
