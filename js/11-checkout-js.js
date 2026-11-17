      /* ===== Checkout: bill -> delivery details -> UPI (QR + app buttons) -> UTR -> order ===== */
      (function () {
        var UPI_ID = "raj15chat2004@okicici",
          UPI_NAME = "Customiza.in",
          UTR_MIN = 12,
          UTR_MAX = 14;
        var STATES = [
          "Andhra Pradesh",
          "Arunachal Pradesh",
          "Assam",
          "Bihar",
          "Chhattisgarh",
          "Goa",
          "Gujarat",
          "Haryana",
          "Himachal Pradesh",
          "Jharkhand",
          "Karnataka",
          "Kerala",
          "Madhya Pradesh",
          "Maharashtra",
          "Manipur",
          "Meghalaya",
          "Mizoram",
          "Nagaland",
          "Odisha",
          "Punjab",
          "Rajasthan",
          "Sikkim",
          "Tamil Nadu",
          "Telangana",
          "Tripura",
          "Uttar Pradesh",
          "Uttarakhand",
          "West Bengal",
          "Andaman and Nicobar Islands",
          "Chandigarh",
          "Dadra and Nagar Haveli and Daman and Diu",
          "Delhi",
          "Jammu and Kashmir",
          "Ladakh",
          "Lakshadweep",
          "Puducherry",
        ];
        var IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        var LOGO = {
          gpay: '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#fff"/><text x="24" y="23" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="21" fill="#4285F4">G</text><text x="24" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="12" fill="#5f6368">Pay</text></svg>',
          phonepe:
            '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#5f259f"/><text x="24" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="22" fill="#fff">\u092A\u0947</text></svg>',
          paytm:
            '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#fff"/><text x="24" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="15"><tspan fill="#002e6e">pay</tspan><tspan fill="#00b9f1">tm</tspan></text></svg>',
          bhim: '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#fff"/><text x="24" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="14"><tspan fill="#f47920">BH</tspan><tspan fill="#138808">IM</tspan></text></svg>',
          pop: '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#1b1b1f"/><text x="24" y="31" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="17" fill="#ffd23f">pop</text></svg>',
          upi: '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#fff"/><text x="24" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="15"><tspan fill="#097939">U</tspan><tspan fill="#ed752e">PI</tspan></text></svg>',
        };
        var st = null,
          M = null;
        function $$(s) {
          return M.querySelector(s);
        }
        function unitOf(it) {
          var pr = P.filter(function (q) {
            return q.id === it.pid;
          })[0];
          return pr ? Math.floor(+pr.price) || PRICE : it.unit || PRICE;
        }
        function totalOf(items) {
          return items.reduce(function (a, it) {
            return a + unitOf(it) * it.qty;
          }, 0);
        }
        function discOf() {
          if (!st || !st.coupon) return 0;
          return st.items.reduce(function (a, it) {
            return a + Math.floor((unitOf(it) * it.qty * st.coupon.pct) / 100);
          }, 0);
        }
        function payable() {
          return totalOf(st.items) - discOf();
        }
        var stI = -1;
        function stNorm(v) {
          v = String(v || "").trim().toLowerCase();
          for (var i = 0; i < STATES.length; i++)
            if (STATES[i].toLowerCase() === v) return STATES[i];
          return "";
        }
        function stClose() {
          var L = $$("#stL"), i = $$("#cfS");
          if (L) L.hidden = true;
          if (i) i.setAttribute("aria-expanded", "false");
          stI = -1;
        }
        function stList(all) {
          var inp = $$("#cfS"), L = $$("#stL");
          if (!inp || !L) return;
          var q = inp.value.trim().toLowerCase(), r;
          if (all || !q) r = STATES.slice();
          else {
            r = STATES.filter(function (x) { return x.toLowerCase().indexOf(q) === 0; });
            if (!r.length) r = STATES.filter(function (x) { return x.toLowerCase().indexOf(q) > -1; });
          }
          L.innerHTML = r.length
            ? r.map(function (x) { return '<button type="button" class="stO" data-s="' + x + '">' + x + "</button>"; }).join("")
            : '<div class="stN">No state found. Check the spelling.</div>';
          L.hidden = false;
          inp.setAttribute("aria-expanded", "true");
          stI = -1;
        }
        function stPick(x) {
          var i = $$("#cfS");
          i.value = x;
          i.classList.remove("bad");
          stClose();
        }
        function stMark(o) {
          for (var k = 0; k < o.length; k++) o[k].classList.toggle("on", k === stI);
          if (o[stI]) o[stI].scrollIntoView({ block: "nearest" });
        }
        function stBind() {
          M.addEventListener("input", function (e) {
            if (e.target.id === "cfS") stList(false);
          });
          M.addEventListener("mousedown", function (e) {
            var t = e.target, o = t.closest && t.closest(".stO");
            if (o) { e.preventDefault(); stPick(o.getAttribute("data-s")); return; }
            if (t.closest && t.closest("#stB")) {
              e.preventDefault();
              var L = $$("#stL");
              if (L.hidden) stList(true); else stClose();
              return;
            }
            if (!(t.closest && t.closest(".stW"))) stClose();
          });
          M.addEventListener("keydown", function (e) {
            if (e.target.id !== "cfS") return;
            var L = $$("#stL"), o = L.querySelectorAll(".stO");
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              if (L.hidden) { stList(false); o = L.querySelectorAll(".stO"); }
              stI = e.key === "ArrowDown" ? Math.min(o.length - 1, stI + 1) : Math.max(0, stI - 1);
              stMark(o);
            } else if (e.key === "Enter" && !L.hidden) {
              e.preventDefault();
              var t = o[stI >= 0 ? stI : 0];
              if (t) stPick(t.getAttribute("data-s")); else stClose();
            } else if (e.key === "Escape" && !L.hidden) {
              e.stopPropagation();
              stClose();
            }
          });
          M.addEventListener("focusout", function (e) {
            if (e.target.id !== "cfS") return;
            setTimeout(function () {
              var i = $$("#cfS");
              if (!i) return;
              var n = stNorm(i.value);
              if (n) i.value = n;
              stClose();
            }, 120);
          });
        }
        function cpBox() {
          var bx = $$("#cpBox");
          if (!bx) return;
          if (st.coupon) {
            bx.innerHTML = '<div class="cpOk"><span>\u2713 <b>' + esc(st.coupon.code) + '</b> applied \u00b7 ' + st.coupon.pct + '% off</span><button type="button" class="btn sm g" data-c="cpRemove">Remove</button></div>';
            return;
          }
          var g = window.CPN_GEN || [];
          bx.innerHTML =
            '<div class="cpRow"><input id="cpIn" placeholder="Enter coupon code" autocomplete="off" autocapitalize="characters"><button type="button" class="btn sm" data-c="cpApply">Apply</button></div><p class="mut coNote" id="cpMsg"></p>' +
            (g.length
              ? '<div class="cpChips">' + g.map(function (c) {
                  return '<button type="button" class="cpChip" data-c="cpUse" data-k="' + esc(c.code) + '"><span class="cpV"><b>' + c.pct + '%</b><i>OFF</i></span><span class="cpC"><b>' + esc(c.code) + '</b><em>Tap to apply this coupon</em></span><span class="cpA">APPLY</span></button>';
                }).join("") + "</div>"
              : "");
        }
        async function cpApply(code) {
          var inp = $$("#cpIn"), msg = $$("#cpMsg");
          function fail(t) { if (msg) { msg.className = "coErr"; msg.textContent = t; } }
          code = String(code || (inp && inp.value) || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
          if (!code) return fail("Enter a coupon code.");
          if (msg) { msg.className = "mut coNote"; msg.textContent = "Checking\u2026"; }
          try {
            var s = await FS.collection("coupons").doc(code).get();
            if (!s.exists || s.data().active !== true) return fail("This coupon code is not valid.");
            var c = s.data();
            if (c.firstOnly !== false && USER) {
              var o = await FS.collection("orders").where("uid", "==", USER.uid).limit(1).get();
              if (!o.empty) return fail("This coupon is only for your first purchase.");
            }
            if (!st) return;
            st.coupon = { code: code, pct: c.pct };
            bill(); payBtn(); cpBox();
          } catch (e) { fail("Could not check the coupon. Please try again."); }
        }
        function digits(v) {
          return String(v || "").replace(/\D/g, "");
        }
        function ph10(v) {
          var d = digits(v);
          if (d.length > 10) d = d.slice(-10);
          return d;
        }
        function build() {
          M = document.createElement("div");
          M.id = "coM";
          M.className = "coM";
          M.hidden = true;
          M.innerHTML =
            '<div class="coBox" role="dialog" aria-modal="true" aria-label="Checkout"><div class="coTop"><button type="button" class="coBk" data-c="coback" aria-label="Back">\u2039 Back</button><div class="coTt"><b class="coT" id="coT">Checkout</b><div class="coSteps" id="coSteps"></div></div><button type="button" class="coX" data-c="close" aria-label="Close">\u00d7</button></div><div id="coBody"></div></div>';
          document.body.appendChild(M);
          stBind();
          M.addEventListener("click", function (e) {
            if (e.target === M) {
              close();
              return;
            }
            var b = e.target.closest("[data-c]");
            if (!b) return;
            var c = b.getAttribute("data-c");
            if (c === "close") close();
            else if (c === "inc" || c === "dec") {
              var it = st.items[+b.getAttribute("data-i")];
              it.qty = Math.max(
                1,
                Math.min(20, it.qty + (c === "inc" ? 1 : -1)),
              );
              it.total = unitOf(it) * it.qty;
              bill();
              payBtn();
            } else if (c === "cpApply") cpApply();
            else if (c === "cpUse") cpApply(b.getAttribute("data-k"));
            else if (c === "cpRemove") { st.coupon = null; bill(); payBtn(); cpBox(); }
            else if (c === "pay") toPay();
            else if (c === "coback") {
              /* top Back button: payment step -> back to bill & address; bill step -> back to shopping */
              if (st.step === 2) {
                st.step = 1;
                render();
                var bx = $$(".coBox");
                if (bx) bx.scrollTop = 0;
              } else close();
            } else if (c === "step1") {
              /* tap "1 · Bill & address": go to the bill + address page (or jump to its top) */
              if (st.step === 2) {
                st.step = 1;
                render();
              }
              var bx1 = $$(".coBox");
              if (bx1) bx1.scrollTop = 0;
            } else if (c === "step2") {
              /* tap "2 · Pay by UPI": same as the pay button (checks the address first), or jump to the top of the UPI page */
              if (st.step === 1) toPay();
              else {
                var bx2 = $$(".coBox");
                if (bx2) bx2.scrollTop = 0;
              }
            } else if (c === "back") {
              st.step = 1;
              render();
            } else if (c === "copy") copyId(b);
            else if (c === "app") openApp(b.getAttribute("data-a"));
            else if (c === "submit") submit();
          });
          M.addEventListener("input", function (e) {
            var t = e.target;
            if (t.id === "cfP" || t.id === "cfA")
              t.value = digits(t.value).slice(-10).slice(0, 10);
            else if (t.id === "cfPin") t.value = digits(t.value).slice(0, 6);
            else if (t.id === "cuUtr") {
              t.value = digits(t.value).slice(0, UTR_MAX);
              utrState();
            }
            if (t.classList) t.classList.remove("bad");
          });
          document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && M && !M.hidden) close();
          });
        }
        function close() {
          if (!M) return;
          M.hidden = true;
          document.documentElement.style.overflow = "";
          st = null;
        }
        function stepsHtml() {
          return (
            '<span role="button" tabindex="0" data-c="step1" class="' +
            (st.step === 1 ? "on" : "") +
            '">1 \u00b7 Bill &amp; address</span><span role="button" tabindex="0" data-c="step2" class="' +
            (st.step === 2 ? "on" : "") +
            '">2 \u00b7 Pay by UPI</span>'
          );
        }
        function bill() {
          var el = $$("#coBill");
          if (!el) return;
          var sub = totalOf(st.items),
            dsc = discOf();
          el.innerHTML =
            st.items
              .map(function (it, i) {
                var u = unitOf(it);
                return (
                  '<div class="coRow"><img src="' +
                  (it.preview || "") +
                  '" alt=""><div class="coM1"><div class="coT">' +
                  esc(it.pname || "Tee") +
                  "</div>" +
                  dsg(it) +
                  '<div class="coU">' +
                  money(u) +
                  " each</div>" +
                  (st.fromCart
                    ? '<span class="mut">Qty ' + it.qty + "</span>"
                    : '<span class="coQ"><button type="button" data-c="dec" data-i="' +
                      i +
                      '" aria-label="Less">\u2212</button><b>' +
                      it.qty +
                      '</b><button type="button" data-c="inc" data-i="' +
                      i +
                      '" aria-label="More">+</button></span>') +
                  '</div><b class="coP">' +
                  money(u * it.qty) +
                  "</b></div>"
                );
              })
              .join("") +
            '<div class="bl"><span>Subtotal</span><span>' +
            money(sub) +
            "</span></div>" +
            (dsc
              ? '<div class="bl"><span>Coupon ' + esc(st.coupon.code) + ' (' + st.coupon.pct + '% off)</span><span><b class="coFree">\u2212' + money(dsc) + '</b></span></div>'
              : "") +
            '<div class="bl"><span>Delivery</span><span><b class="coFree">FREE \u20b90</b></span></div>' +
            '<div class="bl tot"><span>Total to pay</span><span>' +
            money(sub - dsc) +
            "</span></div>";
        }
        function payBtn() {
          var b = $$("#coGo");
          if (b)
            b.textContent =
              "Continue to payment \u00b7 " + money(payable());
        }
        function field(id, label, ph, val, extra) {
          return (
            '<div class="coF"><label for="' +
            id +
            '">' +
            label +
            '</label><input id="' +
            id +
            '" placeholder="' +
            ph +
            '" value="' +
            esc(val || "") +
            '" ' +
            (extra || "") +
            "></div>"
          );
        }
        function render() {
          $$("#coSteps").innerHTML = stepsHtml();
          var body = $$("#coBody");
          if (st.step === 1) {
            var A = (PROF && PROF.addr) || {};
            /* coming back from the UPI step: keep what the customer already typed */
            var SD = st.dl || null;
            function kept(k, dflt) {
              return SD && SD[k] != null ? SD[k] : dflt;
            }
            body.innerHTML =
              '<div class="coCard"><b>Your bill</b><div id="coBill"></div></div>' +
              '<div class="coCard"><b>Coupon</b><div id="cpBox"></div></div>' +
              '<div class="coCard"><b>Delivery details</b>' +
              field(
                "cfN",
                "Full name *",
                "Name as on the parcel",
                kept("name", PROF.name || (USER && USER.displayName) || ""),
                'autocomplete="name"',
              ) +
              (USER
                ? ""
                : field(
                    "cfE",
                    "Email (optional)",
                    "Use the same email when you log in later",
                    (st && st.dl && st.dl.email) || "",
                    'type="email" inputmode="email" autocomplete="email" maxlength="100"',
                  )) +
              '<div class="coTwo">' +
              field(
                "cfP",
                "Mobile number",
                "10-digit mobile",
                kept("phone", ph10(PROF.phone)),
                'inputmode="numeric" maxlength="10" autocomplete="tel"',
              ) +
              field(
                "cfA",
                "Alternate mobile number",
                "Optional if the other is filled",
                kept("altPhone", ph10(PROF.altPhone)),
                'inputmode="numeric" maxlength="10"',
              ) +
              "</div>" +
              field(
                "cfL1",
                "Address line 1",
                "House / flat no., building, street",
                kept("line1", A.line1 || (!PROF.addr ? PROF.address : "") || ""),
                'autocomplete="address-line1"',
              ) +
              field(
                "cfL2",
                "Address line 2",
                "Area, colony, locality (optional if line 1 is filled)",
                kept("line2", A.line2 || ""),
                'autocomplete="address-line2"',
              ) +
              field("cfLm", "Landmark", "Near (optional)", kept("landmark", A.landmark || "")) +
              '<div class="coTwo">' +
              field(
                "cfPin",
                "Pincode *",
                "6-digit pincode",
                kept("pin", A.pin || ""),
                'inputmode="numeric" maxlength="6" autocomplete="postal-code"',
              ) +
              field(
                "cfC",
                "City *",
                "City / town",
                kept("city", A.city || ""),
                'autocomplete="address-level2"',
              ) +
              "</div>" +
              '<div class="coF"><label for="cfS">State *</label><div class="stW"><input id="cfS" autocomplete="off" autocapitalize="words" placeholder="Type or pick your state" role="combobox" aria-expanded="false" value="' +
              esc(kept("state", A.state || "")) +
              '"><button type="button" class="stB" id="stB" aria-label="Show all states" tabindex="-1">\u25be</button><div class="stL" id="stL" hidden></div></div></div>' +
              '<p class="mut coNote">Fill at least one mobile number and at least one address line.</p><p class="coErr" id="coErr"></p></div>' +
              '<button type="button" class="btn coBtn" id="coGo" data-c="pay"></button><p class="mut coNote">Delivery is free. You will pay by UPI on the next step.</p>';
            bill();
            payBtn();
            cpBox();
            return;
          }
          var amt = payable(),
            link = upiLink(amt);
          var apps = [
            ["gpay", "Google Pay"],
            ["phonepe", "PhonePe"],
            ["paytm", "Paytm"],
            ["bhim", "BHIM"],
            ["pop", "Pop UPI"],
            ["upi", "Other UPI"],
          ];
          body.innerHTML =
            '<div class="coCard coPay"><div class="mut">Amount to pay</div><div class="coAmt">' +
            money(amt) +
            '</div><div class="mut" style="font-size:13px">Delivery \u20b90 \u00b7 Pay to <b>' +
            esc(UPI_ID) +
            "</b></div></div>" +
            '<div class="coCard coQrC"><b>Scan &amp; pay</b><div class="coQr" id="coQr"></div><p class="mut coNote">Open any UPI app on your phone \u2192 Scan \u2192 pay exactly ' +
            money(amt) +
            ".</p>" +
            '<button type="button" class="btn g sm" data-c="copy">Copy UPI ID</button></div>' +
            '<div class="coCard"><b>Or pay with an app</b><div class="coApps">' +
            apps
              .map(function (a) {
                return (
                  '<button type="button" class="coApp" data-c="app" data-a="' +
                  a[0] +
                  '"><span class="coLg">' +
                  LOGO[a[0]] +
                  "</span><span>" +
                  a[1] +
                  "</span></button>"
                );
              })
              .join("") +
            '</div><p class="mut coNote" id="coHint">Tap an app on your phone. On a laptop, scan the QR above instead.</p></div>' +
            '<div class="coCard"><b>Confirm your payment</b><p class="mut coNote" style="margin-top:4px">After paying, enter the UTR (UPI reference number) from your payment app. It is ' +
            UTR_MIN +
            "\u2013" +
            UTR_MAX +
            " digits.</p>" +
            '<input id="cuUtr" inputmode="numeric" autocomplete="off" maxlength="' +
            UTR_MAX +
            '" placeholder="Enter UTR number"><p class="coErr" id="coErr"></p>' +
            '<button type="button" class="btn coBtn" id="coSub" data-c="submit" disabled>Submit &amp; place order</button></div>' +
            '<button type="button" class="coBack" data-c="back">\u2190 Edit address</button>';
          try {
            var q = qrcode(0, "M");
            q.addData(link);
            q.make();
            $$("#coQr").innerHTML = q.createSvgTag({
              cellSize: 4,
              margin: 2,
              scalable: true,
            });
          } catch (e) {
            $$("#coQr").textContent =
              "Could not draw the QR. Use the UPI ID: " + UPI_ID;
          }
        }
        function upiLink(amt, scheme) {
          return (
            (scheme || "upi://pay") +
            "?pa=" +
            UPI_ID +
            "&pn=" +
            encodeURIComponent(UPI_NAME) +
            "&am=" +
            (+amt).toFixed(2) +
            "&cu=INR&tn=" +
            encodeURIComponent("Customiza order")
          );
        }
        function openApp(k) {
          var amt = payable(),
            u;
          if (k === "gpay")
            u = upiLink(amt, IOS ? "gpay://upi/pay" : "tez://upi/pay");
          else if (k === "phonepe") u = upiLink(amt, "phonepe://pay");
          else if (k === "paytm")
            u = upiLink(amt, IOS ? "paytmmp://upi/pay" : "paytmmp://pay");
          else u = upiLink(amt);
          var h = $$("#coHint");
          if (h)
            h.textContent =
              "Opening the app\u2026 if nothing opens, scan the QR above or pay to " +
              UPI_ID +
              ".";
          window.location.href = u;
        }
        function copyId(b) {
          var done = function () {
            var o = b.textContent;
            b.textContent = "Copied \u2713";
            setTimeout(function () {
              b.textContent = o;
            }, 1600);
          };
          try {
            navigator.clipboard.writeText(UPI_ID).then(done, function () {
              fallback();
            });
          } catch (e) {
            fallback();
          }
          function fallback() {
            var t = document.createElement("textarea");
            t.value = UPI_ID;
            document.body.appendChild(t);
            t.select();
            try {
              document.execCommand("copy");
              done();
            } catch (e) {}
            t.remove();
          }
        }
        function val(id) {
          var e = $$("#" + id);
          return e ? e.value.trim() : "";
        }
        function toPay() {
          var d = {
            name: val("cfN"),
            email: val("cfE"),
            phone: ph10(val("cfP")),
            altPhone: ph10(val("cfA")),
            line1: val("cfL1"),
            line2: val("cfL2"),
            landmark: val("cfLm"),
            pin: val("cfPin"),
            city: val("cfC"),
            state: stNorm(val("cfS")),
          };
          var bad = [],
            msg = "";
          function chk(ok, id, m) {
            if (!ok) {
              bad.push(id);
              if (!msg) msg = m;
            }
          }
          chk(d.name.length >= 2, "cfN", "Please enter your full name.");
          chk(
            !d.email ||
              (d.email.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)),
            "cfE",
            "Enter a valid email, or leave it empty.",
          );
          d.email = d.email.toLowerCase();
          var okP = /^[6-9]\d{9}$/.test(d.phone),
            okA = /^[6-9]\d{9}$/.test(d.altPhone);
          /* at least ONE valid mobile number (either box); a box that is filled must be valid and the two must differ */
          if (!okP && !okA) { chk(false, "cfP", "Enter at least one valid 10-digit mobile number."); bad.push("cfA"); }
          else {
            chk(!d.phone || okP, "cfP", "Enter a valid 10-digit mobile number.");
            chk(!d.altPhone || okA, "cfA", "Enter a valid 10-digit alternate number, or leave it empty.");
            chk(!(okP && okA) || d.altPhone !== d.phone, "cfA", "The two mobile numbers must be different.");
          }
          /* at least ONE address line (either box) */
          if (d.line1.length < 4 && d.line2.length < 4) { chk(false, "cfL1", "Please enter at least one address line."); bad.push("cfL2"); }
          else {
            chk(!d.line1 || d.line1.length >= 4, "cfL1", "Address line 1 is too short.");
            chk(!d.line2 || d.line2.length >= 4, "cfL2", "Address line 2 is too short.");
          }
          chk(
            /^[1-9]\d{5}$/.test(d.pin),
            "cfPin",
            "Enter a valid 6-digit pincode.",
          );
          chk(d.city.length >= 2, "cfC", "Please enter your city.");
          chk(!!d.state, "cfS", "Please type or pick a valid state.");
          var er = $$("#coErr");
          if (bad.length) {
            bad.forEach(function (i) {
              $$("#" + i).classList.add("bad");
            });
            er.textContent = msg;
            var f = $$("#" + bad[0]);
            f.scrollIntoView({ block: "center", behavior: "smooth" });
            f.focus();
            return;
          }
          if (!d.phone) { d.phone = d.altPhone; d.altPhone = ""; }
          if (!d.line1) { d.line1 = d.line2; d.line2 = ""; }
          d.address = [
            d.line1,
            d.line2,
            d.landmark ? "Landmark: " + d.landmark : "",
            d.city,
            d.state + " - " + d.pin,
          ]
            .filter(Boolean)
            .join(", ");
          st.dl = d;
          st.step = 2;
          render();
          var b = $$(".coBox");
          if (b) b.scrollTop = 0;
        }
        function utrState() {
          var v = val("cuUtr"),
            b = $$("#coSub");
          if (b) b.disabled = !(v.length >= UTR_MIN && v.length <= UTR_MAX);
          var e = $$("#coErr");
          if (e) e.textContent = "";
        }
        async function placePaid(items, dl, fromCart, pay) {
          /* the logged-in user, or (guest checkout) a hidden guest session */
          var OU = await orderUser(),
            gem = String(USER ? USER.email || "" : dl.email || "")
              .trim()
              .toLowerCase();
          var batch = FS.batch(),
            gid = rid("g_"),
            now = Date.now(),
            made = [];
          items.forEach(function (it) {
            var pr = P.filter(function (q) {
              return q.id === it.pid;
            })[0];
            if (!pr)
              throw new Error(
                '"' +
                  (it.pname || "A product") +
                  '" is no longer available. Remove it from your cart.',
              );
            var d = Object.assign({}, it),
              png = d.design,
              id = rid("o_"),
              u = Math.floor(+pr.price) || PRICE;
            delete d.design;
            delete d.id;
            d.unit = u;
            d.total = u * d.qty;
            if (pay.coupon) {
              var ds = Math.floor((u * d.qty * pay.coupon.pct) / 100);
              d.discount = ds;
              d.total = u * d.qty - ds;
              d.coupon = { code: pay.coupon.code, pct: pay.coupon.pct };
            }
            Object.assign(d, {
              uid: OU.uid,
              email: gem,
              ts: now,
              name: dl.name,
              phone: dl.phone,
              altPhone: dl.altPhone || "",
              address: dl.address,
              addr: {
                line1: dl.line1,
                line2: dl.line2,
                landmark: dl.landmark,
                city: dl.city,
                state: dl.state,
                pin: dl.pin,
              },
              deliveryFee: 0,
              status: "New",
              groupId: gid,
              payMethod: "UPI",
              payStatus: "UTR submitted - verify",
              orderNo: newOrderNo(),
              payment: {
                method: "UPI",
                upiId: pay.upiId,
                utr: pay.utr,
                amount: pay.amount,
                groupId: gid,
                ts: now,
              },
            });
            made.push(Object.assign({ id: id }, d));
            batch.set(FS.collection("orders").doc(id), d);
            batch.set(
              FS.collection("orders").doc(id).collection("files").doc("design"),
              { png: png, ts: now },
            );
            if (fromCart && it.id) batch.delete(cartRef().doc(it.id));
          });
          batch.set(FS.collection("utrs").doc(pay.utr), {
            uid: OU.uid,
            groupId: gid,
            ts: now,
          });
          var prof = {
            name: dl.name,
            phone: dl.phone,
            altPhone: dl.altPhone || "",
            address: dl.address,
            addr: {
              line1: dl.line1,
              line2: dl.line2,
              landmark: dl.landmark,
              city: dl.city,
              state: dl.state,
              pin: dl.pin,
            },
          };
          /* only a logged-in customer has a saved profile; a guest does not */
          if (USER)
            batch.set(
              FS.collection("users").doc(USER.uid),
              Object.assign({ email: USER.email || "", updated: now }, prof),
              { merge: true },
            );
          await batch.commit();
          if (USER) Object.assign(PROF, prof);
          return made;
        }
        async function submit() {
          var utr = digits(val("cuUtr")),
            er = $$("#coErr"),
            b = $$("#coSub");
          if (utr.length < UTR_MIN || utr.length > UTR_MAX) {
            er.textContent =
              "Enter the " +
              UTR_MIN +
              "\u2013" +
              UTR_MAX +
              " digit UTR from your payment app.";
            return;
          }
          if (st.busy) return;
          st.busy = true;
          b.disabled = true;
          b.textContent = "Placing your order\u2026";
          er.textContent = "";
          var DUP =
            "This UTR number has already been used for another order. Please check and enter the correct UTR from your payment app.";
          /* Speed: no separate "is this UTR used?" read before saving (that was an extra full round trip to the server).
             The order is saved in ONE atomic write that also creates utrs/<UTR>; if the UTR already exists the server rejects
             the whole write and the catch below shows the same "already used" message. */
          try {
            var amt = payable(),
              nm = st.dl.name;
            var dlv = st.dl,
              made = await placePaid(st.items, st.dl, st.fromCart, {
                upiId: UPI_ID,
                utr: utr,
                amount: amt,
                coupon: st.coupon || null,
              });
            close();
            showThanks(made, dlv);
          } catch (e) {
            st.busy = false;
            b.disabled = false;
            b.innerHTML = "Submit &amp; place order";
            er.textContent =
              e && e.code === "permission-denied"
                ? DUP + (st.coupon ? " If you used a coupon, it may also have expired." : "")
                : "Could not place order: " + (e.message || e.code);
          }
        }
        window.openCheckout = function (items, fromCart) {
          if (!items || !items.length) return;
          if (!M) build();
          st = {
            items: items.map(function (it) {
              return Object.assign({}, it);
            }),
            fromCart: !!fromCart,
            step: 1,
            dl: null,
            busy: false,
          };
          M.hidden = false;
          document.documentElement.style.overflow = "hidden";
          render();
          $$(".coBox").scrollTop = 0;
        };
      })();
    
