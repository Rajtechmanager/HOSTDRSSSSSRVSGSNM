      (function () {
        var wrap = window.__wzDirWrap; /* the overlay that sits on the shirt photo */
        if (!wrap || !window.__nsCurve) return;
        var W = document.createElement("div");
        W.id = "ncW";
        W.innerHTML =
          '<button type="button" id="ncB" aria-label="Curve text" title="Curve"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17C6 6 18 6 21 17"/><path d="M8.5 15.5l.8-2.2M12 14.2v-2.6M15.5 15.5l-.8-2.2" stroke-width="1.8"/></svg></button><span class="crvl">Curve</span>';
        var P = document.createElement("div");
        P.id = "ncP";
        P.setAttribute("role", "group");
        P.innerHTML =
          '<div class="crvh"><span>Curve <b id="ncV">0</b></span><button type="button" id="ncZ" aria-label="Reset curve" title="Reset">&#8634;</button></div><div class="crvr"><input id="ncS" type="range" min="-100" max="100" step="1" value="0" aria-label="Curve amount"></div><div class="crvf"><span>&#8592; Bowl</span><span>Arch &#8594;</span></div>';
        wrap.appendChild(W);
        wrap.appendChild(P);
        var B = W.querySelector("#ncB"), S = P.querySelector("#ncS"), V = P.querySelector("#ncV");
        /* the overlay sits right on top of the photo: keep taps / drags away from the photo's own handlers */
        ["pointerdown", "pointermove", "pointerup", "pointercancel", "touchstart", "touchmove", "mousedown", "click"].forEach(function (n) {
          W.addEventListener(n, function (e) { e.stopPropagation(); });
          P.addEventListener(n, function (e) { e.stopPropagation(); });
        });
        function show(v) {
          S.value = v;
          V.textContent = v;
          W.classList.toggle("set", !!v);
        }
        function sync() {
          var vis = wrap.offsetParent !== null,
            cvEl = wrap.previousElementSibling;
          W.classList.toggle("show", vis);
          if (!vis) { P.classList.remove("open"); B.classList.remove("on"); return; }
          /* ~10% down the photo (upper right, level with the head/shoulder area) */
          /* NOTE: this overlay is a 0-height strip at the BOTTOM of the photo, so everything is placed with "bottom" */
          var ch = (cvEl && cvEl.clientHeight) || 400,
            hh = W.offsetHeight || 54,
            ph = 42, /* fixed bar height: measuring it while hidden made the bar jump after opening */
            tp = Math.round(ch * 0.095),          /* distance of the button's top edge from the photo's top */
            bt = Math.max(0, ch - tp - hh);        /* -> bottom offset */
          W.style.top = "auto";
          P.style.top = "auto";
          W.style.bottom = bt + "px";
          P.style.bottom = Math.max(0, bt + hh - ph) + "px"; /* panel top lines up with the button top */
          if (document.activeElement !== S) show(Math.round(window.__nsCurve.get()));
        }
        var lastTap = 0;
        function setOpen(o) {
          P.classList.toggle("open", o);
          B.classList.toggle("on", o);
          B.setAttribute("aria-expanded", o ? "true" : "false");
          P.setAttribute("aria-hidden", o ? "false" : "true");
        }
        /* icon tap: open the bar, tap again: close it. (A double-fired tap within 250ms is ignored.) */
        B.addEventListener("click", function (e) {
          e.preventDefault();
          var n = Date.now();
          if (n - lastTap < 250) return;
          lastTap = n;
          sync(); /* put the bar in its final spot BEFORE it slides out */
          setOpen(!P.classList.contains("open"));
        });
        function apply(v) {
          if (Math.abs(v) < 4) v = 0; /* snaps back to the centre = straight text */
          show(v);
          window.__nsCurve.set(v);
        }
        S.addEventListener("input", function () { apply(+S.value); });
        P.querySelector("#ncZ").addEventListener("click", function () { apply(0); });
        document.addEventListener("pointerdown", function (e) {
          if (P.classList.contains("open") && !P.contains(e.target) && !W.contains(e.target)) {
            P.classList.remove("open");
            B.classList.remove("on");
          }
        });
        setInterval(sync, 350);
        sync();
      })();
    
