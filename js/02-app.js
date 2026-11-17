      /* Collections page: Hoodies / T-Shirts / Oversized T-Shirts as round carousel. Every product (all languages) shows in each category. Auto-slides after 5s of no touch. */
      (function () {
        var IC = {
          hoodie:
            '<svg viewBox="0 0 64 64"><path fill="#161616" d="M23 7c0 6 4 10 9 10s9-4 9-10l9 5 12 19-9 6-4-6v25H15V31l-4 6-9-6 12-19z"/><path fill="none" stroke="#efe6da" stroke-width="1.6" stroke-linecap="round" d="M26 17c1 5 3 8 6 11 3-3 5-6 6-11M21 43h22l2 9H19z"/></svg>',
          terry:
            '<svg viewBox="0 0 64 64"><path fill="#161616" d="M21 10L5 18 1 36l12 3 3-8v26h32V31l3 8 12-3-4-18-16-8c-1 4-5 7-11 7s-10-3-11-7z"/><path fill="none" stroke="#efe6da" stroke-width="1.6" stroke-linecap="round" d="M24 12c1 4 4 6 8 6s7-2 8-6M24 15c1 3 4 5 8 5s7-2 8-5M16 51h32M16 54h32"/></svg>',
          tee: '<svg viewBox="0 0 64 64"><path fill="#161616" d="M22 9L9 15 3 28l11 4 2-4v27h32V28l2 4 11-4-6-13-13-6c-1 5-5 8-10 8s-9-3-10-8z"/></svg>',
          over: '<svg viewBox="0 0 64 64"><path fill="#161616" d="M21 10L5 18 1 36l12 3 3-8v26h32V31l3 8 12-3-4-18-16-8c-1 4-5 7-11 7s-10-3-11-7z"/></svg>',
        };
        var CIMG = {
            tee: "assets/4c5691f83c35.webp",
            over: "assets/1fab45e7db0b.webp",
            terry:
              "assets/bab7fc9402e3.webp",
            hoodie:
              "assets/6b38b487cd39.webp",
          },
          CATS = [
            ["tee", "T-Shirts"],
            ["over", "Oversized T-Shirts"],
            ["terry", "Oversized Terry"],
            ["hoodie", "Hoodies"],
          ],
          cat = "over", /* default category: Oversized T-Shirts */
          cur = 0,
          L = [],
          sig = "",
          tm = null,
          active = false,
          moved = false,
          RM = matchMedia("(prefers-reduced-motion:reduce)").matches,
          tr = $("clTrack"),
          st = $("clStage");
        function nat(l) {
          var m = /\((.+)\)/.exec(LANGS[l] || "");
          return m ? m[1] : LANGS[l] || "English";
        }
        function lst() {
          var o = Object.keys(LANGS),
            q = (window.Qs || Qs || "").toLowerCase();
          return P.filter(function (x) {
            return (
              (x.cat || "tee") === cat &&
              (!q ||
                (x.name + " " + (x.colour || "")).toLowerCase().indexOf(q) >= 0)
            );
          })
            .map(function (x, i) {
              return [x, i];
            })
            .sort(function (a, b) {
              return (
                o.indexOf(a[0].lang || "en") - o.indexOf(b[0].lang || "en") ||
                a[1] - b[1]
              );
            })
            .map(function (a) {
              return a[0];
            });
        }
        function cats() {
          $("clCats").innerHTML = CATS.map(function (c) {
            return (
              '<button class="clCat' +
              (c[0] === cat ? " on" : "") +
              '" data-c="' +
              c[0] +
              '"><i class="ic ph"><img src="' +
              CIMG[c[0]] +
              '" alt=""></i><span>' +
              c[1] +
              "</span></button>"
            );
          }).join("");
        }
        function build(pop) {
          tr.innerHTML = L.map(function (x, i) {
            var im = [x.img].concat(x.imgs || []);
            return (
              '<div class="clItem" data-i="' +
              i +
              '"><div class="clCirc' +
              (im.length > 1 ? " pz" : "") +
              '">' +
              im
                .map(function (u, j) {
                  return (
                    '<img src="' +
                    u +
                    '" alt=""' +
                    (j ? "" : ' class="on"') +
                    ">"
                  );
                })
                .join("") +
              "</div></div>"
            );
          }).join("");
          if (pop)
            [].forEach.call(tr.children, function (el, i) {
              var k = Math.abs(i - cur);
              el.style.setProperty(
                "--dl",
                Math.min(k, 4) * 170 + (i > cur ? 70 : 0) + "ms",
              );
              el.classList.add("pop");
            });
        }
        function place() {
          var N = L.length,
            x = L[cur];
          if (!x) {
            $("clName").textContent =
              window.Qs || Qs ? "No tees match your search" : "Coming soon";
            $("clPrice").textContent = "";
            $("clLang").textContent = "";
            $("clDots").innerHTML = "";
            clearTimeout(tm);
            return;
          }
          [].forEach.call(tr.children, function (el, i) {
            var k = N > 2 ? (((i - cur) % N) + N) % N : i - cur;
            if (N > 2 && k > N / 2) k -= N;
            var a = Math.abs(k);
            el.style.setProperty("--k", k);
            el.style.setProperty("--s", a ? (a > 1 ? 0.72 : 0.86) : 1);
            el.style.opacity = a > 3 ? 0 : 1;
            el.style.pointerEvents = a > 3 ? "none" : "auto";
            el.style.zIndex = 10 - a;
            el.classList.toggle("c", !k);
          });
          var n = $("clName");
          n.textContent = x.name || "";
          n.classList.toggle("nl", /[^\x00-\x7F]/.test(x.name || ""));
          $("clPrice").innerHTML = mrpHtml(x) + "\u20B9" + esc(x.price);
          $("clLang").textContent = nat(x.lang || "en");
          var f = $("clInfo");
          f.classList.remove("in");
          void f.offsetWidth;
          f.classList.add("in");
          $("clWm").style.setProperty("--wx", -cur * 3 + "vw");
          $("clDots").innerHTML =
            N <= 7
              ? L.map(function (_, i) {
                  return "<i" + (i === cur ? ' class="on"' : "") + "></i>";
                }).join("")
              : "<span>" + (cur + 1) + " / " + N + "</span>";
          clearTimeout(tm);
          var r = $("clRing");
          r.classList.remove("run");
          void r.getBoundingClientRect();
          /* the centred product flashes its photos in order, first -> last, one per second; then the carousel slides on by itself */
          clearInterval(window.__clSeq);
          [].forEach.call(tr.querySelectorAll(".pz"), function (z) {
            delete z.dataset.seq;
          });
          var fg = r.querySelector(".fg");
          if (fg) fg.style.animationDuration = "";
          if (active && N > 1 && !RM) {
            var cz = tr.children[cur] && tr.children[cur].querySelector(".pz"),
              ci = cz ? cz.querySelectorAll("img") : [],
              dur = ci.length > 1 ? ci.length * 1000 : 5000;
            if (ci.length > 1) {
              var t0 = Date.now(),
                kk = -1;
              cz.dataset.seq = "1"; /* this one is driven here, not by the shared 1-second timer below */
              window.__clSeq = setInterval(function () {
                var k = Math.min(ci.length - 1, Math.floor((Date.now() - t0) / 1000)),
                  j;
                if (k === kk) return;
                kk = k;
                for (j = 0; j < ci.length; j++) ci[j].classList.toggle("on", j === k);
              }, 100);
              for (var j0 = 0; j0 < ci.length; j0++) ci[j0].classList.toggle("on", j0 === 0); /* always starts on the FIRST photo */
              kk = 0;
            }
            if (fg) fg.style.animationDuration = dur + "ms"; /* the ring counts the same time */
            r.classList.add("run");
            tm = setTimeout(function () {
              go(cur + 1);
            }, dur);
          }
        }
        function go(i) {
          var N = L.length;
          if (!N) return;
          cur = ((i % N) + N) % N;
          place();
        }
        function fill(pop) {
          L = lst();
          sig = L.map(function (x) {
            return x.id + (x.img || "").length + (x.imgs || []).length;
          }).join();
          if (cur >= L.length) cur = 0;
          build(pop);
          place();
        }
        window.colView = function (a) {
          var was = active;
          active = a;
          if (a && !was) {
            cats();
            fill(true);
          } else if (!a) {
            clearTimeout(tm);
            clearInterval(window.__clSeq);
          }
        };
        window.colSearch = function () {
          if (!active) return;
          cur = 0;
          fill(true);
        };
        window.colRender = function () {
          if (!active) return;
          var o = sig;
          L = lst();
          var n = L.map(function (x) {
            return x.id + (x.img || "").length + (x.imgs || []).length;
          }).join();
          if (n !== o) fill(false);
        };
        $("clCats").onclick = function (e) {
          var b = e.target.closest("[data-c]");
          if (!b) return;
          cat = b.dataset.c;
          cur = 0;
          cats();
          fill(true);
        };
        $("clCats").addEventListener("click", function (e) {
          if (e.target.closest("[data-c]")) this.classList.remove("hint");
        });
        $("clPrev").onclick = function () {
          go(cur - 1);
        };
        $("clNext").onclick = function () {
          go(cur + 1);
        };
        var sx = 0,
          dx = 0,
          dn = false;
        st.addEventListener("pointerdown", function (e) {
          if (e.target.closest(".clArr")) return;
          dn = true;
          sx = e.clientX;
          dx = 0;
          moved = false;
          tr.classList.add("drag");
        });
        window.addEventListener("pointermove", function (e) {
          if (!dn) return;
          dx = e.clientX - sx;
          if (Math.abs(dx) > 8) moved = true;
          tr.style.setProperty("--dx", dx + "px");
        });
        function up() {
          if (!dn) return;
          dn = false;
          tr.classList.remove("drag");
          tr.style.setProperty("--dx", "0px");
          if (dx < -45) go(cur + 1);
          else if (dx > 45) go(cur - 1);
          else place();
        }
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        st.addEventListener("click", function (e) {
          if (moved) return;
          var it = e.target.closest(".clItem");
          if (!it) return;
          var i = +it.dataset.i;
          if (i === cur) {
            /* NEW: ask Instant Design or Design Studio first (popup script near the end of the page) */
            if (window.__openModePick) {
              window.__openModePick(L[i]);
              return;
            }
            var id = L[i].id;
            pickP(id);
            location.hash = "#product/" + id;
          } else go(i);
        });
        /* hero gallery: swipe left/right on phones */
        var h = $("hero"),
          hx = null,
          hy = 0;
        h.addEventListener(
          "touchstart",
          function (e) {
            var t = e.touches[0];
            hx = t.clientX;
            hy = t.clientY;
          },
          { passive: true },
        );
        h.addEventListener(
          "touchend",
          function (e) {
            if (hx === null) return;
            var t = e.changedTouches[0],
              a = t.clientX - hx,
              b = t.clientY - hy;
            hx = null;
            if (Math.abs(a) > 45 && Math.abs(a) > Math.abs(b) * 1.3) {
              window.go &&
                (function () {
                  window.go(window.cur + (a < 0 ? 1 : -1));
                  window.auto();
                })();
            }
          },
          { passive: true },
        );
        if (VIEW === "home" && P.length) window.colView(true);
      })();
    
