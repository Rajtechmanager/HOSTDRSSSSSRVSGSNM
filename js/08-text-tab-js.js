      (function () {
        var bar = document.createElement("div");
        bar.id = "txtBar";
        bar.innerHTML =
          '<button type="button" class="tbA" id="tbA" hidden></button><button type="button" class="tbG wait" id="tbG"><span></span><b aria-hidden="true">&#8594;</b></button>';
        document.body.appendChild(bar);
        var tbA = document.getElementById("tbA"),
          tbG = document.getElementById("tbG"),
          sl = document.getElementById("slots"),
          seen = false,
          lastS = "",
          REV = false,
          IT = 0;
        function esc2(x) {
          return String(x).replace(/[&<>"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
          });
        }
        function onText() {
          var cs = document.getElementById("customSec");
          return !!(cs && !cs.hidden && C && C.dataset.tab === "text");
        }
        function hasTxt() {
          return T.some(function (t) {
            return t.txt && t.txt.trim();
          });
        }
        function lastHas() {
          var l = T[T.length - 1];
          return !!(l && l.txt && l.txt.trim());
        }
        function upd() {
          var on = onText();
          sl.hidden = !on;
          var ac = document.querySelector("#customSec .acts"),
            mob = matchMedia("(max-width:760px)").matches,
            typing = !!(C && C.classList.contains("typing"));
          var fa = document.activeElement,
            fh = !!(
              fa &&
              fa.classList &&
              fa.classList.contains("tt") &&
              fa.value.trim()
            );
          if (!typing || !fh) REV = false;
          /* REV = the person typed something and paused: show Continue even if this browser never tells us the keyboard was closed with Back */
          bar.classList.toggle("show", on && mob && (!typing || REV || fh));
          var tt0 = document.querySelector("#editor .tt");
          if (tt0 && tt0.parentNode)
            tt0.parentNode.setAttribute("data-c", tt0.value.length + " / 18");
          if (!on) return;
          var n = T.length,
            lh = lastHas(),
            h = hasTxt(),
            ti = tIdx(),
            i,
            o = "";
          /* the other texts live on the right border of the panel; tap one to edit it */
          for (i = 0; i < n; i++) {
            if (i === ti && !mob) continue;
            var t = T[i],
              f = !!(t.txt && t.txt.trim());
            o +=
              '<button type="button" class="rl ' +
              (f ? "f" : "e") +
              (i === ti ? " on" : "") +
              '" data-sl="' +
              i +
              '" data-keep aria-label="Edit text ' +
              (i + 1) +
              '"><b>' +
              (i + 1) +
              "</b><span>" +
              (f ? esc2(t.txt.trim()) : "empty") +
              "</span></button>";
          }
          /* phone: the strip lists ALL texts (current one highlighted) and only appears once there are 2+ */
          if (mob && n < 2) o = "";
          /* desktop has no bottom bar, so the rail also carries the add button there */
          if (!mob && h && lh && n < MAXT)
            o +=
              '<button type="button" class="rl add" data-sladd="1" data-keep aria-label="Add text ' +
              (n + 1) +
              '"><b>+</b><span>Text ' +
              (n + 1) +
              "</span></button>";
          sl.classList.add("rail");
          sl.hidden = !o;
          document.getElementById("stepText").classList.toggle("rail", !!o);
          if (o) sl.style.top = document.getElementById("editor").offsetTop + "px";
          if (o !== lastS) {
            sl.innerHTML =
              (o.indexOf('data-sl="') > -1
? '<div class="rlh">' + (mob ? "&#9998; Tap to edit" : "&#9998; Edit") + "</div>"
                : "") + (mob ? '<div class="rlw">' + o + "</div>" : o);
            lastS = o;
          }
          /* keep the card tall enough to hold the whole rail */
          document.getElementById("stepText").style.minHeight = o
            ? sl.offsetTop + sl.offsetHeight + 14 + "px"
            : "";
          /* bottom bar */
          var canAdd = h && lh && n < MAXT;
          tbA.hidden = !canAdd;
          tbA.textContent = "+ Text " + (n + 1);
          tbG.classList.toggle("wait", !h);
          tbG.classList.toggle("go", h);
          tbG.firstChild.textContent = h
            ? "Continue to Style"
            : "Type your text first";
          tbG.lastChild.style.display = h ? "" : "none";
          bar.style.bottom =
            (ac && ac.offsetHeight && getComputedStyle(ac).display !== "none"
              ? ac.offsetHeight
              : document.body.classList.contains("kb")
                ? kbGap()
                : 0) + "px";
          if (h && !seen) {
            seen = true;
            if (canAdd) {
              tbA.classList.add("attn");
              setTimeout(function () {
                tbA.classList.remove("attn");
              }, 4500);
            }
          }
        }
        sl.addEventListener("click", function (e) {
          var b = e.target.closest && e.target.closest("[data-sl]");
          if (b) {
            var l = document.querySelector(
              '#layers [data-l="' + b.dataset.sl + '"]',
            );
            if (l) l.click();
            var tt = document.querySelector("#editor .tt");
            if (tt) tt.focus();
            setTimeout(upd, 0);
            return;
          }
          b = e.target.closest && e.target.closest("[data-sladd]");
          if (b) {
            document.getElementById("addT").click();
            setTimeout(upd, 0);
          }
        });
        tbA.addEventListener("click", function () {
          document.getElementById("addT").click();
          setTimeout(upd, 0);
        });
        tbG.addEventListener("click", function () {
          if (!hasTxt()) {
            var tt = document.querySelector("#editor .tt");
            if (tt) {
              tt.focus();
              tt.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            return;
          }
          if (window.doneTyping) doneTyping();
          showTab("style");
        });
        /* the old "Add another text line?" card scroll is no longer needed */
        window.askMore = function () {};
        ["chips", "editor"].forEach(function (n) {
          var o = window[n];
          if (typeof o !== "function") return;
          window[n] = function () {
            var r = o.apply(this, arguments);
            upd();
            return r;
          };
        });
        var ed = document.getElementById("editor");
        ["input", "click"].forEach(function (ev) {
          ed.addEventListener(ev, function () {
            setTimeout(upd, 0);
          });
        });
        document.addEventListener("focusin", function () {
          setTimeout(upd, 0);
        });
        document.addEventListener("focusout", function () {
          setTimeout(upd, 350);
        });
        if (C)
          new MutationObserver(upd).observe(C, {
            attributes: true,
            attributeFilter: ["data-tab", "class"],
          });
        var cs = document.getElementById("customSec");
        if (cs)
          new MutationObserver(upd).observe(cs, {
            attributes: true,
            attributeFilter: ["hidden"],
          });
        window.addEventListener("resize", upd);
        if (window.visualViewport)
          visualViewport.addEventListener("resize", upd);
        /* typewriter demo inside the empty text box: shows what to type, then erases itself */
        var W = [
            "Write your name",
            "Write your thoughts",
            "Tushar",
            "Swastik",
            "Raj",
            "Aarav",
            "Ananya",
          ],
          wi = 0,
          ci = 0,
          del = false,
          hold = 0,
          BASE = "Type your text here";
        setInterval(function () {
          var tt = document.querySelector("#editor .tt");
          if (!tt || !onText()) return;
          if (tt.value) {
            if (tt.placeholder !== BASE) tt.placeholder = BASE;
            return;
          }
          if (hold > 0) {
            hold--;
            return;
          }
          var w = W[wi],
            stp = w.length > 10 ? 2 : 1;
          if (!del) {
            ci += stp;
            if (ci >= w.length) {
              ci = w.length;
              del = true;
              hold = 12;
            }
          } else {
            ci -= stp;
            if (ci <= 0) {
              ci = 0;
              del = false;
              wi = (wi + 1) % W.length;
              hold = 4;
            }
          }
          tt.placeholder =
            w.slice(0, ci) + (document.activeElement === tt ? "" : "|") || " ";
        }, 110);
        /* keyboard closed with the phone's Back button: the box stays focused and no blur fires, so treat it exactly like pressing Go/Done */
        function flash() {
          upd();
          tbG.classList.remove("flash");
          void tbG.offsetWidth;
          tbG.classList.add("flash");
          if (!tbA.hidden) {
            tbA.classList.remove("attn");
            void tbA.offsetWidth;
            tbA.classList.add("attn");
            setTimeout(function () {
              tbA.classList.remove("attn");
            }, 4500);
          }
          setTimeout(function () {
            tbG.classList.remove("flash");
          }, 2600);
          var st = document.querySelector("#slots");
          if (st && st.scrollIntoView)
            setTimeout(function () {
              st.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }, 120);
        }
        var dt0 = window.doneTyping;
        if (typeof dt0 === "function")
          window.doneTyping = function () {
            var r = dt0.apply(this, arguments);
            if (onText() && hasTxt()) setTimeout(flash, 60);
            return r;
          };
        /* Keyboard closed with Back: the box stays focused, so no blur ever fires. Safari, Brave, Edge etc. report the keyboard differently from Chrome,
     so we use three independent signals and any one of them is enough:
     1) the visible height grows back by >=90px from its lowest point since the keyboard opened (relative, so browser toolbars cannot break it)
     2) blur / Done / Enter (handled elsewhere)
     3) the person typed something and paused for 1s -> Continue shows above the keyboard anyway (works even when the browser gives no resize signal) */
        var vv = window.visualViewport,
          kbOpen = false,
          restH = 0,
          baseH = 0,
          lowH = 0;
        function vh() {
          return vv ? vv.height : window.innerHeight;
        }
        function isTT(a) {
          return !!(a && a.classList && a.classList.contains("tt"));
        }
        function kbGap() {
          var v = window.visualViewport;
          if (!v || v.scale > 1.05) return 0;
          return Math.max(
            0,
            Math.round(window.innerHeight - v.offsetTop - v.height),
          );
        }
        function gone() {
          var a = document.activeElement;
          if (isTT(a)) a.blur();
          if (C) C.classList.remove("typing");
          REV = false;
          setTimeout(function () {
            if (onText()) {
              upd();
              if (hasTxt()) flash();
            }
          }, 120);
        }
        function chk() {
          var h = vh();
          if (!isTT(document.activeElement)) {
            if (!kbOpen) restH = h;
            else kbOpen = false;
            return;
          }
          if (!kbOpen) {
            if (baseH && baseH - h >= 100) {
              kbOpen = true;
              lowH = h;
            }
            return;
          }
          if (h < lowH) {
            lowH = h;
            return;
          }
          if (h - lowH >= 90) {
            kbOpen = false;
            baseH = h;
            gone();
          }
        }
        function startIdle() {
          clearTimeout(IT);
          IT = setTimeout(function () {
            var a = document.activeElement;
            if (isTT(a) && a.value.trim()) {
              REV = true;
              upd();
            }
          }, 1000);
        }
        restH = vh();
        document.addEventListener("focusin", function (e) {
          if (!isTT(e.target)) return;
          baseH = Math.max(restH, vh());
          lowH = vh();
          kbOpen = false;
          chk();
          setTimeout(chk, 450);
          startIdle();
        });
        document.addEventListener(
          "input",
          function (e) {
            if (isTT(e.target)) startIdle();
          },
          true,
        );
        if (vv) {
          vv.addEventListener("resize", chk);
          vv.addEventListener("scroll", upd);
        }
        window.addEventListener("resize", chk);
        window.addEventListener("orientationchange", function () {
          setTimeout(function () {
            restH = baseH = lowH = vh();
            kbOpen = false;
          }, 400);
        });
        setInterval(upd, 800);
        upd();
      })();
    
