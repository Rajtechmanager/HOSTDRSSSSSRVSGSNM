      /* ===== Studio "Image" step: choose between OUR design (same wheel as Instant Design) or the customer's OWN upload ===== */
      (function () {
        var F = document.getElementById("picFlow");
        if (!F) return;
        var WANT = null,
          SELID = null,
          TT = 0;
        function flash(msg, ms) {
          var e = document.getElementById("toast");
          if (!e) return;
          clearTimeout(TT);
          e.textContent = msg;
          e.style.display = "block";
          TT = setTimeout(function () {
            e.style.display = "none";
          }, ms || 1000);
        }
        function L() {
          return window.DSG || [];
        }
        function closeFlow() {
          F.hidden = true;
          F.innerHTML = "";
          W.built = false;
          W.st = null;
        }

        /* ---- the wheel (same behaviour as the Instant Design wheel) ---- */
        var W = {
          pos: 0,
          vel: 0,
          raf: 0,
          drag: null,
          moved: false,
          target: null,
          els: [],
          st: null,
          built: false,
        };
        function wRender() {
          if (!W.built || !W.st || !W.st.isConnected) return;
          var l = L(),
            N = l.length;
          if (!N) return;
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
            if (el._ix !== ix || el._id !== l[ix].id) {
              el._ix = ix;
              el._id = l[ix].id;
              el.style.backgroundImage = 'url("' + l[ix].img + '")';
            }
            el.classList.toggle("on", l[ix].id === SELID);
          }
          var k = ((c % N) + N) % N;
          if (k < 0) k = 0;
          var nm = document.getElementById("sdNm"),
            ct = document.getElementById("sdCt");
          if (nm && l[k]) {
            nm.textContent = l[k].name || "Design";
            ct.textContent = k + 1 + " / " + N;
          }
        }
        function wTick() {
          W.raf = 0;
          if (W.drag) return;
          var N = L().length,
            wrap = N >= 7;
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
          var N = L().length,
            cur = Math.round(W.pos);
          if (N >= 7) {
            var d = (((ix - cur) % N) + N) % N;
            if (d > N / 2) d -= N;
            W.target = cur + d;
          } else W.target = ix;
          W.vel = 0;
          wKick();
        }
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
        function wUp() {
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
        window.addEventListener("pointerup", wUp);
        window.addEventListener("pointercancel", wUp);
        window.addEventListener("resize", function () {
          wRender();
        });
        function wBuild(host) {
          var h = "",
            j,
            l = L(),
            k = -1;
          for (j = 0; j < 11; j++)
            h +=
              '<button type="button" class="ds2" aria-label="Design"></button>';
          host.innerHTML =
            '<div class="dsw" id="sdW">' +
            h +
            '<button type="button" class="wa l" data-w="-1" aria-label="Previous">&#8249;</button><button type="button" class="wa r" data-w="1" aria-label="Next">&#8250;</button></div><div class="dsl"><b id="sdNm"></b> <span class="mut" id="sdCt"></span></div><p class="note2">Select a design</p>';
          var st = (W.st = host.querySelector("#sdW"));
          /* 1.5s finger tutorial: swipe the wheel, then tap the print */
          (function () {
            var hd = document.createElement("div");
            hd.className = "sdHand";
            hd.setAttribute("aria-hidden", "true");
            hd.innerHTML = '<i class="sdR"></i><b>\uD83D\uDC46</b>';
            st.appendChild(hd);
            if (matchMedia("(prefers-reduced-motion: reduce)").matches) { hd.remove(); return; }
            setTimeout(function () { if (hd.parentNode) hd.remove(); }, 1600);
          })();
          W.els = [].slice.call(st.querySelectorAll(".ds2"));
          W.built = true;
          W.vel = 0;
          W.target = null;
          W.raf = 0;
          W.drag = null;
          W.moved = false;
          l.forEach(function (d, n) {
            if (d.id === SELID) k = n;
          });
          W.pos = k >= 0 ? k : 0;
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
          st.addEventListener("click", function (e) {
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
            if (b && b._ix != null) {
              wGo(b._ix);
              pick(L()[b._ix]);
            }
          });
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
          wRender();
        }

        /* ---- put a picture on the shirt (same sizing rules as the normal flow, but no page jump while swapping designs) ---- */
        function place(c) {
          var m = Math.min(1, 1600 / Math.max(c.width, c.height)),
            k = 0,
            d,
            t = document.createElement("canvas");
          do {
            t.width = Math.max(1, Math.round(c.width * m));
            t.height = Math.max(1, Math.round(c.height * m));
            var g = t.getContext("2d");
            g.clearRect(0, 0, t.width, t.height);
            g.imageSmoothingQuality = "high";
            g.drawImage(c, 0, 0, t.width, t.height);
            d = t.toDataURL("image/png", 0.92);
            m *= 0.85;
          } while (d.length > 1500000 && k++ < 8);
          var b = new Image();
          b.onload = function () {
            S.bimg = b;
            S.img = d;
            sel = "i";
            chips();
            editor();
            draw();
            if (window._adv) {
              window._adv = false;
              setTimeout(function () {
                closeFlow();
                (function () {
                  var e = document.getElementById("picEd");
                  if (
                    window.showTab &&
                    document.querySelector(".cust").dataset.tab !== "image"
                  )
                    showTab("image");
                  if (e && e.scrollIntoView)
                    e.scrollIntoView({ block: "start", behavior: "smooth" });
                })();
              }, 350);
            }
          };
          b.src = d;
        }
        function pick(x) {
          if (!x) return;
          SELID = x.id;
          wRender();
          window._adv = true;
          var im = new Image();
          im.onload = function () {
            PIC.orig = null;
            PICFIXED = true;
            try {
              var c = document.createElement("canvas");
              c.width = im.naturalWidth || im.width;
              c.height = im.naturalHeight || im.height;
              c.getContext("2d").drawImage(im, 0, 0);
              place(c);
            } catch (err) {
              S.bimg = im;
              S.img = x.img;
              sel = "i";
              chips();
              editor();
              draw();
              window._adv = false;
              setTimeout(function () {
                closeFlow();
                (function () {
                  var e = document.getElementById("picEd");
                  if (
                    window.showTab &&
                    document.querySelector(".cust").dataset.tab !== "image"
                  )
                    showTab("image");
                  if (e && e.scrollIntoView)
                    e.scrollIntoView({ block: "start", behavior: "smooth" });
                })();
              }, 350);
            }
          };
          im.onerror = function () {
            window._adv = false;
            toast("Could not load that design. Try another one.");
          };
          im.src = x.img;
        }

        /* ---- the three little screens ---- */
        function view(v) {
          F.hidden = false;
          F.dataset.v = v;
          W.built = false;
          if (v === "choose") {
            F.innerHTML =
              '<h3>How do you want to add a picture?</h3><div class="pch">' +
              '<button type="button" class="pcb nod" data-a="none"><span class="em">\u270D\uFE0F</span><b>No design</b><small>Continue with text only</small></button>' +
              '<button type="button" class="pcb" data-a="ours"><span class="em">\uD83C\uDFA8</span><b>Use our design</b><small>Pick from our ready-made designs</small></button>' +
              '<button type="button" class="pcb" data-a="own"><span class="em">\uD83D\uDCF7</span><b>Upload your own</b><small>A photo or PNG from your device</small></button></div>' +
              '<button class="lnk" type="button" data-a="close">Cancel</button>';
          } else if (v === "ours") {
            if (!L().length) {
              F.innerHTML =
                '<h3>Our designs</h3><p class="mut">Designs are coming soon.</p><button class="lnk" type="button" data-a="back">\u2039 Back</button>';
              return;
            }
            F.innerHTML =
              '<h3>Pick one of our designs</h3><div id="sdHost"></div><button class="lnk" type="button" data-a="back">\u2039 Back</button> &nbsp; <button class="lnk" type="button" data-a="close">Close</button>';
            wBuild(F.querySelector("#sdHost"));
          } else if (v === "own") {
            F.innerHTML =
              '<h3>Upload your picture</h3><p class="mut">What should we do with the background? Then choose your file.</p>' +
              '<div class="pch2"><button class="btn g" type="button" data-a="keep">Keep background</button><button class="btn" type="button" data-a="rem">Remove background</button></div>' +
              '<p class="pnote">PNG files are placed on the shirt exactly as they are, whichever you pick.</p>' +
              '<button class="lnk" type="button" data-a="back">\u2039 Back</button>';
          }
        }
        F.addEventListener("click", function (e) {
          var b = e.target.closest("[data-a]");
          if (!b || !F.contains(b)) return;
          var a = b.dataset.a;
          if (a === "ours") view("ours");
          else if (a === "own") {
            flash("Please upload a PNG from your device for best result", 1000);
            view("own");
          } else if (a === "keep" || a === "rem") {
            WANT = a;
            document.getElementById("file").click();
          } else if (a === "none") {
            closeFlow();
            (function () {
              var e = document.getElementById("picEd");
              if (
                window.showTab &&
                document.querySelector(".cust").dataset.tab !== "image"
              )
                showTab("image");
              if (e && e.scrollIntoView)
                e.scrollIntoView({ block: "start", behavior: "smooth" });
            })();
          } else if (a === "back") closeFlow();
          else if (a === "close") closeFlow();
        });

        /* hooks used by the main script */
        window.picUpload = function () {
          WANT = null;
          closeFlow();
          flash("Please upload a PNG from your device for best result", 1000);
          document.getElementById("file").click();
        };
        window.picFlowOpen = function (v) {
          WANT = null;
          if (!S.bimg) SELID = null;
          view(v || "choose");
          try {
            F.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } catch (e) {}
        };
        window.picAfterFile = function (f) {
          var png =
            /^image\/png$/i.test(f.type || "") || /\.png$/i.test(f.name || "");
          if (png) {
            /* PNG (Keep background OR Remove background): no shape picker, no background removal.
               The PNG goes straight onto the shirt exactly as it is. */
            PICFIXED = false;
            closeFlow();
            PIC.mode = "keep";
            PIC.mask = "full";
            PIC.zoom = 1;
            PIC.ox = PIC.oy = 0;
            useIt();
            return;
          }
          /* not a PNG: Keep background -> shape picker (oval, square, star...), Remove background -> cut-out */
          PICFIXED = false;
          if (WANT === "rem") {
            closeFlow();
            document.getElementById("picM").hidden = false;
            PIC.mode = "rem";
            doRemove();
            return;
          }
          if (WANT === "keep") {
            closeFlow();
            PIC.mode = "keep";
            openPic("mask");
            return;
          }
          openPic("bg");
        };
        /* designs arrive from the database after load: refresh the wheel if it is open */
        var _nr = window.nameRender;
        if (typeof _nr === "function")
          window.nameRender = function () {
            var r = _nr.apply(this, arguments);
            try {
              if (!F.hidden && F.dataset.v === "ours") view("ours");
            } catch (e) {}
            return r;
          };
      })();
    
