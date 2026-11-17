      /* Round corner resize handle (Design Studio).
         Fixes: stale pointer entries blocking the handle, tiny hit area, lost pointerup leaving resize "stuck". */
      (function () {
        var cv = document.getElementById("shirt");
        if (!cv || !cv.parentNode) return;
        var st = cv.parentNode, RZH = null, ACT = {};
        cv.style.touchAction = "none";
        function p2(ev) {
          var r = cv.getBoundingClientRect();
          return [((ev.clientX - r.left) * CW) / r.width, ((ev.clientY - r.top) * CH) / r.height];
        }
        /* generous hit area measured in real screen pixels (bigger for fingers) */
        function onHandle(ev) {
          var b = cv._hb;
          if (!b || UNSEL) return null;
          var r = cv.getBoundingClientRect();
          if (!r.width) return null;
          var k = CW / r.width,
            hs = b.s || 1,
            rad = Math.max(b.r, Math.max((ev.pointerType === "mouse" ? 26 : 38) * hs, ev.pointerType === "mouse" ? 12 : 16) * k),
            p = p2(ev);
          return Math.hypot(p[0] - b.x, p[1] - b.y) <= rad ? { b: b, p: p } : null;
        }
        /* track only pointers that are really down; clears itself on every up / cancel anywhere on the page */
        document.addEventListener("pointerdown", function (ev) { ACT[ev.pointerId] = ev.pointerType; }, true);
        function gone(ev) {
          delete ACT[ev.pointerId];
          delete PTS[ev.pointerId]; /* removes stale pinch entries that used to block the handle */
        }
        document.addEventListener("pointerup", gone, true);
        document.addEventListener("pointercancel", gone, true);
        function endRZ() {
          if (!RZH) return;
          RZH = null;
          cv.style.cursor = "grab";
          draw();
        }
        /* capture phase on the stage: runs before the canvas's own move / pinch handlers */
        st.addEventListener(
          "pointerdown",
          function (ev) {
            if (ev.target !== cv || (ev.pointerType === "mouse" && ev.button > 0)) return;
            if (RZH && RZH.id !== ev.pointerId) RZH = null; /* never keep an old resize alive */
            var others = Object.keys(ACT).filter(function (id) {
              return +id !== ev.pointerId && ACT[id] === "touch";
            });
            if (ev.pointerType === "touch" && others.length) return; /* real 2nd finger = pinch */
            var h = onHandle(ev);
            if (!h) return;
            var o = selObj();
            if (!o) return;
            for (var id in PTS) delete PTS[id]; /* drop leftovers so nothing blocks this press */
            RZH = {
              o: o,
              k: h.b.k,
              cx: h.b.cx,
              cy: h.b.cy,
              d0: Math.max(24, Math.hypot(h.p[0] - h.b.cx, h.p[1] - h.b.cy) || 1),
              s0: o.size,
              id: ev.pointerId,
            };
            try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
            PEND = null;
            drag = null;
            ev.preventDefault();
            ev.stopImmediatePropagation();
          },
          true,
        );
        /* window level, so it keeps tracking even if capture is lost */
        window.addEventListener("pointermove", function (ev) {
          if (RZH) {
            if (ev.pointerId !== RZH.id) return;
            if (ev.pointerType === "mouse" && ev.buttons === 0) { endRZ(); return; } /* button already released */
            var p = p2(ev),
              v = Math.max(20, Math.min(100, (RZH.s0 * (Math.hypot(p[0] - RZH.cx, p[1] - RZH.cy) || 1)) / RZH.d0));
            RZH.o.size = v;
            var ed = RZH.k === "i" ? document.getElementById("picEd") : document.getElementById("editor");
            if (ed) [].forEach.call(ed.querySelectorAll("[data-k=size]"), function (i) { i.value = v; });
            cv.style.cursor = "nwse-resize";
            draw();
            ev.preventDefault();
            return;
          }
          if (!drag && ev.target === cv && ev.pointerType === "mouse") cv.style.cursor = onHandle(ev) ? "nwse-resize" : "grab";
        }, { passive: false });
        function end(ev) { if (RZH && ev.pointerId === RZH.id) endRZ(); }
        window.addEventListener("pointerup", end, true);
        window.addEventListener("pointercancel", end, true);
        cv.addEventListener("lostpointercapture", end);
        window.addEventListener("blur", endRZ);
      })();
      /* Tilt handle (Design Studio): hold the round icon on the top-left corner of the selected text / photo and drag to turn it. */
      (function () {
        var cv = document.getElementById("shirt");
        if (!cv || !cv.parentNode) return;
        var st = cv.parentNode,
          RTD = null,
          ACT = {},
          TCUR =
            "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M20 12a8 8 0 1 1-2.6-5.9' fill='none' stroke='%23fff' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M20 12a8 8 0 1 1-2.6-5.9' fill='none' stroke='%23111' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") 12 12, grab";
        function p2(ev) {
          var r = cv.getBoundingClientRect();
          return [((ev.clientX - r.left) * CW) / r.width, ((ev.clientY - r.top) * CH) / r.height];
        }
        /* same generous hit area as the resize handle (real screen pixels, bigger for fingers) */
        function onTilt(ev) {
          var b = cv._rb;
          if (!b || UNSEL) return null;
          var r = cv.getBoundingClientRect();
          if (!r.width) return null;
          var k = CW / r.width,
            hs = b.s || 1,
            rad = Math.max(b.r, Math.max((ev.pointerType === "mouse" ? 26 : 38) * hs, ev.pointerType === "mouse" ? 12 : 16) * k),
            p = p2(ev);
          return Math.hypot(p[0] - b.x, p[1] - b.y) <= rad ? { b: b, p: p } : null;
        }
        document.addEventListener("pointerdown", function (ev) { ACT[ev.pointerId] = ev.pointerType; }, true);
        function gone(ev) { delete ACT[ev.pointerId]; }
        document.addEventListener("pointerup", gone, true);
        document.addEventListener("pointercancel", gone, true);
        function endT() {
          if (!RTD) return;
          RTD = null;
          window.__dsTilt = false;
          cv.style.cursor = "grab";
          draw(); /* badge disappears */
        }
        /* capture phase on the stage: runs before the canvas's own move / pinch handlers */
        st.addEventListener(
          "pointerdown",
          function (ev) {
            if (ev.target !== cv || (ev.pointerType === "mouse" && ev.button > 0)) return;
            if (RTD && RTD.id !== ev.pointerId) RTD = null; /* never keep an old tilt alive */
            var others = Object.keys(ACT).filter(function (id) {
              return +id !== ev.pointerId && ACT[id] === "touch";
            });
            if (ev.pointerType === "touch" && others.length) return; /* real 2nd finger = pinch */
            var h = onTilt(ev);
            if (!h) return;
            var o = selObj();
            if (!o) return;
            for (var id in PTS) delete PTS[id]; /* drop leftovers so nothing blocks this press */
            RTD = {
              o: o,
              k: h.b.k,
              cx: h.b.cx,
              cy: h.b.cy,
              a0: Math.atan2(h.p[1] - h.b.cy, h.p[0] - h.b.cx),
              r0: +o.rot || 0,
              id: ev.pointerId,
            };
            window.__dsTilt = true;
            try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
            PEND = null;
            drag = null;
            cv.style.cursor = TCUR;
            ev.preventDefault();
            ev.stopImmediatePropagation();
            draw();
          },
          true,
        );
        /* window level, so it keeps tracking even if capture is lost */
        window.addEventListener("pointermove", function (ev) {
          if (!RTD) {
            if (!drag && ev.target === cv && ev.pointerType === "mouse" && onTilt(ev)) cv.style.cursor = TCUR;
            return;
          }
          if (ev.pointerId !== RTD.id) return;
          if (ev.pointerType === "mouse" && ev.buttons === 0) { endT(); return; } /* button already released */
          var p = p2(ev),
            v = RTD.r0 + ((Math.atan2(p[1] - RTD.cy, p[0] - RTD.cx) - RTD.a0) * 180) / Math.PI,
            sn;
          v = ((((v + 180) % 360) + 360) % 360) - 180; /* keep between -180 and 180 degrees */
          sn = Math.round(v / 45) * 45; /* light magnet at 0, 45, 90, 135, 180 */
          if (Math.abs(v - sn) < 3) v = sn;
          if (v === 180) v = -180;
          RTD.o.rot = v;
          cv.style.cursor = TCUR;
          draw();
          ev.preventDefault();
        }, { passive: false });
        function end(ev) { if (RTD && ev.pointerId === RTD.id) endT(); }
        window.addEventListener("pointerup", end, true);
        window.addEventListener("pointercancel", end, true);
        cv.addEventListener("lostpointercapture", end);
        window.addEventListener("blur", endT);
      })();
    
