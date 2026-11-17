      /* ===== Help Center: floating bubble on the home page only. Hidden while designing (Instant Design / Design Studio). ===== */
      (function () {
        var ISSUES = [
          ["where", "Where is my order?"],
          ["addr_wrong", "I entered a wrong delivery address"],
          ["addr_change", "I want to change my delivery address"],
          ["pay", "My payment is not confirmed"],
          ["cancel", "I want to cancel my order"],
          ["item", "Wrong / damaged item or print issue"],
          ["other", "Something else"],
        ];
        var B = document.createElement("button");
        B.id = "hcBtn";
        B.type = "button";
        B.hidden = true;
        B.setAttribute("aria-label", "Help Center");
        B.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.8-1.1 1.6M12 16.5v.01"/></svg><span>Help<br>Center</span>';
        var P = document.createElement("div");
        P.id = "hcP";
        P.hidden = true;
        P.innerHTML =
          '<div class="hh"><div><b>Help Center</b><small>Customiza support</small></div><button type="button" class="hx" data-a="close" aria-label="Close">×</button></div><div id="hcM"></div><form id="hcIn" hidden><input id="hcTx" maxlength="400" placeholder="Type your message…" autocomplete="off"><button type="submit">Send</button></form>';
        document.body.appendChild(B);
        document.body.appendChild(P);
        var M = P.querySelector("#hcM"),
          IN = P.querySelector("#hcIn"),
          TX = P.querySelector("#hcTx");
        var MQ = window.matchMedia("(max-width:760px)"),
          isOpen = false,
          pinned = false,
          started = false,
          stage = "",
          ORD = [],
          cur = null,
          sending = false,
          loadedFor = null,
          NQ = "";
        function e(s) {
          return typeof esc === "function"
            ? esc(s)
            : String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
                return {
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                }[c];
              });
        }
        function mon(n) {
          return typeof money === "function"
            ? money(n)
            : "₹" + (+n || 0).toLocaleString("en-IN");
        }
        function down() {
          setTimeout(function () {
            M.scrollTop = M.scrollHeight;
          }, 30);
        }
        function say(h, who) {
          var d = document.createElement("div");
          d.className = "m " + (who || "bot");
          d.innerHTML = h;
          M.appendChild(d);
          down();
          return d;
        }
        function ops(h) {
          var d = document.createElement("div");
          d.className = "ops";
          d.innerHTML = h;
          M.appendChild(d);
          down();
          return d;
        }
        function lock() {
          [].forEach.call(M.querySelectorAll(".ops button"), function (b) {
            b.disabled = true;
          });
        }
        function reset() {
          M.innerHTML = "";
          started = false;
          stage = "";
          ORD = [];
          cur = null;
          IN.hidden = true;
          loadedFor = null;
          NQ = "";
        }
        function ask(ph) {
          IN.hidden = false;
          TX.placeholder = ph;
          fit();
          setTimeout(function () {
            TX.focus();
            down();
          }, 60);
        }
        function engaged() {
          var n = document.getElementById("nameSec"),
            i = document.getElementById("nmIn"),
            d = document.getElementById("nmD");
          try {
            if (
              typeof NS !== "undefined" &&
              NS &&
              NS.name &&
              String(NS.name).trim()
            )
              return true;
          } catch (x) {}
          if (i && document.activeElement === i) return true;
          if (d && !d.hidden) return true;
          if (n && n.dataset && n.dataset.wz && n.dataset.wz !== "name")
            return true;
          return false;
        }
        function shouldShow() {
          try {
            if (typeof VIEW === "undefined" || VIEW !== "home") return false;
          } catch (x) {
            return false;
          }
          var pf = document.getElementById("picFlow");
          if (pf && !pf.hidden) return false;
          if (engaged()) return false;
          if (document.querySelector(".modal:not([hidden]),.coM:not([hidden])"))
            return false;
          return true;
        }
        function modalOpen() {
          return !!document.querySelector(
            ".modal:not([hidden]),.coM:not([hidden])",
          );
        }
        function fit() {
          if (!isOpen || !MQ.matches) {
            P.style.height = "";
            P.style.top = "";
            return;
          }
          var v = window.visualViewport;
          P.style.height = (v ? v.height : window.innerHeight) + "px";
          P.style.top = (v ? v.offsetTop : 0) + "px";
        }
        function sync() {
          var v = shouldShow(),
            mo = modalOpen();
          if (isOpen && !pinned && !v && !mo) isOpen = false;
          B.hidden = !v;
          P.hidden = !(isOpen && !mo);
          document.documentElement.classList.toggle(
            "hcLock",
            !P.hidden && MQ.matches,
          );
          fit();
        }
        if (window.visualViewport) {
          ["resize", "scroll"].forEach(function (n) {
            visualViewport.addEventListener(n, function () {
              fit();
              down();
            });
          });
        }
        window.addEventListener("orientationchange", function () {
          setTimeout(function () {
            fit();
            down();
          }, 250);
        });
        function openP() {
          isOpen = true;
          if (MQ.matches) pinned = true;
          sync();
          if (!started) begin();
        }
        function closeP() {
          isOpen = false;
          pinned = false;
          sync();
        }
        function begin() {
          started = true;
          M.innerHTML = "";
          var u = window.AUTH && AUTH.currentUser;
          say("Hi! 👋 Welcome to the Customiza Help Center.");
          if (!u) {
            stage = "login";
            say("To help you with your orders, please log in first.");
            ops(
              '<button type="button" class="pri" data-a="login">Log in</button>',
            );
            return;
          }
          loadOrders(u);
        }
        function fetchOrders(u) {
          return new Promise(function (res, rej) {
            if (window.MYO_OK && Array.isArray(window.MYO)) {
              res(window.MYO.slice());
              return;
            }
            var done = false,
              un = null,
              tm = setTimeout(function () {
                if (done) return;
                done = true;
                try {
                  un && un();
                } catch (x) {}
                rej(new Error("timeout"));
              }, 9000);
            un = FS.collection("orders")
              .where("uid", "==", u.uid)
              .onSnapshot(
                function (sn) {
                  if (done) return;
                  done = true;
                  clearTimeout(tm);
                  try {
                    un();
                  } catch (x) {}
                  res(
                    sn.docs.map(function (d) {
                      var x = d.data();
                      x.id = d.id;
                      return x;
                    }),
                  );
                },
                function (er) {
                  if (done) return;
                  done = true;
                  clearTimeout(tm);
                  rej(er);
                },
              );
          });
        }
        function loadOrders(u) {
          stage = "loading";
          var t = say("Checking your orders…", "bot typing");
          fetchOrders(u)
            .then(function (list) {
              t.remove();
              ORD = list
                .sort(function (a, b) {
                  return (b.ts || 0) - (a.ts || 0);
                })
                .slice(0, 15);
              if (!ORD.length) {
                stage = "noorder_q";
                say("You don't have any orders yet. 🙂");
                mailMsg();
                say("Tell us your query 👇");
                ask("Type your query…");
                return;
              }
              pickOrder();
            })
            .catch(function (er) {
              t.remove();
              stage = "err";
              say(
                er && er.message === "timeout"
                  ? "Loading is taking longer than usual. Please check your internet and try again."
                  : "Sorry, I could not load your orders: " +
                      e((er && (er.message || er.code)) || ""),
              );
              mailMsg();
              ops(
                '<button type="button" class="pri" data-a="retry">Try again</button>',
              );
            });
        }
        function pickOrder() {
          stage = "pick";
          cur = null;
          say("Which order do you need help with?");
          ops(
            ORD.map(function (x, i) {
              return (
                '<button type="button" class="hcO" data-o="' +
                i +
                '"><img src="' +
                (x.preview || "") +
                '" alt=""><span><b>#' +
                e(x.orderNo || x.id.slice(-6).toUpperCase()) +
                "</b><br>" +
                e(x.pname || "Tee") +
                " · size " +
                e(x.size) +
                " · ×" +
                (x.qty || 1) +
                " · " +
                mon(x.total) +
                '<br><span class="st">' +
                e(x.status || "New") +
                "</span> " +
                new Date(x.ts).toLocaleDateString() +
                "</span></button>"
              );
            }).join(""),
          );
        }
        function pickIssue() {
          stage = "issue";
          say("What help do you need?");
          ops(
            ISSUES.map(function (q) {
              return (
                '<button type="button" data-k="' +
                q[0] +
                '">' +
                q[1] +
                "</button>"
              );
            }).join(""),
          );
        }
        function mailMsg() {
          say(
            'If you would like to contact us directly, you can email us at <a href="mailto:customiza.official@gmail.com">customiza.official@gmail.com</a>.',
          );
        }
        function noOf(x) {
          return x.orderNo || x.id.slice(-6).toUpperCase();
        }
        function send(key, label, msg) {
          if (sending || !cur) return;
          sending = true;
          lock();
          var u = window.AUTH && AUTH.currentUser;
          if (!u) {
            sending = false;
            begin();
            return;
          }
          var x = cur,
            doc = {
              uid: u.uid,
              orderId: x.id,
              orderNo: noOf(x),
              issueKey: key,
              issue: label,
              message: msg || "",
              name: x.name || "",
              phone: x.phone || "",
              altPhone: x.altPhone || "",
              email: x.email || u.email || "",
              address: x.address || "",
              pname: ((x.pname || "") + " " + (x.color || "")).trim(),
              size: x.size || "",
              qty: x.qty || 1,
              total: x.total || 0,
              orderStatus: x.status || "New",
              status: "Open",
              ts: Date.now(),
            };
          var t = say("Sending…", "bot typing");
          FS.collection("queries")
            .add(doc)
            .then(function () {
              t.remove();
              stage = "done";
              say(
                "Okay, we have noted your details and will contact you soon. ✅<br><br><b>Order ID:</b> #" +
                  e(noOf(x)) +
                  "<br><b>Issue:</b> " +
                  e(label) +
                  (msg ? "<br><b>Your query:</b> " + e(msg) : "") +
                  "<br><b>We will reach you on:</b> " +
                  e(x.phone || "") +
                  (x.altPhone ? " / " + e(x.altPhone) : ""),
              );
              mailMsg();
              ops(
                '<button type="button" data-a="another">Help with another order</button><button type="button" data-a="close">Close</button>',
              );
              sending = false;
            })
            .catch(function (er) {
              t.remove();
              sending = false;
              say("Sorry, we could not send this: " + e(er.message || er.code));
              ops(
                '<button type="button" data-k="' + key + '">Try again</button>',
              );
            });
        }
        B.addEventListener("click", function () {
          if (isOpen) closeP();
          else {
            pinned = false;
            openP();
          }
        });
        var TOP = document.getElementById("hcTop");
        if (TOP)
          TOP.addEventListener("click", function () {
            if (isOpen && pinned) closeP();
            else {
              pinned = true;
              openP();
            }
          });
        P.addEventListener("click", function (ev) {
          var t = ev.target.closest && ev.target.closest("button");
          if (!t) return;
          var d = t.dataset;
          if (d.a === "close") {
            closeP();
            return;
          }
          if (d.a === "login") {
            if (typeof openAuth === "function")
              openAuth("Log in to get help with your orders");
            return;
          }
          if (d.a === "shop") {
            closeP();
            location.hash = "#custom";
            return;
          }
          if (d.a === "retry") {
            begin();
            return;
          }
          if (d.a === "another") {
            lock();
            pickOrder();
            return;
          }
          if (d.o != null) {
            var x = ORD[+d.o];
            if (!x || stage !== "pick") return;
            cur = x;
            lock();
            say("Order #" + e(noOf(x)), "me");
            pickIssue();
            return;
          }
          if (d.k) {
            var q = ISSUES.filter(function (z) {
              return z[0] === d.k;
            })[0];
            if (!q || !cur) return;
            lock();
            say(e(q[1]), "me");
            if (d.k === "other") {
              stage = "other";
              say("What query do you have? Please type it below.");
              ask("Type your query…");
              return;
            }
            send(q[0], q[1], "");
          }
        });
        function sendNoOrder(query, contact) {
          if (sending) return;
          sending = true;
          var u = window.AUTH && AUTH.currentUser;
          if (!u) {
            sending = false;
            begin();
            return;
          }
          var m = contact.match(/\+?\d[\d\s\-]{5,}\d/),
            ph = m ? m[0].replace(/\s+/g, " ").trim() : contact,
            nm =
              (m ? contact.replace(m[0], "") : "")
                .replace(/[,;:\-]+/g, " ")
                .replace(/\s+/g, " ")
                .trim() ||
              u.displayName ||
              "";
          var doc = {
            uid: u.uid,
            orderId: "",
            orderNo: "",
            noOrder: true,
            issueKey: "noorder",
            issue: "Query (no order placed yet)",
            message: query,
            name: nm,
            phone: ph,
            altPhone: "",
            contactNote: contact,
            email: u.email || "",
            address: "",
            pname: "",
            size: "",
            qty: 0,
            total: 0,
            orderStatus: "",
            status: "Open",
            ts: Date.now(),
          };
          var t = say("Sending…", "bot typing");
          FS.collection("queries")
            .add(doc)
            .then(function () {
              t.remove();
              stage = "done";
              say(
                "Thank you! ✅ We have noted your query and will contact you shortly.<br><br><b>Your query:</b> " +
                  e(query) +
                  "<br><b>We will reach you on:</b> " +
                  e(ph),
              );
              mailMsg();
              ops(
                '<button type="button" class="pri" data-a="shop">Design a tee</button><button type="button" data-a="close">Close</button>',
              );
              sending = false;
            })
            .catch(function (er) {
              t.remove();
              sending = false;
              say("Sorry, we could not send this: " + e(er.message || er.code));
              ask("Your phone number & details");
            });
        }
        IN.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var v = TX.value.trim();
          if (!v) return;
          if (stage === "other") {
            TX.value = "";
            IN.hidden = true;
            say(e(v), "me");
            send("other", "Something else", v);
            return;
          }
          if (stage === "noorder_q") {
            TX.value = "";
            NQ = v;
            say(e(v), "me");
            stage = "noorder_c";
            say(
              "Thanks! Please share your phone number and any other details, so we can contact you.",
            );
            ask("Your phone number & details");
            return;
          }
          if (stage === "noorder_c") {
            if (v.replace(/\D/g, "").length < 7) {
              say("Please include a valid phone number so we can reach you.");
              return;
            }
            TX.value = "";
            IN.hidden = true;
            say(e(v), "me");
            sendNoOrder(NQ, v);
          }
        });
        /* when the person logs in or out */
        if (window.AUTH)
          AUTH.onAuthStateChanged(function (u) {
            if (!u) {
              reset();
              if (isOpen) begin();
              return;
            }
            if (isOpen && stage === "login") {
              begin();
            } else if (!isOpen && stage === "login") {
              reset();
            }
          });
        /* keep the bubble in sync with where the person is */
        window.addEventListener("hashchange", function () {
          setTimeout(sync, 60);
        });
        [
          "click",
          "input",
          "focusin",
          "focusout",
          "transitionend",
          "animationend",
        ].forEach(function (n) {
          document.addEventListener(
            n,
            function () {
              setTimeout(sync, 80);
            },
            true,
          );
        });
        setInterval(sync, 400);
        sync();
      })();
    
