      (function () {
        var ov = document.getElementById("mpOv"),
          sec = document.getElementById("nameSec"),
          prod = null,
          forced = null,
          fresh = false;
        if (!ov || !sec) return;
        var cssDone = false;
        /* copy the existing mode-card styles once, re-scoped to the popup (the page's own rules are not touched) */
        function copyCss() {
          if (cssDone) return;
          cssDone = true;
          var out = "";
          function walk(rules) {
            [].forEach.call(rules, function (r) {
              var t = r.cssText || "";
              if (t.indexOf("#modeSec") < 0) return;
              if (r.selectorText === "#modeSec") {
                for (var i = 0; i < r.style.length; i++) {
                  var p = r.style[i];
                  if (p.indexOf("--") === 0) out += "#mpOv .mpC{" + p + ":" + r.style.getPropertyValue(p) + "}";
                }
                return;
              }
              out += t.replace(/#modeSec/g, "#mpOv .mpC");
            });
          }
          try {
            [].forEach.call(document.styleSheets, function (ss) {
              try { walk(ss.cssRules); } catch (e) {}
            });
          } catch (e) {}
          var st = document.createElement("style");
          st.id = "mode-pick-copy-css";
          st.textContent = out;
          document.head.appendChild(st);
        }
        function fillDemo(slot, sel) {
          var src = document.querySelector("#modeSec " + sel),
            el = document.getElementById(slot);
          el.innerHTML = "";
          if (!src) return;
          var c = src.cloneNode(true);
          c.removeAttribute("data-go");
          c.removeAttribute("role");
          c.removeAttribute("tabindex");
          c.removeAttribute("aria-label");
          el.appendChild(c);
        }
        function open() {
          copyCss();
          [].forEach.call(ov.querySelectorAll(".mpC"), function (m) { m.classList.add("live"); });
          ov.classList.add("on");
          document.documentElement.style.overflow = "hidden";
          if (window.__mpUI) window.__mpUI.start();
        }
        function close() {
          ov.classList.remove("on");
          if (window.__mpUI) window.__mpUI.stop();
          document.documentElement.style.overflow = "";
          document.getElementById("mpTop").innerHTML = "";
          document.getElementById("mpBot").innerHTML = "";
        }
        function unforce() {
          forced = null;
          fresh = false;
          sec.removeAttribute("data-force");
        }
        window.__openModePick = function (p) {
          if (!p) return;
          prod = p;
          open();
        };
        document.getElementById("mpX").onclick = close;
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && ov.classList.contains("on")) close();
        });
        /* Design Studio: exactly what a tap did before */
        document.getElementById("mpD").onclick = function () {
          var id = prod && prod.id;
          close();
          unforce();
          if (id == null) return;
          pickP(id);
          location.hash = "#product/" + id;
        };
        /* Instant Design: open it right here, no scrolling animation, with this product's category already chosen */
        document.getElementById("mpI").onclick = function () {
          var c = (prod && prod.cat) || "tee";
          close();
          forced = c;
          fresh = false;
          sec.setAttribute("data-force", c);
          var back = document.getElementById("wzBack"),
            n = 0;
          while (sec.dataset.wz && sec.dataset.wz !== "name" && back && n++ < 6) back.click();
          var hd = document.querySelector("header"),
            off = 0;
          try {
            if (hd && /sticky|fixed/.test(getComputedStyle(hd).position)) off = hd.offsetHeight;
          } catch (e) {}
          var y = sec.getBoundingClientRect().top + (window.pageYOffset || 0) - off;
          window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
        };
        /* a design was just picked in Instant Design */
        sec.addEventListener(
          "click",
          function (e) {
            if (forced && e.target.closest && e.target.closest(".ds2")) fresh = true;
          },
          true
        );
        /* wizard reached "What do you want?": choose the forced category for the person and move on (or step back over it) */
        function tryPick(k) {
          if (!forced || sec.dataset.wz !== "cat") return;
          var b = sec.querySelector('#catRow .cb[data-c="' + forced + '"]');
          if (b && !b.disabled) {
            fresh = false;
            b.click();
          } else if (k < 25) setTimeout(function () { tryPick(k + 1); }, 60);
          else unforce(); /* category not available: fall back to the normal step */
        }
        new MutationObserver(function () {
          if (!forced || sec.dataset.wz !== "cat") return;
          if (fresh) tryPick(0);
          else {
            var back = document.getElementById("wzBack"); /* came back from the next step: skip over it */
            if (back) back.click();
          }
        }).observe(sec, { attributes: true, attributeFilter: ["data-wz"] });
        /* normal flow again when the person uses the Instant Design button directly, or leaves the page */
        var md = document.getElementById("modeSec");
        if (md)
          md.addEventListener("click", function (e) {
            if (e.target.closest && e.target.closest('[data-go="nameSec"]')) unforce();
          });
        window.addEventListener("hashchange", unforce);
      })();
    
