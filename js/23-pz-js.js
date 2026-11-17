      (function () {
        var sec = document.getElementById("nameSec"),
          ov = document.getElementById("mpOv"),
          mpI = document.getElementById("mpI"),
          mpD = document.getElementById("mpD");
        if (!sec || !ov || !mpI || !mpD) return;
        var PZ_ID = "pzPhoto",
          item = null,
          waiting = false,
          ORIG = null,
          iv = 0;
        /* true only while the "Upload your photo" of Personalized Instant Design is in progress */
        window.__pzMasks = function () {
          return !!(sec.dataset.pz && waiting);
        };

        /* ---- 1. popup button between Instant Design and Design Studio ---- */
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mpB p";
        btn.id = "mpP";
        btn.innerHTML = "<b>\uD83D\uDDBC\uFE0F Personalize Instant Design</b><span>Your photo + your name in 15 seconds</span><small class=\"mpH\">Choose from the gallery</small><div class=\"mpGal\" aria-hidden=\"true\"><div class=\"mpGb\"><span>&#9776;</span><b>Gallery</b><span class=\"pzOk\">&#10003;</span></div><div class=\"pzGv\"><div class=\"pzPan\"><div class=\"pzPic\"></div><u class=\"pzSel\"></u><u class=\"pzRip\"></u><u class=\"pzFg\">&#128070;</u></div><u class=\"pzBar\"><u></u></u></div></div><em class=\"mpTap\" aria-hidden=\"true\" style=\"font-style:normal\">&#128070;</em>";
        mpD.parentNode.insertBefore(btn, mpD);

        /* ---- 2. the upload box inside the "design" step ---- */
        var nmD = document.getElementById("nmD"),
          h3 = nmD && nmD.querySelector("h3"),
          box = document.createElement("div");
        box.id = "pzBox";
        box.innerHTML =
          '<div class="pictip pt2"><span class="pt-b">Adding <strong>PNG</strong> image gives best result</span><span class="pt-a" aria-hidden="true">&#8595;</span></div>' +
          '<button type="button" class="addb" id="pzUpB"><b class="upa" aria-hidden="true"><i class="ph"><u></u><u></u><u></u><u></u></i><i class="fl"></i><i class="ar">&#8593;</i></b><span>2 \u00B7 Upload your photo</span><small>Use a photo or PNG from your phone gallery.</small></button>' +
          '<img id="pzPrev" alt="Your photo" />';
        if (nmD) nmD.appendChild(box);

        /* the same upload function as Design Studio's "Upload your photo" (PNG goes straight in; other photos get the background / shape choices) */
        document.getElementById("pzUpB").onclick = function () {
          waiting = true;
          if (window.picUpload) window.picUpload();
          else document.getElementById("file").click();
        };

        /* ---- 3. take the finished photo instead of putting it on the Design Studio shirt ---- */
        var _usePic = window.usePic;
        if (typeof _usePic === "function") {
          window.usePic = function (c, opaque) {
            if (!(sec.dataset.pz && waiting)) return _usePic.apply(this, arguments);
            waiting = false;
            take(c, opaque);
          };
        }
        function take(c, opaque) {
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
            d = t.toDataURL(opaque ? "image/jpeg" : "image/png", 0.92);
            m *= 0.85;
          } while (d.length > 1500000 && k++ < 8);
          item = { id: PZ_ID, kind: "design", img: d, name: "Your photo" };
          ensure();
          var pv = document.getElementById("pzPrev");
          pv.src = d;
          pv.classList.add("on");
          /* use the normal "a design was picked" path of Instant Design: the photo plays the sticker's role */
          var b = document.getElementById("pzPick");
          if (!b) {
            b = document.createElement("button");
            b.type = "button";
            b.id = "pzPick";
            b.className = "ds2";
            b.setAttribute("data-d", PZ_ID);
            b.style.display = "none";
            sec.appendChild(b);
          }
          b.click();
        }
        function ensure() {
          if (!item) return;
          var L = window.DSG;
          if (!L) L = window.DSG = [];
          if (!L.some(function (x) { return x && x.id === PZ_ID; })) L.unshift(item);
        }

        /* ---- 4. switch personalize mode on / off ---- */
        function on() {
          ORIG = ORIG || {
            h: sec.querySelector(".nmH").textContent,
            s: sec.querySelector(".idSub").textContent,
            b: (sec.querySelector(".ib1 b") || {}).textContent,
            d: h3 && h3.textContent,
          };
          item = null;
          clean();
          sec.dataset.pz = "1";
          sec.querySelector(".nmH").textContent = "Personalized Instant Design";
          sec.querySelector(".idSub").textContent =
            "Make your own design in seconds. Write your name or any quote you want on your shirt, add your own photo and see it on a tee right away. No design skills needed.";
          var b = sec.querySelector(".ib1 b");
          if (b) b.textContent = "Your photo,";
          if (h3) h3.textContent = "1 \u00B7 Upload your photo";
          var pv = document.getElementById("pzPrev");
          pv.removeAttribute("src");
          pv.classList.remove("on");
          clearInterval(iv);
          iv = setInterval(ensure, 400);
          if (window.nameRender) window.nameRender();
        }
        function off() {
          waiting = false;
          clearInterval(iv);
          if (!sec.dataset.pz) return;
          delete sec.dataset.pz;
          if (ORIG) {
            sec.querySelector(".nmH").textContent = ORIG.h;
            sec.querySelector(".idSub").textContent = ORIG.s;
            var b = sec.querySelector(".ib1 b");
            if (b && ORIG.b) b.textContent = ORIG.b;
            if (h3 && ORIG.d) h3.textContent = ORIG.d;
          }
          item = null;
          clean();
          if (window.nameRender) window.nameRender();
        }
        function clean() {
          if (window.DSG)
            window.DSG = window.DSG.filter(function (x) { return !(x && x.id === PZ_ID); });
        }

        /* ---- 5. open from the popup: same start as Instant Design (category already known from the product tapped) ---- */
        btn.onclick = function () {
          if (typeof mpI.onclick === "function") mpI.onclick();
          on();
        };
        /* the normal Instant Design / Design Studio paths switch personalize mode off again */
        mpI.addEventListener("click", off, true);
        mpD.addEventListener("click", off, true);
        var md = document.getElementById("modeSec");
        if (md) md.addEventListener("click", off, true);
        window.addEventListener("hashchange", off);
      })();
    
