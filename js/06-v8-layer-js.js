      /* Two icons (picture on top / text on top) shown just above the Curve button whenever the picture and a text overlap. */
      (function () {
        var st = document.querySelector("#customSec .stage");
        if (!st) return;
        var W = document.createElement("div");
        W.id = "lyrW";
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
        st.appendChild(W);
        /* keep the stage's own drag / pinch handlers away from these buttons */
        ["pointerdown", "pointermove", "pointerup", "pointercancel", "touchstart", "touchmove", "mousedown"].forEach(function (n) {
          W.addEventListener(n, function (e) { e.stopPropagation(); });
        });
        var C = document.querySelector("#customSec .cust");
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
          var cs = document.getElementById("customSec"),
            ob = document.querySelector("#picEd .ovl"),
            ov = !!(cs && !cs.hidden && ob && !ob.hidden),
            typing = !!(C && C.classList.contains("typing")) || document.body.classList.contains("kb");
          var vs = !!(ov && !typing);
          W.classList.toggle("show", vs);
          track(vs);
          if (!ov) return;
          var on = ob.querySelector("[data-top].on"),
            v = on ? (on.dataset.top === "t" ? "t" : "p") : "p";
          [].forEach.call(W.querySelectorAll("[data-lyr]"), function (b) {
            var a = b.dataset.lyr === v;
            b.classList.toggle("on", a);
            b.setAttribute("aria-pressed", a ? "true" : "false");
          });
        }
        W.addEventListener("click", function (e) {
          var b = e.target.closest && e.target.closest("[data-lyr]");
          if (!b) return;
          e.stopPropagation();
          W.classList.remove("hint");
          var ov = layout().ov || {}, v = b.dataset.lyr === "t";
          Object.keys(ov).forEach(function (i) { if (T[i]) T[i].front = v; });
          draw();
          setTimeout(sync, 60);
        });
        document.addEventListener("click", function () { setTimeout(sync, 0); });
        setInterval(sync, 300);
        sync();
      })();
    
