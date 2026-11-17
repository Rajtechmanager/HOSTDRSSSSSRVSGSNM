      (function () {
        var dk = document.createElement("div");
        dk.id = "sdock";
        dk.setAttribute("role", "toolbar");
        dk.setAttribute("aria-label", "Style tools");
        document.body.appendChild(dk);
        var dl = document.createElement("div");
        dl.id = "sdockL";
        dl.setAttribute("role", "toolbar");
        dl.setAttribute("aria-label", "Choose text");
        document.body.appendChild(dl);
        var lastL = "";
        var SEC = [
            ["font", "Font"],
            ["col", "Color"],
            ["dir", "Direction"],
          ],
          last = "";
        function active() {
          var cs = document.getElementById("customSec");
          return !!(
            cs &&
            !cs.hidden &&
            C &&
            C.dataset.tab === "style" &&
            T.length
          );
        }
        function pos() {
          var ctl = document.getElementById("ctl"),
            ac = document.querySelector("#customSec .acts");
          if (!ctl) return;
          var r = ctl.getBoundingClientRect(),
            ar = ac && ac.offsetHeight ? ac.getBoundingClientRect() : null,
            top = Math.max(0, r.top) + 8,
            bot = (ar ? ar.top : window.innerHeight) - 8;
          [dk, dl].forEach(function (d) {
            d.style.top = top + "px";
            d.style.maxHeight = Math.max(120, bot - top) + "px";
          });
        }
        function upd() {
          var on = active();
          dk.classList.toggle("show", on);
          dl.classList.toggle("show", on);
          if (!on) return;
          var ti = tIdx(),
            h =
              '<div class="sdl">Edit</div>' +
              SEC.map(function (f) {
                return (
                  '<button type="button" class="sdb' +
                  (STYSEC === f[0] ? " on" : "") +
                  '" data-sds="' +
                  f[0] +
                  '" aria-pressed="' +
                  (STYSEC === f[0]) +
                  '">' +
                  (FBI[f[0]] || "") +
                  "<span>" +
                  f[1] +
                  "</span></button>"
                );
              }).join(""),
            hl = T.map(function (t, i) {
              return (
                '<button type="button" class="sdb' +
                (ti === i ? " on" : "") +
                '" data-sdt="' +
                i +
                '" aria-pressed="' +
                (ti === i) +
                '"><i class="dot" style="background:' +
                colOf(t) +
                '"></i><span>Text ' +
                (i + 1) +
                "</span></button>"
              );
            }).join("");
          if (h !== last) {
            dk.innerHTML = h;
            last = h;
          }
          if (hl !== lastL) {
            dl.innerHTML = hl;
            lastL = hl;
          }
          pos();
        }
        function onDock(e) {
          var b = e.target.closest && e.target.closest("[data-sds]");
          if (b) {
            var f = document.querySelector(
              '#editor .fb[data-fs="' + b.dataset.sds + '"]',
            );
            if (f) f.click();
            else STYSEC = b.dataset.sds;
            var c = document.getElementById("ctl");
            if (c) c.scrollTop = 0;
            upd();
            return;
          }
          b = e.target.closest && e.target.closest("[data-sdt]");
          if (b) {
            var l = document.querySelector(
              '#layers [data-l="' + b.dataset.sdt + '"]',
            );
            if (l) l.click();
            setTimeout(upd, 0);
          }
        }
        dk.addEventListener("click", onDock);
        dl.addEventListener("click", onDock);
        /* keep the dock in sync whenever the texts, selection or colours change */
        ["chips", "editor"].forEach(function (n) {
          var o = window[n];
          if (typeof o !== "function") return;
          window[n] = function () {
            var r = o.apply(this, arguments);
            upd();
            return r;
          };
        });
        document
          .getElementById("editor")
          .addEventListener("click", function () {
            setTimeout(upd, 0);
          });
        document
          .getElementById("editor")
          .addEventListener("input", function () {
            setTimeout(upd, 0);
          });
        if (C)
          new MutationObserver(upd).observe(C, {
            attributes: true,
            attributeFilter: ["data-tab"],
          });
        var cs = document.getElementById("customSec");
        if (cs)
          new MutationObserver(upd).observe(cs, {
            attributes: true,
            attributeFilter: ["hidden"],
          });
        window.addEventListener("resize", pos);
        window.addEventListener("scroll", pos, { passive: true });
        if (window.visualViewport)
          visualViewport.addEventListener("resize", pos);
        setInterval(function () {
          if (dk.classList.contains("show")) pos();
          else upd();
        }, 700);
        upd();
      })();
    
