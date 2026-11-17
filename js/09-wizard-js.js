      (function () {
        var sec = document.getElementById("nameSec"),
          inp = document.getElementById("nmIn"),
          grid = document.getElementById("pvGrid");
        if (!sec || !inp || !grid) return;
        var st = "name",
          selPid = null,
          h3 = sec.querySelector("#nmS>h3");
        var LBL = {
          design: "Pick a design",
          cat: "What do you want?",
          langs: "Choose a language",
          detail: "Customise your shirt",
        };
        var PREV = {
          design: "name",
          cat: "design",
          langs: "cat",
          detail: "langs",
        };
        var bar = document.createElement("div");
        bar.id = "wzBar";
        bar.innerHTML =
          '<button type="button" id="wzBack">\u2039 Back</button><span id="wzLbl"></span>';
        sec.insertBefore(bar, sec.firstChild);
        var go = document.createElement("button");
        go.type = "button";
        go.id = "wzGo";
        go.className = "btn";
        go.hidden = true;
        go.textContent = "Continue \u2192";
        inp.insertAdjacentElement("afterend", go);
        var hint = document.createElement("p");
        hint.id = "wzHint";
        hint.textContent =
          "Tap a language to style it. Both white and black shirts are available on each.";
        grid.parentNode.insertBefore(hint, grid);
        function applySel() {
          [].forEach.call(grid.querySelectorAll(".pv"), function (pv) {
            var c = pv.querySelector("canvas");
            pv.classList.toggle("sel", !!c && c.dataset.vid === selPid);
          });
        }
        window.__idLandY = function () {
          var hd = document.querySelector("header"), off = 0;
          try { if (hd && /sticky|fixed/.test(getComputedStyle(hd).position)) off = hd.offsetHeight; } catch (e) {}
          return bar.getBoundingClientRect().top + window.pageYOffset - off - 8;
        };
        function set(s) {
          st = s;
          sec.dataset.wz = s;
          if (s === "detail" && h3 && h3.parentNode) {
            /* last page: title first, then the Back button, then colours | shirt | styles */
            if (bar.previousElementSibling !== h3) h3.insertAdjacentElement("afterend", bar);
          } else if (sec.firstChild !== bar) {
            sec.insertBefore(bar, sec.firstChild);
          }
          document.getElementById("wzLbl").textContent = LBL[s] || "";
          grid.classList.toggle("one", s === "detail");
          if (h3)
            h3.textContent =
              s === "detail"
                ? "Customise your shirt"
                : "Your text in every language";
          if (s === "detail") applySel();
          if (s !== "name" && window.nameRender)
            requestAnimationFrame(function () {
              window.nameRender();
              if (s === "detail") applySel();
            });
          if (s === "langs") {
            /* land with the Back bar at the top, so the heading and all 4 shirts are in view; re-check as the shirts finish drawing */
            var stop = false,
              halt = function () {
                stop = true;
              };
            window.addEventListener("touchstart", halt, {
              once: true,
              passive: true,
            });
            window.addEventListener("wheel", halt, {
              once: true,
              passive: true,
            });
            [0, 60, 400, 900].forEach(function (ms, k) {
              (ms
                ? setTimeout
                : function (f) {
                    f();
                  })(function () {
                if (stop || st !== "langs") return;
                var y =
                  bar.getBoundingClientRect().top + window.pageYOffset - 10;
                window.scrollTo({
                  top: Math.max(0, y),
                  behavior: "auto",
                });
              }, ms);
            });
            return;
          }
          if (s === "detail") {
            /* land with the shirt block (colours | shirt | styles) at the very top of the screen: nothing above it, a little of what is below is fine; re-check as the shirt finishes drawing */
            var stopD = false,
              haltD = function () {
                stopD = true;
              };
            window.addEventListener("touchstart", haltD, {
              once: true,
              passive: true,
            });
            window.addEventListener("wheel", haltD, {
              once: true,
              passive: true,
            });
            [0, 60, 400, 900].forEach(function (ms, k) {
              (ms
                ? setTimeout
                : function (f) {
                    f();
                  })(function () {
                if (stopD || st !== "detail") return;
                var main = h3 || sec.querySelector(".nsMain");
                if (!main) return;
                var hd = document.querySelector("header"),
                  off = 0;
                try {
                  if (hd && /sticky|fixed/.test(getComputedStyle(hd).position))
                    off = hd.offsetHeight;
                } catch (e) {}
                var y =
                  main.getBoundingClientRect().top + window.pageYOffset - off - 8;
                window.scrollTo({
                  top: Math.max(0, y),
                  behavior: "auto",
                });
              }, ms);
            });
            setTimeout(function () {
              window.removeEventListener("touchstart", haltD);
              window.removeEventListener("wheel", haltD);
            }, 1000);
            return;
          }
          (function () {
            if (window.__wzInit) return; /* first load: do not auto-scroll down to the studio */
            var y = sec.getBoundingClientRect().top + window.pageYOffset - 70;
            /* Instant Studio sticker step ("Pick a design"): land straight with the Back bar at the top (no later jump) */
            if (s === "design") y = window.__idLandY();
            window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
          })();
        }
        /* step 1 -> 2: Go / Enter / keyboard Back closes the keyboard, then Continue appears */
        function sync() {
          go.hidden = !inp.value.trim();
        }
        ["input", "keyup", "change", "blur", "focus", "paste"].forEach(
          function (ev) {
            inp.addEventListener(ev, function () {
              setTimeout(sync, 0);
            });
          },
        );
        inp.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.keyCode === 13) {
            setTimeout(function () {
              sync();
              go.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
          }
        });
        setInterval(function () {
          if (st === "name") sync();
        }, 500);
        go.addEventListener("click", function () {
          if (inp.value.trim()) set("design");
        });
        document
          .getElementById("wzBack")
          .addEventListener("click", function () {
            if (PREV[st]) set(PREV[st]);
          });
        /* runs after the studio's own click handler, so the design / category is already stored */
        sec.addEventListener("click", function (e) {
          var t = e.target;
          if (st === "design" && t.closest(".ds2")) {
            setTimeout(function () {
              if (st === "design" && !document.getElementById("nmC").hidden)
                set("cat");
            }, 450);
          } else if (st === "cat") {
            var b = t.closest(".cb");
            if (b && !b.disabled && b.dataset.c)
              setTimeout(function () {
                if (st === "cat") set("langs");
              }, 200);
          } else if (st === "langs") {
            if (t.closest(".pcd")) return;
            var pv = t.closest(".pv"),
              c = pv && pv.querySelector("canvas");
            if (c) {
              selPid = c.dataset.vid;
              try {
                if (window.nsPickLang) window.nsPickLang(selPid);
              } catch (err) {}
              set("detail");
            }
          }
        });
        /* the studio redraws the shirts now and then: keep the chosen one selected */
        if (window.MutationObserver)
          new MutationObserver(function () {
            if (st !== "detail") return;
            applySel();
            if (!grid.querySelector(".pv.sel")) set("langs");
          }).observe(grid, { childList: true });
        window.__wzInit = 1;
        set("name");
        window.__wzInit = 0;
      })();
    
