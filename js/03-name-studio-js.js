      /* ===== "Type your name" studio: name + admin design, shown on every language version of the chosen garment ===== */
      (function () {
        var NS = {
            name: "",
            did: null,
            dimg: null,
            cat: null,
            shirt: "black",
            shc: {},
            size: "",
            col: "#f4f4f0",
            bw: 0,
            bc: "b",
            style: 0,
            o: 0,
            ch: 200,
            cs: 100,
            cl: 50,
            tsize: 55,
            tpx: 50,
            tpy: 66,
            isize: 60,
            ipx: 50,
            ipy: 8,
          },
          VC = {},
          PVC = [],
          RQ = 0,
          drag = null,
          BUSY = false;
        var CT = [
          ["tee", "T-Shirt"],
          ["over", "Oversized T-Shirt"],
          ["terry", "Oversized Terry"],
          ["hoodie", "Hoodie"],
        ];
        var CI = {
          tee: '<svg viewBox="0 0 64 64"><path fill="currentColor" d="M22 9L9 15 3 28l11 4 2-4v27h32V28l2 4 11-4-6-13-13-6c-1 5-5 8-10 8s-9-3-10-8z"/></svg>',
          over: '<svg viewBox="0 0 64 64"><path fill="currentColor" d="M21 10L5 18 1 36l12 3 3-8v26h32V31l3 8 12-3-4-18-16-8c-1 4-5 7-11 7s-10-3-11-7z"/></svg>',
          terry:
            '<svg viewBox="0 0 64 64"><path fill="currentColor" d="M21 10L5 18 1 36l12 3 3-8v26h32V31l3 8 12-3-4-18-16-8c-1 4-5 7-11 7s-10-3-11-7z"/><path fill="none" stroke="#fff" stroke-width="1.6" d="M16 51h32M16 54h32"/></svg>',
          hoodie:
            '<svg viewBox="0 0 64 64"><path fill="currentColor" d="M23 7c0 6 4 10 9 10s9-4 9-10l9 5 12 19-9 6-4-6v25H15V31l-4 6-9-6 12-19z"/></svg>',
        };
        var PAL = [
            ["#ffffff", "White"],
            ["#111111", "Black"],
            ["#ff2a3d", "Red"],
            ["#f2b705", "Golden"],
            ["#fff200", "Neon yellow"],
            ["#ff2d95", "Hot pink"],
            ["#ff7a00", "Orange"],
            ["#39ff14", "Neon green"],
            ["#1f6bff", "Electric blue"],
            ["#3ac8ff", "Sky blue"],
            ["#8b3dff", "Purple"],
            ["#c9ccd1", "Silver"],
          ],
          _co = colOf;
        colOf = function (t) {
          return t && t.hex ? t.hex : _co(t);
        };
        var SELK =
          null; /* 't' = name selected, 'i' = design selected, null = nothing selected */
        function nsBox(x, e) {
          var wh = SHIRT === "white",
            bx = e.x0 - 7,
            by = e.y0 - 7,
            bw = e.x1 - e.x0 + 14,
            bh = e.y1 - e.y0 + 14;
          x.save();
          var rot = +e.rot || 0,
            ra = (rot * Math.PI) / 180,
            rcx = (e.x0 + e.x1) / 2,
            rcy = (e.y0 + e.y1) / 2,
            tl = null;
          if (rot) {
            x.translate(rcx, rcy);
            x.rotate(ra);
            x.translate(-rcx, -rcy);
          }
          x.fillStyle = wh ? "rgba(225,29,46,.07)" : "rgba(255,255,255,.08)";
          x.fillRect(bx, by, bw, bh);
          x.setLineDash([7, 5]);
          x.lineWidth = 2.4;
          x.strokeStyle = wh ? "rgba(0,0,0,.9)" : "rgba(255,255,255,.95)";
          x.strokeRect(bx, by, bw, bh);
          x.setLineDash([]);
          x.fillStyle = "#ff4a5a";
          x.strokeStyle = "#fff";
          x.lineWidth = 1.5;
          [
            [bx, by],
            [bx + bw, by],
            [bx, by + bh],
            [bx + bw, by + bh],
          ].forEach(function (c, n) {
            if (n === 3 || n === 0) return; /* the 4th corner becomes the resize handle, the 1st the tilt handle */
            x.beginPath();
            x.arc(c[0], c[1], 6, 0, 6.283);
            x.fill();
            x.stroke();
          });
          (function () {
            /* TILT handle: round icon on the top-left corner. Hold + drag it to turn the name / design. */
            var cvs = x.canvas,
              rr = cvs.getBoundingClientRect(),
              k = rr.width ? cvs.width / rr.width : 1,
              touch = !RZFINE(),
              s = Math.max(0.4, Math.min(1.3, Math.min(bw, bh) / k / 70)),
              hr = (touch ? 17 : 15) * k * s,
              f = hr / 15,
              cs = Math.cos(ra),
              sn = Math.sin(ra),
              ox = bx - rcx,
              oy = by - rcy,
              rx = rcx + ox * cs - oy * sn,
              ry = rcy + ox * sn + oy * cs;
            cvs._rb = {
              x: rx,
              y: ry,
              r: Math.max(hr + (touch ? 14 * k : 8 * k) * s, (touch ? 24 : 16) * k),
              cx: rcx,
              cy: rcy,
              k: e.k,
            };
            tl = { x: rx, y: ry, k: k, hr: hr, dx: rx - rcx, dy: ry - rcy };
            x.save();
            x.translate(bx, by);
            x.scale(f, f);
            x.shadowColor = "rgba(0,0,0,.45)";
            x.shadowBlur = 8;
            x.fillStyle = "#ffffff";
            x.strokeStyle = "#e11d2e";
            x.lineWidth = 2.5;
            x.beginPath();
            x.arc(0, 0, 15, 0, 6.283);
            x.fill();
            x.shadowBlur = 0;
            x.stroke();
            x.lineWidth = 2.2;
            x.lineCap = "round";
            x.beginPath();
            x.arc(0, 0, 6.5, -2.8, 1.6);
            x.stroke();
            x.fillStyle = "#e11d2e";
            var ea = 1.6,
              ex = 6.5 * Math.cos(ea),
              ey = 6.5 * Math.sin(ea),
              ux = -Math.sin(ea),
              uy = Math.cos(ea),
              vx = Math.cos(ea),
              vy = Math.sin(ea);
            x.beginPath();
            x.moveTo(ex + ux * 5, ey + uy * 5);
            x.lineTo(ex + vx * 4.2, ey + vy * 4.2);
            x.lineTo(ex - vx * 4.2, ey - vy * 4.2);
            x.closePath();
            x.fill();
            x.restore();
          })();
          (function () {
            var cvs = x.canvas,
              rr = cvs.getBoundingClientRect(),
              k = rr.width ? cvs.width / rr.width : 1,
              touch = !RZFINE(),
              /* handle shrinks together with the picture / text box (never below 50%) */
              s = Math.max(0.4, Math.min(1.3, Math.min(bw, bh) / k / 70)),
              hr = (touch ? 17 : 15) * k * s,
              f = hr / 15,
              hx = bx + bw,
              hy = by + bh;
            cvs._hb = {
              x: rcx + (hx - rcx) * Math.cos(ra) - (hy - rcy) * Math.sin(ra),
              y: rcy + (hx - rcx) * Math.sin(ra) + (hy - rcy) * Math.cos(ra),
              r: Math.max(hr + (touch ? 14 * k : 8 * k) * s, (touch ? 24 : 16) * k),
              cx: (e.x0 + e.x1) / 2,
              cy: (e.y0 + e.y1) / 2,
              k: e.k,
            };
            x.translate(hx, hy);
            x.scale(f, f);
            x.shadowColor = "rgba(0,0,0,.45)";
            x.shadowBlur = 8;
            x.fillStyle = "#ffffff";
            x.strokeStyle = "#e11d2e";
            x.lineWidth = 2.5;
            x.beginPath();
            x.arc(0, 0, 15, 0, 6.283);
            x.fill();
            x.shadowBlur = 0;
            x.stroke();
            x.fillStyle = "#e11d2e";
            x.lineWidth = 2.2;
            x.lineCap = "round";
            x.beginPath();
            x.moveTo(-6, -6);
            x.lineTo(6, 6);
            x.stroke();
            x.beginPath();
            x.moveTo(-7, -7);
            x.lineTo(-1, -7);
            x.lineTo(-7, -1);
            x.closePath();
            x.fill();
            x.beginPath();
            x.moveTo(7, 7);
            x.lineTo(1, 7);
            x.lineTo(7, 1);
            x.closePath();
            x.fill();
          })();
          x.restore();
          var TT = window.__nsTilt;
          if (tl && TT && TT.k === e.k && TT.cv === x.canvas) {
            /* while tilting: small badge with the angle, next to the tilt handle */
            var lb = Math.round(rot) + "\u00B0",
              kk = tl.k,
              dl = Math.hypot(tl.dx, tl.dy) || 1,
              lx = tl.x + (tl.dx / dl) * (tl.hr + 26 * kk),
              ly = tl.y + (tl.dy / dl) * (tl.hr + 26 * kk),
              lh = 26 * kk,
              lw;
            x.save();
            x.font = "700 " + Math.round(15 * kk) + "px Helvetica,Arial,sans-serif";
            x.textAlign = "center";
            x.textBaseline = "middle";
            lw = x.measureText(lb).width + 18 * kk;
            lx = Math.max(lw / 2 + 4, Math.min(x.canvas.width - lw / 2 - 4, lx));
            ly = Math.max(lh / 2 + 4, Math.min(x.canvas.height - lh / 2 - 4, ly));
            x.fillStyle = "rgba(17,17,17,.9)";
            x.beginPath();
            if (x.roundRect) x.roundRect(lx - lw / 2, ly - lh / 2, lw, lh, lh / 2);
            else x.rect(lx - lw / 2, ly - lh / 2, lw, lh);
            x.fill();
            x.fillStyle = "#ffffff";
            x.fillText(lb, lx, ly + 1);
            x.restore();
          }
        }
        function RZFINE() {
          return (
            window.matchMedia &&
            matchMedia("(pointer:fine)").matches &&
            !matchMedia("(max-width:760px)").matches
          );
        }
        /* Instant Design: 16 styles (English). Style 1 = Anton, Styles 2-10 = new, Styles 11-16 = the older Bebas Neue ... Abril Fatface */
        var IFONTS = [FSI0.en[0]].concat(
            [
              ["Permanent Marker", 400],
              ["Bangers", 400],
              ["Pirata One", 400, 1.4],
              ["Pacifico", 400, 1.6],
              ["Black Ops One", 400],
              ["Luckiest Guy", 400, 1.25],
              ["Bowlby One", 400],
              ["Rubik Glitch", 400, 1.25],
              ["Press Start 2P", 400, 1.3],
            ],
            FSI0.en.slice(1, 7),
          ),
          FSI = Object.assign({}, FSI0, { en: IFONTS });
        /* Instant Studio (English) style 12 only: Blow Brush (embedded font, see #blowbrush-font-css) */
        IFONTS[11] = ["Blow Brush", 400];
        /* ===== Signature (Instant Studio only): 4 signature fonts sit at the END of every language list ===== */
        var SIGF = [
            ["Kolker Brush", 400, 1.8, 1],
            ["Hurricane", 400, 2.0, 1.5],
            ["Passions Conflict", 400, 2.0, 1.45],
            ["Comforter Brush", 400, 1.8, 1.15],
          ],
          NSIG = SIGF.length;
        Object.keys(FSI).forEach(function (k) {
          FSI[k] = FSI[k].concat(SIGF);
        });
        /* Signature = a separate SECOND text (kind "s"): own text, size, position and tilt; the name is never changed */
        NS.sig = null;
        NS.sigTxt = "";
        NS.ssize = 40;
        NS.spx = 50;
        NS.spy = 80;
        NS.srot = 0;
        /* Colour: the palette changes the MAIN text only, unless the signature is the selected item.
           The signature keeps its own colour (default: light on a dark shirt, dark on a white shirt). */
        NS.scol = null;
        function sigOn() {
          return NS.sig != null && !!NS.sigTxt;
        }
        function sigCol() {
          return NS.scol || (NS.shirt === "white" ? "#111111" : "#f4f4f0");
        }
        function curCol() {
          return SELK === "s" && sigOn() ? sigCol() : NS.col;
        }
        function setCol(v) {
          if (SELK === "s" && sigOn()) NS.scol = v;
          else NS.col = v;
        }
        function PK(k) {
          return k === "i" ? "i" : k === "s" ? "s" : "t";
        }
        function fidx(L) {
          return EST(L) % (FSI[L].length - NSIG);
        }
        function sigRepaint() {
          var f = NS.sig != null ? SIGF[NS.sig] : null,
            job =
              f && document.fonts && document.fonts.load
                ? document.fonts.load("400 60px \"" + f[0] + "\"", NS.sigTxt || "A").catch(function () {})
                : Promise.resolve();
          VC = {};
          syncCtl();
          paint();
          job.then(function () {
            VC = {};
            paint();
          });
        }
        /* Texture (Instant Studio only): 0 = none, 1-5 = texture on the main text (never on the signature) */
        NS.tex = 0;
        window.__nsTex = {
          cur: function () {
            return NS.tex || 0;
          },
          set: function (i) {
            NS.tex = i | 0;
            paint();
          },
        };
        /* Colour picker bridge: sets the main text colour only (never the signature) */
        window.__nsCol = {
          set: function (v) {
            NS.col = v;
            var cq = document.getElementById("nsCust");
            if (cq) cq.hidden = true;
            syncCtl();
            paint();
          },
        };
        window.__nsSig = {
          fonts: SIGF,
          cur: function () {
            return NS.sig;
          },
          text: function () {
            return NS.sigTxt || "";
          },
          name: function () {
            return NS.name;
          },
          apply: function (txt, i) {
            NS.sigTxt = txt;
            NS.sig = i;
            sigRepaint();
          },
          clear: function () {
            NS.sig = null;
            NS.sigTxt = "";
            sigRepaint();
          },
        };
        function lv(p) {
          var l = p.lang && FONT_SETS[p.lang] ? p.lang : "en";
          return l;
        }
        /* default style: Style 4 for every language (until the customer taps a Style button) */
        function EST(L) {
          return NS.ss ? NS.style : 3;
        }
        function variants() {
          var out = [],
            seen = {};
          if (!NS.cat) return out;
          Object.keys(LANGS).forEach(function (l) {
            var p = P.filter(function (x) {
              return (x.cat || "tee") === NS.cat && lv(x) === l;
            })[0];
            if (p && !seen[l]) {
              seen[l] = 1;
              out.push(p);
            }
          });
          return out;
        }
        function withV(p, fn) {
          var o = {
              S: S,
              T: T,
              I: I,
              LANG: LANG,
              FONTS: FONTS,
              SHIRT: SHIRT,
              TC: TC,
              WC: WC,
            },
            L = lv(p),
            raw = NS.name.trim();
          VC[L] = VC[L] || { tc: {}, wc: {} };
          S = {
            size: NS.size,
            pid: p.id,
            cat: p.cat || "tee",
            inst: true /* marks the Instant Studio view */,
            base: p.img,
            pname: p.name || "",
            pcolor: p.colour || "",
            price: +p.price || PRICE,
            mrp: baseOf(p),
            bimg: NS.dimg,
            img: null,
          };
          LANG = L;
          FONTS = FSI[L];
          SHIRT = NS.shc[p.id] || NS.shirt;
          TC = VC[L].tc;
          WC = VC[L].wc;
          T = [
            {
              o: NS.o || 0,
              cv: NS.cv || 0,
              raw: raw,
              txt: xlit(raw, L),
              font: fidx(L),
              tc: 0,
              hex: NS.col,
              bw: NS.bw,
              bc: NS.bc,
              size: NS.tsize,
              px: NS.tpx,
              py: NS.tpy,
              front: NS.front !== false,
              rot: NS.trot || 0,
              tex: NS.tex || 0,
            },
          ];
          if (NS.sig != null && NS.sigTxt)
            T.push({
              sig: true,
              o: 0,
              cv: 0,
              raw: NS.sigTxt,
              txt: NS.sigTxt,
              font: FSI[L].length - NSIG + NS.sig,
              tc: 0,
              hex: sigCol(),
              bw: 0,
              bc: "b",
              size: NS.ssize,
              px: NS.spx,
              py: NS.spy,
              front: true,
              rot: NS.srot || 0,
            });
          I = { size: NS.isize, px: NS.ipx, py: NS.ipy, rot: NS.irot || 0 };
          try {
            return fn();
          } finally {
            /* the drawing code empties TC / WC by swapping in a new object when they get full; keep that new object,
               otherwise the old full one is used again and nothing new is ever remembered (every frame rebuilt) */
            VC[L].tc = TC;
            VC[L].wc = WC;
            S = o.S;
            T = o.T;
            I = o.I;
            LANG = o.LANG;
            FONTS = o.FONTS;
            SHIRT = o.SHIRT;
            TC = o.TC;
            WC = o.WC;
          }
        }
        function fonts() {
          /* make sure each language's first font is ready, then repaint */
          var jobs = variants().map(function (p) {
            var L = lv(p),
              f = FSI[L][fidx(L)],
              t =
                withV(p, function () {
                  return T[0].txt;
                }) || SAMPLES[L];
            try {
              loadScriptFonts(L);
            } catch (e) {}
            return document.fonts && document.fonts.load
              ? document.fonts
                  .load(f[1] + ' 60px "' + f[0] + '"', t || SAMPLES[L])
                  .catch(function () {})
                  .then(function () {
                    VC[L] = { tc: {}, wc: {} };
                  })
              : Promise.resolve();
          });
          return Promise.all(jobs);
        }
        /* hint: after the design + garment are chosen, Style 2 glows (2s wait, 2s glow, 1s off, 2s glow) so people notice the styles */
        var SHT = [],
          SHD = false;
        function shBtn() {
          return document.querySelector('#nsStyles [data-st="1"]');
        }
        function shGlow(on) {
          var b = shBtn();
          if (b) b.classList.toggle("glow", on);
        }
        function shClear() {
          SHT.forEach(clearTimeout);
          SHT = [];
          shGlow(false);
        }
        function shRun() {
          shClear();
          if (SHD) return;
          SHT.push(
            setTimeout(function () {
              shGlow(true);
            }, 2000),
            setTimeout(function () {
              shGlow(false);
            }, 4000),
            setTimeout(function () {
              shGlow(true);
            }, 5000),
            setTimeout(function () {
              shGlow(false);
            }, 7000),
          );
        }
        (function () {
          var nm = document.getElementById("nmS");
          if (!nm || !window.MutationObserver) return;
          new MutationObserver(function () {
            if (!nm.hidden) {
              if (!nm._sh) {
                nm._sh = 1;
                shRun();
              }
            } else {
              nm._sh = 0;
              shClear();
            }
          }).observe(nm, { attributes: true, attributeFilter: ["hidden"] });
          if (!nm.hidden) {
            nm._sh = 1;
            shRun();
          }
        })();
        var PO = null; /* while resizing: only this canvas is redrawn (others catch up on release) */
        var LVSRC = null,
          LVN = 0; /* live-resize bookkeeping (Instant Studio only) */
        var CVLIVE = false, /* Instant Studio Curve slider is being moved: light preview on ONE shirt */
          CVPO = false,
          CVT = 0;
        function curvePick() {
          var best = null, ba = -1, vh = window.innerHeight || 800, vw = window.innerWidth || 400;
          PVC.forEach(function (e) {
            var r = e.cv.getBoundingClientRect(),
              a = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) * Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
            if (a > ba) { ba = a; best = e.cv; }
          });
          return best;
        }
        function curveEnd() {
          CVT = 0;
          CVLIVE = false;
          if (CVPO) { CVPO = false; PO = null; }
          paint(); /* now every shirt gets the crisp curve */
        }
        function paint() {
          if (RQ) return;
          RQ = requestAnimationFrame(function () {
            RQ = 0;
            /* live resize (pinch / corner handle): smooth scaled preview; the crisp full render happens when the finger / mouse is released */
            var src = (G && (G.m === "p" || G.m === "r") && G) || FG || RZ || null;
            if (src !== LVSRC) {
              LVSRC = src;
              LVN++;
            }
            var live = src ? { k: src.k, size0: src.s0, n: LVN } : null,
              capDone = false;
            PVC.forEach(function (e) {
              if (PO && e.cv !== PO) return;
              window.__nsLive = live;
              window.__nsCurveLive = CVLIVE;
              window.__nsFast = true;
              try {
                withV(e.p, function () {
                  var r = render(e.cv, false);
                  if (src && !capDone && r && r.order) {
                    var cq = r.order.filter(function (o) {
                      return o.k === src.k;
                    })[0];
                    if (cq && cq.kf < 0.995) {
                      capDone = true;
                      var cs = NS[PK(src.k) + "size"],
                        ce = src.k === "i" ? cs * cq.kf : ((20 + 1.6 * cs) * cq.kf - 20) / 1.6;
                      ce = Math.max(20, ce);
                      if (ce < cs - 0.05) {
                        NS[PK(src.k) + "size"] = ce;
                        src.s0 = ce;
                        if (src.dl) src.d0 = src.dl;
                      }
                    }
                  }
                  if (SELK && r && r.order) {
                    var q = r.order.filter(function (o) {
                      return o.k === SELK;
                    })[0];
                    if (q) nsBox(e.cv.getContext("2d"), q);
                  }
                });
              } finally {
                window.__nsLive = null;
                window.__nsCurveLive = false;
                window.__nsFast = false;
              }
            });
          });
        }
        /* Curve control (name studio): lets the outside "Curve" slider read / change NS.cv and repaint */
        window.__nsCurve = {
          get: function () { return NS.cv || 0; },
          set: function (v) {
            NS.cv = v;
            if (!CVLIVE) {
              CVLIVE = true;
              if (!PO) { var pk = curvePick(); if (pk) { PO = pk; CVPO = true; } }
            }
            clearTimeout(CVT);
            CVT = setTimeout(curveEnd, 220);
            paint();
          },
        };
        /* Layer order (name studio): true = text on top of the picture, false = picture on top */
        window.__nsLayer = {
          overlap: function () {
            try {
              return PVC.some(function (e) {
                var o = withV(e.p, function () {
                  return layout().ov || {};
                });
                return Object.keys(o).length > 0;
              });
            } catch (x) {
              return false;
            }
          },
          get: function () { return NS.front !== false; },
          set: function (v) { NS.front = !!v; paint(); },
        };
        function money2(n) {
          return "\u20B9" + (+n || 0).toLocaleString("en-IN");
        }
        /* ===== Design wheel: spin it sideways like a bike gear; works with hundreds of designs (only ~11 are ever drawn) ===== */
        var W = {
          pos: 0,
          vel: 0,
          raf: 0,
          drag: null,
          moved: false,
          target: null,
          els: [],
          built: false,
          st: null,
        };
        function wL() {
          return window.DSG || [];
        }
        function wWrap() {
          return wL().length >= 7;
        }
        function wRender() {
          var L = wL(),
            N = L.length;
          if (!W.built || !N) return;
          var wrap = N >= 7,
            pos = W.pos;
          if (!wrap) pos = W.pos = Math.max(0, Math.min(N - 1, pos));
          var c = Math.round(pos),
            width = W.st.clientWidth || 320,
            R = Math.min(width * 0.46, 330),
            step = 0.62,
            i,
            j,
            el,
            ix,
            d,
            a,
            cs;
          for (j = -5; j <= 5; j++) {
            el = W.els[j + 5];
            i = c + j;
            ix = wrap ? ((i % N) + N) % N : i;
            if (!wrap && (i < 0 || i >= N)) {
              el.style.display = "none";
              continue;
            }
            d = i - pos;
            a = d * step;
            if (Math.abs(a) > 1.5) {
              el.style.display = "none";
              continue;
            }
            cs = Math.cos(a);
            el.style.display = "block";
            el.style.transform =
              "translateX(" +
              (Math.sin(a) * R).toFixed(1) +
              "px) rotateY(" +
              (-a * 50).toFixed(1) +
              "deg) scale(" +
              (0.5 + 0.5 * cs).toFixed(3) +
              ")";
            el.style.zIndex = Math.round(cs * 100);
            el.style.opacity = (0.3 + 0.7 * cs).toFixed(2);
            if (el._ix !== ix || el._id !== L[ix].id) {
              el._ix = ix;
              el._id = L[ix].id;
              el.dataset.d = L[ix].id;
              el.style.backgroundImage = 'url("' + L[ix].img + '")';
            }
            el.classList.toggle("on", L[ix].id === NS.did);
          }
          var k = ((c % N) + N) % N;
          if (k < 0) k = 0;
          var nm = document.getElementById("dsNm"),
            ct = document.getElementById("dsCt");
          if (nm && L[k]) {
            nm.textContent = L[k].name || "Design";
            ct.textContent = k + 1 + " / " + N;
            var cc = window.dsgCat ? window.dsgCat(L[k]) : "anime",
              cn = window.DSCOUNT || {};
            [].forEach.call(
              document.querySelectorAll("#dsCats .dcb"),
              function (b) {
                b.classList.toggle("on", b.dataset.dc === cc);
                b.disabled = cn[b.dataset.dc] === 0;
              },
            );
          }
        }
        /* pressing a type: that type's designs first, in order, then the next type, and so on */
        document.addEventListener("click", function (e) {
          var b = e.target.closest && e.target.closest("#dsCats .dcb");
          if (!b || b.disabled || !window.dsgOrder) return;
          window.DSMODE = { mode: "group", first: b.dataset.dc };
          window.dsgOrder();
          W.pos = 0;
          W.vel = 0;
          W.target = null;
          wRender();
        });
        function wTick() {
          W.raf = 0;
          if (W.drag) return;
          var wrap = wWrap(),
            N = wL().length;
          if (W.target != null) {
            W.pos += (W.target - W.pos) * 0.18;
            if (Math.abs(W.target - W.pos) < 0.003) {
              W.pos = W.target;
              W.target = null;
            }
          } else if (Math.abs(W.vel) > 0.0012) {
            W.pos += W.vel;
            W.vel *= 0.955;
            if (!wrap && (W.pos < 0 || W.pos > N - 1)) {
              W.vel = 0;
            }
          } else {
            W.vel = 0;
            if (Math.abs(W.pos - Math.round(W.pos)) > 0.003)
              W.target = Math.round(W.pos);
          }
          wRender();
          if (W.target != null || Math.abs(W.vel) > 0.0012)
            W.raf = requestAnimationFrame(wTick);
        }
        function wKick() {
          if (!W.raf) W.raf = requestAnimationFrame(wTick);
        }
        function wGo(ix) {
          var N = wL().length,
            cur = Math.round(W.pos);
          if (wWrap()) {
            var d = (((ix - cur) % N) + N) % N;
            if (d > N / 2) d -= N;
            W.target = cur + d;
          } else W.target = ix;
          W.vel = 0;
          wKick();
        }
        function wBuild() {
          var g = document.getElementById("dsGrid"),
            h = "",
            j;
          g.className = "";
          for (j = 0; j < 11; j++)
            h +=
              '<button type="button" class="ds2" aria-label="Design"></button>';
          g.innerHTML =
            '<div class="dsw" id="dsW">' +
            h +
            '<button type="button" class="wa l" data-w="-1" aria-label="Previous">&#8249;</button><button type="button" class="wa r" data-w="1" aria-label="Next">&#8250;</button></div><div id="dsGest" hidden aria-hidden="true"><div class="dgStage"><i class="dgRing"></i><span class="dgF">\uD83D\uDC46</span></div><div class="dgCap"><span class="c1">Swipe to browse designs</span><span class="c2">Tap one to pick it</span></div></div><div class="dsl"><b id="dsNm"></b> <span class="mut" id="dsCt"></span></div><div class="dcats" id="dsCats"><button type="button" class="dcb" data-dc="faith" style="--ac:#f5c451"><b class="dcf a"></b><b class="dcf b"></b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4c2.5 3 2.5 7 0 10-2.500-3-2.500-7 0-10z"/><path d="M5 9c3 0 6 2 7 5-3 1-6-1-7-5z"/><path d="M19 9c-3 0-6 2-7 5 3 1 6-1 7-5z"/><path d="M4 17c4 3 12 3 16 0"/></svg><span>Faith &amp;<br>Spirituality</span></button><button type="button" class="dcb" data-dc="anime" style="--ac:#ff4d6d"><b class="dcf a"></b><b class="dcf b"></b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6c3 1 15 1 18 0"/><path d="M5 9.500h14"/><path d="M7 9.500V20"/><path d="M17 9.500V20"/><path d="M12 7v2.500"/></svg><span>Anime &amp;<br>Asian Art</span></button><button type="button" class="dcb" data-dc="icons" style="--ac:#b784ff"><b class="dcf a"></b><b class="dcf b"></b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16"/><path d="M5 18 4 8l5 4 3-6 3 6 5-4-1 10"/></svg><span>Icons &amp;<br>Legends</span></button><button type="button" class="dcb" data-dc="street" style="--ac:#3ddcff"><b class="dcf a"></b><b class="dcf b"></b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3 5 14h6l-1 7 8-11h-6z"/></svg><span>Streetwear<br>&amp; Graphics</span></button></div><p class="note2">\u2194 Spin the wheel, tap a design to pick it</p>';
          var st = (W.st = document.getElementById("dsW"));
          W.els = [].slice.call(st.querySelectorAll(".ds2"));
          W.built = true;
          st.addEventListener("pointerdown", function (e) {
            if (e.target.closest(".wa")) return;
            W.drag = {
              x: e.clientX,
              pos0: W.pos,
              lx: e.clientX,
              lt: performance.now(),
              v: 0,
            };
            W.moved = false;
            W.vel = 0;
            W.target = null;
          });
          window.addEventListener("pointermove", function (e) {
            var D = W.drag;
            if (!D) return;
            var dx = e.clientX - D.x;
            if (Math.abs(dx) > 6) W.moved = true;
            if (!W.moved) return;
            var now = performance.now(),
              dt = Math.max(1, now - D.lt);
            D.v = 0.8 * D.v + 0.2 * ((-(e.clientX - D.lx) / 80 / dt) * 16.7);
            D.lx = e.clientX;
            D.lt = now;
            W.pos = D.pos0 - dx / 80;
            wRender();
          });
          function up() {
            var D = W.drag;
            if (!D) return;
            W.drag = null;
            if (W.moved) {
              W.vel = Math.max(-1.6, Math.min(1.6, D.v));
              setTimeout(function () {
                W.moved = false;
              }, 0);
              wKick();
            }
          }
          window.addEventListener("pointerup", up);
          window.addEventListener("pointercancel", up);
          st.addEventListener(
            "click",
            function (e) {
              if (W.moved) {
                e.stopPropagation();
                e.preventDefault();
                return;
              }
              var w = e.target.closest(".wa");
              if (w) {
                wGo(Math.round(W.pos) + +w.dataset.w);
                return;
              }
              var b = e.target.closest(".ds2");
              if (b && b._ix != null) wGo(b._ix);
            },
            true,
          );
          st.addEventListener(
            "wheel",
            function (e) {
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                W.pos += e.deltaX / 120;
                W.vel = 0;
                W.target = null;
                wRender();
                wKick();
              }
            },
            { passive: false },
          );
        }
        function drawDesigns() {
          var g = document.getElementById("dsGrid"),
            L = wL();
          if (!L.length) {
            W.built = false;
            g.className = "";
            g.innerHTML = '<span class="mut">Designs are coming soon.</span>';
            return;
          }
          if (!W.built) wBuild();
          wRender();
        }
        function drawCats() {
          var r = document.getElementById("catRow");
          r.innerHTML = CT.map(function (c) {
            var n = Object.keys(LANGS).filter(function (l) {
              return P.some(function (x) {
                return (x.cat || "tee") === c[0] && lv(x) === l;
              });
            }).length;
            return (
              '<button type="button" class="cb' +
              (c[0] === NS.cat ? " on" : "") +
              '" data-c="' +
              c[0] +
              '"' +
              (n ? "" : " disabled") +
              ">" +
              CI[c[0]] +
              c[1] +
              "<small>" +
              (n ? n + (n > 1 ? " languages" : " language") : "Coming soon") +
              "</small></button>"
            );
          }).join("");
        }
        var SIZES = ["S", "M", "L", "XL", "XXL"];
        function drawStudio() {
          var s = document.getElementById("nmS"),
            V = variants(),
            g = document.getElementById("pvGrid");
          if (!NS.cat || !NS.did || !NS.dimg || !NS.name.trim() || !V.length) {
            s.hidden = true;
            return;
          }
          SELK = null;
          s.hidden = false;
          PVC = [];
          /* the Border control lives inside the chosen shirt card: put it back in the section before the cards are rebuilt, so it is never lost with them */
          var bdp = document.getElementById("nsBd");
          if (bdp && g.contains(bdp))
            s.insertBefore(bdp, s.querySelector(".nsMain"));
          g.innerHTML = "";
          V.forEach(function (p) {
            var d = document.createElement("div");
            d.className = "pv";
            var cv = document.createElement("canvas");
            cv.width = CW;
            cv.height = CH;
            cv.dataset.vid = p.id;
            var t = withV(p, function () {
                return T[0].txt;
              }),
              L = lv(p);
            d.appendChild(cv);
            var zb = document.createElement("div");
            zb.className = "szb";
            zb.textContent = NS.size;
            d.appendChild(zb);
            var b = document.createElement("div");
            b.className = "pt";
            b.innerHTML =
              '<div class="pth"><div class="ptn"><div class="pl">' +
              esc(LANGS[L]) +
              '</div><div class="mut" style="font-size:12px;min-height:16px">' +
              esc(t) +
              '</div></div><div class="bdSlot"></div></div><div class="pzr"><small class="pzl">Size</small><span class="pzs">' +
              SIZES.map(function (z) {
                return (
                  '<button type="button" class="chip' +
                  (z === NS.size ? " on" : "") +
                  '" data-z="' +
                  z +
                  '">' +
                  z +
                  "</button>"
                );
              }).join("") +
              '</span></div><div class="pprow"><div class="pp">' +
              mrpHtml(p) +
              money2(p.price || PRICE) +
              '</div><span class="pcs"><button type="button" class="pcd w" data-pc="white" data-pid="' +
              p.id +
              '" aria-label="White shirt"></button><button type="button" class="pcd k" data-pc="black" data-pid="' +
              p.id +
              '" aria-label="Black shirt"></button></span></div><button type="button" class="btn g" data-add="' +
              p.id +
              '">Add to cart</button><button type="button" class="btn" data-buy="' +
              p.id +
              '">Buy now</button>';
            d.appendChild(b);
            g.appendChild(d);
            PVC.push({ p: p, cv: cv });
          });
          pcSync();
          fonts().then(paint);
          paint();
        }
        function pcSync() {
          [].forEach.call(
            document.querySelectorAll("#pvGrid .pcd"),
            function (b) {
              b.classList.toggle(
                "on",
                (NS.shc[b.dataset.pid] || NS.shirt) === b.dataset.pc,
              );
            },
          );
        }
        function syncCtl() {
          pcSync();
          var s = document.getElementById("nmS");
          [].forEach.call(
            document.querySelectorAll("#pvGrid .szb"),
            function (b) {
              b.textContent = NS.size;
            },
          );
          var bcw = document.getElementById("nsBc");
          if (bcw) {
            bcw.hidden = !NS.bw;
            [].forEach.call(bcw.children, function (b) {
              b.classList.toggle("on", b.dataset.nbc === NS.bc);
            });
          }
          [].forEach.call(s.querySelectorAll("[data-a]"), function (i) {
            i.value = NS[i.dataset.a];
          });
          [].forEach.call(s.querySelectorAll("[data-sh]"), function (b) {
            b.classList.toggle("on", b.dataset.sh === NS.shirt);
          });
          [].forEach.call(s.querySelectorAll("[data-st]"), function (b) {
            b.classList.toggle("on", +b.dataset.st === EST(NS.vl || "en"));
          });
          [].forEach.call(
            document.querySelectorAll("#pvGrid .pzs .chip"),
            function (b) {
              b.classList.toggle("on", b.dataset.z === NS.size);
            },
          );
          [].forEach.call(
            s.querySelectorAll("#nsCols i[data-hx]"),
            function (i) {
              i.classList.toggle("on", i.dataset.hx === curCol());
            },
          );
          [].forEach.call(s.querySelectorAll("#nsDirs [data-no]"), function (b) {
            b.classList.toggle("on", +b.dataset.no === (NS.o || 0));
          });
          var cu = s.querySelector("#nsCols i.cust"),
            isC = COLS.indexOf(curCol()) < 0;
          if (cu) {
            cu.classList.toggle("on", isC);
            cu.style.setProperty("--cc", curCol());
          }
          var lt = s.querySelector("input.lit");
          if (lt)
            lt.style.background =
              "linear-gradient(90deg,#000,hsl(" + NS.ch + ",100%,50%),#fff)";
          [].forEach.call(s.querySelectorAll("[data-h]"), function (i) {
            i.value = NS[i.dataset.h];
          });
          var pv = document.getElementById("nsCpv");
          if (pv) pv.style.background = curCol();
        }
        function steps() {
          var has = !!NS.name.trim();
          document.getElementById("nmD").hidden = !has;
          document.getElementById("nmC").hidden = !(has && NS.did);
        }
        window.nsPickLang = function (vid) {
          var p = variants().filter(function (x) {
            return String(x.id) === String(vid);
          })[0];
          NS.vl = p ? lv(p) : "en";
        };
        window.nameRender = function () {
          var sec = document.getElementById("nameSec");
          if (!sec) return;
          if (
            NS.did &&
            !(window.DSG || []).some(function (d) {
              return d.id === NS.did;
            })
          ) {
            NS.did = null;
            NS.dimg = null;
          }
          drawDesigns();
          drawCats();
          steps();
          if (!NS.cat || !variants().length) {
            NS.cat = null;
            drawCats();
          }
          drawStudio();
          syncCtl();
        };
        /* one-time controls */
        document.getElementById("nsCols").innerHTML =
          COLS.map(function (c, n) {
            return (
              '<i data-hx="' +
              c +
              '" title="' +
              CNAMES[n] +
              '" style="background:' +
              c +
              '"></i>'
            );
          }).join("") +
          '<i class="cust" data-cust="1" title="Custom colour" style="background:' +
          RAINBOW +
          '"></i>';
        document.getElementById("nmIn").oninput = function () {
          NS.name = this.value;
          steps();
          if (!NS.name.trim()) {
            document.getElementById("nmS").hidden = true;
          } else if (NS.cat && NS.did) {
            if (document.getElementById("nmS").hidden) drawStudio();
            else {
              PVC.forEach(function (e, i) {
                var l = document.querySelectorAll("#pvGrid .pv .mut")[i];
                if (l)
                  l.textContent = withV(e.p, function () {
                    return T[0].txt;
                  });
              });
              fonts().then(paint);
              paint();
            }
          }
        };
        var sec = document.getElementById("nameSec");
        sec.addEventListener("click", function (e) {
          var t = e.target.closest("button,i[data-hx],i[data-cust]");
          if (!t) return;
          var d = t.dataset;
          if (d.d) {
            var x = (window.DSG || []).filter(function (q) {
              return q.id === d.d;
            })[0];
            if (!x) return;
            NS.did = x.id;
            NS.dsrc = x.img;
            var im = new Image();
            im.onload = function () {
              NS.dimg = im;
              drawStudio();
              syncCtl();
            };
            im.src = x.img;
            drawDesigns();
            steps();
            setTimeout(function () {
              document
                .getElementById("nmC")
                .scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 80);
          } else if (d.c && t.classList.contains("cb")) {
            NS.cat = d.c;
            drawCats();
            drawStudio();
            syncCtl();
            setTimeout(function () {
              document
                .getElementById("nmS")
                .scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
          } else if (d.st != null) {
            SHD = true;
            shClear();
            NS.ss = true;
            NS.style = +d.st;
            VC = {};
            syncCtl();
            fonts().then(paint);
            paint();
          } else if (d.hx) {
            setCol(d.hx);
            var cq = document.getElementById("nsCust");
            if (cq) cq.hidden = true;
            syncCtl();
            paint();
          } else if (d.cust) {
            var cp = document.getElementById("nsCust");
            cp.hidden = !cp.hidden;
            if (!cp.hidden) {
              setCol(hsl2hex(NS.ch, 100, NS.cl));
              syncCtl();
              paint();
            }
          } else if (d.pc) {
            NS.shc[d.pid] = d.pc;
            VC = {};
            pcSync();
            paint();
          } else if (d.sh) {
            if (d.sh !== NS.shirt) {
              NS.shirt = d.sh;
              if (
                d.sh === "white" &&
                (NS.col === "#ffffff" || NS.col === "#f4f4f0")
              )
                NS.col = "#111111";
              else if (d.sh === "black" && NS.col === "#111111")
                NS.col = "#f4f4f0";
              VC = {};
              syncCtl();
              paint();
            }
          } else if (d.no != null) {
            NS.o = +d.no || 0;
            syncCtl();
            paint();
          } else if (d.nbc) {
            NS.bc = d.nbc;
            syncCtl();
            paint();
          } else if (d.z) {
            NS.size = d.z;
            syncCtl();
          } else if (d.add) nsAdd(d.add, false, t);
          else if (d.buy) nsAdd(d.buy, true, t);
        });
        sec.addEventListener("input", function (e) {
          var ds = e.target.dataset || {};
          if (ds.h) {
            NS[ds.h] = +e.target.value;
            NS.cs = 100;
            setCol(hsl2hex(NS.ch, 100, NS.cl));
            [].forEach.call(sec.querySelectorAll("#nsCols i"), function (i) {
              i.classList.remove("on");
            });
            var cu = sec.querySelector("#nsCols i.cust");
            if (cu) {
              cu.classList.add("on");
              cu.style.setProperty("--cc", curCol());
            }
            var lt = sec.querySelector("input.lit");
            if (lt)
              lt.style.background =
                "linear-gradient(90deg,#000,hsl(" + NS.ch + ",100%,50%),#fff)";
            paint();
            return;
          }
          var k = ds.a;
          if (!k) return;
          var pv0 = NS[k];
          NS[k] = +e.target.value;
          if (k === "bw" && !pv0 && NS.bw) {
            NS.bc = "b";
            tryHint();
          }
          syncCtl();
          paint();
        });
        var TRYT = 0,
          TRYD = false;
        function tryHint() {
          if (TRYD) return;
          var c = document.getElementById("nsCols");
          if (!c) return;
          TRYD = true;
          clearTimeout(TRYT);
          var old = c.querySelector(".tapG");
          if (old) old.remove();
          var g = document.createElement("span");
          g.className = "tapG";
          g.setAttribute("aria-hidden", "true");
          g.textContent = "\uD83D\uDC46";
          c.appendChild(g);
          TRYT = setTimeout(function () {
            g.remove();
            TRYD = false;
          }, 2100);
        }
        /* drag the name / design right on any shirt: moves it on all of them */
        function cpt(cv, ev) {
          var r = cv.getBoundingClientRect();
          return [
            ((ev.clientX - r.left) * CW) / r.width,
            ((ev.clientY - r.top) * CH) / r.height,
          ];
        }
        document
          .getElementById("pvGrid")
          .addEventListener("pointerdown", function (ev) {
            if (ev.pointerType === "touch") return;
            var cv = ev.target.closest("canvas");
            if (!cv) return;
            var e = PVC.filter(function (q) {
              return q.cv === cv;
            })[0];
            if (!e) return;
            var p = cpt(cv, ev);
            var h = withV(e.p, function () {
              return hit(p[0], p[1]);
            });
            if (!h) {
              if (SELK) {
                SELK = null;
                syncCtl();
                paint();
              }
              return;
            }
            SELK = h.k;
            syncCtl();
            paint();
            drag = { e: e, cv: cv, k: h.k, dx: h.cx - p[0], dy: h.ty - p[1] };
            PO = cv;
            try {
              cv.setPointerCapture(ev.pointerId);
            } catch (x) {}
            cv.style.cursor = "grabbing";
            ev.preventDefault();
          });
        document
          .getElementById("pvGrid")
          .addEventListener("pointermove", function (ev) {
            if (!drag || ev.target !== drag.cv) return;
            var p = cpt(drag.cv, ev),
              g = withV(drag.e.p, function () {
                var G0 = GM();
                return { cx: G0.cx, top: G0.top, sx: G0.sx, sy: G0.sy, rt: relaxTop(), st: sigBoxTop(), lt: lowBoxTop(drag.k) };
              }),
              px = Math.max(
                0,
                Math.min(100, (p[0] + drag.dx - g.cx) / g.sx + 50),
              ),
              py = Math.max(drag.k === "i" ? 0 : drag.k === "s" ? (g.st - g.top) / g.sy : -(g.rt || 0) / g.sy, Math.min(g.lt != null ? (g.lt - g.top) / g.sy : 100, (p[1] + drag.dy - g.top) / g.sy));
            NS[PK(drag.k) + "px"] = px;
            NS[PK(drag.k) + "py"] = py;
            syncCtl();
            paint();
            ev.preventDefault();
          });
        /* phones: hold + drag moves the name / design; two fingers pinch to resize. Scrolling still works anywhere you do not touch the name or design. */
        var G = null,
          LK = null,
          TAPD = null,
          grid = document.getElementById("pvGrid");
        function tpt(cv, t) {
          var r = cv.getBoundingClientRect();
          return [
            ((t.clientX - r.left) * CW) / r.width,
            ((t.clientY - r.top) * CH) / r.height,
          ];
        }
        function hitAt(cv, p) {
          var e = PVC.filter(function (q) {
            return q.cv === cv;
          })[0];
          if (!e) return null;
          var h = withV(e.p, function () {
            return hit(p[0], p[1]);
          });
          return h ? { e: e, h: h } : null;
        }
        /* size from finger distance. At the min / max, the gesture is re-anchored so the size answers the finger straight away when it turns back */
        function rzV(src, dd) {
          src.dl = dd;
          var u = (src.s0 * dd) / src.d0;
          if (u > 100) { src.s0 = 100; src.d0 = dd; return 100; }
          if (u < 20) { src.s0 = 20; src.d0 = dd; return 20; }
          return u;
        }
        function dist(ts) {
          return (
            Math.hypot(
              ts[0].clientX - ts[1].clientX,
              ts[0].clientY - ts[1].clientY,
            ) || 1
          );
        }
        grid.addEventListener(
          "touchstart",
          function (ev) {
            var cv = ev.target.closest && ev.target.closest("canvas");
            if (!cv) return;
            var ts = ev.touches;
            if (ts.length === 1) {
              var p = tpt(cv, ts[0]),
                hb = SELK && cv._hb && cv._hb.k === SELK ? cv._hb : null;
              if (hb && Math.hypot(p[0] - hb.x, p[1] - hb.y) <= hb.r) {
                TAPD = null;
                G = {
                  m: "r",
                  cv: cv,
                  k: hb.k,
                  cx: hb.cx,
                  cy: hb.cy,
                  d0: Math.hypot(p[0] - hb.cx, p[1] - hb.cy) || 1,
                  s0: NS[PK(hb.k) + "size"],
                };
                ev.preventDefault();
                return;
              }
              var r = hitAt(cv, p);
              if (!r) {
                G = null;
                TAPD = SELK ? { x: ts[0].clientX, y: ts[0].clientY } : null;
                return;
              }
              SELK = r.h.k;
              paint();
              LK = r.h.k;
              G = {
                m: "d",
                cv: cv,
                e: r.e,
                k: r.h.k,
                dx: r.h.cx - p[0],
                dy: r.h.ty - p[1],
              };
              ev.preventDefault();
            } else if (ts.length >= 2) {
              TAPD = null;
              ev.preventDefault(); /* two fingers on the shirts = resize the name/design, never zoom the page */
              var k = SELK;
              if (!k) {
                var m = hitAt(cv, tpt(cv, ts[0])) || hitAt(cv, tpt(cv, ts[1]));
                k = m ? m.h.k : null;
              }
              if (!k) {
                G = null;
                return;
              }
              SELK = k;
              paint();
              LK = k;
              G = {
                m: "p",
                cv: cv,
                k: k,
                d0: dist(ts),
                s0: NS[PK(k) + "size"],
              };
            }
          },
          { passive: false },
        );
        grid.addEventListener(
          "touchmove",
          function (ev) {
            if (!G) {
              if (ev.touches.length >= 2) ev.preventDefault();
              return;
            }
            ev.preventDefault();
            var ts = ev.touches;
            if (G.m === "r" && ts.length === 1) {
              var q = tpt(G.cv, ts[0]),
                rv = rzV(G, Math.hypot(q[0] - G.cx, q[1] - G.cy) || 1);
              NS[PK(G.k) + "size"] = rv;
              paint();
            } else if (G.m === "p" && ts.length >= 2) {
              var v = rzV(G, dist(ts));
              NS[PK(G.k) + "size"] = v;
              paint();
            } else if (G.m === "d" && ts.length === 1) {
              var p = tpt(G.cv, ts[0]),
                g = withV(G.e.p, function () {
                  var G0 = GM();
                  return { cx: G0.cx, top: G0.top, sx: G0.sx, sy: G0.sy, rt: relaxTop(), st: sigBoxTop(), lt: lowBoxTop(G.k) };
                }),
                px = Math.max(
                  0,
                  Math.min(100, (p[0] + G.dx - g.cx) / g.sx + 50),
                ),
                py = Math.max(G.k === "i" ? 0 : G.k === "s" ? (g.st - g.top) / g.sy : -(g.rt || 0) / g.sy, Math.min(g.lt != null ? (g.lt - g.top) / g.sy : 100, (p[1] + G.dy - g.top) / g.sy));
              NS[PK(G.k) + "px"] = px;
            NS[PK(G.k) + "py"] = py;
              paint();
            }
          },
          { passive: false },
        );
        ["gesturestart", "gesturechange", "gestureend"].forEach(function (n) {
          grid.addEventListener(n, function (e) {
            e.preventDefault();
          });
        });
        function tEnd(ev) {
          if (!G) return;
          if (!ev.touches.length || G.m === "p") G = null;
        }
        grid.addEventListener(
          "touchmove",
          function (ev) {
            if (
              TAPD &&
              ev.touches.length &&
              Math.hypot(
                ev.touches[0].clientX - TAPD.x,
                ev.touches[0].clientY - TAPD.y,
              ) > 10
            )
              TAPD = null;
          },
          { passive: true },
        );
        grid.addEventListener("touchend", function (ev) {
          if (TAPD && !ev.touches.length) {
            TAPD = null;
            if (SELK) {
              SELK = null;
              paint();
            }
          }
        });
        grid.addEventListener("touchend", tEnd);
        grid.addEventListener("touchcancel", function () {
          G = null;
          TAPD = null;
        });
        /* Phone speed (Instant Studio): while a finger is dragging / resizing, redraw ONLY the shirt being touched
           (the laptop already does this). All other shirts catch up once the finger is lifted. */
        grid.addEventListener(
          "touchstart",
          function () {
            if (G && G.cv) PO = G.cv;
          },
          { passive: true },
        );
        function poDone(ev) {
          if (ev && ev.touches && ev.touches.length) return; /* another finger is still down */
          if (!PO) return;
          PO = null;
          paint();
          try { syncCtl(); } catch (x) {}
        }
        grid.addEventListener("touchend", poDone);
        grid.addEventListener("touchcancel", poDone);
        /* Instant Studio: long names (7+ letters) push the round resize handle underneath the Curve / "On top" buttons,
           which used to swallow the touch. If a finger lands on the handle, the handle wins (the button stays untouched). */
        var FG = null;
        document.addEventListener(
          "touchstart",
          function (ev) {
            FG = null;
            if (!SELK || ev.touches.length !== 1) return;
            var t = ev.target;
            if (!t || !t.closest || t.closest("canvas") || !t.closest(".wzDirWrap")) return;
            var ts = ev.touches[0], i, e, cv, hb, r, p;
            for (i = 0; i < PVC.length; i++) {
              e = PVC[i];
              cv = e.cv;
              hb = cv && cv._hb;
              if (!hb || hb.k !== SELK) continue;
              r = cv.getBoundingClientRect();
              if (!r.width || !r.height) continue;
              p = tpt(cv, ts);
              if (Math.hypot(p[0] - hb.x, p[1] - hb.y) <= hb.r) {
                FG = {
                  cv: cv,
                  k: hb.k,
                  cx: hb.cx,
                  cy: hb.cy,
                  d0: Math.hypot(p[0] - hb.cx, p[1] - hb.cy) || 1,
                  s0: NS[PK(hb.k) + "size"],
                };
                G = null;
                TAPD = null;
                PO = cv;
                ev.preventDefault();
                ev.stopPropagation();
                return;
              }
            }
          },
          { capture: true, passive: false },
        );
        document.addEventListener(
          "touchmove",
          function (ev) {
            if (!FG) return;
            ev.preventDefault();
            ev.stopPropagation();
            if (ev.touches.length !== 1) return;
            var q = tpt(FG.cv, ev.touches[0]),
              rv = rzV(FG, Math.hypot(q[0] - FG.cx, q[1] - FG.cy) || 1);
            NS[PK(FG.k) + "size"] = rv;
            paint();
          },
          { capture: true, passive: false },
        );
        function fgEnd(ev) {
          if (!FG) return;
          if (ev.touches && ev.touches.length) return;
          FG = null;
          poDone(ev);
        }
        document.addEventListener("touchend", fgEnd, true);
        document.addEventListener("touchcancel", fgEnd, true);
        /* laptop: drag the round corner handle to resize the selected name / design (like Canva) */
        var RZ = null;
        function rzHandle(cv, ev) {
          if (!SELK || !cv._hb || cv._hb.k !== SELK) return null;
          var p = cpt(cv, ev),
            b = cv._hb;
          return Math.hypot(p[0] - b.x, p[1] - b.y) <= b.r ? b : null;
        }
        var RZT = 0;
        function rzEnd(ev) {
          if (!RZ) return;
          RZ.cv.style.cursor = "grab";
          RZ = null;
          PO = null;
          clearTimeout(RZT);
          RZT = 0;
          syncCtl();
          paint(); /* now redraw every shirt once */
        }
        grid.addEventListener(
          "pointerdown",
          function (ev) {
            if (ev.pointerType === "touch" || ev.button > 0) return; /* touch uses the touch handlers above */
            var cv = ev.target.closest && ev.target.closest("canvas");
            if (!cv) return;
            if (RZ) RZ = null; /* never keep a stale resize alive */
            var b = rzHandle(cv, ev);
            if (!b) return;
            var p = cpt(cv, ev);
            PO = cv;
            RZ = {
              cv: cv,
              k: b.k,
              cx: b.cx,
              cy: b.cy,
              id: ev.pointerId,
              d0: Math.max(24, Math.hypot(p[0] - b.cx, p[1] - b.cy) || 1),
              s0: NS[PK(b.k) + "size"],
            };
            try {
              cv.setPointerCapture(ev.pointerId);
            } catch (x) {}
            drag = null;
            cv.style.cursor = "nwse-resize";
            ev.preventDefault();
            ev.stopPropagation();
          },
          true,
        );
        /* window level: keeps following the mouse even if capture is lost */
        window.addEventListener("pointermove", function (ev) {
          if (RZ) {
            if (ev.pointerId !== RZ.id) return;
            if (ev.pointerType === "mouse" && ev.buttons === 0) { rzEnd(); return; }
            var p = cpt(RZ.cv, ev),
              v = rzV(RZ, Math.hypot(p[0] - RZ.cx, p[1] - RZ.cy) || 1);
            NS[PK(RZ.k) + "size"] = v;
            if (!RZT) RZT = setTimeout(function () { RZT = 0; syncCtl(); }, 120); /* heavy DOM sync, not on every mouse event */
            paint();
            ev.preventDefault();
            return;
          }
          if (drag || ev.pointerType === "touch") return;
          var cv = ev.target.closest && ev.target.closest("#pvGrid canvas");
          if (cv) cv.style.cursor = rzHandle(cv, ev) ? "nwse-resize" : "grab";
        }, { passive: false });
        window.addEventListener("pointerup", rzEnd, true);
        window.addEventListener("pointercancel", rzEnd, true);
        window.addEventListener("blur", rzEnd);
        /* ===== Tilt handle (Instant Studio only): hold the round icon on the top-left corner and drag to turn the selected name / design ===== */
        var RT = null,
          TCUR =
            "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M20 12a8 8 0 1 1-2.6-5.9' fill='none' stroke='%23fff' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M20 12a8 8 0 1 1-2.6-5.9' fill='none' stroke='%23111' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") 12 12, grab";
        function tiltAt(cv, p) {
          var b = SELK && cv._rb && cv._rb.k === SELK ? cv._rb : null;
          return b && Math.hypot(p[0] - b.x, p[1] - b.y) <= b.r ? b : null;
        }
        function tiltStart(cv, b, p, id) {
          RT = {
            cv: cv,
            k: b.k,
            cx: b.cx,
            cy: b.cy,
            a0: Math.atan2(p[1] - b.cy, p[0] - b.cx),
            r0: NS[PK(b.k) + "rot"] || 0,
            id: id,
          };
          window.__nsTilt = { cv: cv, k: b.k };
          TAPD = null;
          drag = null;
          PO = cv; /* only the shirt being turned is redrawn while moving (smooth); the others catch up on release */
          paint();
        }
        function tiltMove(p) {
          if (!RT) return;
          var v = RT.r0 + ((Math.atan2(p[1] - RT.cy, p[0] - RT.cx) - RT.a0) * 180) / Math.PI,
            sn;
          v = ((((v + 180) % 360) + 360) % 360) - 180; /* keep between -180 and 180 degrees */
          sn = Math.round(v / 45) * 45; /* light magnet at 0, 45, 90, 135, 180 */
          if (Math.abs(v - sn) < 3) v = sn;
          if (v === 180) v = -180;
          NS[PK(RT.k) + "rot"] = v;
          paint();
        }
        function tiltEnd() {
          if (!RT) return;
          RT.cv.style.cursor = "grab";
          RT = null;
          window.__nsTilt = null;
          PO = null;
          paint(); /* now redraw every shirt once */
        }
        grid.addEventListener(
          "pointerdown",
          function (ev) {
            if (ev.pointerType === "touch" || ev.button > 0 || RZ || RT) return;
            var cv = ev.target.closest && ev.target.closest("canvas");
            if (!cv) return;
            var p = cpt(cv, ev),
              b = tiltAt(cv, p);
            if (!b) return;
            tiltStart(cv, b, p, ev.pointerId);
            try {
              cv.setPointerCapture(ev.pointerId);
            } catch (x) {}
            cv.style.cursor = TCUR;
            ev.preventDefault();
            ev.stopPropagation();
          },
          true,
        );
        window.addEventListener(
          "pointermove",
          function (ev) {
            if (RT) {
              if (RT.id === "touch" || ev.pointerId !== RT.id) return;
              if (ev.pointerType === "mouse" && ev.buttons === 0) {
                tiltEnd();
                return;
              }
              RT.cv.style.cursor = TCUR;
              tiltMove(cpt(RT.cv, ev));
              ev.preventDefault();
              return;
            }
            if (drag || RZ || ev.pointerType === "touch") return;
            var cv = ev.target.closest && ev.target.closest("#pvGrid canvas");
            if (cv && tiltAt(cv, cpt(cv, ev))) cv.style.cursor = TCUR;
          },
          { passive: false },
        );
        function tiltEndP() {
          if (RT && RT.id !== "touch") tiltEnd();
        }
        window.addEventListener("pointerup", tiltEndP, true);
        window.addEventListener("pointercancel", tiltEndP, true);
        window.addEventListener("blur", tiltEndP);
        grid.addEventListener(
          "touchstart",
          function (ev) {
            if (RT) {
              ev.preventDefault();
              ev.stopPropagation();
              return;
            }
            if (ev.touches.length !== 1) return;
            var cv = ev.target.closest && ev.target.closest("canvas");
            if (!cv) return;
            var p = tpt(cv, ev.touches[0]),
              b = tiltAt(cv, p);
            if (!b) return;
            tiltStart(cv, b, p, "touch");
            ev.preventDefault();
            ev.stopPropagation();
          },
          { capture: true, passive: false },
        );
        grid.addEventListener(
          "touchmove",
          function (ev) {
            if (!RT || RT.id !== "touch") return;
            ev.preventDefault();
            ev.stopPropagation();
            if (ev.touches.length) tiltMove(tpt(RT.cv, ev.touches[0]));
          },
          { capture: true, passive: false },
        );
        function tiltTouchEnd(ev) {
          if (!RT || RT.id !== "touch") return;
          ev.stopPropagation();
          if (!ev.touches.length) tiltEnd();
        }
        grid.addEventListener("touchend", tiltTouchEnd, true);
        grid.addEventListener("touchcancel", tiltTouchEnd, true);
        function endDrag() {
          if (drag) {
            drag.cv.style.cursor = "grab";
            drag = null;
            if (PO) {
              PO = null;
              paint();
            }
          }
        }
        document
          .getElementById("pvGrid")
          .addEventListener("pointerup", endDrag);
        document
          .getElementById("pvGrid")
          .addEventListener("pointercancel", endDrag);
        var DN = null;
        document.addEventListener("pointerdown", function (e) {
          if (!e.isPrimary) {
            if (DN) DN.multi = true;
            return;
          }
          if (!SELK) {
            DN = null;
            return;
          }
          DN =
            e.target.closest && e.target.closest("#pvGrid canvas")
              ? null
              : { x: e.clientX, y: e.clientY, multi: false };
        });
        document.addEventListener("pointerup", function (e) {
          if (!e.isPrimary || !DN) return;
          var d = DN;
          DN = null;
          if (d.multi || G || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10)
            return;
          if (SELK) {
            SELK = null;
            paint();
          }
        });
        /* add to cart / buy now: the item is built exactly like the normal designer builds it */
        async function nsAdd(pid, buy, btn) {
          var p = P.filter(function (q) {
            return q.id === pid;
          })[0];
          if (!p || BUSY) return;
          if (!NS.size) {
            var zw =
              btn && btn.closest
                ? btn.closest(".pv").querySelector(".pzs")
                : null;
            if (zw) {
              zw.classList.remove("blink");
              void zw.offsetWidth;
              zw.classList.add("blink");
              zw.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(function () {
                zw.classList.remove("blink");
              }, 3000);
            }
            toast("Please select your size first");
            return;
          }
          if (!NS.name.trim() || !NS.dimg) {
            toast("Write your name or quote and pick a design first");
            return;
          }
          if (!buy && CART.length >= 8) {
            toast("Cart is full (8 designs). Place an order or remove one.");
            return;
          }
          BUSY = true;
          btn.disabled = true;
          try {
            await fonts();
            var it = withV(p, function () {
              var u = Math.floor(S.price || PRICE);
              return Object.assign(
                {
                  ts: Date.now(),
                  pid: p.id,
                  pname: p.name || "",
                  color: p.colour || "",
                  size: NS.size,
                  qty: 1,
                  unit: u,
                  total: u,
                  preview: previewJpg(),
                  design: printSafe(640000),
                },
                designData(),
              );
            });
            if (buy) {
              window.openCheckout([it], false);
            } else {
              await orderUser();
              await cartRef().doc(rid("c_")).set(it);
              toast("Added to your cart");
            }
          } catch (e) {
            toast("Could not add to cart: " + (e.message || e.code));
          }
          BUSY = false;
          btn.disabled = false;
        }
        if (typeof P !== "undefined" && P.length) window.nameRender();
      })();
    
