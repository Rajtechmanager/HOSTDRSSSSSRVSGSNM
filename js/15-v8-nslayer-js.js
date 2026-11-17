      /* Instant Studio: "picture on top" / "text on top" icons, right above the Curve button, shown only when text and picture overlap */
      (function () {
        var wrap = window.__wzDirWrap;
        if (!wrap || !window.__nsLayer) return;
        var W = document.createElement("div");
        W.id = "nlW";
        W.setAttribute("role", "group");
        W.setAttribute("aria-label", "Which goes on top");
        var ICON_P =
          '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="3" width="13" height="13" rx="2.5"/><path d="M7 8h5M9.5 8v5.5"/>' +
          '<rect x="11" y="11" width="14" height="14" rx="2.5" fill="currentColor"/>' +
          '<path class="mk" d="M13.5 22l3.5-4.5 2.5 3 1.5-2 2 3.5"/></svg>';
        var ICON_T =
          '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="3" width="13" height="13" rx="2.5"/><path d="M5.5 13l3-4 2.2 2.6 1.3-1.6 1.8 3"/>' +
          '<rect x="11" y="11" width="14" height="14" rx="2.5" fill="currentColor"/>' +
          '<path class="mk" d="M14.5 15.5h7M18 15.5V22"/></svg>';
        W.innerHTML =
          '<span class="lyrl">On top</span>' +
          '<button type="button" data-lyr="p" title="Picture on top" aria-label="Picture on top of text">' + ICON_P + "</button>" +
          '<button type="button" data-lyr="t" title="Text on top" aria-label="Text on top of picture">' + ICON_T + "</button>";
        wrap.appendChild(W);
        /* the overlay sits on the photo: keep taps / drags away from the photo's own handlers */
        ["pointerdown", "pointermove", "pointerup", "pointercancel", "touchstart", "touchmove", "mousedown"].forEach(function (n) {
          W.addEventListener(n, function (e) { e.stopPropagation(); });
        });
        var H = document.createElement("div");
        H.className = "lyrH";
        H.innerHTML = "<span>Bring image on top of text</span><i>&#128071;</i>";
        W.appendChild(H);
        var shown = false, lastHide = 0, lastPlay = 0, hT = 0;
        function hint() {
          var n = Date.now();
          if (n - lastPlay < 8000) return;
          lastPlay = n;
          W.classList.add("hint");
          clearTimeout(hT);
          hT = setTimeout(function () { W.classList.remove("hint"); }, 1500); /* shown for 1.5 seconds */
        }
        var want = 0;
        /* the drag / pinch demo (Design Studio: .gh, Instant Studio: __nsAnimEnd) must be completely over first */
        function busy() {
          return !!document.querySelector(".gh") || !!window.__guideBusy || Date.now() < (window.__nsAnimEnd || 0);
        }
        function track(on) {
          var n = Date.now();
          if (on && !shown && n - lastHide > 1200) want = n;
          if (!on) {
            if (shown) lastHide = n;
            want = 0;
            W.classList.remove("hint");
          }
          shown = on;
          if (on && want && n - want > 1200 && !busy()) {
            want = 0;
            hint();
          }
        }
        function sync() {
          var vis = wrap.offsetParent !== null,
            ov = vis && window.__nsLayer.overlap();
          W.classList.toggle("show", !!ov);
          track(!!ov);
          if (!ov) return;
          /* sit just above the Curve button, wherever that is */
          var nc = document.getElementById("ncW"),
            bt = parseInt(nc && nc.style.bottom, 10) || 120,
            lh = W.offsetHeight || 100;
          W.style.top = "auto";
          W.style.bottom = Math.max(0, bt - 8 - lh) + "px"; /* just BELOW the Curve button */
          var top = window.__nsLayer.get();
          [].forEach.call(W.querySelectorAll("[data-lyr]"), function (b) {
            var a = (b.dataset.lyr === "t") === top;
            b.classList.toggle("on", a);
            b.setAttribute("aria-pressed", a ? "true" : "false");
          });
        }
        W.addEventListener("click", function (e) {
          var b = e.target.closest && e.target.closest("[data-lyr]");
          if (!b) return;
          W.classList.remove("hint");
          window.__nsLayer.set(b.dataset.lyr === "t");
          setTimeout(sync, 30);
        });
        setInterval(sync, 350);
        sync();
      })();
    
