      var PRICE = 1999,
        S = { size: null, img: null, pid: null, base: null };
      var $ = function (i) {
        return document.getElementById(i);
      };
      function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
          return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
      }
      /* ===== Base price (MRP): shown cut above the final price. A product with no base price uses 2000. ===== */
      var BASE_DEF = 2000;
      function baseOf(x) {
        var b = Math.floor(+(x && x.basePrice));
        return b > 0 ? b : BASE_DEF;
      }
      function mrpHtml(x, mult) {
        var f = +(x && x.price) || PRICE,
          b = baseOf(x);
        return b > f
          ? '<s class="mrp">₹' + (b * (mult || 1)).toLocaleString("en-IN") + "</s>"
          : "";
      }
      function toast(t) {
        var e = $("toast");
        e.textContent = t;
        e.style.display = "block";
        setTimeout(function () {
          e.style.display = "none";
        }, 2600);
      }

      /* design layered on the admin's product photo */
      function scene(o) {
        var sz = (o.sz / 100) * 220,
          cx = 40 + (o.px / 100) * 320,
          cy = 60 + (o.py / 100) * 280;
        return (
          (o.base
            ? '<image href="' +
              o.base +
              '" x="0" y="0" width="400" height="440" preserveAspectRatio="xMidYMid slice"/>'
            : '<rect width="400" height="440" fill="#ddd"/>') +
          (o.img
            ? '<image href="' +
              o.img +
              '" x="' +
              (cx - sz / 2) +
              '" y="' +
              (cy - sz / 2) +
              '" width="' +
              sz +
              '" height="' +
              sz +
              '" preserveAspectRatio="xMidYMid meet"/>'
            : "")
        );
      }
      /* ===== Back-of-shirt live preview: up to 5 texts + 1 PNG, each placed on its own ===== */
      var BASE_URL =
        "assets/5912f5934030.webp";
      var FONTS = [
        ["Anton", 400],
        ["Bebas Neue", 400],
        ["Archivo Black", 400],
        ["Oswald", 700],
        ["Big Shoulders Display", 900],
        ["Orbitron", 800],
        ["Abril Fatface", 400],
        ["Baskervville", 700],
        ["Permanent Marker", 400],
        ["Bowlby One", 400],
        ["Roboto", 900],
        ["Hubot Sans", 900],
      ];
      /* ===== Language engine: sound-for-sound conversion into the product's script (never translates meaning) ===== */
      var LANGS = {
          en: "English",
          hi: "Hindi (हिन्दी)",
          mr: "Marathi (मराठी)",
          te: "Telugu (తెలుగు)",
          ja: "Japanese (日本語)",
          zh: "Chinese (中文)",
          ur: "Urdu (اردو)",
        },
        SAMPLES = {
          en: "RAJ",
          hi: "राज",
          mr: "राज",
          te: "రాజ్",
          ja: "ラジ",
          zh: "拉吉",
          ur: "راج",
        },
        LANG = "en",
        DEVF = [
          ["Noto Sans Devanagari", 900],
          ["Rozha One", 400],
          ["Yatra One", 400],
          ["Kalam", 700],
          ["Teko", 700],
          ["Khand", 700],
          ["Mukta", 800],
          ["Tiro Devanagari Hindi", 400],
        ],
        FONT_SETS = {
          en: FONTS,
          hi: DEVF,
          mr: DEVF,
          te: [
            ["Noto Sans Telugu", 900],
            ["Ramabhadra", 400],
            ["Mallanna", 400],
            ["Dhurjati", 400],
            ["Gurajada", 400],
            ["Peddana", 400],
          ],
          ja: [
            ["Noto Sans JP", 900],
            ["Dela Gothic One", 400],
            ["Rampart One", 400],
            ["Potta One", 400],
            ["Reggae One", 400],
            ["RocknRoll One", 400],
          ],
          zh: [
            ["Noto Sans SC", 900],
            ["Ma Shan Zheng", 400],
            ["ZCOOL KuaiLe", 400],
            ["ZCOOL QingKe HuangYou", 400],
            ["Zhi Mang Xing", 400],
            ["Noto Serif SC", 900],
          ],
          ur: [
            ["Noto Nastaliq Urdu", 700],
            ["Gulzar", 400],
            ["Noto Naskh Arabic", 700],
            ["Amiri", 700],
            ["Lateef", 800],
            ["Scheherazade New", 700],
            ["Noto Kufi Arabic", 900],
            ["Noto Sans Arabic", 900],
          ],
        },
        DV = {
          kh: "ख",
          gh: "घ",
          chh: "छ",
          ch: "च",
          jh: "झ",
          th: "थ",
          dh: "ध",
          ph: "फ",
          bh: "भ",
          sh: "श",
          k: "क",
          g: "ग",
          c: "क",
          j: "ज",
          t: "त",
          d: "द",
          n: "न",
          p: "प",
          b: "ब",
          m: "म",
          y: "य",
          r: "र",
          l: "ल",
          v: "व",
          w: "व",
          s: "स",
          h: "ह",
          f: "फ",
          z: "ज",
          q: "क",
          x: "क्स",
        },
        VW = {
          aa: ["ा", "आ"],
          ai: ["ै", "ऐ"],
          au: ["ौ", "औ"],
          ee: ["ी", "ई"],
          oo: ["ू", "ऊ"],
          ou: ["ौ", "औ"],
          ie: ["ी", "ई"],
          ea: ["ी", "ई"],
          a: ["", "अ"],
          i: ["ि", "इ"],
          u: ["ु", "उ"],
          e: ["े", "ए"],
          o: ["ो", "ओ"],
        },
        LC = {
          क: "k",
          ख: "kh",
          ग: "g",
          घ: "gh",
          ङ: "ng",
          च: "ch",
          छ: "chh",
          ज: "j",
          झ: "jh",
          ञ: "ny",
          ट: "t",
          ठ: "th",
          ड: "d",
          ढ: "dh",
          ण: "n",
          त: "t",
          थ: "th",
          द: "d",
          ध: "dh",
          न: "n",
          प: "p",
          फ: "ph",
          ब: "b",
          भ: "bh",
          म: "m",
          य: "y",
          र: "r",
          ल: "l",
          व: "v",
          श: "sh",
          ष: "sh",
          स: "s",
          ह: "h",
          ळ: "l",
        },
        LV = {
          अ: "a",
          आ: "a",
          इ: "i",
          ई: "i",
          उ: "u",
          ऊ: "u",
          ए: "e",
          ऐ: "ai",
          ओ: "o",
          औ: "au",
          ऋ: "ri",
          "ा": "a",
          "ि": "i",
          "ी": "i",
          "ु": "u",
          "ू": "u",
          "े": "e",
          "ै": "ai",
          "ो": "o",
          "ौ": "au",
          "ृ": "ri",
          "ं": "n",
          "ँ": "n",
          "ः": "h",
        },
        VG = {
          a: ["a", ""],
          e: ["e", ""],
          i: ["i", ""],
          o: ["o", ""],
          u: ["u", ""],
          aa: ["a", "ー"],
          ee: ["i", "ー"],
          ea: ["i", "ー"],
          ie: ["i", "ー"],
          oo: ["u", "ー"],
          oa: ["o", "ー"],
          ai: ["a", "イ"],
          ay: ["e", "イ"],
          ey: ["e", "イ"],
          ei: ["e", "イ"],
          au: ["a", "ウ"],
          aw: ["o", "ー"],
          ou: ["a", "ウ"],
          ow: ["o", "ウ"],
        },
        KJ = {
          "": "ア イ ウ エ オ",
          k: "カ キ ク ケ コ",
          g: "ガ ギ グ ゲ ゴ",
          s: "サ シ ス セ ソ",
          z: "ザ ジ ズ ゼ ゾ",
          t: "タ ティ トゥ テ ト",
          d: "ダ ディ ドゥ デ ド",
          n: "ナ ニ ヌ ネ ノ",
          h: "ハ ヒ フ ヘ ホ",
          b: "バ ビ ブ ベ ボ",
          p: "パ ピ プ ペ ポ",
          m: "マ ミ ム メ モ",
          y: "ヤ イ ユ エ ヨ",
          r: "ラ リ ル レ ロ",
          l: "ラ リ ル レ ロ",
          w: "ワ ウィ ウ ウェ ウォ",
          f: "ファ フィ フ フェ フォ",
          v: "ヴァ ヴィ ヴ ヴェ ヴォ",
          j: "ジャ ジ ジュ ジェ ジョ",
          S: "シャ シ シュ シェ ショ",
          C: "チャ チ チュ チェ チョ",
        },
        FJ = {
          k: "ク",
          g: "グ",
          s: "ス",
          z: "ズ",
          t: "ト",
          d: "ド",
          n: "ン",
          h: "フ",
          b: "ブ",
          p: "プ",
          m: "ム",
          y: "イ",
          r: "ル",
          l: "ル",
          w: "ウ",
          f: "フ",
          v: "ヴ",
          j: "ジ",
          S: "シュ",
          C: "チ",
        },
        KZ = {
          "": "阿 埃 伊 奥 乌",
          b: "巴 贝 比 波 布",
          p: "帕 佩 皮 波 普",
          m: "马 梅 米 莫 穆",
          f: "法 费 菲 弗 夫",
          d: "达 德 迪 多 杜",
          t: "塔 特 蒂 托 图",
          n: "纳 内 尼 诺 努",
          l: "拉 莱 利 洛 卢",
          g: "加 格 吉 戈 古",
          k: "卡 凯 基 科 库",
          h: "哈 赫 希 霍 胡",
          j: "贾 杰 吉 乔 朱",
          r: "拉 雷 里 罗 鲁",
          s: "萨 塞 西 索 苏",
          z: "扎 泽 兹 佐 祖",
          v: "瓦 维 维 沃 武",
          w: "瓦 韦 维 沃 乌",
          y: "亚 耶 伊 约 尤",
          S: "沙 谢 希 肖 舒",
          C: "查 切 奇 乔 楚",
        },
        FZ = {
          b: "布",
          p: "普",
          m: "姆",
          f: "夫",
          d: "德",
          t: "特",
          n: "恩",
          l: "尔",
          g: "格",
          k: "克",
          h: "赫",
          j: "吉",
          r: "尔",
          s: "斯",
          z: "兹",
          v: "夫",
          w: "乌",
          y: "伊",
          S: "什",
          C: "奇",
        };
      Object.keys(KJ).forEach(function (k) {
        KJ[k] = KJ[k].split(" ");
      });
      Object.keys(KZ).forEach(function (k) {
        KZ[k] = KZ[k].split(" ");
      });
      /* ===== Design Studio fonts: the new display fonts come FIRST, the older plain fonts follow. Instant Design keeps its own untouched copy (FSI0). ===== */
      var FSI0 = {};
      Object.keys(FONT_SETS).forEach(function (k) {
        FSI0[k] = FONT_SETS[k].slice();
      });
      var NEWF = {
          en: [
            ["Permanent Marker", 400],
            ["Bangers", 400],
            ["Pirata One", 400, 1.4],
            ["Pacifico", 400, 1.6],
            ["Black Ops One", 400],
            ["Luckiest Guy", 400, 1.25],
            ["Bowlby One", 400],
            ["Rubik Glitch", 400, 1.25],
            ["Press Start 2P", 400, 1.3],
          ],
          hi: [
            ["Modak", 400, 1.3],
            ["Jaini", 400],
            ["Jaini Purva", 400],
            ["Baloo 2", 800],
            ["Inknut Antiqua", 900],
            ["Sarpanch", 900],
            ["Tillana", 800],
            ["Amita", 700],
          ],
          te: [
            ["Ravi Prakash", 400, 1.3],
            ["Lakki Reddy", 400, 1.3],
            ["Tenali Ramakrishna", 400, 1.3],
            ["Sree Krushnadevaraya", 400, 1.3],
            ["Ramaraja", 400, 1.3],
            ["Suranna", 400, 1.3],
            ["Gidugu", 400, 1.3],
            ["Noto Serif Telugu", 900, 1.3],
          ],
          ja: [
            ["Mochiy Pop One", 400, 1.2],
            ["Train One", 400, 1.2],
            ["Hachi Maru Pop", 400, 1.2],
            ["DotGothic16", 400, 1.2],
            ["Stick", 400, 1.2],
            ["Yusei Magic", 400, 1.2],
            ["Zen Antique", 400, 1.2],
            ["Kaisei Decol", 700, 1.2],
          ],
          zh: [
            ["Liu Jian Mao Cao", 400, 1.2],
            ["Long Cang", 400, 1.2],
            ["ZCOOL XiaoWei", 400, 1.2],
          ],
          ur: [
            ["Lalezar", 400],
            ["Rakkas", 400],
            ["Katibeh", 400],
            ["Jomhuria", 400],
            ["Aref Ruqaa", 700],
            ["Changa", 800],
            ["Reem Kufi", 700],
            ["El Messiri", 700],
          ],
        },
        NEWN = {};
      Object.keys(NEWF).forEach(function (k) {
        var a = FONT_SETS[k],
          nm = NEWF[k].map(function (f) {
            return f[0];
          }),
          old = a.filter(function (f) {
            return nm.indexOf(f[0]) < 0;
          });
        a.length = 0;
        Array.prototype.push.apply(a, NEWF[k].concat(old));
        NEWN[k] = NEWF[k].length;
        if (k === "hi") NEWN.mr = NEWN.hi;
      });
      /* Design Studio (English) last style: Hubot Sans -> Blow Brush (embedded font). Instant Studio keeps its own copy (FSI0). */
      if (FONT_SETS.en[FONT_SETS.en.length - 1][0] === "Hubot Sans")
        FONT_SETS.en[FONT_SETS.en.length - 1] = ["Blow Brush", 400];
      DX = { to: "टू", the: "द", is: "इज़", of: "ऑफ", and: "एंड", you: "यू" };
      function dev(w) {
        if (DX[w]) return DX[w];
        var o = "",
          i = 0,
          pc = false,
          last = "",
          v,
          c,
          k,
          rest,
          m,
          val;
        while (i < w.length) {
          v = null;
          c = null;
          for (k = 2; k > 0 && !v; k--)
            if (VW[w.substr(i, k)]) v = w.substr(i, k);
          if (v) {
            rest = w.slice(i + v.length);
            m =
              v === "a"
                ? pc
                  ? /^[^aeiou]*$/.test(rest)
                    ? "ा"
                    : ""
                  : i === 0
                    ? "अ"
                    : "आ"
                : VW[v][pc ? 0 : 1];
            o += m;
            pc = false;
            last = "";
            i += v.length;
            continue;
          }
          for (k = 3; k > 0 && !c; k--)
            if (DV[w.substr(i, k)]) c = w.substr(i, k);
          if (c) {
            val = c === "c" && /[eiy]/.test(w.charAt(i + 1)) ? "स" : DV[c];
            if (pc && last === c) {
              i += c.length;
              continue;
            }
            if (pc) o += "्";
            o += val;
            pc = true;
            last = c;
            i += c.length;
            continue;
          }
          o += w.charAt(i);
          pc = false;
          last = "";
          i++;
        }
        return o;
      }
      function t2d(s) {
        return s
          .replace(/ె/g, "े")
          .replace(/ొ/g, "ो")
          .replace(/ఎ/g, "ए")
          .replace(/ఒ/g, "ओ")
          .replace(/[\u0C00-\u0C7F]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) - 0x300);
          })
          .replace(/्(?=[^\u0900-\u097F]|$)/g, "");
      }
      function d2t(s) {
        return s
          .replace(/ॉ/g, "ो")
          .replace(/ऑ/g, "ओ")
          .replace(/\u093C/g, "")
          .replace(/[\u0900-\u097F]/g, function (c) {
            return String.fromCharCode(c.charCodeAt(0) + 0x300);
          })
          .replace(/([\u0C15-\u0C39])(?=[^\u0C00-\u0C7F]|$)/g, "$1\u0C4D");
      }
      function d2l(w) {
        var o = "",
          i,
          c,
          n;
        for (i = 0; i < w.length; i++) {
          c = w.charAt(i);
          n = w.charAt(i + 1);
          if (LC[c]) {
            o += LC[c];
            if (n === "्") i++;
            else if (LC[n] || n === "ं" || n === "ँ" || n === "ः") o += "a";
          } else if (LV[c]) o += LV[c];
          else if (c !== "\u093C" && c !== "्") o += c;
        }
        return o;
      }
      function rom(w) {
        var t = [],
          i = 0,
          o,
          g;
        w = w
          .toLowerCase()
          .replace(/sh/g, "S")
          .replace(/ch/g, "C")
          .replace(/ph/g, "f")
          .replace(/kh|ck|q/g, "k")
          .replace(/gh/g, "g")
          .replace(/dh/g, "d")
          .replace(/bh/g, "b")
          .replace(/wh/g, "w")
          .replace(/th/g, "t")
          .replace(/x/g, "ks")
          .replace(/c(?=[eiy])/g, "s")
          .replace(/c/g, "k")
          .replace(/([^aeiou])\1+/g, "$1");
        while (i < w.length) {
          o = "";
          if (!/[aeiou]/.test(w.charAt(i))) {
            if (!/[a-zSC]/.test(w.charAt(i))) {
              t.push([null, w.charAt(i)]);
              i++;
              continue;
            }
            o = w.charAt(i);
            i++;
          }
          g = VG[w.substr(i, 2)]
            ? w.substr(i, 2)
            : /[aeiou]/.test(w.charAt(i))
              ? w.charAt(i)
              : null;
          if (g) {
            t.push([o, VG[g][0], VG[g][1]]);
            i += g.length;
          } else t.push([o, null]);
        }
        return t;
      }
      var YJ = {
        k: "キャ キ キュ キェ キョ",
        g: "ギャ ギ ギュ ギェ ギョ",
        n: "ニャ ニ ニュ ニェ ニョ",
        h: "ヒャ ヒ ヒュ ヒェ ヒョ",
        b: "ビャ ビ ビュ ビェ ビョ",
        p: "ピャ ピ ピュ ピェ ピョ",
        m: "ミャ ミ ミュ ミェ ミョ",
        r: "リャ リ リュ リェ リョ",
      };
      Object.keys(YJ).forEach(function (k) {
        YJ[k] = YJ[k].split(" ");
      });
      function ja(w) {
        var IJ = { a: 0, i: 1, u: 2, e: 3, o: 4 },
          t = rom(w),
          out = "",
          i,
          x,
          n;
        for (i = 0; i < t.length; i++) {
          x = t[i];
          n = t[i + 1];
          if (x[0] === null) {
            out += x[1];
            continue;
          }
          if (!x[1] && n && n[0] === "y" && n[1] && YJ[x[0]]) {
            out += YJ[x[0]][IJ[n[1]]] + (n[2] || "");
            i++;
            continue;
          }
          out += x[1]
            ? (KJ[x[0]] || KJ.k)[IJ[x[1]]] + (x[2] || "")
            : FJ[x[0]] || "";
        }
        return out;
      }
      function zh(w) {
        var IZ = { a: 0, e: 1, i: 2, o: 3, u: 4 };
        return rom(w)
          .map(function (x) {
            if (x[0] === null) return x[1];
            return x[1] ? (KZ[x[0]] || KZ.k)[IZ[x[1]]] : FZ[x[0]] || "";
          })
          .join("");
      }

      /* Urdu: Roman letters -> Urdu script by sound (short vowels are left out, as Urdu is normally written) */
      var UC = {
          chh: "چھ",
          kh: "خ",
          gh: "غ",
          ch: "چ",
          jh: "جھ",
          th: "تھ",
          dh: "دھ",
          ph: "ف",
          bh: "بھ",
          sh: "ش",
          zh: "ژ",
          k: "ک",
          g: "گ",
          c: "ک",
          j: "ج",
          t: "ت",
          d: "د",
          n: "ن",
          p: "پ",
          b: "ب",
          m: "م",
          y: "ی",
          r: "ر",
          l: "ل",
          v: "و",
          w: "و",
          s: "س",
          h: "ہ",
          f: "ف",
          z: "ز",
          q: "ق",
          x: "کس",
        },
        UI0 = {
          aa: "آ",
          ai: "ای",
          au: "او",
          ee: "ای",
          oo: "او",
          ou: "او",
          ie: "ای",
          ea: "ای",
          a: "ا",
          i: "ا",
          u: "ا",
          e: "ا",
          o: "او",
        },
        UI1 = {
          aa: "ا",
          ai: "ی",
          au: "و",
          ee: "ی",
          oo: "و",
          ou: "و",
          ie: "ی",
          ea: "ی",
          a: "ا",
          i: "ی",
          u: "و",
          e: "ی",
          o: "و",
        },
        UF = {
          aa: "ا",
          ai: "ے",
          au: "و",
          ee: "ی",
          oo: "و",
          ou: "و",
          ie: "ی",
          ea: "ی",
          a: "ا",
          i: "ی",
          u: "و",
          e: "ے",
          o: "و",
        },
        UX = {
          allah: "اللہ",
          muhammad: "محمد",
          mohammad: "محمد",
          mohammed: "محمد",
          mohd: "محمد",
          ahmed: "احمد",
          ahmad: "احمد",
          ali: "علی",
          khan: "خان",
          to: "ٹو",
          the: "دی",
          is: "ایز",
          of: "آف",
          and: "اینڈ",
          you: "یو",
        };
      function urd(w) {
        if (UX[w]) return UX[w];
        var o = "",
          i = 0,
          pc = false,
          last = "",
          v,
          c,
          k,
          rest,
          val,
          m;
        while (i < w.length) {
          v = null;
          c = null;
          for (k = 2; k > 0 && !v; k--)
            if (VW[w.substr(i, k)]) v = w.substr(i, k);
          if (v) {
            rest = w.slice(i + v.length);
            if (!pc) m = i === 0 ? UI0[v] : UI1[v];
            else if (!rest) m = UF[v];
            else if (v === "a" || v === "i")
              m = /^[^aeiou]*$/.test(rest) ? (v === "a" ? "ا" : "ی") : "";
            else if (v === "u") m = "";
            else m = UI1[v];
            o += m;
            pc = false;
            last = "";
            i += v.length;
            continue;
          }
          for (k = 3; k > 0 && !c; k--)
            if (UC[w.substr(i, k)]) c = w.substr(i, k);
          if (c) {
            if (pc && last === c) {
              i += c.length;
              continue;
            }
            val = c === "c" && /[eiy]/.test(w.charAt(i + 1)) ? "س" : UC[c];
            o += val;
            pc = true;
            last = c;
            i += c.length;
            continue;
          }
          o += w.charAt(i);
          pc = false;
          last = "";
          i++;
        }
        return o;
      }
      function xlit(s, L) {
        if (!s) return "";
        if (!L) return s;
        s = s.normalize("NFC");
        if (L === "hi" || L === "mr") s = s.replace(/[\u0C00-\u0C7F]+/g, t2d);
        if (L === "te") s = s.replace(/[\u0900-\u097F]+/g, d2t);
        if (L === "en" || L === "ja" || L === "zh" || L === "ur")
          s = s.replace(/[\u0900-\u097F\u0C00-\u0C7F]+/g, function (w) {
            return d2l(t2d(w));
          });
        if (L === "en") return s;
        return s.replace(/[A-Za-z\u00C0-\u024F]+/g, function (w) {
          w = w.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return L === "ja"
            ? ja(w)
            : L === "zh"
              ? zh(w)
              : L === "ur"
                ? urd(w.toLowerCase())
                : L === "te"
                  ? d2t(dev(w.toLowerCase()))
                  : dev(w.toLowerCase());
        });
      }
      function gr(s) {
        return window.Intl && Intl.Segmenter
          ? Array.from(
              new Intl.Segmenter(undefined, {
                granularity: "grapheme",
              }).segment(s),
              function (x) {
                return x.segment;
              },
            )
          : s.split("");
      }

      function loadScriptFonts(l) {
        FONT_SETS[l].forEach(function (f) {
          if (l === "en" || f._l) return;
          f._l = 1;
          var k = document.createElement("link");
          k.rel = "stylesheet";
          k.href =
            "https://fonts.googleapis.com/css2?family=" +
            f[0].replace(/ /g, "+") +
            ":wght@" +
            f[1] +
            "&display=swap";
          k.onload = function () {
            if (!document.fonts || !document.fonts.load) return;
            document.fonts
              .load(
                f[1] + ' 60px "' + f[0] + '"',
                SAMPLES[l] +
                  T.map(function (t) {
                    return t.txt;
                  }).join(""),
              )
              .catch(function () {})
              .then(function () {
                clr();
                draw();
              });
          };
          document.head.appendChild(k);
        });
      }
      function xlTxt(t) {
        return (
          (LANG !== "en"
            ? "This tee prints in <b>" +
              LANGS[LANG] +
              "</b>. Type in English letters (or paste any text) and it is written in " +
              LANGS[LANG].split(" ")[0] +
              " by sound, not translated. "
            : "") +
          (t && t.raw && t.raw !== t.txt
            ? "<br>On the shirt: <b>" + esc(t.txt) + "</b>"
            : "")
        );
      }
      function xlDiv(t) {
        return (
          '<div class="xl" style="font-size:13px;color:var(--mut);margin:6px 0 0;line-height:1.5">' +
          xlTxt(t) +
          "</div>"
        );
      }
      function showXl() {
        var e = $("editor").querySelector(".xl");
        if (e) e.innerHTML = xlTxt(T[sel]);
      }
      function fmtTitle() {
        var t = $("ptitle"),
          n = t.textContent;
        if (LANG === "en" || LANG === "hi" || LANG === "ur") {
          var m = n.match(/^(\S+)(\s[\s\S]*)?$/);
          t.innerHTML = m
            ? '<span class="ew">' + esc(m[1]) + "</span>" + esc(m[2] || "")
            : esc(n);
        } else t.textContent = n;
      }
      function applyLang(l) {
        l = FONT_SETS[l] ? l : "en";
        var ch = l !== LANG;
        LANG = l;
        document.body.dataset.lang = l;
        fmtTitle();
        FONTS = FONT_SETS[l];
        loadScriptFonts(l);
        T.forEach(function (t) {
          t.txt = xlit(t.raw == null ? t.txt : t.raw, l);
          if (ch) t.font = NEWN[l] || 0;
        });
        if (ch) {
          clr();
          chips();
          editor();
          loadFont(
            0,
            T.map(function (t) {
              return t.txt;
            }).join("") || SAMPLES[l],
          ).then(draw);
        }
      }
      function langOpts() {
        return Object.keys(LANGS)
          .map(function (k) {
            return '<option value="' + k + '">' + LANGS[k] + "</option>";
          })
          .join("");
      }

      var COLS = [
        "#f4f4f0",
        "#e11d2e",
        "#f5c542",
        "#3aa0ff",
        "#9b9b9b",
        "#f97316",
        "#8b5a2b",
        "#22a559",
        "#166534",
        "#a3e635",
        "#14b8a6",
        "#22d3ee",
        "#1e40af",
        "#8b5cf6",
        "#ec4899",
        "#d946ef",
        "#7f1d1d",
        "#d4a017",
        "#e7d3b0",
        "#cfcfcf",
        "#111111",
      ];
      var CNAMES = [
        "White",
        "Red",
        "Yellow",
        "Blue",
        "Grey",
        "Orange",
        "Brown",
        "Green",
        "Dark green",
        "Lime",
        "Teal",
        "Sky blue",
        "Navy",
        "Purple",
        "Pink",
        "Magenta",
        "Maroon",
        "Gold",
        "Beige",
        "Silver",
        "Black",
      ];
      function hsl2hex(h, s, l) {
        s /= 100;
        l /= 100;
        var a = s * Math.min(l, 1 - l);
        var f = function (n) {
          var k = (n + h / 30) % 12,
            c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return ("0" + Math.round(255 * c).toString(16)).slice(-2);
        };
        return "#" + f(0) + f(8) + f(4);
      }
      function colOf(t) {
        return t.tc < 0
          ? hsl2hex(
              t.hue == null ? 200 : t.hue,
              100,
              t.lit == null ? 50 : t.lit,
            )
          : COLS[t.tc];
      }
      var RAINBOW = "linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)";
      var C = null,
        NUD = {},
        NT = 0,
        SCT = 0,
        PICSEL = false,
        MAXT = 5,
        T = [],
        I = { size: 70, px: 50, py: 35 },
        showBox = false,
        UNSEL = false,
        TC = {},
        WC = {},
        UID = 0,
        RAF = 0;
      function clr() {
        TC = {};
        WC = {};
      }
      S.bimg = null;
      var BASE_WHITE_URL =
        "assets/e22108471124.webp";
      var CW = 768,
        CH = 1152,
        BASE = new Image(),
        BASEW = new Image(),
        SHIRT = "black";
      BASE.onload = BASEW.onload = function () {
        draw();
      };
      BASE.src = BASE_URL;
      BASEW.src = BASE_WHITE_URL;
      /* Oversized Terry products are customised on top of these two photos (black / white): studio photos, design studio only */
      var TB = new Image(),
        TBW = new Image();
      TB.onload = TBW.onload = function () {
        draw();
      };
      TB.src =
        "assets/90f10e1ee96d.webp";
      TBW.src =
        "assets/6cf4926d9f1d.webp";
      /* plain Oversized Tee products use these two photos (black / white): studio photos, design studio only */
      var OB = new Image(),
        OBW = new Image();
      OB.onload = OBW.onload = function () {
        draw();
      };
      OB.src =
        "assets/90f10e1ee96d.webp";
      OBW.src =
        "assets/6cf4926d9f1d.webp";
      /* Hoodie products are customised on top of these two photos (black / white) */
      var HB = new Image(),
        HBW = new Image();
      HB.onload = HBW.onload = function () {
        draw();
      };
      HB.src =
        "assets/6b5725bdbe82.webp";
      HBW.src =
        "assets/22783bdf9328.webp";
      var CATN = {
        tee: "tee",
        over: "oversized t-shirt",
        terry: "oversized terry tee",
        hoodie: "hoodie",
      };
      function catN(c) {
        return CATN[c || "tee"] || "tee";
      }
      function SB() {
        var c = S.cat,
          w = SHIRT === "white";
        return c === "hoodie"
          ? w
            ? HBW
            : HB
          : c === "terry"
            ? w
              ? TBW
              : TB
            : c === "over"
              ? w
                ? OBW
                : OB
              : w
                ? BASEW
                : BASE;
      }
      function newT() {
        return {
          o: 0,
          txt: "",
          font: (typeof NEWN !== "undefined" && NEWN[LANG]) || 0,
          tc: T.length === 1 ? 1 : SHIRT === "white" ? 20 : 0,
          size: 60,
          bc: "w",
          px: 50,
          py: Math.min(8 + T.length * 20, 95),
          front: true,
        };
      }
      /* Print area of each garment on the 768x1152 photo: cx = centre of the back panel, top/hem = first/last row a print may use,
   hA/hB = half width of the print area (above/below sw), gw = width of the sample text. Hoodie = on the hoodie body only (below the hood, above the rib). */
      var GEO = {
        tee: {
          cx: 390,
          top: 390,
          sx: 2.8,
          sy: 5.2,
          hA: 186,
          hB: 182,
          sw: 665,
          hem: 1065,
          gw: 330,
        },
        over: {
          cx: 383,
          top: 380,
          sx: 2.4,
          sy: 4.4,
          hA: 150,
          hB: 150,
          sw: 585,
          hem: 925,
          gw: 300,
        },
        terry: {
          cx: 383,
          top: 380,
          sx: 2.4,
          sy: 4.4,
          hA: 150,
          hB: 150,
          sw: 585,
          hem: 925,
          gw: 300,
        },
        hoodie: {
          cx: 384,
          top: 340,
          sx: 2.4,
          sy: 4.1,
          hA: 150,
          hB: 135,
          sw: 585,
          hem: 782,
          gw: 262,
        },
      };
      function GM() {
        return GEO[S.cat] || GEO.tee;
      }
      function cxOf(p) {
        var g = GM();
        return g.cx + (p - 50) * g.sx;
      }
      function tyOf(p) {
        var g = GM();
        return g.top + p * g.sy;
      }
      /* number of empty pixel rows above the first letter pixel of a text canvas (cached) */
      function gapTop(c) {
        if (c._gt != null) return c._gt;
        var w = c.width,
          h = c.height,
          d,
          x,
          y;
        try {
          d = c.getContext("2d").getImageData(0, 0, w, h).data;
        } catch (e) {
          return (c._gt = 0);
        }
        for (y = 0; y < h; y++)
          for (x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 40) return (c._gt = y);
        return (c._gt = 0);
      }
      /* number of empty pixel rows below the last letter pixel of a text canvas (cached) */
      function gapBot(c) {
        if (c._gb != null) return c._gb;
        var w = c.width,
          h = c.height,
          d,
          x,
          y;
        try {
          d = c.getContext("2d").getImageData(0, 0, w, h).data;
        } catch (e) {
          return (c._gb = 0);
        }
        for (y = h - 1; y >= 0; y--)
          for (x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 40) return (c._gb = h - 1 - y);
        return (c._gb = 0);
      }
      /* INSTANT STUDIO HOODIE ONLY: lowest row (photo px) the main text / signature may reach (the hoodie body ends near row 870).
         Lower number = stops higher up the hoodie, higher number = reaches further down. */
      var HOODIE_I_HEM = 866;
      /* how far (print-area units) the name may rise above the top of the print area */
      function relaxTop() {
        var L = els(),
          i;
        for (i = 0; i < L.length; i++) if (L[i].k === "t") return L[i].rt || 0;
        return 0;
      }
      /* SIGNATURE ONLY: highest row (photo px) where the TOP OF THE SIGNATURE LETTERS may reach = just under the neck.
         It is measured on the letters (not the empty box around them), so it is the same in every language. Normal text keeps GEO[..].top.
         Raise a number's value to lower the limit, lower the number to let the signature go higher. */
      var SIGTOP = { tee: 345, over: 316, terry: 316, hoodie: 312 };
      function sigTopOf() {
        var g = GM();
        return Math.min(g.top, SIGTOP[S.cat] != null ? SIGTOP[S.cat] : g.top);
      }
      function fit(o) {
        /* keep the print on the garment's back panel: never past the seams, below the collar/hood, above the hem */
        var g = GM(),
          H = o.ty + o.ph > g.sw ? g.hB : g.hA,
          k = 1,
          kf = 1,
          /* Instant Studio hoodie: main text + signature (not the artwork) may go lower, down to the bottom of the hoodie */
          instH = !!(S.inst && S.cat === "hoodie" && o.k !== "i"),
          hem = instH ? HOODIE_I_HEM : g.hem;
        if (o.pw > 2 * H) {
          k = (2 * H) / o.pw;
          o.pw *= k;
          o.ph *= k;
          kf *= k;
        }
        if (o.ph > hem - g.top) {
          k = (hem - g.top) / o.ph;
          o.pw *= k;
          o.ph *= k;
          kf *= k;
        }
        o.kf = kf;
        /* signature: its empty space below the letters may drop under the limit, so the LETTERS reach the bottom */
        var sgb = instH && o.k === "s" && o.c ? (gapBot(o.c) / (o.c.height || 1)) * o.ph : 0;
        if (o.ty + o.ph > hem + sgb) o.ty = hem + sgb - o.ph;
        if (instH) o.mt = hem + sgb - o.ph; /* lowest allowed top of the box (used while dragging) */
        /* English Style 4 (Pirata One) has empty space above its letters inside its box, so the box may rise by that much: the letters then reach the same top as every other style */
        var rt = 0;
        if (o.k === "t" && o.c && LANG === "en") {
          var tt = T[o.i],
            ff = tt && FONTS[tt.font];
          if (ff && ff[0] === "Pirata One")
            rt = (gapTop(o.c) / (o.c.height || 1)) * o.ph;
        }
        o.rt = rt;
        if (o.k === "s") {
          /* signature: the empty space above its letters may rise above the limit, so the LETTERS reach the neck limit in every language */
          var sgap = o.c ? (gapTop(o.c) / (o.c.height || 1)) * o.ph : 0;
          o.st = sigTopOf() - sgap;
          if (o.ty < o.st) o.ty = o.st;
        } else if (o.ty < g.top - rt) o.ty = g.top - rt;
        if (o.cx - o.pw / 2 < g.cx - H) o.cx = g.cx - H + o.pw / 2;
        if (o.cx + o.pw / 2 > g.cx + H) o.cx = g.cx + H - o.pw / 2;
        return o;
      }
      /* INSTANT STUDIO HOODIE: lowest allowed top of the text / signature box (photo px) while dragging, or null for other garments */
      function lowBoxTop(k) {
        var L = els(),
          i;
        for (i = 0; i < L.length; i++) if (L[i].k === k && L[i].mt != null) return L[i].mt;
        return null;
      }
      /* SIGNATURE ONLY: current highest allowed top of the signature box (photo px), used while dragging */
      function sigBoxTop() {
        var L = els(),
          i;
        for (i = 0; i < L.length; i++) if (L[i].k === "s" && L[i].st != null) return L[i].st;
        return sigTopOf();
      }
      function textCanvas0(t, s) {
        var o = t.o || 0,
          key = o + "|" + t.font + "|" + t.size + "|" + colOf(t) + "|" + s,
          hit = TC[key];
        if (hit) return hit;
        if (Object.keys(TC).length > 40) TC = {};
        var f = FONTS[t.font],
          F = 2 * (20 + t.size * 1.6),
          c = document.createElement("canvas"),
          x = c.getContext("2d"),
          fs = function (n) {
            return f[1] + " " + n + 'px "' + f[0] + '"';
          },
          ch =
            LANG === "ur"
              ? o === 1
                ? [s]
                : s.split(/\s+/).filter(Boolean)
              : gr(s),
          MAXV = 960;
        if (o === 0) {
          if (LANG === "hi") {
            /* Hindi: Devanagari vowel signs (matras) can extend above the measured font box. Render on a roomy canvas and crop to the actual glyph pixels, with padding. This branch is Hindi-only; Urdu keeps its existing renderer below. */
            var hiDraw = function (Z) {
              var bw = Math.ceil(Z * Math.max(4, s.length * 2.2)) + 400,
                bh = Math.ceil(Z * 5),
                bc = document.createElement("canvas");
              bc.width = bw;
              bc.height = bh;
              var g = bc.getContext("2d");
              g.direction = "ltr";
              g.font = fs(Z);
              g.fillStyle = colOf(t);
              g.textAlign = "center";
              g.textBaseline = "alphabetic";
              g.fillText(s, bw / 2, bh * 0.62);
              var d = g.getImageData(0, 0, bw, bh).data,
                x0 = bw,
                x1 = -1,
                y0 = bh,
                y1 = -1,
                xx,
                yy;
              for (yy = 0; yy < bh; yy++)
                for (xx = 0; xx < bw; xx++)
                  if (d[(yy * bw + xx) * 4 + 3] > 6) {
                    if (xx < x0) x0 = xx;
                    if (xx > x1) x1 = xx;
                    if (yy < y0) y0 = yy;
                    if (yy > y1) y1 = yy;
                  }
              if (x1 < 0) return { bc: bc, x0: 0, y0: 0, w: 8, h: 8 };
              return { bc: bc, x0: x0, y0: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
            };
            var hd = hiDraw(F);
            if (hd.w + 20 > 840) {
              F *= (840 - 20) / (hd.w + 20);
              hd = hiDraw(F);
            }
            c.width = hd.w + 20;
            c.height = hd.h + 20;
            x = c.getContext("2d");
            x.drawImage(hd.bc, hd.x0, hd.y0, hd.w, hd.h, 10, 10, hd.w, hd.h);
          } else if (LANG === "ur") {
            /* Urdu: one joined run, right-to-left. Browsers (Safari especially) misreport Nastaliq glyph sizes, so draw on a roomy canvas and crop to the real pixels */
            var urDraw = function (Z) {
              var bw = Math.ceil(Z * Math.max(4, s.length * 1.6)) + 400,
                bh = Math.ceil(Z * 5),
                bc = document.createElement("canvas");
              bc.width = bw;
              bc.height = bh;
              var g = bc.getContext("2d");
              g.direction = "rtl";
              g.font = fs(Z);
              g.fillStyle = colOf(t);
              g.textAlign = "center";
              g.textBaseline = "alphabetic";
              g.fillText(s, bw / 2, bh * 0.6);
              var d = g.getImageData(0, 0, bw, bh).data,
                x0 = bw,
                x1 = -1,
                y0 = bh,
                y1 = -1,
                xx,
                yy;
              for (yy = 0; yy < bh; yy++)
                for (xx = 0; xx < bw; xx++)
                  if (d[(yy * bw + xx) * 4 + 3] > 6) {
                    if (xx < x0) x0 = xx;
                    if (xx > x1) x1 = xx;
                    if (yy < y0) y0 = yy;
                    if (yy > y1) y1 = yy;
                  }
              if (x1 < 0) return { bc: bc, x0: 0, y0: 0, w: 8, h: 8 };
              return { bc: bc, x0: x0, y0: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
            };
            var ud = urDraw(F);
            if (ud.w + 16 > 840) {
              F *= (840 - 16) / (ud.w + 16);
              ud = urDraw(F);
            }
            c.width = ud.w + 16;
            c.height = ud.h + 16;
            x = c.getContext("2d");
            x.drawImage(ud.bc, ud.x0, ud.y0, ud.w, ud.h, 8, 8, ud.w, ud.h);
          } else {
            x.font = fs(F);
            var w = Math.ceil(x.measureText(s).width) + 16;
            if (w > 840) {
              F *= 840 / w;
              w = 840;
            }
            var h = Math.ceil(F * (f[2] || 1.1));
            c.width = w;
            c.height = h;
            x = c.getContext("2d");
            x.font = fs(F);
            x.fillStyle = colOf(t);
            x.textAlign = "center";
            x.textBaseline = "middle";
            x.fillText(s, w / 2, h / 2);
          }
        } else if (o === 1) {
          /* vertical 1: spaced letters in a row, turned 90 degrees so the word reads top to bottom */
          var gap = 0,
            meas = function (Z) {
              x.font = fs(Z);
              gap = Z * 0.32;
              var tot = 0;
              ch.forEach(function (k) {
                tot += x.measureText(k).width;
              });
              return tot + gap * (ch.length - 1) + 16;
            };
          var W = meas(F);
          if (W > MAXV) {
            F *= MAXV / W;
            W = meas(F);
          }
          var H = Math.ceil(F * (LANG === "ur" || LANG === "hi" ? 1.8 : 1.1)),
            r = document.createElement("canvas");
          r.width = Math.ceil(W);
          r.height = H;
          var g = r.getContext("2d");
          if (LANG === "ur") g.direction = "rtl";
          g.font = fs(F);
          g.fillStyle = colOf(t);
          g.textBaseline = "middle";
          g.textAlign = "left";
          var px = 8;
          ch.forEach(function (k) {
            g.fillText(k, px, H / 2);
            px += g.measureText(k).width + gap;
          });
          c.width = H;
          c.height = r.width;
          x = c.getContext("2d");
          x.translate(H, 0);
          x.rotate(Math.PI / 2);
          x.drawImage(r, 0, 0);
        } else {
          /* vertical 2: upright letters stacked one under another */
          var lh = 0,
            mw = 0,
            m2 = function (Z) {
              x.font = fs(Z);
              mw = 0;
              ch.forEach(function (k) {
                mw = Math.max(mw, x.measureText(k).width);
              });
              lh = Z * (LANG === "ur" || LANG === "hi" ? 1.8 : 1.12);
              return lh * ch.length + 16;
            };
          var HH = m2(F);
          if (HH > MAXV) {
            F *= MAXV / HH;
            HH = m2(F);
          }
          c.width = Math.ceil(mw) + 16;
          c.height = Math.ceil(HH);
          x = c.getContext("2d");
          x.font = fs(F);
          x.fillStyle = colOf(t);
          x.textAlign = "center";
          x.textBaseline = "middle";
          /* stacked letters looked too thin: add a light same-colour outline so they print a little bolder */
          x.strokeStyle = colOf(t);
          x.lineWidth = Math.max(2, F * 0.035);
          x.lineJoin = "round";
          ch.forEach(function (k, i) {
            x.strokeText(k, c.width / 2, 8 + lh * i + lh / 2);
            x.fillText(k, c.width / 2, 8 + lh * i + lh / 2);
          });
        }
        c._id = ++UID;
        return (TC[key] = c);
      }
      /* border around the outside of the text (works for every language and direction): paint a solid copy of the text around a ring, then the text on top */
      function textCanvas(t, s) {
        var bw = +t.bw || 0;
        if (!bw) return textCanvas0(t, s);
        var col = t.bc === "b" ? "#000000" : "#ffffff",
          key =
            "B|" +
            bw +
            "|" +
            col +
            "|" +
            (t.o || 0) +
            "|" +
            t.font +
            "|" +
            t.size +
            "|" +
            colOf(t) +
            "|" +
            s,
          hit = TC[key];
        if (hit) return hit;
        var b = textCanvas0(t, s),
          r = Math.max(1, Math.round(bw * (20 + t.size * 1.6) * 0.0125)),
          w = b.width + 2 * r,
          h = b.height + 2 * r,
          c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        var g = c.getContext("2d");
        var m = document.createElement("canvas");
        m.width = b.width;
        m.height = b.height;
        var mg = m.getContext("2d");
        mg.drawImage(b, 0, 0);
        mg.globalCompositeOperation = "source-in";
        mg.fillStyle = col;
        mg.fillRect(0, 0, m.width, m.height);
        var n = Math.max(16, Math.min(48, r * 3)),
          k,
          a,
          rr;
        for (rr = r; rr > 0; rr -= Math.max(1, r / 3)) {
          for (k = 0; k < n; k++) {
            a = (k * 2 * Math.PI) / n;
            g.drawImage(m, r + rr * Math.cos(a), r + rr * Math.sin(a));
          }
        }
        g.drawImage(m, r, r);
        g.drawImage(b, r, r);
        c._id = ++UID;
        return (TC[key] = c);
      }
      function els() {
        var out = [];
        T.forEach(function (t, i) {
          var s = t.sig ? t.txt.trim() : t.txt.trim().toUpperCase();
          if (!s) return;
          var LVt = window.__nsLive && window.__nsLive.k === "t" ? window.__nsLive : null,
            c = textCanvas(LVt ? Object.assign({}, t, { size: LVt.size0 }) : t, s),
            w = c.width,
            h = c.height,
            vt = (t.o || 0) > 0 || !!+t.cv;
          var cx = cxOf(t.px),
            ty = tyOf(t.py),
            pw = w / 2,
            ph = h / 2;
          if (LVt) {
            var lr = Math.min((20 + t.size * 1.6) / (20 + LVt.size0 * 1.6), 420 / pw, 480 / ph);
            pw *= lr;
            ph *= lr;
          }
          var o = fit({ k: t.sig ? "s" : "t", i: i, c: c, cx: cx, ty: ty, pw: pw, ph: ph });
          o.rot = +t.rot || 0; /* Instant Studio tilt (degrees) */
          o.x0 = o.cx - o.pw / 2;
          o.x1 = o.cx + o.pw / 2;
          o.y0 = vt ? o.ty : o.ty + o.ph * 0.15;
          o.y1 = vt ? o.ty + o.ph : o.ty + o.ph * 0.85;
          out.push(o);
        });
        if (S.bimg && S.bimg.width) {
          var b = S.bimg,
            pw = (I.size / 100) * 400,
            ph = (pw * b.height) / b.width;
          if (ph > 480) {
            pw *= 480 / ph;
            ph = 480;
          }
          var cx = cxOf(I.px),
            ty = tyOf(I.py);
          var o = fit({ k: "i", c: b, cx: cx, ty: ty, pw: pw, ph: ph });
          o.rot = +I.rot || 0; /* Instant Studio tilt (degrees) */
          o.x0 = o.cx - o.pw / 2;
          o.x1 = o.cx + o.pw / 2;
          o.y0 = o.ty;
          o.y1 = o.ty + o.ph;
          out.push(o);
        }
        return out;
      }
      function layout() {
        var L = els(),
          im = null,
          ts = [],
          ov = {};
        L.forEach(function (e) {
          if (e.k === "i") im = e;
          else ts.push(e);
        });
        if (im)
          ts.forEach(function (e) {
            if (e.x0 < im.x1 && e.x1 > im.x0 && e.y0 < im.y1 && e.y1 > im.y0)
              ov[e.i] = true;
          });
        var back = [],
          front = [];
        ts.forEach(function (e) {
          (ov[e.i] && !T[e.i].front ? back : front).push(e);
        });
        return {
          order: back.concat(im ? [im] : [], front),
          ov: ov,
          n: L.length,
        };
      }
      function warp(d, e) {
        /* bend the flat artwork round the back of the shirt (bent bitmap is cached, so moving it is a single drawImage) */
        if (e.rot && !e._rr) {
          /* Instant Studio tilt: same cached bitmap, just turned around its centre */
          var wa = (e.rot * Math.PI) / 180,
            wx = e.cx,
            wy = e.ty + e.ph / 2;
          e._rr = 1;
          d.save();
          d.translate(wx, wy);
          d.rotate(wa);
          d.translate(-wx, -wy);
          try {
            warp(d, e);
          } finally {
            d.restore();
            e._rr = 0;
          }
          return;
        }
        var LVw = window.__nsLive,
          lvOn = !!(LVw && e.k === LVw.k),
          id = e.c._id || (e.c._id = ++UID),
          key = lvOn
            ? "L" + LVw.n + "|" + id
            : id + "|" + Math.round(e.pw) + "|" + Math.round(e.ph),
          w = WC[key];
        if (!w) {
          if (Object.keys(WC).length > 30) WC = {};
          var A = 0.45,
            sw = 3,
            cw = e.c.width,
            ch = e.c.height,
            s = e.pw / cw,
            ox = Math.ceil(e.pw / 2) + 3,
            c = document.createElement("canvas");
          c.width = ox * 2;
          c.height = Math.ceil(e.ph) + 12;
          var g = c.getContext("2d");
          g.imageSmoothingQuality = "high";
          var X = function (u) {
            return ox + ((e.pw / 2) * Math.sin(u * A)) / Math.sin(A);
          };
          for (var i = 0; i < cw; i += sw) {
            var u0 = (i / cw) * 2 - 1,
              u1 = (Math.min(i + sw, cw) / cw) * 2 - 1,
              um = (u0 + u1) / 2,
              x0 = X(u0),
              x1 = X(u1);
            g.drawImage(
              e.c,
              i,
              0,
              Math.min(sw, cw - i),
              ch,
              x0,
              (7 * (1 - Math.cos(um * A))) / (1 - Math.cos(A)),
              x1 - x0 + 1,
              ch * s * (1 - 0.05 * um * um),
            );
          }
          w = WC[key] = { c: c, ox: ox, pw0: e.pw };
        }
        if (lvOn && w.pw0) {
          /* Instant Studio live resize: reuse ONE bent bitmap and just scale it (sub-pixel, no rebuild per frame) */
          var sc = e.pw / w.pw0;
          d.drawImage(w.c, e.cx - w.ox * sc, e.ty, w.c.width * sc, w.c.height * sc);
          return;
        }
        d.drawImage(w.c, Math.round(e.cx - w.ox), Math.round(e.ty));
      }
      function render(cv, ui) {
        var x = cv.getContext("2d");
        x.clearRect(0, 0, CW, CH);
        x.imageSmoothingQuality = "high";
        var B0 = SB(),
          NF = !!window.__nsFast,
          P0 = B0;
        if (NF && B0.complete && B0.width) {
          /* Instant Studio: the shirt photo is scaled to canvas size ONCE and then copied 1:1 (no big photo rescale on every frame) */
          var bs = B0.currentSrc || B0.src;
          if (!B0._pre || B0._pre._s !== bs || B0._pre._w !== B0.width || B0._pre.width !== CW) {
            var pc = document.createElement("canvas");
            pc.width = CW;
            pc.height = CH;
            var pg = pc.getContext("2d");
            pg.imageSmoothingQuality = "high";
            pg.drawImage(B0, 0, 0, CW, CH);
            pc._s = bs;
            pc._w = B0.width;
            B0._pre = pc;
          }
          P0 = B0._pre;
        }
        if (B0.complete && B0.width) x.drawImage(P0, 0, 0, CW, CH);
        else {
          x.fillStyle = SHIRT === "white" ? "#eee" : "#111";
          x.fillRect(0, 0, CW, CH);
        }
        var r = layout();
        if (!r.n) {
          if (ui) ghost(x);
          return r;
        }
        var D = render.D || (render.D = document.createElement("canvas"));
        if (D.width !== CW) {
          D.width = CW;
          D.height = CH;
        }
        var d = D.getContext("2d");
        /* Instant Studio: only the small area around the name / design is processed, not the whole 768x1152 canvas */
        var bb = null;
        if (NF) {
          var bx0 = CW, by0 = CH, bx1 = 0, by1 = 0;
          r.order.forEach(function (e) {
            bx0 = Math.min(bx0, e.cx - e.pw / 2 - 28);
            bx1 = Math.max(bx1, e.cx + e.pw / 2 + 28);
            by0 = Math.min(by0, e.ty - 28);
            by1 = Math.max(by1, e.ty + e.ph + 40);
            if (e.rot) {
              var ta = (Math.abs(e.rot) * Math.PI) / 180,
                tw = Math.abs(Math.cos(ta)) * e.pw / 2 + Math.abs(Math.sin(ta)) * (e.ph / 2 + 6),
                th = Math.abs(Math.sin(ta)) * e.pw / 2 + Math.abs(Math.cos(ta)) * (e.ph / 2 + 6),
                tcy = e.ty + e.ph / 2;
              bx0 = Math.min(bx0, e.cx - tw - 28);
              bx1 = Math.max(bx1, e.cx + tw + 28);
              by0 = Math.min(by0, tcy - th - 28);
              by1 = Math.max(by1, tcy + th + 40);
            }
          });
          bx0 = Math.max(0, Math.floor(bx0));
          by0 = Math.max(0, Math.floor(by0));
          bx1 = Math.min(CW, Math.ceil(bx1));
          by1 = Math.min(CH, Math.ceil(by1));
          if (bx1 > bx0 && by1 > by0) bb = { x: bx0, y: by0, w: bx1 - bx0, h: by1 - by0 };
        }
        if (bb) d.clearRect(bb.x, bb.y, bb.w, bb.h);
        else d.clearRect(0, 0, CW, CH);
        d.imageSmoothingQuality = "high";
        r.order.forEach(function (e) {
          warp(d, e);
        });
        x.globalAlpha = 0.96;
        if (bb) x.drawImage(D, bb.x, bb.y, bb.w, bb.h, bb.x, bb.y, bb.w, bb.h);
        else x.drawImage(D, 0, 0);
        x.globalAlpha = 1;
        var Tc = render.T || (render.T = document.createElement("canvas"));
        if (Tc.width !== CW) {
          Tc.width = CW;
          Tc.height = CH;
        }
        var t = Tc.getContext("2d");
        t.globalCompositeOperation = "source-over";
        if (bb) {
          t.clearRect(bb.x, bb.y, bb.w, bb.h);
          t.drawImage(P0, bb.x, bb.y, bb.w, bb.h, bb.x, bb.y, bb.w, bb.h);
          t.globalCompositeOperation = "destination-in";
          t.drawImage(D, bb.x, bb.y, bb.w, bb.h, bb.x, bb.y, bb.w, bb.h);
          x.globalAlpha = 0.14;
          x.drawImage(Tc, bb.x, bb.y, bb.w, bb.h, bb.x, bb.y, bb.w, bb.h);
        } else {
          t.clearRect(0, 0, CW, CH);
          t.drawImage(B0, 0, 0, CW, CH);
          t.globalCompositeOperation = "destination-in";
          t.drawImage(D, 0, 0);
          x.globalAlpha = 0.14;
          x.drawImage(Tc, 0, 0);
        }
        t.globalCompositeOperation = "source-over";
        x.globalAlpha = 1;
        if (ui) outline(x, r);
        return r;
      }
      function fitFont(x, txt, px, maxW, FF) {
        x.font = "400 " + px + "px " + FF;
        var w = x.measureText(txt).width;
        if (w > maxW) px *= maxW / w;
        x.font = "400 " + px + "px " + FF;
        return px;
      }
      var GH = [];
      function pill(x, txt, cx, cy, bg, fg, id) {
        x.save();
        x.globalAlpha = 1;
        x.font = "700 17px Helvetica,Arial,sans-serif";
        x.textAlign = "center";
        x.textBaseline = "middle";
        var w = x.measureText(txt).width + 26,
          h = 28,
          l = cx - w / 2,
          t = cy - h / 2,
          r = h / 2;
        GH.push({ id: id, x0: l, x1: l + w, y0: t - 4, y1: t + h + 10 });
        x.fillStyle = bg;
        x.beginPath();
        x.moveTo(l + r, t);
        x.arcTo(l + w, t, l + w, t + h, r);
        x.arcTo(l + w, t + h, l, t + h, r);
        x.arcTo(l, t + h, l, t, r);
        x.arcTo(l, t, l + w, t, r);
        x.closePath();
        x.fill();
        x.beginPath();
        x.moveTo(cx - 6, t + h);
        x.lineTo(cx + 6, t + h);
        x.lineTo(cx, t + h + 7);
        x.closePath();
        x.fill();
        x.fillStyle = fg;
        x.fillText(txt, cx, cy + 1);
        x.restore();
      }
      function carShape(x, x0, y0, w) {
        var k = w / 300;
        x.save();
        x.translate(x0, y0);
        x.scale(k, k);
        x.fillStyle = SHIRT === "white" ? "#222" : "#b8b8b8";
        x.beginPath();
        x.moveTo(5, 52);
        x.lineTo(5, 42);
        x.bezierCurveTo(30, 38, 60, 32, 95, 26);
        x.bezierCurveTo(115, 12, 150, 4, 185, 4);
        x.bezierCurveTo(220, 4, 245, 12, 262, 22);
        x.lineTo(288, 20);
        x.lineTo(292, 10);
        x.lineTo(300, 10);
        x.lineTo(296, 30);
        x.lineTo(296, 52);
        x.closePath();
        x.fill();
        [62, 240].forEach(function (wx) {
          x.fillStyle = SHIRT === "white" ? "#f4f4f0" : "#111";
          x.beginPath();
          x.arc(wx, 52, 17, 0, 7);
          x.fill();
          x.fillStyle = SHIRT === "white" ? "#555" : "#d8d8d8";
          x.beginPath();
          x.arc(wx, 52, 9, 0, 7);
          x.fill();
        });
        x.restore();
      }
      function ghost(x) {
        /* what an empty shirt shows: a faint sample so people know what each part is */
        GH = [];
        var g0 = GM(),
          cx = g0.cx,
          FF = "'Anton',Impact,'Arial Narrow',sans-serif";
        x.save();
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.globalAlpha = 0.28;
        var W = SHIRT === "white";
        x.fillStyle = W ? "#111" : "#f4f4f0";
        fitFont(x, "YOUR TEXT", 100, g0.gw, FF);
        x.fillText("YOUR TEXT", cx, 478);
        var cw0 = Math.min(300, g0.gw - 6);
        carShape(x, cx - cw0 / 2, 548, cw0);
        x.fillStyle = "#e11d2e";
        fitFont(x, "SECOND LINE", 42, g0.gw, FF);
        x.fillText("SECOND LINE", cx, 676);
        x.restore();
        pill(
          x,
          "TEXT 1 · type below",
          cx,
          422,
          W ? "#111" : "#f4f4f0",
          W ? "#fff" : "#111",
          "t1",
        );
        pill(x, "IMAGE · tap to add", cx, 530, "#3aa0ff", "#fff", "img");
        pill(x, "TEXT 2 · tap to add", cx, 636, "#e11d2e", "#fff", "t2");
        x.save();
        x.globalAlpha = 0.75;
        x.fillStyle = W ? "#222" : "#fff";
        x.font =
          "600 " +
          Math.round(17 * Math.min(1, g0.gw / 306)) +
          "px Helvetica,Arial,sans-serif";
        x.textAlign = "center";
        x.fillText("Tap a label, or use the buttons above", cx, 736);
        x.fillText("Up to 5 texts + 1 picture", cx, 760);
        x.restore();
      }
      function outline(x, r) {
        if (x.canvas) x.canvas._hb = x.canvas._rb = null;
        if (UNSEL) return;
        var e = r.order.filter(function (e) {
          return e.k === "i" ? PICSEL || sel === "i" : !PICSEL && e.i === sel;
        })[0];
        if (!e) return;
        x.save();
        var bx = e.x0 - 7,
          by = e.y0 - 7,
          bw = e.x1 - e.x0 + 14,
          bh = e.y1 - e.y0 + 14,
          wh = SHIRT === "white";
        var trot = +e.rot || 0,
          tcx = (e.x0 + e.x1) / 2,
          tcy = (e.y0 + e.y1) / 2;
        if (trot) {
          /* tilted name / photo: the selection box turns with it */
          x.translate(tcx, tcy);
          x.rotate((trot * Math.PI) / 180);
          x.translate(-tcx, -tcy);
        }
        x.fillStyle = wh ? "rgba(225,29,46,.07)" : "rgba(255,255,255,.08)";
        x.fillRect(bx, by, bw, bh);
        x.setLineDash([7, 5]);
        x.lineWidth = 2.4;
        x.strokeStyle = wh ? "rgba(0,0,0,.9)" : "rgba(255,255,255,.95)";
        x.strokeRect(bx, by, bw, bh);
        x.setLineDash([]);
        x.fillStyle = "#ff4a5a";
        x.strokeStyle = "#fff";
        x.lineWidth = 1.5;
        var hasH = !!(x.canvas && x.canvas.id === "shirt");
        [
          [bx, by],
          [bx + bw, by],
          [bx, by + bh],
          [bx + bw, by + bh],
        ].forEach(function (c, n) {
          if ((n === 3 || n === 0) && hasH) return; /* the 4th corner becomes the round resize handle, the 1st the round tilt handle */
          x.beginPath();
          x.arc(c[0], c[1], 6, 0, 6.283);
          x.fill();
          x.stroke();
        });
        if (hasH) {
          drawRzHandle(x, bx + bw, by + bh, e);
          drawTiltHandle(x, bx, by, e);
        }
        x.restore();
        if (hasH) drawTiltBadge(x, e);
      }
      /* round white handle with a red diagonal double-arrow: drag it to resize the selected text / photo */
      function drawRzHandle(x, hx, hy, e) {
        var cvs = x.canvas,
          rr = cvs.getBoundingClientRect(),
          k = rr.width ? cvs.width / rr.width : 1,
          /* handle shrinks together with the picture / text box (never below 50%) */
          /* Design Studio: the handle follows the text / photo box, but only within limits:
             never bigger than before (1), never smaller than half (0.5), so it is always easy to grab and never swallows a tiny text */
          s = Math.max(0.5, Math.min(1, (Math.min(e.x1 - e.x0, e.y1 - e.y0) + 14) / k / 90)),
          hr = 16 * k * s,
          f = hr / 15;
        var ta = ((+e.rot || 0) * Math.PI) / 180,
          tcx = (e.x0 + e.x1) / 2,
          tcy = (e.y0 + e.y1) / 2;
        cvs._hb = {
          x: tcx + (hx - tcx) * Math.cos(ta) - (hy - tcy) * Math.sin(ta),
          y: tcy + (hx - tcx) * Math.sin(ta) + (hy - tcy) * Math.cos(ta),
          r: hr + 14 * k * s,
          cx: (e.x0 + e.x1) / 2,
          cy: (e.y0 + e.y1) / 2,
          k: e.k,
          s: s,
        };
        x.save();
        x.translate(hx, hy);
        x.scale(f, f);
        x.setLineDash([]);
        x.shadowColor = "rgba(0,0,0,.45)";
        x.shadowBlur = 8;
        x.fillStyle = "#ffffff";
        x.strokeStyle = "#e11d2e";
        x.lineWidth = 2.5;
        x.beginPath();
        x.arc(0, 0, 15, 0, 6.283);
        x.fill();
        x.shadowBlur = 0;
        x.stroke();
        x.fillStyle = "#e11d2e";
        x.lineWidth = 2.2;
        x.lineCap = "round";
        x.beginPath();
        x.moveTo(-6, -6);
        x.lineTo(6, 6);
        x.stroke();
        x.beginPath();
        x.moveTo(-7, -7);
        x.lineTo(-1, -7);
        x.lineTo(-7, -1);
        x.closePath();
        x.fill();
        x.beginPath();
        x.moveTo(7, 7);
        x.lineTo(1, 7);
        x.lineTo(7, 1);
        x.closePath();
        x.fill();
        x.restore();
      }
      /* round white handle with a red circular arrow, on the 1st (top-left) corner: hold + drag it to tilt the selected text / photo */
      function drawTiltHandle(x, tx, ty, e) {
        var cvs = x.canvas,
          rr = cvs.getBoundingClientRect(),
          k = rr.width ? cvs.width / rr.width : 1,
          s = Math.max(0.5, Math.min(1, (Math.min(e.x1 - e.x0, e.y1 - e.y0) + 14) / k / 90)),
          hr = 16 * k * s,
          f = hr / 15,
          ta = ((+e.rot || 0) * Math.PI) / 180,
          tcx = (e.x0 + e.x1) / 2,
          tcy = (e.y0 + e.y1) / 2;
        cvs._rb = {
          x: tcx + (tx - tcx) * Math.cos(ta) - (ty - tcy) * Math.sin(ta),
          y: tcy + (tx - tcx) * Math.sin(ta) + (ty - tcy) * Math.cos(ta),
          r: hr + 14 * k * s,
          cx: tcx,
          cy: tcy,
          k: e.k,
          s: s,
          hr: hr,
        };
        x.save();
        x.translate(tx, ty);
        x.scale(f, f);
        x.setLineDash([]);
        x.shadowColor = "rgba(0,0,0,.45)";
        x.shadowBlur = 8;
        x.fillStyle = "#ffffff";
        x.strokeStyle = "#e11d2e";
        x.lineWidth = 2.5;
        x.beginPath();
        x.arc(0, 0, 15, 0, 6.283);
        x.fill();
        x.shadowBlur = 0;
        x.stroke();
        x.lineWidth = 2.2;
        x.lineCap = "round";
        x.beginPath();
        x.arc(0, 0, 6.5, -2.8, 1.6);
        x.stroke();
        x.fillStyle = "#e11d2e";
        var ea = 1.6,
          ex = 6.5 * Math.cos(ea),
          ey = 6.5 * Math.sin(ea),
          ux = -Math.sin(ea),
          uy = Math.cos(ea),
          vx = Math.cos(ea),
          vy = Math.sin(ea);
        x.beginPath();
        x.moveTo(ex + ux * 5, ey + uy * 5);
        x.lineTo(ex + vx * 4.2, ey + vy * 4.2);
        x.lineTo(ex - vx * 4.2, ey - vy * 4.2);
        x.closePath();
        x.fill();
        x.restore();
      }
      /* while tilting: small badge with the angle, next to the tilt handle */
      function drawTiltBadge(x, e) {
        var b = x.canvas._rb;
        if (!window.__dsTilt || !b) return;
        var kk = b.hr / 16 / b.s || 1,
          dx = b.x - b.cx,
          dy = b.y - b.cy,
          dl = Math.hypot(dx, dy) || 1,
          lb = Math.round(+e.rot || 0) + "\u00B0",
          lh = 26 * kk,
          lx = b.x + (dx / dl) * (b.hr + 26 * kk),
          ly = b.y + (dy / dl) * (b.hr + 26 * kk),
          lw;
        x.save();
        x.font = "700 " + Math.round(15 * kk) + "px Helvetica,Arial,sans-serif";
        x.textAlign = "center";
        x.textBaseline = "middle";
        lw = x.measureText(lb).width + 18 * kk;
        lx = Math.max(lw / 2 + 4, Math.min(x.canvas.width - lw / 2 - 4, lx));
        ly = Math.max(lh / 2 + 4, Math.min(x.canvas.height - lh / 2 - 4, ly));
        x.fillStyle = "rgba(17,17,17,.9)";
        x.beginPath();
        if (x.roundRect) x.roundRect(lx - lw / 2, ly - lh / 2, lw, lh, lh / 2);
        else x.rect(lx - lw / 2, ly - lh / 2, lw, lh);
        x.fill();
        x.fillStyle = "#ffffff";
        x.fillText(lb, lx, ly + 1);
        x.restore();
      }
      function cur_o() {
        return { sz: 100, px: 50, py: 0 };
      }
      function draw() {
        if (RAF) return;
        RAF = requestAnimationFrame(function () {
          RAF = 0;
          drawNow();
        });
        return cur_o();
      }
      function drawNow() {
        var cs_ = document.getElementById("customSec");
        if (cs_) cs_.setAttribute("data-cat", S.cat || "tee");
        var r = render($("shirt"), true);
        var qn_ = +$("qty").value || 1;
        $("price").innerHTML =
          (S.mrp > (S.price || PRICE)
            ? '<s class="mrp">₹' + (S.mrp * qn_).toLocaleString("en-IN") + "</s>"
            : "") +
          "₹" +
          ((S.price || PRICE) * qn_).toLocaleString("en-IN");
        $("price2").innerHTML = $("price").innerHTML;
        var hasTxt = T.some(function (t) {
          return t.txt && t.txt.trim();
        });
        $("place").disabled = $("addCart").disabled = !(hasTxt && r.n && S.pid);
        var stT = $("tabs").querySelector("[data-t=style]");
        if (stT) {
          if (!hasTxt) STYLESEEN = false;
          stT.classList.toggle("glow", hasTxt && !STYLESEEN);
        }
        var ob = $("picEd").querySelector(".ovl");
        if (ob) {
          var ks = Object.keys(r.ov || {});
          ob.hidden = !ks.length;
          if (ks.length) {
            var af = ks.every(function (i) {
              return T[i] && T[i].front;
            });
            [].forEach.call(ob.querySelectorAll("[data-top]"), function (c) {
              c.classList.toggle("on", (c.dataset.top === "t") === af);
            });
          }
        }
        if (window.selPop && C && C.dataset.tab === "style") selPop(false);
        return cur_o();
      }
      function printFile(K0) {
        /* flat, transparent print file of the WHOLE back design.
           The canvas is sized to everything the customer placed (picture + every text,
           including tilted ones), then trimmed to the real pixels and given the same
           empty margin on all four sides. Nothing can be cut off any more. */
        var K = K0 || 2,
          L = layout().order,
          bx0 = 1e9,
          by0 = 1e9,
          bx1 = -1e9,
          by1 = -1e9;
        L.forEach(function (e) {
          var pcx = e.cx,
            pcy = e.ty + e.ph / 2,
            a = ((e.rot || 0) * Math.PI) / 180,
            co = Math.cos(a),
            si = Math.sin(a);
          [
            [e.cx - e.pw / 2, e.ty],
            [e.cx + e.pw / 2, e.ty],
            [e.cx - e.pw / 2, e.ty + e.ph],
            [e.cx + e.pw / 2, e.ty + e.ph],
          ].forEach(function (p) {
            var dx = p[0] - pcx,
              dy = p[1] - pcy,
              X = pcx + dx * co - dy * si,
              Y = pcy + dx * si + dy * co;
            bx0 = Math.min(bx0, X);
            by0 = Math.min(by0, Y);
            bx1 = Math.max(bx1, X);
            by1 = Math.max(by1, Y);
          });
        });
        if (!L.length) {
          bx0 = by0 = 0;
          bx1 = by1 = 10;
        }
        var c = document.createElement("canvas");
        c.width = Math.max(1, Math.ceil((bx1 - bx0) * K));
        c.height = Math.max(1, Math.ceil((by1 - by0) * K));
        var x = c.getContext("2d");
        x.imageSmoothingQuality = "high";
        L.forEach(function (e) {
          if (e.rot) {
            var pcx = (e.cx - bx0) * K,
              pcy = (e.ty + e.ph / 2 - by0) * K;
            x.save();
            x.translate(pcx, pcy);
            x.rotate((e.rot * Math.PI) / 180);
            x.translate(-pcx, -pcy);
          }
          x.drawImage(e.c, (e.cx - e.pw / 2 - bx0) * K, (e.ty - by0) * K, e.pw * K, e.ph * K);
          if (e.rot) x.restore();
        });
        /* trim the empty space around the artwork, then add one equal margin on every side */
        var tx0 = 0,
          ty0 = 0,
          tx1 = c.width,
          ty1 = c.height;
        try {
          var W = c.width,
            H = c.height,
            d = x.getImageData(0, 0, W, H).data,
            i,
            j,
            f0 = 1e9,
            f1 = -1,
            g0 = 1e9,
            g1 = -1;
          for (j = 0; j < H; j++)
            for (i = 0; i < W; i++)
              if (d[(j * W + i) * 4 + 3] > 8) {
                if (i < f0) f0 = i;
                if (i > f1) f1 = i;
                if (j < g0) g0 = j;
                if (j > g1) g1 = j;
              }
          if (f1 >= 0) {
            tx0 = f0;
            tx1 = f1 + 1;
            ty0 = g0;
            ty1 = g1 + 1;
          }
        } catch (e) {}
        var tw = tx1 - tx0,
          th = ty1 - ty0,
          pad = Math.round(Math.max(tw, th) * 0.05),
          o = document.createElement("canvas");
        o.width = tw + pad * 2;
        o.height = th + pad * 2;
        o.getContext("2d").drawImage(c, tx0, ty0, tw, th, pad, pad, tw, th);
        return o.toDataURL("image/png");
      }
      function previewJpg() {
        var c = document.createElement("canvas");
        c.width = CW;
        c.height = CH;
        render(c);
        var q = 0.97,
          d;
        do {
          d = c.toDataURL("image/jpeg", q);
          q -= 0.03;
        } while (d.length > 280000 && q > 0.6);
        return d;
      }
      function loadFont(i, t) {
        var f = FONTS[i];
        return document.fonts && document.fonts.load
          ? document.fonts
              .load(f[1] + ' 60px "' + f[0] + '"', t || SAMPLES[LANG])
              .catch(function () {})
              .then(clr)
          : Promise.resolve();
      }
      var sel = 0;
      function lbl(t) {
        return t.txt.trim() || "New text";
      }
      function chips() {
        UNSEL = false;
        $("layers").innerHTML = T.map(function (t, i) {
          return (
            '<button type="button" class="lyr' +
            (tIdx() === i ? " on" : "") +
            '" data-l="' +
            i +
            '"><i style="background:' +
            colOf(t) +
            '"></i><span><b>Text ' +
            (i + 1) +
            "</b>" +
            (t.txt.trim()
              ? " <em>(" + esc(t.txt.trim()) + ")</em>"
              : " <em>(empty)</em>") +
            "</span></button>"
          );
        }).join("");
        var OR = ["1st", "2nd", "3rd", "4th", "5th"];
        $("addL").textContent =
          T.length >= MAXT
            ? "Maximum " + MAXT + " texts added"
            : T.length
              ? "Add " + OR[T.length] + " text"
              : "Add text";
        $("addN").textContent =
          T.length >= MAXT
            ? "Remove one if you want a different text"
            : T.length
              ? "You can add up to " +
                MAXT +
                " texts · " +
                T.length +
                " of " +
                MAXT +
                " used"
              : "You can add up to " + MAXT + " texts";
        $("addB").hidden = T.length >= MAXT;
        $("addB").innerHTML =
          "Add<br>" + ["1st", "2nd", "3rd", "4th", "5th"][T.length] + " text";
        $("addT").disabled = T.length >= MAXT;
        $("addT").classList.toggle("pulse", false);
        nudgeCheck();
        $("layers").classList.toggle("one", T.length < 2);
        askUpdate();
      }
      var STYSEC = "font";
      var FBI = {
        dir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16M16 4l4 4-4 4M20 16H4M8 12l-4 4 4 4"/></svg>',
        size: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5h11v2M8.5 5v13M6 18h5M14 11V10h7v1M17.5 10v8M16 18h3"/></svg>',
        font: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19L9 5l6 14M5.2 14h7.6M16 19l2.5-6 2.5 6M17 17h3"/></svg>',
        col: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.2-1-1.5-1-2.7 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/></svg>',
        pos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/></svg>',
      };
      function hintTxt() {
        return STYSEC === "col"
          ? "\uD83C\uDFA8 Use the Colour option together with the Border option just below it for the best results."
          : "\u270B Hold it on the shirt and drag to move. Pinch with two fingers to resize.";
      }
      function fbar() {
        return (
          '<div class="fbar">' +
          [
            ["font", "Font"],
            ["col", "Color"],
            ["dir", "Direction"],
          ]
            .map(function (f) {
              return (
                '<button type="button" class="fb' +
                (STYSEC === f[0] ? " on" : "") +
                '" data-fs="' +
                f[0] +
                '">' +
                FBI[f[0]] +
                "<span>" +
                f[1] +
                "</span></button>"
              );
            })
            .join("") +
          "</div>"
        );
      }
      $("editor").addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("[data-fs]");
        if (!b) return;
        STYSEC = b.dataset.fs;
        var st = $("editor").querySelector(".ed-style");
        if (st) st.dataset.sec = STYSEC;
        var hp = $("editor").querySelector(".ed-style .mdhint");
        if (hp) hp.textContent = hintTxt();
        [].forEach.call($("editor").querySelectorAll(".fb"), function (x) {
          x.classList.toggle("on", x === b);
        });
      });
      function sl(k, l, a, b, v) {
        return (
          "<label>" +
          l +
          '</label><input type="range" data-k="' +
          k +
          '" min="' +
          a +
          '" max="' +
          b +
          '" value="' +
          v +
          '">'
        );
      }
      function editor() {
        $("picEd").innerHTML = S.bimg
          ? '<div class="tcard"><div class="th"><b>Your photo</b><span style="display:flex;gap:6px">' +
            (PICFIXED
              ? ""
              : '<button class="chip" type="button" data-edi="1">Background</button>') +
            '<button class="chip" type="button" data-rmi="1">Remove</button></span></div>' +
            '<div class="ovl" hidden><label>Your picture is touching some text. Which goes on top?</label><div class="chips"><button class="chip" type="button" data-top="t">Text on top</button><button class="chip" type="button" data-top="i">Picture on top</button></div></div></div>'
          : "";
        var e = $("editor"),
          ti = tIdx(),
          t = T[ti];
        if (!t) {
          e.innerHTML = "";
          return;
        }
        e.innerHTML =
          '<div class="tcard"><div class="ed-text"><div class="th"><b>Text ' +
          (ti + 1) +
          '<span class="req"> (' +
          (ti ? "Optional" : "Required") +
          ')</span></b><span class="cnt">' +
          (t.raw == null ? t.txt : t.raw).length +
          ' / 18</span><button class="chip' +
          (T.length > 1 ? "" : " hm") +
          '" type="button" data-rm="1">Remove</button></div>' +
          '<div class="trow"><div class="tin"><input class="tt" maxlength="18" enterkeyhint="done" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Type your text here" value="' +
          esc(t.raw == null ? t.txt : t.raw) +
          '"><button type="button" class="clr" data-clr="1" data-keep aria-label="Clear text">×</button></div><button type="button" class="dn" data-done="1" data-keep>Done</button></div>' +
          xlDiv(t) +
          '</div><div class="ed-style" data-sec="' +
          STYSEC +
          '">' +
          '<p class="mdhint">' +
          hintTxt() +
          "</p>" +
          fbar() +
          '<div class="fsec fs-dir"><label>Direction</label><div class="chips dirs">' +
          [
            ["Horizontal", 0],
            ["Vertical 1", 1],
            ["Vertical 2", 2],
          ]
            .map(function (d) {
              return (
                '<button class="chip' +
                ((t.o || 0) === d[1] ? " on" : "") +
                '" type="button" data-o="' +
                d[1] +
                '">' +
                d[0] +
                "</button>"
              );
            })
            .join("") +
          "</div>" +
          '</div><div class="fsec fs-font"><label>Font</label><div class="fts">' +
          FONTS.map(function (f, n) {
            return (
              '<b data-f="' +
              n +
              '" class="' +
              (n === t.font ? "on" : "") +
              '" style="font-family:\'' +
              f[0] +
              "';font-weight:" +
              f[1] +
              '">' +
              esc((t.txt || SAMPLES[LANG]).toUpperCase()) +
              "</b>"
            );
          }).join("") +
          '</div></div><div class="fsec fs-col"><label>Colour</label><div class="sw">' +
          COLS.map(function (c, n) {
            return (
              '<i data-c="' +
              n +
              '" title="' +
              CNAMES[n] +
              '" class="' +
              (n === t.tc ? "on" : "") +
              '" style="background:' +
              c +
              '"></i>'
            );
          }).join("") +
          '<i data-c="-1" title="Custom colour" class="cust' +
          (t.tc < 0 ? " on" : "") +
          '" style="background:' +
          RAINBOW +
          '"></i></div>' +
          '<div class="cm cmc"' +
          (t.tc < 0 ? "" : " hidden") +
          '><label>Custom colour · slide to pick any colour</label><input type="range" class="hue" data-h="hue" min="0" max="360" value="' +
          (t.hue == null ? 200 : t.hue) +
          '" style="background:' +
          RAINBOW +
          '">' +
          '<input type="range" class="lit" data-h="lit" min="5" max="95" value="' +
          (t.lit == null ? 50 : t.lit) +
          '" style="background:linear-gradient(90deg,#000,hsl(' +
          (t.hue == null ? 200 : t.hue) +
          ',100%,50%),#fff)"></div>' +
          '<div class="bdsec bdx"><div class="btry" hidden>↑ Use border with colour</div><div class="bdh"><label>Border around text</label><span class="bwv' +
          (t.bw ? " on" : "") +
          '">' +
          (t.bw ? t.bw : "None") +
          '</span></div><div class="cm"><input type="range" data-k="bw" min="0" max="10" step="1" style="--p:' +
          (t.bw || 0) * 10 +
          '%" value="' +
          (t.bw || 0) +
          '"></div><div class="bdt"><span>None</span><span>Thin</span><span>Bold</span></div><div class="bcw chips"' +
          (t.bw ? "" : " hidden") +
          '><button class="chip' +
          (t.bc === "b" ? " on" : "") +
          '" type="button" data-bc="b"><i style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#111;border:1px solid #888;margin-right:6px;vertical-align:-2px"></i>Black</button><button class="chip' +
          (t.bc !== "b" ? " on" : "") +
          '" type="button" data-bc="w"><i style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#fff;border:1px solid #888;margin-right:6px;vertical-align:-2px"></i>White</button></div></div>' +
          "</div></div></div>";
      }
      function tIdx() {
        return typeof sel === "number" ? sel : T.length ? T.length - 1 : -1;
      }
      function curObj() {
        return T[tIdx()];
      }
      $("editor").oninput = function (e) {
        var o = curObj();
        if (!o) return;
        if (e.target.classList.contains("tt")) {
          o.raw = e.target.value;
          o.txt = xlit(o.raw, LANG);
          showXl();
          var cn = e.target.closest(".ed-text").querySelector(".cnt");
          if (cn) cn.textContent = e.target.value.length + " / 18";
          [].forEach.call($("editor").querySelectorAll(".fts b"), function (b) {
            b.textContent = (o.txt || SAMPLES[LANG]).toUpperCase();
          });
          chips();
          loadFont(o.font, o.txt).then(draw);
          draw();
        } else if (e.target.dataset.h) {
          o[e.target.dataset.h] = +e.target.value;
          o.tc = -1;
          var ed = $("editor"),
            cs = ed.querySelector(".cust");
          [].forEach.call(ed.querySelectorAll(".sw i"), function (b) {
            b.classList.toggle("on", b === cs);
          });
          ed.querySelector(".lit").style.background =
            "linear-gradient(90deg,#000,hsl(" +
            (o.hue == null ? 200 : o.hue) +
            ",100%,50%),#fff)";
          chips();
          draw();
        } else if (e.target.dataset.k === "bw") {
          var pbw = +o.bw || 0;
          o.bw = +e.target.value;
          if (!pbw && o.bw) o.bc = "w";
          var bcw = $("editor").querySelector(".bcw");
          if (bcw) {
            bcw.hidden = !o.bw;
            [].forEach.call(bcw.children, function (x) {
              x.classList.toggle(
                "on",
                (x.dataset.bc === "b") === (o.bc === "b"),
              );
            });
          }
          showBox = true;
          draw();
        } else if (e.target.dataset.k) {
          o[e.target.dataset.k] = +e.target.value;
          showBox = true;
          draw();
        }
      };
      $("editor").onchange = function (e) {
        if (e.target.dataset && e.target.dataset.k) {
          showBox = false;
          draw();
        }
      };
      document.addEventListener("pointerup", function () {
        if (!drag && showBox) {
          showBox = false;
          PICSEL = false;
          draw();
        }
      });
      $("editor").onclick = function (e) {
        var d = e.target.dataset,
          ti = tIdx(),
          t = T[ti];
        if (!t) return;
        if (d.bc) {
          var bb = e.target.closest("[data-bc]");
          t.bc = d.bc;
          [].forEach.call(bb.parentNode.children, function (x) {
            x.classList.toggle("on", x === bb);
          });
          draw();
          return;
        }
        if (d.clr) {
          var tf = $("editor").querySelector(".tt");
          if (tf) {
            tf.value = "";
            tf.dispatchEvent(new Event("input", { bubbles: true }));
            tf.focus();
          }
        } else if (d.done) doneTyping();
        else if (d.rm) {
          T.splice(ti, 1);
          sel = T.length ? Math.min(ti, T.length - 1) : S.bimg ? "i" : null;
          chips();
          editor();
          draw();
        } else if (d.o != null) {
          t.o = +d.o;
          [].forEach.call(e.target.parentNode.children, function (b) {
            b.classList.toggle("on", b === e.target);
          });
          draw();
        } else if (d.f != null) {
          t.font = +d.f;
          [].forEach.call(e.target.parentNode.children, function (b) {
            b.classList.toggle("on", b === e.target);
          });
          loadFont(t.font, t.txt).then(draw);
          draw();
        } else if (d.c != null) {
          t.tc = +d.c;
          [].forEach.call(e.target.parentNode.children, function (b) {
            b.classList.toggle("on", b === e.target);
          });
          var cmc = $("editor").querySelector(".cmc");
          if (cmc) cmc.hidden = t.tc >= 0;
          chips();
          draw();
        }
      };
      $("layers").onclick = function (e) {
        var b = e.target.closest("[data-l]");
        if (!b) return;
        sel = b.dataset.l === "i" ? "i" : +b.dataset.l;
        chips();
        editor();
        draw();
        selPop(true);
      };
      $("addT").onclick = function () {
        if (T.length >= MAXT) return;
        var n = newT(),
          p = T[T.length - 1];
        if (p)
          n.py = Math.min(
            88,
            p.py + ((20 + p.size * 1.6) * 1.1) / 4.4 + 3,
          ); /* lands on the next line, under the previous text */
        /* 5th text: goes to the very bottom of the print area (just above the hem) instead of piling on the 4th */
        if (p && T.length === MAXT - 1) {
          var g5 = GM(),
            lim = (g5.hem - g5.top) / g5.sy - 8;
          n.py = Math.min(lim, Math.max(100, p.py + 18));
        }
        T.push(n);
        sel = T.length - 1;
        chips();
        editor();
        draw();
        var f = $("editor").querySelector(".tt");
        if (f) f.focus();
      };
      $("addP").onclick = function () {
        if (window.picFlowOpen) picFlowOpen("ours");
        else $("file").click();
      };
      $("upP").onclick = function () {
        if (window.picUpload) picUpload();
        else $("file").click();
      };
      function setShirt(c) {
        if (c === SHIRT) return;
        SHIRT = c;

        [].forEach.call($("shirtc").children, function (b) {
          b.classList.toggle("on", b.dataset.s === c);
        });
        clr();
        chips();
        editor();
        draw();
      }
      $("shirtc").onclick = function (e) {
        var b = e.target.closest("[data-s]");
        if (b) setShirt(b.dataset.s);
      };
      /* picture controls (own box under step 2), scrolling helper and the "add another text" popup */
      $("picEd").oninput = function (e) {
        var k = e.target.dataset.k;
        if (!k) return;
        I[k] = +e.target.value;
        PICSEL = true;
        showBox = true;
        draw();
      };
      $("picEd").onchange = function (e) {
        if (e.target.dataset && e.target.dataset.k) {
          PICSEL = false;
          showBox = false;
          draw();
        }
      };
      $("picEd").onclick = function (e) {
        if (e.target.dataset.top) {
          var ov = layout().ov,
            v = e.target.dataset.top === "t";
          Object.keys(ov).forEach(function (i) {
            if (T[i]) T[i].front = v;
          });
          draw();
          return;
        }
        if (e.target.dataset.edi) {
          if (PIC.orig) openPic("bg");
          return;
        }
        if (e.target.dataset.rmi) {
          S.bimg = null;
          S.img = null;
          $("file").value = "";
          sel = T.length ? T.length - 1 : null;
          chips();
          editor();
          draw();
        }
      };
      function goTo(el) {
        if (!el || $("customSec").hidden) return;
        var m = matchMedia("(max-width:760px)").matches;
        if (m) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }
        var off = m ? $("shirt").parentNode.offsetHeight + 10 : 84,
          y = el.getBoundingClientRect().top + window.pageYOffset - off;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
      function nudgeCheck() {
        clearTimeout(NT);
        var n = $("nudge"),
          last = T[T.length - 1];
        if (
          VIEW !== "product" ||
          T.length >= MAXT ||
          !last ||
          !last.txt.trim() ||
          NUD[T.length] ||
          (C &&
            matchMedia("(max-width:760px)").matches &&
            C.dataset.tab !== "text")
        ) {
          n.hidden = true;
          return;
        }
        NT = setTimeout(function () {
          var l = T[T.length - 1];
          if (
            VIEW !== "product" ||
            T.length >= MAXT ||
            !l ||
            !l.txt.trim() ||
            NUD[T.length] ||
            (C &&
              matchMedia("(max-width:760px)").matches &&
              C.dataset.tab !== "text")
          )
            return;
          $("nudgeT").textContent = "Want another line of text?";
          $("nudgeGo").textContent = "+ Add text " + (T.length + 1);
          n.hidden = false;
        }, 900);
      }
      $("nudgeGo").onclick = function () {
        showTab("text");
        $("addT").click();
        $("nudge").hidden = true;
        setTimeout(function () {
          goTo($("editor"));
        }, 150);
      };
      $("nudgeX").onclick = function () {
        NUD[T.length] = 1;
        $("nudge").hidden = true;
      };

      /* ===== phone: Done / Enter closes the keyboard and asks about another line ===== */
      function isMob() {
        return matchMedia("(max-width:760px)").matches;
      }
      var TYT = 0,
        STEPS = ["text", "style", "image", "shirt"];
      function askUpdate() {
        var a = $("askc");
        if (!a) return;
        var l = T[T.length - 1],
          n = T.length,
          has = !!(l && l.txt.trim()),
          full = n >= MAXT,
          nm = (LANGS[LANG] || "").split(" ")[0],
          ts = T[tIdx()];
        a.hidden = !has;
        a.classList.toggle("full", full);
        $("askT").textContent = full
          ? "Maximum " + MAXT + " texts added"
          : "Add another text line?";
        $("askD").textContent = full
          ? "All set? Next you can pick the font, colour and position."
          : "You can add up to " + MAXT + " text lines.";
        $("askAdd").disabled = full;
        $("askTee").textContent = "TEXT";
        $("thP").textContent =
          "Enter your text lines" +
          (LANG !== "en" ? " (" + nm + " sound style)" : "") +
          ".";
        $("tips").innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg><span><b>Tips:</b> ' +
          (LANG !== "en"
            ? "Text is written in <b>" +
              esc(nm) +
              "</b> by sound, not translated."
            : "Short text prints sharpest on the shirt.") +
          (ts && ts.raw && ts.raw !== ts.txt
            ? "<br>On the shirt: <b>" + esc(ts.txt) + "</b>"
            : "") +
          "</span>";
      }
      function askReveal(smooth) {
        var c = $("askc"),
          sc = $("ctl"),
          ac = document.querySelector("#customSec .acts");
        if (!c || c.hidden || !sc || !ac) return;
        var cr = c.getBoundingClientRect(),
          sr = sc.getBoundingClientRect(),
          ar = ac.getBoundingClientRect();
        var top = sr.top + 10,
          bot = Math.min(sr.bottom, ar.top) - 12,
          avail = bot - top,
          d;
        /* the whole card (Add another text + Continue to Style) must sit between the top of the panel and the bottom bar */
        d =
          cr.height >= avail
            ? cr.top - top
            : cr.top + cr.height / 2 - (top + avail / 2);
        if (Math.abs(d) > 2)
          sc.scrollBy({ top: d, behavior: smooth ? "smooth" : "auto" });
      }
      function askMore() {
        var l = T[T.length - 1],
          c = $("askc");
        if (!isMob() || !l || !l.txt.trim() || c.hidden) return;
        setTimeout(function () {
          askReveal(true);
          c.classList.remove("ping");
          void c.offsetWidth;
          c.classList.add("ping");
        }, 320);
        setTimeout(function () {
          askReveal(true);
        }, 800);
        setTimeout(function () {
          askReveal(false);
        }, 1300);
      }
      function doneTyping() {
        var a = document.activeElement;
        clearTimeout(TYT);
        if (C) C.classList.remove("typing");
        if (a && a.classList && a.classList.contains("tt")) a.blur();
        askMore();
      }
      $("editor").addEventListener("keydown", function (e) {
        if (
          isMob() &&
          e.key === "Enter" &&
          e.target.classList &&
          e.target.classList.contains("tt")
        ) {
          e.preventDefault();
          doneTyping();
        }
      });
      /* while typing: shrink the shirt preview so the box stays above the keyboard */
      document.addEventListener("focusin", function (e) {
        var t = e.target;
        if (t.classList && t.classList.contains("tt")) {
          clearTimeout(TYT);
          if (C) C.classList.add("typing");
          setTimeout(function () {
            if (document.activeElement === t && isMob())
              t.scrollIntoView({ block: "center", behavior: "smooth" });
          }, 350);
        }
      });
      document.addEventListener("focusout", function (e) {
        var t = e.target;
        if (t.classList && t.classList.contains("tt")) {
          clearTimeout(TYT);
          TYT = setTimeout(function () {
            if (C) C.classList.remove("typing");
          }, 300);
        }
      });
      /* tapping Done / X must not steal focus first, or the layout moves under the finger */
      document.addEventListener("mousedown", function (e) {
        if (e.target.closest && e.target.closest("[data-keep]"))
          e.preventDefault();
      });
      document.addEventListener("click", function (e) {
        var b = e.target.closest && e.target.closest("[data-next]");
        if (b) showTab(b.dataset.next);
      });
      $("askAdd").onclick = function () {
        $("addT").click();
      };

      /* phone layout: steps under the preview (Text / Style / Image / Shirt) with a progress bar under them */
      var STYLESEEN = false;
      function showTab(t) {
        if (t === "style") STYLESEEN = true;
        var _g = $("tabs") && $("tabs").querySelector("[data-t=style]");
        if (_g && t === "style") _g.classList.remove("glow");
        if (!C) C = document.querySelector(".cust");
        C.dataset.tab = t;
        var k = STEPS.indexOf(t);
        [].forEach.call($("tabs").children, function (b, i) {
          b.classList.toggle("on", b.dataset.t === t);
          b.classList.toggle("done", i < k);
        });
        $("progF").style.width = (k + 1) * 25 + "%";
        $("prog").setAttribute("aria-valuenow", k + 1);
        if (t !== "text") C.classList.remove("typing");
        $("ctl").scrollTop = 0;
        nudgeCheck();
        if (window.FXM) FXM(t);
        if (t === "style") {
          setTimeout(function () {
            selPop(true);
          }, 60);
          setTimeout(function () {
            selPop(false);
          }, 500);
        } else selPopHide();
      }
      /* ===== storm behind the shirt: soft lightning flashes while designing, an electric power burst on the last step (phone only) ===== */
      (function () {
        var st = document.querySelector("#customSec .stage"),
          fx = document.createElement("div"),
          sky,
          cv,
          g,
          W = 0,
          H = 0,
          D = 1,
          raf = 0,
          ev = null,
          sp = [],
          timer = 0,
          power = false,
          big = 0;
        fx.className = "fx";
        fx.innerHTML =
          '<div class="fx-sky"></div><canvas class="fx-c"></canvas>';
        st.appendChild(fx);
        sky = fx.firstChild;
        cv = fx.lastChild;
        g = cv.getContext("2d");
        function jag(x0, y0, x1, y1, d) {
          var p = [
              [x0, y0],
              [x1, y1],
            ],
            i,
            j,
            o,
            a,
            b,
            dx,
            dy,
            L,
            r;
          for (i = 0; i < 5; i++) {
            o = [p[0]];
            for (j = 0; j < p.length - 1; j++) {
              a = p[j];
              b = p[j + 1];
              dx = b[0] - a[0];
              dy = b[1] - a[1];
              L = Math.sqrt(dx * dx + dy * dy) || 1;
              r = (Math.random() - 0.5) * d;
              o.push(
                [
                  (a[0] + b[0]) / 2 - (dy / L) * r,
                  (a[1] + b[1]) / 2 + (dx / L) * r,
                ],
                b,
              );
            }
            p = o;
            d *= 0.55;
          }
          return p;
        }
        function bolt(x0, y0, x1, y1, w, a) {
          var L = Math.hypot(x1 - x0, y1 - y0),
            m = jag(x0, y0, x1, y1, L * 0.35),
            br = [],
            n = 2 + ((Math.random() * 2) | 0),
            k,
            q,
            an,
            l2;
          for (k = 0; k < n; k++) {
            q = m[Math.floor(m.length * (0.25 + Math.random() * 0.5))];
            an =
              Math.atan2(y1 - y0, x1 - x0) +
              (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6);
            l2 = L * (0.18 + Math.random() * 0.22);
            br.push(
              jag(
                q[0],
                q[1],
                q[0] + Math.cos(an) * l2,
                q[1] + Math.sin(an) * l2,
                l2 * 0.3,
              ),
            );
          }
          return { m: m, br: br, w: w, a: a };
        }
        function line(p, w, c, bl) {
          g.beginPath();
          p.forEach(function (q, i) {
            i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]);
          });
          g.lineWidth = w;
          g.strokeStyle = c;
          g.shadowColor = "rgba(110,160,255,.95)";
          g.shadowBlur = bl * D;
          g.stroke();
        }
        function draw(b, f) {
          g.globalAlpha = Math.min(1, f * b.a);
          g.lineJoin = g.lineCap = "round";
          line(b.m, b.w * 4, "rgba(110,160,255,.4)", 20);
          line(b.m, b.w * 1.6, "rgba(200,225,255,.9)", 8);
          line(b.m, b.w * 0.7, "#fff", 2);
          b.br.forEach(function (q) {
            line(q, b.w * 2, "rgba(190,215,255,.55)", 8);
            line(q, b.w * 0.6, "#fff", 2);
          });
        }
        /* a faint bolt high up at one side while designing */
        function ambient() {
          var l = Math.random() < 0.5,
            x0 = l
              ? W * (0.03 + Math.random() * 0.2)
              : W * (0.77 + Math.random() * 0.2);
          return [
            bolt(
              x0,
              -4,
              x0 + (Math.random() - 0.5) * W * 0.14,
              H * (0.4 + Math.random() * 0.3),
              1,
              0.6,
            ),
          ];
        }
        /* strong arcs jumping in from both sides + from the top corners */
        function powerSet() {
          var s = [],
            i,
            y;
          for (i = 0; i < 2; i++) {
            y = H * (0.15 + Math.random() * 0.6);
            s.push(
              bolt(
                -4,
                y,
                W * (0.2 + Math.random() * 0.14),
                y + (Math.random() - 0.5) * H * 0.35,
                1.6,
                1,
              ),
            );
            y = H * (0.15 + Math.random() * 0.6);
            s.push(
              bolt(
                W + 4,
                y,
                W * (0.66 + Math.random() * 0.14),
                y + (Math.random() - 0.5) * H * 0.35,
                1.6,
                1,
              ),
            );
          }
          s.push(
            bolt(
              W * (0.1 + Math.random() * 0.15),
              -4,
              W * (0.1 + Math.random() * 0.2),
              H * 0.5,
              1.3,
              0.8,
            ),
          );
          s.push(
            bolt(
              W * (0.75 + Math.random() * 0.15),
              -4,
              W * (0.75 + Math.random() * 0.15),
              H * 0.5,
              1.3,
              0.8,
            ),
          );
          return s;
        }
        function sparks(n) {
          var i, l;
          for (i = 0; i < n; i++) {
            l = Math.random() < 0.5;
            sp.push({
              x: l ? 0 : W,
              y: H * (0.1 + Math.random() * 0.7),
              vx: (l ? 1 : -1) * (40 + Math.random() * 170),
              vy: (Math.random() - 0.5) * 170,
              t: 0,
              l: 350 + Math.random() * 450,
            });
          }
        }
        function frame(now) {
          var t = now - ev.t0,
            u = t / ev.dur,
            dt = ev.last ? now - ev.last : 0,
            f;
          ev.last = now;
          if (u >= 1 && !sp.length) {
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.clearRect(0, 0, cv.width, cv.height);
            raf = 0;
            ev = null;
            return;
          }
          if (u < 1 && t - ev.gen >= ev.regen) {
            ev.bolts = ev.mk();
            ev.gen = t;
          }
          g.setTransform(D, 0, 0, D, 0, 0);
          g.clearRect(0, 0, W, H);
          f =
            u >= 1
              ? 0
              : u < 0.12
                ? 1
                : u < 0.2
                  ? 0.15
                  : u < 0.38
                    ? 0.9
                    : u < 0.48
                      ? 0.1
                      : u < 0.62
                        ? 0.55
                        : Math.max(0, ((1 - u) / 0.38) * 0.4);
          if (f > 0)
            ev.bolts.forEach(function (b) {
              draw(b, f);
            });
          sp = sp.filter(function (s) {
            s.t += dt;
            if (s.t > s.l) return false;
            var k = 1 - s.t / s.l;
            s.x += (s.vx * dt) / 1000;
            s.y += (s.vy * dt) / 1000;
            s.vy += (120 * dt) / 1000;
            g.globalAlpha = k;
            g.fillStyle = "#e8f1ff";
            g.shadowColor = "rgba(110,160,255,1)";
            g.shadowBlur = 8 * D;
            g.fillRect(s.x - 1, s.y - 1, 2, 2);
            return true;
          });
          raf = requestAnimationFrame(frame);
        }
        function play(pw) {
          W = st.clientWidth;
          H = st.clientHeight;
          D = Math.min(window.devicePixelRatio || 1, 2);
          cv.width = Math.round(W * D);
          cv.height = Math.round(H * D);
          ev = {
            t0: performance.now(),
            dur: pw ? 700 : 650,
            regen: pw ? 85 : 99999,
            gen: 0,
            mk: pw ? powerSet : ambient,
            bolts: null,
            last: 0,
          };
          ev.bolts = ev.mk();
          if (pw) sparks(16);
          if (!raf) raf = requestAnimationFrame(frame);
        }
        function ok() {
          return (
            LANG !== "en" &&
            LANG !== "hi" &&
            LANG !== "ur" &&
            VIEW === "product" &&
            !document.hidden &&
            !$("customSec").hidden &&
            !matchMedia("(prefers-reduced-motion:reduce)").matches
          );
        }
        function strike(pw) {
          if (LANG === "en" || LANG === "hi" || LANG === "ur") return;
          sky.className = "fx-sky";
          void sky.offsetWidth;
          sky.className = "fx-sky go" + (pw ? " pw" : "");
          if (pw || Math.random() < 0.6) play(pw);
        }
        function sched(first) {
          clearTimeout(timer);
          timer = setTimeout(
            tick,
            first ||
              (power
                ? 1800 + Math.random() * 1800
                : 5000 + Math.random() * 5000),
          );
        }
        function tick() {
          if (!ok()) {
            big = 0;
            sched();
            return;
          }
          if (big > 0) {
            big--;
            strike(true);
            if (big > 0) timer = setTimeout(tick, 1100);
            else timer = 0;
            return;
          }
          if (power) {
            timer = 0;
            return;
          }
          strike(false);
          sched();
        }
        /* called from showTab: last step = power mode */
        window.FXM = function (t) {
          var p = t === "shirt";
          st.classList.toggle("power", p);
          if (p && !power) {
            power = true;
            big = 3;
            sched(450);
          } else if (!p && power) {
            power = false;
            big = 0;
            sched(3000);
          } else if (!timer) sched(2500);
        };
        window.FXS = strike;
      })();

      /* ===== English only: soft breeze + tiny snow while designing, 2s strong wind/snow burst on the last step ===== */
      (function () {
        var st = document.querySelector("#customSec .stage");
        if (!st) return;
        var bg = document.createElement("div");
        bg.className = "enbg";
        bg.innerHTML = "<i></i><b></b><u></u>";
        st.insertBefore(bg, st.firstChild);
        var cv = document.createElement("canvas");
        cv.className = "enfx";
        st.appendChild(cv);
        var g = cv.getContext("2d");
        var W = 0,
          H = 0,
          D = 1,
          fl = [],
          streaks = [],
          gust = null,
          nextGust = 0,
          burst = 0,
          raf = 0,
          last = 0,
          iv = 0,
          NF = 38;
        function mkFlake(top) {
          return {
            x: Math.random() * W,
            y: top ? -6 : Math.random() * H,
            r: 0.7 + Math.random() * 1.3,
            vy: 10 + Math.random() * 16,
            ph: Math.random() * 6.28,
            sw: 6 + Math.random() * 10,
            a: 0.35 + Math.random() * 0.5,
          };
        }
        function size() {
          var w = st.clientWidth,
            h = st.clientHeight;
          if (w !== W || h !== H) {
            W = w;
            H = h;
            D = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = Math.round(W * D);
            cv.height = Math.round(H * D);
          }
        }
        function ok() {
          return (
            LANG === "en" &&
            VIEW === "product" &&
            !document.hidden &&
            !$("customSec").hidden &&
            !matchMedia("(prefers-reduced-motion:reduce)").matches
          );
        }
        function newGust(now, strong) {
          var dir = Math.random() < 0.7 ? 1 : -1;
          gust = {
            t0: now,
            dur: strong ? 2000 : 1500 + Math.random() * 500,
            dir: dir,
            k: strong ? 1 : 0.35,
          };
          var n = strong ? 16 : 5,
            i;
          for (i = 0; i < n; i++)
            streaks.push({
              y: H * (0.05 + Math.random() * 0.85),
              x:
                dir > 0
                  ? -W * 0.3 - Math.random() * W * 0.3
                  : W * 1.3 + Math.random() * W * 0.3,
              len: W * (0.18 + Math.random() * 0.3),
              amp: 3 + Math.random() * 7,
              f: 0.015 + Math.random() * 0.02,
              sp: W * (strong ? 1.5 : 0.75) * (0.8 + Math.random() * 0.5),
              a: (strong ? 0.5 : 0.28) * (0.6 + Math.random() * 0.4),
              d: dir,
              w: strong ? 1.3 : 0.9,
            });
        }
        function frame(now) {
          raf = 0;
          if (!ok()) {
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.clearRect(0, 0, cv.width, cv.height);
            return;
          }
          size();
          var dt = Math.min(50, last ? now - last : 16);
          last = now;
          g.setTransform(D, 0, 0, D, 0, 0);
          g.clearRect(0, 0, W, H);
          if (burst && now > burst) {
            burst = 0;
          }
          var want = burst ? 170 : NF;
          while (fl.length < want) fl.push(mkFlake(!!burst));
          if (!burst && fl.length > NF) fl.length = Math.max(NF, fl.length - 3);
          if (!gust && now > nextGust) {
            newGust(now, false);
            nextGust = now + 3000 + Math.random() * 1000;
          }
          var wind = 0;
          if (gust) {
            var u = (now - gust.t0) / gust.dur;
            if (u >= 1) gust = null;
            else
              wind =
                Math.sin(Math.PI * u) * gust.dir * gust.k * (burst ? 260 : 110);
          }
          var i, f, s;
          g.fillStyle = "#fff";
          for (i = 0; i < fl.length; i++) {
            f = fl[i];
            f.ph += (dt / 1000) * 1.2;
            f.x += ((Math.sin(f.ph) * f.sw + wind) * dt) / 1000;
            f.y += (f.vy * (burst ? 2.6 : 1) * dt) / 1000;
            if (f.y > H + 6 || f.x > W + 20 || f.x < -20) {
              fl[i] = mkFlake(true);
              if (wind)
                ((fl[i].x = wind > 0 ? -8 : W + 8),
                  (fl[i].y = Math.random() * H));
            }
            g.globalAlpha = f.a;
            g.beginPath();
            g.arc(f.x, f.y, f.r, 0, 6.283);
            g.fill();
          }
          g.lineCap = "round";
          streaks = streaks.filter(function (s) {
            s.x += (s.d * s.sp * dt) / 1000;
            if (s.d > 0 ? s.x - s.len > W : s.x + s.len < 0) return false;
            var x0 = s.d > 0 ? s.x - s.len : s.x,
              x1 = s.d > 0 ? s.x : s.x + s.len,
              gr = g.createLinearGradient(x0, 0, x1, 0),
              c = "rgba(225,238,255,";
            gr.addColorStop(0, c + "0)");
            gr.addColorStop(0.5, c + s.a + ")");
            gr.addColorStop(1, c + "0)");
            g.globalAlpha = 1;
            g.strokeStyle = gr;
            g.lineWidth = s.w;
            g.beginPath();
            var x;
            for (x = x0; x <= x1; x += 8) {
              var y = s.y + Math.sin(x * s.f + now / 260) * s.amp;
              x === x0 ? g.moveTo(x, y) : g.lineTo(x, y);
            }
            g.stroke();
            return true;
          });
          raf = requestAnimationFrame(frame);
        }
        function run() {
          if (!raf && ok()) {
            last = 0;
            nextGust = performance.now() + 1200;
            raf = requestAnimationFrame(frame);
          }
        }
        setInterval(run, 600);
        document.addEventListener("visibilitychange", run);
        var prev = window.FXM;
        window.FXM = function (t) {
          if (prev) prev(t);
          if (LANG !== "en") return;
          run();
          if (t === "shirt" && ok()) {
            var n = performance.now();
            burst = n + 2000;
            gust = null;
            streaks = [];
            newGust(n, true);
          }
        };
      })();

      (function () {
        var st = document.querySelector("#customSec .stage");
        if (!st) return;
        var bg = document.createElement("div");
        bg.className = "urbg";
        st.insertBefore(bg, st.firstChild);
      })();

      /* ===== Urdu only: a crescent moon drifts down every 2-3s while designing; a full moon glows for 2s on the final step ===== */
      (function () {
        var st = document.querySelector("#customSec .stage");
        if (!st) return;
        var cv = document.createElement("canvas");
        cv.className = "urfx";
        st.appendChild(cv);
        var g = cv.getContext("2d");
        var W = 0,
          H = 0,
          D = 1,
          cr = [],
          full = null,
          raf = 0,
          last = 0,
          next = 0,
          sC = null,
          sF = null;
        function size() {
          var w = st.clientWidth,
            h = st.clientHeight;
          if (w !== W || h !== H) {
            W = w;
            H = h;
            D = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = Math.round(W * D);
            cv.height = Math.round(H * D);
          }
        }
        function ok() {
          return (
            LANG === "ur" &&
            VIEW === "product" &&
            !document.hidden &&
            !$("customSec").hidden &&
            !matchMedia("(prefers-reduced-motion:reduce)").matches
          );
        }
        function sprites() {
          if (sC) return;
          sC = document.createElement("canvas");
          sC.width = sC.height = 96;
          var a = sC.getContext("2d");
          a.shadowColor = "rgba(255,225,150,.9)";
          a.shadowBlur = 10;
          var gr = a.createLinearGradient(14, 14, 70, 80);
          gr.addColorStop(0, "#fff6d6");
          gr.addColorStop(1, "#e6b94d");
          a.fillStyle = gr;
          a.beginPath();
          a.arc(48, 48, 32, 0, 6.2832);
          a.fill();
          a.shadowBlur = 0;
          a.globalCompositeOperation = "destination-out";
          a.beginPath();
          a.arc(60, 40, 28, 0, 6.2832);
          a.fill();
          sF = document.createElement("canvas");
          sF.width = sF.height = 256;
          var b = sF.getContext("2d");
          var h = b.createRadialGradient(128, 128, 40, 128, 128, 128);
          h.addColorStop(0, "rgba(255,236,170,.55)");
          h.addColorStop(1, "rgba(255,236,170,0)");
          b.fillStyle = h;
          b.fillRect(0, 0, 256, 256);
          var m = b.createRadialGradient(112, 110, 6, 128, 128, 58);
          m.addColorStop(0, "#fffbe9");
          m.addColorStop(0.7, "#f7e3a0");
          m.addColorStop(1, "#e2bd62");
          b.fillStyle = m;
          b.beginPath();
          b.arc(128, 128, 58, 0, 6.2832);
          b.fill();
          b.fillStyle = "rgba(190,150,70,.28)";
          [
            [108, 112, 11],
            [146, 104, 7],
            [140, 146, 13],
            [104, 150, 6],
          ].forEach(function (c) {
            b.beginPath();
            b.arc(c[0], c[1], c[2], 0, 6.2832);
            b.fill();
          });
        }
        function spawn() {
          cr.push({
            x: W * (0.1 + Math.random() * 0.8),
            y: -20,
            s: 16 + Math.random() * 16,
            rot: (Math.random() - 0.5) * 1.2,
            vr: (Math.random() - 0.5) * 0.8,
            vy: 22 + Math.random() * 16,
            ph: Math.random() * 6.28,
            sw: 10 + Math.random() * 14,
            life: 0,
            maxl: 4200,
          });
        }
        function frame(now) {
          raf = 0;
          if (!ok()) {
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.clearRect(0, 0, cv.width, cv.height);
            return;
          }
          size();
          sprites();
          var dt = Math.min(50, last ? now - last : 16);
          last = now;
          g.setTransform(D, 0, 0, D, 0, 0);
          g.clearRect(0, 0, W, H);
          if (!full && now > next) {
            spawn();
            next = now + 2000 + Math.random() * 1000;
          }
          cr = cr.filter(function (p) {
            p.life += dt;
            p.ph += (dt / 1000) * 1.8;
            p.rot += (p.vr * dt) / 1000;
            p.y += (p.vy * dt) / 1000;
            p.x += (Math.sin(p.ph) * p.sw * dt) / 1000;
            var k = p.life / p.maxl;
            if (k >= 1 || p.y > H + 20) return false;
            g.save();
            g.globalAlpha =
              (k < 0.15 ? k / 0.15 : k > 0.7 ? (1 - k) / 0.3 : 1) * 0.9;
            g.translate(p.x, p.y);
            g.rotate(p.rot);
            g.drawImage(sC, -p.s, -p.s, p.s * 2, p.s * 2);
            g.restore();
            return true;
          });
          if (full) {
            var u = (now - full.t0) / 2000;
            if (u >= 1) full = null;
            else if (u >= 0) {
              var e = 1 - Math.pow(1 - Math.min(1, u * 2.5), 3),
                a = u < 0.2 ? u / 0.2 : u > 0.75 ? (1 - u) / 0.25 : 1,
                R = H * (0.34 + 0.06 * Math.sin(u * 9)),
                y = H * 0.3 + (1 - e) * H * 0.25;
              g.save();
              g.globalAlpha = a;
              g.drawImage(sF, W * 0.5 - R, y - R, R * 2, R * 2);
              g.restore();
            }
          }
          raf = requestAnimationFrame(frame);
        }
        function run() {
          if (!raf && ok()) {
            last = 0;
            next = performance.now() + 900;
            raf = requestAnimationFrame(frame);
          }
        }
        setInterval(run, 600);
        document.addEventListener("visibilitychange", run);
        var prev = window.FXM;
        window.FXM = function (t) {
          if (prev) prev(t);
          if (LANG !== "ur") return;
          run();
          if (t === "shirt" && ok()) {
            full = { t0: performance.now() };
            cr = [];
          }
        };
      })();

      /* ===== Falling flags (English): small flag sprites shared by the customizer and the home banner ===== */
      var FLAGS = {};
      function flagSprite(k) {
        if (FLAGS[k]) return FLAGS[k];
        var c = document.createElement("canvas"),
          x;
        if (k === "uk") {
          c.width = 120;
          c.height = 60;
          x = c.getContext("2d");
          x.fillStyle = "#012169";
          x.fillRect(0, 0, 120, 60);
          x.strokeStyle = "#fff";
          x.lineWidth = 12;
          x.beginPath();
          x.moveTo(0, 0);
          x.lineTo(120, 60);
          x.moveTo(120, 0);
          x.lineTo(0, 60);
          x.stroke();
          x.strokeStyle = "#C8102E";
          x.lineWidth = 4;
          x.beginPath();
          x.moveTo(0, 0);
          x.lineTo(120, 60);
          x.moveTo(120, 0);
          x.lineTo(0, 60);
          x.stroke();
          x.fillStyle = "#fff";
          x.fillRect(50, 0, 20, 60);
          x.fillRect(0, 20, 120, 20);
          x.fillStyle = "#C8102E";
          x.fillRect(54, 0, 12, 60);
          x.fillRect(0, 24, 120, 12);
        } else {
          c.width = 120;
          c.height = 60;
          x = c.getContext("2d");
          var i, j;
          for (i = 0; i < 13; i++) {
            x.fillStyle = i % 2 ? "#fff" : "#B22234";
            x.fillRect(0, (i * 60) / 13, 120, 60 / 13 + 0.6);
          }
          x.fillStyle = "#3C3B6E";
          x.fillRect(0, 0, 50, 32.3);
          x.fillStyle = "#fff";
          for (i = 0; i < 5; i++)
            for (j = 0; j < 6 - (i % 2); j++) {
              x.beginPath();
              x.arc(4.5 + j * 8 + (i % 2 ? 4 : 0), 4 + i * 6.3, 1.5, 0, 6.2832);
              x.fill();
            }
        }
        x.strokeStyle = "rgba(0,0,0,.25)";
        x.lineWidth = 1;
        x.strokeRect(0.5, 0.5, c.width - 1, c.height - 1);
        return (FLAGS[k] = c);
      }
      function flagP(W, k, sc, fast) {
        var r = Math.random;
        return {
          t: "f",
          sp: flagSprite(k),
          x: W * (0.06 + r() * 0.88),
          y: -16,
          w: (24 + r() * 10) * sc,
          rot: (r() - 0.5) * 0.6,
          vr: 0,
          vy: (fast ? 240 + r() * 140 : 26 + r() * 16) * sc,
          ph: r() * 6.28,
          sw: (fast ? 6 : 12) * sc,
          life: 0,
          max: fast ? 2600 : 12000,
        };
      }
      function flagDraw(g, p, al) {
        g.globalAlpha = al * 0.9;
        g.rotate(Math.sin(p.ph) * 0.25);
        g.scale(Math.cos(p.ph * 1.3) * 0.2 + 0.85, 1);
        g.drawImage(p.sp, -p.w / 2, -p.w / 4, p.w, p.w / 2);
      }
      /* customizer, English, phone: a UK flag drifts down every 2-3s; a bunch of flags falls for ~1.4s when the design is finished */
      (function () {
        var st = document.querySelector("#customSec .stage");
        if (!st) return;
        var cv = document.createElement("canvas");
        cv.className = "enfl";
        st.appendChild(cv);
        var g = cv.getContext("2d");
        var W = 0,
          H = 0,
          D = 1,
          pt = [],
          raf = 0,
          last = 0,
          next = 0,
          bu = 0,
          bn = 0;
        function size() {
          var w = st.clientWidth,
            h = st.clientHeight;
          if (w !== W || h !== H) {
            W = w;
            H = h;
            D = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = Math.round(W * D);
            cv.height = Math.round(H * D);
          }
        }
        function ok() {
          return (
            LANG === "en" &&
            VIEW === "product" &&
            !document.hidden &&
            !$("customSec").hidden &&
            !matchMedia("(prefers-reduced-motion:reduce)").matches
          );
        }
        function frame(now) {
          raf = 0;
          if (!ok()) {
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.clearRect(0, 0, cv.width, cv.height);
            pt = [];
            return;
          }
          size();
          var dt = Math.min(50, last ? now - last : 16),
            sc = Math.max(0.7, Math.min(1.3, H / 300));
          last = now;
          g.setTransform(D, 0, 0, D, 0, 0);
          g.clearRect(0, 0, W, H);
          if (now < bu) {
            if (now > bn) {
              pt.push(flagP(W, "us", sc, 1));
              bn = now + 70;
            }
          } else if (now > next) {
            pt.push(flagP(W, "uk", sc, 0));
            next = now + 2000 + Math.random() * 1000;
          }
          pt = pt.filter(function (p) {
            p.life += dt;
            var f = p.life / p.max;
            if (f >= 1 || p.y > H + 20) return false;
            p.ph += (dt / 1000) * 1.7;
            p.y += (p.vy * dt) / 1000;
            p.x += (Math.sin(p.ph) * p.sw * dt) / 1000;
            g.save();
            g.translate(p.x, p.y);
            g.rotate(p.rot);
            flagDraw(g, p, f < 0.08 ? f / 0.08 : f > 0.85 ? (1 - f) / 0.15 : 1);
            g.restore();
            return true;
          });
          raf = requestAnimationFrame(frame);
        }
        function run() {
          if (!raf && ok()) {
            last = 0;
            next = performance.now() + 900;
            raf = requestAnimationFrame(frame);
          }
        }
        setInterval(run, 600);
        document.addEventListener("visibilitychange", run);
        var prev = window.FXM;
        window.FXM = function (t) {
          if (prev) prev(t);
          if (LANG !== "en") return;
          run();
          if (t === "shirt" && ok()) {
            bu = performance.now() + 1400;
            bn = performance.now();
          }
        };
      })();

      /* ===== Home banner: a calm, themed effect that follows the language chosen for each banner photo (storm / lotus / crescent / breeze) ===== */
      (function () {
        var hero = $("hero");
        if (!hero) return;
        var cv = document.createElement("canvas");
        cv.className = "hfx";
        hero.insertBefore(cv, hero.querySelector(".hcopy"));
        var g = cv.getContext("2d"),
          W = 0,
          HT = 0,
          D = 1,
          raf = 0,
          last = 0,
          pt = [],
          fl = null,
          nx = 0,
          KIND = {
            ja: "storm",
            zh: "storm",
            hi: "lotus",
            mr: "lotus",
            ur: "moon",
            en: "flags",
          },
          sC = null,
          lk = "",
          bu = 0,
          bn = 0;
        function size() {
          var w = hero.clientWidth,
            h = hero.clientHeight;
          if (w !== W || h !== HT) {
            W = w;
            HT = h;
            D = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = Math.round(W * D);
            cv.height = Math.round(HT * D);
          }
        }
        function ok() {
          return (
            !hero.hidden &&
            !document.hidden &&
            !matchMedia("(prefers-reduced-motion:reduce)").matches
          );
        }
        function kind() {
          var x = G.concat(H)[cur];
          return (x && KIND[x.lang]) || "";
        }
        function crescent() {
          if (sC) return;
          sC = document.createElement("canvas");
          sC.width = sC.height = 96;
          var a = sC.getContext("2d");
          a.shadowColor = "rgba(255,225,150,.9)";
          a.shadowBlur = 10;
          var gr = a.createLinearGradient(14, 14, 70, 80);
          gr.addColorStop(0, "#fff6d6");
          gr.addColorStop(1, "#e6b94d");
          a.fillStyle = gr;
          a.beginPath();
          a.arc(48, 48, 32, 0, 6.2832);
          a.fill();
          a.shadowBlur = 0;
          a.globalCompositeOperation = "destination-out";
          a.beginPath();
          a.arc(60, 40, 28, 0, 6.2832);
          a.fill();
        }
        function jag(x0, y0, x1, y1, d) {
          var p = [
              [x0, y0],
              [x1, y1],
            ],
            i,
            j,
            o,
            a,
            b,
            dx,
            dy,
            L,
            r;
          for (i = 0; i < 5; i++) {
            o = [p[0]];
            for (j = 0; j < p.length - 1; j++) {
              a = p[j];
              b = p[j + 1];
              dx = b[0] - a[0];
              dy = b[1] - a[1];
              L = Math.sqrt(dx * dx + dy * dy) || 1;
              r = (Math.random() - 0.5) * d;
              o.push(
                [
                  (a[0] + b[0]) / 2 - (dy / L) * r,
                  (a[1] + b[1]) / 2 + (dx / L) * r,
                ],
                b,
              );
            }
            p = o;
            d *= 0.55;
          }
          return p;
        }
        function petalPath(h, w) {
          g.beginPath();
          g.moveTo(0, 0);
          g.bezierCurveTo(-w, -h * 0.3, -w * 0.8, -h * 0.85, 0, -h);
          g.bezierCurveTo(w * 0.8, -h * 0.85, w, -h * 0.3, 0, 0);
          g.closePath();
        }
        function spawn(k, sc) {
          var r = Math.random;
          if (k === "lotus")
            pt.push({
              t: "p",
              x: W * (0.05 + r() * 0.9),
              y: -14,
              h: (8 + r() * 6) * sc,
              rot: r() * 6.28,
              vr: (r() - 0.5) * 0.9,
              vy: (20 + r() * 14) * sc,
              ph: r() * 6.28,
              sw: (10 + r() * 14) * sc,
              life: 0,
              max: 16000,
            });
          else if (k === "moon")
            pt.push({
              t: "c",
              x: W * (0.08 + r() * 0.84),
              y: -14,
              s: (9 + r() * 8) * sc,
              rot: (r() - 0.5) * 1.1,
              vr: (r() - 0.5) * 0.5,
              vy: (16 + r() * 10) * sc,
              ph: r() * 6.28,
              sw: (8 + r() * 10) * sc,
              life: 0,
              max: 7000,
            });
          else if (k === "flags") pt.push(flagP(W, "uk", sc, 0));
          else if (k === "breeze")
            pt.push({
              t: "w",
              x: -120,
              y: HT * (0.1 + r() * 0.6),
              len: (110 + r() * 110) * sc,
              vx: (90 + r() * 70) * sc,
              ph: r() * 6.28,
              amp: (4 + r() * 6) * sc,
              life: 0,
              max: 4200,
            });
        }
        /* when a banner photo appears, its effect is already running: petals/moons spread over the picture, first thunder soon */
        function seed(k, sc, now) {
          var r = Math.random,
            i;
          if (k === "storm") nx = now + 500;
          else if (k === "lotus") {
            for (i = 0; i < 7; i++) {
              spawn(k, sc);
              pt[pt.length - 1].y = HT * (0.02 + r() * 0.6);
            }
            nx = now + 900;
          } else if (k === "moon") {
            for (i = 0; i < 3; i++) {
              spawn(k, sc);
              pt[pt.length - 1].y = HT * (0.03 + r() * 0.5);
            }
            nx = now + 1500;
          }
        }
        function frame(now) {
          raf = 0;
          if (!ok()) {
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.clearRect(0, 0, cv.width, cv.height);
            pt = [];
            fl = null;
            lk = "";
            return;
          }
          size();
          var dt = Math.min(50, last ? now - last : 16),
            k = kind(),
            sc = Math.max(0.8, Math.min(1.4, HT / 560));
          last = now;
          g.setTransform(D, 0, 0, D, 0, 0);
          g.clearRect(0, 0, W, HT);
          var key = cur + "|" + k;
          if (key !== lk) {
            if (lk.split("|")[1] !== k) {
              pt = [];
              fl = null;
            }
            seed(k, sc, now);
            if (k === "flags") {
              bu = now + 1500;
              bn = now;
            }
          }
          lk = key;
          if (bu > now) {
            if (now > bn) {
              pt.push(flagP(W, "us", sc, 1));
              bn = now + 110;
            }
            nx = Math.max(nx, bu + 700);
          }
          if (k && now > nx) {
            if (k === "storm") {
              fl = {
                t0: now,
                dur: 750,
                x: W * (0.15 + Math.random() * 0.7),
                b:
                  Math.random() < 0.45
                    ? jag(
                        0,
                        0,
                        (Math.random() - 0.5) * W * 0.1,
                        HT * (0.25 + Math.random() * 0.2),
                        HT * 0.18,
                      )
                    : null,
                bx: 0,
              };
              if (fl.b)
                fl.b.forEach(function (q) {
                  q[0] += fl.x;
                });
              nx = now + 2000 + Math.random() * 600;
            } else {
              spawn(k, sc);
              if (k === "lotus" && Math.random() < 0.2) spawn(k, sc);
              nx =
                now +
                (k === "moon"
                  ? 2600
                  : k === "flags"
                    ? 3200
                    : k === "breeze"
                      ? 4200
                      : 1300) +
                Math.random() * (k === "lotus" ? 900 : 1400);
            }
          }
          if (fl) {
            var u = (now - fl.t0) / fl.dur;
            if (u >= 1) fl = null;
            else {
              var a = Math.pow(1 - u, 2) * (0.55 + 0.45 * Math.sin(u * 22)),
                gr = g.createRadialGradient(
                  fl.x,
                  0,
                  0,
                  fl.x,
                  0,
                  Math.max(W, HT) * 0.8,
                );
              gr.addColorStop(0, "rgba(195,220,255," + 0.3 * a + ")");
              gr.addColorStop(1, "rgba(195,220,255,0)");
              g.fillStyle = gr;
              g.fillRect(0, 0, W, HT);
              if (fl.b && u < 0.5) {
                g.save();
                g.globalAlpha = (1 - u * 2) * 0.55;
                g.lineJoin = g.lineCap = "round";
                g.beginPath();
                fl.b.forEach(function (q, i) {
                  i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]);
                });
                g.shadowColor = "rgba(120,170,255,.9)";
                g.shadowBlur = 14 * D;
                g.strokeStyle = "rgba(225,238,255,.95)";
                g.lineWidth = 1.2;
                g.stroke();
                g.restore();
              }
            }
          }
          crescent();
          pt = pt.filter(function (p) {
            p.life += dt;
            var f = p.life / p.max;
            if (f >= 1) return false;
            if (p.t === "w") {
              p.x += (p.vx * dt) / 1000;
              var y = p.y + Math.sin(p.life / 600 + p.ph) * p.amp,
                al = Math.sin(f * Math.PI) * 0.16,
                gr = g.createLinearGradient(p.x - p.len, 0, p.x, 0);
              gr.addColorStop(0, "rgba(255,255,255,0)");
              gr.addColorStop(1, "rgba(255,255,255," + al + ")");
              g.strokeStyle = gr;
              g.lineWidth = 1.2;
              g.beginPath();
              g.moveTo(p.x - p.len, y);
              g.lineTo(p.x, y);
              g.stroke();
              return p.x - p.len < W;
            }
            p.ph += (dt / 1000) * 1.7;
            p.rot += (p.vr * dt) / 1000;
            p.y += (p.vy * dt) / 1000;
            p.x += (Math.sin(p.ph) * p.sw * dt) / 1000;
            if (p.y > HT + 20) return false;
            var al = f < 0.08 ? f / 0.08 : f > 0.85 ? (1 - f) / 0.15 : 1;
            g.save();
            g.translate(p.x, p.y);
            g.rotate(p.rot);
            if (p.t === "f") flagDraw(g, p, al);
            else if (p.t === "c") {
              g.globalAlpha = al * 0.8;
              g.drawImage(sC, -p.s, -p.s, p.s * 2, p.s * 2);
            } else {
              g.globalAlpha = al * 0.7;
              g.scale(Math.cos(p.ph) * 0.5 + 0.6, 1);
              var gr2 = g.createLinearGradient(0, 0, 0, -p.h);
              gr2.addColorStop(0, "#f08cb4");
              gr2.addColorStop(1, "#ffe3ef");
              g.fillStyle = gr2;
              g.shadowColor = "rgba(255,150,190,.5)";
              g.shadowBlur = 5;
              petalPath(p.h, p.h * 0.42);
              g.fill();
            }
            g.restore();
            return true;
          });
          raf = requestAnimationFrame(frame);
        }
        function run() {
          if (!raf && ok()) {
            last = 0;
            nx = performance.now() + 1200;
            raf = requestAnimationFrame(frame);
          }
        }
        setInterval(run, 600);
        document.addEventListener("visibilitychange", run);
      })();

      /* ===== Hindi only: lotus petals drift down every 2-3s while designing; lotuses bloom up from the bottom on the last step ===== */
      (function () {
        var st = document.querySelector("#customSec .stage");
        if (!st) return;
        var bg = document.createElement("div");
        bg.className = "hibg";
        bg.innerHTML = "";
        st.insertBefore(bg, st.firstChild);
        var ar = document.createElement("div");
        ar.className = "hiarch";
        ar.innerHTML = "";
        st.appendChild(ar);
        var cv = document.createElement("canvas");
        cv.className = "hifx";
        st.appendChild(cv);
        var g = cv.getContext("2d");
        var W = 0,
          H = 0,
          D = 1,
          pet = [],
          lot = [],
          raf = 0,
          last = 0,
          next = 0,
          burst = 0,
          nextB = 0,
          PAL = [
            ["#ffe3ef", "#ff9cc2"],
            ["#fff2f7", "#ffb3d0"],
            ["#ffd0e2", "#f06fa0"],
            ["#fff5e6", "#ffb870"],
            ["#ffe9f2", "#ff86b4"],
          ];
        function size() {
          var w = st.clientWidth,
            h = st.clientHeight;
          if (w !== W || h !== H) {
            W = w;
            H = h;
            D = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = Math.round(W * D);
            cv.height = Math.round(H * D);
          }
        }
        function ok() {
          return (
            LANG === "hi" &&
            VIEW === "product" &&
            !document.hidden &&
            !$("customSec").hidden &&
            !matchMedia("(prefers-reduced-motion:reduce)").matches
          );
        }
        function petal(x, y, rise) {
          var c = PAL[(Math.random() * PAL.length) | 0];
          return {
            x: x,
            y: y,
            h: 9 + Math.random() * 7,
            rot: Math.random() * 6.28,
            vr: (Math.random() - 0.5) * 1.6,
            vx: (Math.random() - 0.5) * (rise ? 90 : 14),
            vy: rise ? -(70 + Math.random() * 90) : 20 + Math.random() * 14,
            gy: rise ? 85 : 0,
            ph: Math.random() * 6.28,
            sw: rise ? 10 : 16 + Math.random() * 16,
            c0: c[0],
            c1: c[1],
            a: 0.9,
            life: 0,
            maxl: rise ? 3400 : 99999,
          };
        }
        function pPath(h, w) {
          g.beginPath();
          g.moveTo(0, 0);
          g.bezierCurveTo(-w, -h * 0.3, -w * 0.8, -h * 0.85, 0, -h);
          g.bezierCurveTo(w * 0.8, -h * 0.85, w, -h * 0.3, 0, 0);
          g.closePath();
        }
        function drawPetal(p) {
          g.save();
          g.translate(p.x, p.y);
          g.rotate(p.rot);
          g.scale(Math.cos(p.ph) * 0.55 + 0.6, 1);
          g.globalAlpha = p.a;
          var gr = g.createLinearGradient(0, 0, 0, -p.h);
          gr.addColorStop(0, p.c1);
          gr.addColorStop(1, p.c0);
          g.fillStyle = gr;
          g.shadowColor = "rgba(255,150,190,.55)";
          g.shadowBlur = 6;
          pPath(p.h, p.h * 0.42);
          g.fill();
          g.restore();
        }
        function drawLotus(f, u) {
          var e = 1 - Math.pow(1 - Math.min(1, u * 2.2), 3),
            S = f.S * (0.25 + 0.75 * e),
            a =
              u < 0.15 ? u / 0.15 : u > 0.68 ? Math.max(0, (1 - u) / 0.32) : 1,
            y = f.y0 - (1 - Math.pow(1 - u, 2)) * f.rise,
            x = f.x + Math.sin(u * 5 + f.ph) * 8,
            rows = [
              [-70, -35, 0, 35, 70, 1, 0, 0.32],
              [-52, -18, 18, 52, 0.86, 1, 0.3],
              [-28, 0, 28, 0.7, 2, 0.28],
            ],
            i,
            j,
            r,
            n;
          g.save();
          g.translate(x, y);
          g.globalAlpha = a;
          g.shadowColor = "rgba(255,140,190,.7)";
          g.shadowBlur = 12;
          var rowsDef = [
            { an: [-72, -36, 0, 36, 72], k: 1, c0: "#ffc9de", c1: "#e8508a" },
            { an: [-54, -18, 18, 54], k: 0.86, c0: "#ffe1ec", c1: "#f67aa8" },
            { an: [-30, 0, 30], k: 0.68, c0: "#fff4f8", c1: "#ffa6c6" },
          ];
          for (i = 0; i < rowsDef.length; i++) {
            r = rowsDef[i];
            for (j = 0; j < r.an.length; j++) {
              g.save();
              g.rotate((r.an[j] * Math.PI) / 180);
              var gr = g.createLinearGradient(0, 0, 0, -S * r.k);
              gr.addColorStop(0, r.c1);
              gr.addColorStop(1, r.c0);
              g.fillStyle = gr;
              pPath(S * r.k, S * r.k * 0.3);
              g.fill();
              g.lineWidth = 0.6;
              g.strokeStyle = "rgba(255,255,255,.55)";
              g.stroke();
              g.restore();
            }
          }
          g.shadowBlur = 0;
          g.fillStyle = "#ffd24a";
          g.beginPath();
          g.arc(0, -S * 0.12, S * 0.09, 0, 6.283);
          g.fill();
          g.restore();
        }
        function frame(now) {
          raf = 0;
          if (!ok()) {
            g.setTransform(1, 0, 0, 1, 0, 0);
            g.clearRect(0, 0, cv.width, cv.height);
            return;
          }
          size();
          var dt = Math.min(50, last ? now - last : 16),
            i,
            p;
          last = now;
          g.setTransform(D, 0, 0, D, 0, 0);
          g.clearRect(0, 0, W, H);
          if (!burst || now > burst) {
            burst = 0;
            if (now > next) {
              pet.push(petal(W * (0.12 + Math.random() * 0.76), -12, false));
              if (Math.random() < 0.25)
                pet.push(petal(W * Math.random(), -12, false));
              next = now + 2000 + Math.random() * 1000;
            }
          } else if (now > nextB) {
            pet.push(petal(Math.random() * W, H + 8, true));
            nextB = now + 55;
          }
          pet = pet.filter(function (p) {
            p.life += dt;
            p.ph += (dt / 1000) * 2.1;
            p.rot += (p.vr * dt) / 1000;
            p.vy += (p.gy * dt) / 1000;
            p.x += ((p.vx + Math.sin(p.ph * 0.7) * p.sw) * dt) / 1000;
            p.y += (p.vy * dt) / 1000;
            if (p.maxl < 99999) {
              var k = p.life / p.maxl;
              p.a = k > 0.7 ? Math.max(0, (1 - k) / 0.3) * 0.9 : 0.9;
              if (k >= 1) return false;
            }
            if (p.y > H + 16 || p.x < -20 || p.x > W + 20) return false;
            drawPetal(p);
            return true;
          });
          lot = lot.filter(function (f) {
            var u = (now - f.t0) / f.life;
            if (u < 0) return true;
            if (u >= 1) return false;
            drawLotus(f, u);
            return true;
          });
          raf = requestAnimationFrame(frame);
        }
        function run() {
          if (!raf && ok()) {
            last = 0;
            next = performance.now() + 900;
            raf = requestAnimationFrame(frame);
          }
        }
        setInterval(run, 600);
        document.addEventListener("visibilitychange", run);
        var prev = window.FXM;
        window.FXM = function (t) {
          if (prev) prev(t);
          if (LANG !== "hi") return;
          run();
          if (t === "shirt" && ok()) {
            var n = performance.now(),
              i;
            burst = n + 3000;
            nextB = n;
            lot = [];
            for (i = 0; i < 9; i++)
              lot.push({
                x: W * (0.08 + (0.84 * (i + Math.random() * 0.6)) / 9),
                y0: H + 28,
                rise: H * (0.4 + Math.random() * 0.32),
                S: 26 + Math.random() * 24,
                t0: n + i * 170 + Math.random() * 160,
                life: 2300 + Math.random() * 700,
                ph: Math.random() * 6.28,
              });
          }
        };
      })();
      $("tabs").onclick = function (e) {
        var b = e.target.closest("[data-t]");
        if (b) showTab(b.dataset.t);
      };
      C = document.querySelector(".cust");
      C.dataset.tab = "text";

      /* drag things around right on the shirt */
      var cv = $("shirt"),
        drag = null,
        rect = null,
        PTS = {},
        PZ = null;
      function pt(e) {
        var r = rect || cv.getBoundingClientRect();
        return [
          ((e.clientX - r.left) * CW) / r.width,
          ((e.clientY - r.top) * CH) / r.height,
        ];
      }
      function hit(x, y) {
        var o = layout().order;
        for (var k = o.length - 1; k >= 0; k--) {
          var e = o[k],
            hx = x,
            hy = y;
          if (e.rot) {
            /* Instant Studio tilt: turn the touch point back into the untilted box */
            var ha = (-e.rot * Math.PI) / 180,
              hcx = (e.x0 + e.x1) / 2,
              hcy = (e.y0 + e.y1) / 2,
              hdx = x - hcx,
              hdy = y - hcy;
            hx = hcx + hdx * Math.cos(ha) - hdy * Math.sin(ha);
            hy = hcy + hdx * Math.sin(ha) + hdy * Math.cos(ha);
          }
          if (hx >= e.x0 - 8 && hx <= e.x1 + 8 && hy >= e.y0 - 8 && hy <= e.y1 + 8)
            return e;
        }
        return null;
      }
      function ghostAt(p) {
        if (!GH.length || layout().n) return null;
        for (var i = 0; i < GH.length; i++) {
          var g = GH[i];
          if (p[0] >= g.x0 && p[0] <= g.x1 && p[1] >= g.y0 && p[1] <= g.y1)
            return g.id;
        }
        return null;
      }
      function focusTT() {
        var f = $("editor").querySelector(".tt");
        if (f) f.focus();
      }
      function ghostAct(id) {
        if (id === "img") {
          $("addP").click();
          return;
        }
        if (id === "t2" && T.length < 2) {
          $("addT").click();
          return;
        }
        sel = id === "t2" ? 1 : 0;
        chips();
        editor();
        draw();
        focusTT();
      }
      function hitPref(x, y) {
        var o = layout().order;
        function inb(e, pd) {
          var hx = x,
            hy = y;
          if (e.rot) {
            var ha = (-e.rot * Math.PI) / 180,
              hcx = (e.x0 + e.x1) / 2,
              hcy = (e.y0 + e.y1) / 2,
              hdx = x - hcx,
              hdy = y - hcy;
            hx = hcx + hdx * Math.cos(ha) - hdy * Math.sin(ha);
            hy = hcy + hdx * Math.sin(ha) + hdy * Math.cos(ha);
          }
          return (
            hx >= e.x0 - pd && hx <= e.x1 + pd && hy >= e.y0 - pd && hy <= e.y1 + pd
          );
        }
        var hs = o.filter(function (e) {
          return inb(e, 8);
        });
        var tx = hs.filter(function (e) {
          return e.k !== "i";
        });
        /* a text line is a thin target on a phone: if the tap just misses it (even though it lands on the big photo box),
           still pick the nearest text within ~14 screen px, so text on top of an image is always easy to grab */
        if (!tx.length) {
          var pad = rect && rect.width ? Math.min(40, Math.max(8, (14 * CW) / rect.width)) : 8,
            best = null,
            bd = 1e9;
          o.forEach(function (e) {
            if (e.k === "i" || !inb(e, pad)) return;
            var d = Math.hypot(x - (e.x0 + e.x1) / 2, y - (e.y0 + e.y1) / 2);
            if (d < bd) {
              bd = d;
              best = e;
            }
          });
          /* never reach through a photo that is drawn above this text */
          var imgAbove = -1;
          hs.forEach(function (e) {
            if (e.k === "i") imgAbove = Math.max(imgAbove, o.indexOf(e));
          });
          if (best && o.indexOf(best) > imgAbove) return best;
        }
        if (!hs.length) return null;
        var cur = UNSEL
          ? null
          : hs.filter(function (e) {
              return e.k === "i" ? sel === "i" : e.i === sel;
            })[0];
        if (cur) {
          var ci = o.indexOf(cur),
            above = hs.filter(function (e) {
              return o.indexOf(e) > ci;
            });
          /* a photo drawn ABOVE the selected text must be pickable (do not select the text hidden behind it) */
          var imgs = above.filter(function (e) {
            return e.k === "i";
          });
          if (imgs.length) return imgs[imgs.length - 1];
          /* photo selected + a text drawn above it: the text wins */
          if (cur.k === "i") {
            var tAbove = above.filter(function (e) {
              return e.k !== "i";
            });
            if (tAbove.length) return tAbove[tAbove.length - 1];
          }
          return cur;
        }
        return hs[hs.length - 1];
      }
      function selObj() {
        if (UNSEL) return null;
        return sel === "i"
          ? S.bimg
            ? I
            : null
          : typeof sel === "number"
            ? T[sel] || null
            : null;
      }
      var PEND = null;
      /* outside the shirt = the grey/black photo background beyond the shoulders / sleeves, or below the hem */
      function outShirt(p) {
        var g = GM();
        return Math.abs(p[0] - g.cx) > g.hA * 1.45 || p[1] > g.hem + 50;
      }
      function clearSel() {
        if (UNSEL) return;
        UNSEL = true;
        PICSEL = false;
        showBox = false;
        draw();
        if (window.selPopHide) selPopHide();
      }
      cv.addEventListener("pointerup", function (ev) {
        var t = PEND;
        PEND = null;
        if (
          t &&
          t.id === ev.pointerId &&
          Math.hypot(ev.clientX - t.x, ev.clientY - t.y) < 12 &&
          !drag &&
          !PZ
        )
          clearSel();
      });
      cv.addEventListener("pointermove", function (ev) {
        if (PEND && Math.hypot(ev.clientX - PEND.x, ev.clientY - PEND.y) >= 12)
          PEND = null;
      });
      /* single tap on the empty (non-button) part of the panel below the shirt also unselects */
      document.addEventListener("pointerdown", function (ev) {
        var t = ev.target;
        if (
          !t ||
          !t.closest ||
          !t.closest("#customSec") ||
          t.closest(
            ".stage,#fsv,button,input,select,textarea,label,a,.chip,.lyr,[data-t],[role=button]",
          )
        )
          return;
        clearSel();
      });
      cv.onpointerdown = function (ev) {
        if (Object.keys(PTS).length) {
          PEND = null;
          ev.preventDefault();
          return;
        } /* 2nd finger = pinch the SELECTED item only, never pick another */
        rect = cv.getBoundingClientRect();
        var p = pt(ev),
          gid = ghostAt(p);
        if (gid) {
          ev.preventDefault();
          ghostAct(gid);
          return;
        }
        var e = hitPref(p[0], p[1]);
        if (!e) {
          PEND = outShirt(p)
            ? { x: ev.clientX, y: ev.clientY, id: ev.pointerId }
            : null;
          return;
        }
        PEND = null;
        var ns = e.k === "i" ? "i" : e.i;
        UNSEL = false;
        if (ns !== sel) {
          sel = ns;
          chips();
          editor();
          if (window.selPop) selPop(true);
        }
        drag = { e: e, dx: e.cx - p[0], dy: e.ty - p[1] };
        showBox = true;
        cv.setPointerCapture(ev.pointerId);
        cv.style.cursor = "grabbing";
        ev.preventDefault();
        draw();
      };
      cv.onpointermove = function (ev) {
        if (!drag) {
          var q = pt(ev);
          cv.style.cursor = ghostAt(q)
            ? "pointer"
            : hit(q[0], q[1])
              ? "grab"
              : "default";
          return;
        }
        var p = pt(ev),
          o = drag.e.k === "i" ? I : T[drag.e.i];
        if (!o) return;
        o.px = Math.max(
          0,
          Math.min(100, (p[0] + drag.dx - GM().cx) / GM().sx + 50),
        );
        o.py = Math.max(
          0,
          Math.min(100, (p[1] + drag.dy - GM().top) / GM().sy),
        );
        var ed = drag.e.k === "i" ? $("picEd") : $("editor");
        [].forEach.call(
          ed.querySelectorAll("[data-k=px],[data-k=py]"),
          function (i) {
            i.value = o[i.dataset.k];
          },
        );
        draw();
      };
      cv.onpointerup = cv.onpointercancel = function () {
        drag = null;
        rect = null;
        showBox = false;
        cv.style.cursor = "grab";
        draw();
      };
      /* pinch with two fingers to resize the text / photo under them (drag already moves it) */
      function pdist() {
        var k = Object.keys(PTS);
        if (k.length < 2) return 0;
        var a = PTS[k[0]],
          b = PTS[k[1]];
        return Math.hypot(a[0] - b[0], a[1] - b[1]) || 1;
      }
      function objOf(e) {
        return e ? (e.k === "i" ? I : T[e.i]) : null;
      }
      cv.addEventListener("pointerdown", function (ev) {
        PTS[ev.pointerId] = [ev.clientX, ev.clientY];
        var ks = Object.keys(PTS);
        if (ks.length === 2) {
          var o = selObj();
          if (o) {
            PZ = { o: o, d0: pdist(), s0: o.size };
            drag = null;
            showBox = true;
            ev.preventDefault();
            draw();
          }
        }
      });
      cv.addEventListener("pointermove", function (ev) {
        if (PTS[ev.pointerId]) PTS[ev.pointerId] = [ev.clientX, ev.clientY];
        if (PZ && Object.keys(PTS).length >= 2) {
          PZ.o.size = Math.max(20, Math.min(100, (PZ.s0 * pdist()) / PZ.d0));
          draw();
          ev.preventDefault();
        }
      });
      function pEnd(ev) {
        delete PTS[ev.pointerId];
        if (Object.keys(PTS).length < 2 && PZ) {
          PZ = null;
          showBox = false;
          draw();
        }
      }
      cv.addEventListener("pointerup", pEnd);
      cv.addEventListener("pointercancel", pEnd);
      /* desktop: scroll wheel / trackpad pinch over the text or photo resizes it */
      cv.addEventListener(
        "wheel",
        function (ev) {
          rect = cv.getBoundingClientRect();
          var p = pt(ev),
            o = hit(p[0], p[1]) ? selObj() : null;
          if (!o) return;
          ev.preventDefault();
          o.size = Math.max(
            20,
            Math.min(
              100,
              o.size * Math.exp(-ev.deltaY * (ev.ctrlKey ? 0.01 : 0.002)),
            ),
          );
          draw();
        },
        { passive: false },
      );
      T.push(newT());
      loadFont(0, "YOUR TEXT SECOND LINE").then(draw);
      chips();
      editor();
      if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(function () {
          clr();
          draw();
        });

      /* products + gallery (shared, uploaded by admin) */
      var P = [],
        G = [],
        H = [],
        PKC = null;
      /* Step-4 product picker: only shows products of the same type being customised (hoodies with hoodies, tees with tees...) */
      function renderPick(force) {
        var pk = $("pick"),
          c = S.cat || "tee",
          o = typeof LANGS !== "undefined" ? Object.keys(LANGS) : [],
          rk = function (x) {
            var i = o.indexOf(x.lang || "en");
            return i < 0 ? 99 : i;
          },
          L = P.map(function (x, i) {
            return [x, i];
          })
            .filter(function (a) {
              return (a[0].cat || "tee") === c;
            })
            .sort(function (a, b) {
              return rk(a[0]) - rk(b[0]) || a[1] - b[1];
            })
            .map(function (a) {
              return a[0];
            }),
          sig =
            c +
            "|" +
            L.map(function (x) {
              return x.id + ":" + (x.img ? x.img.length : 0);
            }).join(",");
        /* shows EVERY product of this type, in every language (English first, then the other languages) */
        if (force || PKC !== sig) {
          PKC = sig;
          pk.innerHTML = L.map(function (x) {
            return (
              '<div data-pid="' +
              x.id +
              '"><b class="pLg">' +
              esc((x.lang || "en").toUpperCase()) +
              '</b><img src="' +
              x.img +
              '" alt=""><span>' +
              esc(x.name) +
              (x.colour ? " · " + esc(x.colour) : "") +
              "</span></div>"
            );
          }).join("");
        }
        [].forEach.call(pk.children, function (e) {
          e.classList.toggle("on", e.dataset.pid === S.pid);
        });
      }
      function pickP(id) {
        var x = P.filter(function (q) {
          return q.id === id;
        })[0];
        if (!x) return;
        $("ptitle").textContent = x.name;
        S.pid = x.id;
        S.cat = x.cat || "tee";
        S.base = x.img;
        S.pname = x.name;
        S.pcolor = x.colour || "";
        S.price = +x.price || PRICE;
        S.mrp = baseOf(x);
        applyLang(x.lang || "en");
        fmtTitle();
        renderPick();
        draw();
      }
      document.addEventListener("click", function (e) {
        var t = e.target.closest && e.target.closest("[data-pid]");
        if (t && t.closest("#nameSec")) return;
        if (t) {
          var inPick = !!t.closest("#pick");
          pickP(t.dataset.pid);
          if (inPick)
            history.replaceState(null, "", "#product/" + t.dataset.pid);
          else location.hash = "#product/" + t.dataset.pid;
        }
      });
      function viewOf(h) {
        return /^#(product\/|custom$)/.test(h)
          ? "product"
          : /^#(cart|orders)$/.test(h)
            ? "acct"
            : "home";
      }
      var VIEW = viewOf(location.hash);
      function hashPid() {
        var m = location.hash.match(/^#product\/(.+)$/);
        return m ? m[1] : null;
      }
      function applyView() {
        var has = P.length > 0,
          pv = VIEW === "product",
          hm = VIEW === "home";
        $("hero").hidden = !hm;
        $("colSec").hidden = !hm || !has;
        if ($("modeSec")) $("modeSec").hidden = !hm || !has;
        if ($("nameSec")) $("nameSec").hidden = !hm || !has;
        if (window.colView) colView(hm && has);
        $("customSec").hidden = !pv || !has;
        $("acctSec").hidden = VIEW !== "acct";
        document.body.dataset.view = VIEW === "product" && !has ? "home" : VIEW;
        if (VIEW !== "product") $("nudge").hidden = true;
      }
      var F = "All",
        Qs = "",
        DEF_H = "Wear your own design",
        DEF_P = "Upload a photo or PNG. We print it on a premium tee.",
        cur = 0,
        tmr = null;
      function card(x) {
        var ex = x.imgs && x.imgs.length ? x.imgs : null;
        return (
          '<div class="pc" data-pid="' +
          x.id +
          '"><div class="pi' +
          (ex ? " pz" : "") +
          '"><img src="' +
          x.img +
          '" alt="" loading="lazy"' +
          (ex ? ' class="on"' : "") +
          ">" +
          (ex
            ? ex
                .map(function (u) {
                  return '<img src="' + u + '" alt="" loading="lazy">';
                })
                .join("")
            : "") +
          '<span class="pb">Customize</span></div><div class="pn">' +
          esc(x.name) +
          '</div><div class="pm">' +
          esc(x.colour || "Custom tee") +
          '</div><div class="pr">' +
          mrpHtml(x) +
          "₹" +
          esc(x.price) +
          "</div></div>"
        );
      }
      function go(i) {
        var L = G.concat(H);
        if (!L.length) {
          $("hh").textContent = DEF_H;
          $("hp").textContent = DEF_P;
          $("hero").classList.remove("tcb");
          return;
        }
        cur = (i + L.length) % L.length;
        [].forEach.call($("slides").children, function (e, k) {
          e.classList.toggle("on", k === cur);
        });
        [].forEach.call($("dots").children, function (e, k) {
          e.classList.toggle("on", k === cur);
        });
        var s = L[cur],
          t = s.name || s.sub;
        $("hh").textContent = t ? s.name || "" : DEF_H;
        $("hp").textContent = t ? s.sub || "" : DEF_P;
        /* text colour chosen in admin for this gallery photo (tc = "black" / "white") */
        $("hero").classList.toggle("tcb", !!t && s.tc === "black");
      }
      function auto() {
        clearInterval(tmr);
        if (
          G.concat(H).length > 1 &&
          !matchMedia("(prefers-reduced-motion:reduce)").matches
        )
          tmr = setInterval(function () {
            go(cur + 1);
          }, 2000);
      }
      function renderHero() {
        var L = G.concat(H),
          sl = $("slides"),
          dt = $("dots");
        sl.innerHTML = "";
        dt.innerHTML = "";
        L.forEach(function (x, k) {
          var d = document.createElement("div");
          d.className = "slide";
          d.style.backgroundImage = 'url("' + x.img + '")';
          sl.appendChild(d);
          var b = document.createElement("i");
          b.onclick = function () {
            go(k);
            auto();
          };
          dt.appendChild(b);
        });
        $("hero").classList.toggle("multi", L.length > 1);
        go(cur < L.length ? cur : 0);
        auto();
        /* keep flashing until real hero photos are here (or the full data has arrived and there are none) */
        if (SHOWN && (L.length || FULL)) hideLoad(L.length ? L[0].img : null);
      }
      /* flashing placeholder: stays until the real data has arrived and the first hero photo is ready */
      var HL_DONE = false;
      function hideLoad(img) {
        if (HL_DONE) return;
        HL_DONE = true;
        var e = $("hLoad");
        if (!e) return;
        var kill = function () {
          e.classList.add("off");
          setTimeout(function () {
            if (e.parentNode) e.parentNode.removeChild(e);
          }, 450);
        };
        if (!img) return kill();
        var t = new Image(),
          d = false,
          f = function () {
            if (!d) {
              d = true;
              kill();
            }
          };
        t.onload = t.onerror = f;
        t.src = img;
        if (t.complete) f();
        setTimeout(f, 1500);
      }
      /* safety only: if Firebase never answers at all, stop flashing after 30 seconds */
      setTimeout(function () {
        hideLoad(null);
      }, 30000);
      function renderProducts() {
        var has = P.length > 0;
        renderHero();
        applyView();
        $("nC").hidden = !has;
        if (has) {
          renderPick(true);
          var hp = hashPid();
          if (
            hp &&
            P.some(function (q) {
              return q.id === hp;
            })
          )
            pickP(hp);
          else if (
            !P.some(function (q) {
              return q.id === S.pid;
            })
          )
            pickP(P[0].id);
          else pickP(S.pid);
        } else {
          $("pick").innerHTML = "";
          PKC = null;
          S.pid = null;
          S.cat = "tee";
          S.base = null;
          draw();
        }
        var row = function (x, t) {
            return (
              '<div style="display:flex;align-items:center;gap:12px;margin:8px 0"><img src="' +
              x.img +
              '" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:6px"><span style="flex:1">' +
              t +
              '</span><button class="btn sm" data-del="' +
              x.id +
              '">Delete</button></div>'
            );
          },
          em = function (t) {
            return (
              '<span style="color:var(--mut);font-size:14px">' + t + "</span>"
            );
          };
        var pl = $("pl"),
          gl = $("gl");
        if (pl)
          pl.innerHTML = P.length
            ? P.map(function (x) {
                return row(
                  x,
                  esc(x.name) +
                    (x.colour ? " · " + esc(x.colour) : "") +
                    " · ₹" +
                    esc(x.price),
                );
              }).join("")
            : em("No products yet. Upload one above.");
        if (gl)
          gl.innerHTML = G.length
            ? G.map(function (x) {
                return row(
                  x,
                  esc(x.name || "Untitled photo") +
                    (x.sub ? " · " + esc(x.sub) : ""),
                );
              }).join("")
            : em("No banner photos yet. Upload some above.");
        if (window._draw) window._draw();
        if (window.colRender) colRender();
        if (window.nameRender) nameRender();
        if (has && location.hash === "#collections" && !window._colDone) {
          window._colDone = 1;
          setTimeout(scrollCol, 120);
        }
      }
      $("hPrev").onclick = function () {
        go(cur - 1);
        auto();
      };
      $("hNext").onclick = function () {
        go(cur + 1);
        auto();
      };
      if ($("q")) $("q").oninput = function () {
        Qs = this.value.trim();
        if (VIEW !== "home") {
          location.hash = "#collections";
          return;
        }
        if (P.length) {
          if (window.colSearch) colSearch();
          if (Qs) scrollCol();
        }
      };
      /* every product with several photos flashes through them, one per second */
      setInterval(function () {
        if (document.hidden) return;
        [].forEach.call(document.querySelectorAll(".pz"), function (p) {
          var a = p.querySelectorAll("img"),
            k = 0,
            i;
          if (a.length < 2 || p.dataset.seq === "1") return;
          for (i = 0; i < a.length; i++)
            if (a[i].classList.contains("on")) k = i;
          a[k].classList.remove("on");
          a[(k + 1) % a.length].classList.add("on");
        });
      }, 1000);
      var FULL = false,
        SHOWN = false,
        SIG = "";
      function mapDocs(s) {
        return s.docs.map(function (d) {
          var x = d.data();
          x.id = d.id;
          ["name", "sub"].forEach(function (k) {
            if (typeof x[k] === "string")
              x[k] = x[k].replace(/\bhindu\b/gi, function (m) {
                return m === m.toUpperCase()
                  ? "HINDI"
                  : m[0] === "H"
                    ? "Hindi"
                    : "hindi";
              });
          });
          return x;
        });
      }
      function docSig(A) {
        return A.map(function (x) {
          var y = {},
            k;
          for (k in x) if (k !== "img" && k !== "imgs") y[k] = x[k];
          var m = x.img || "";
          return (
            JSON.stringify(y) +
            "|" +
            m.length +
            "|" +
            m.slice(-24) +
            "|" +
            (x.imgs || [])
              .map(function (u) {
                return u.length;
              })
              .join(",")
          );
        }).join("\n");
      }
      function applyDocs(A, part, more) {
        /* part = quick first batch: only used until the full list has arrived (more = a later quick batch may refine what is on screen) */
        if (part) {
          if (FULL || (SHOWN && !more)) return;
          var hp = hashPid();
          if (
            hp &&
            !A.some(function (x) {
              return x.id === hp;
            })
          )
            return;
        } else FULL = true;
        var sg = docSig(A);
        if (sg === SIG) return;
        SIG = sg;
        SHOWN = true;
        H = A.filter(function (x) {
          return x.kind === "hero";
        });
        P = A.filter(function (x) {
          return (
            x.kind !== "gallery" && x.kind !== "hero" && x.kind !== "design"
          );
        });
        G = A.filter(function (x) {
          return (
            x.kind !== "product" && x.kind !== "hero" && x.kind !== "design"
          );
        });
        window.DSG = A.filter(function (x) {
          return x.kind === "design";
        });
        if (!window.dsgOrder) {
          window.DSCATS = [
            ["faith", "Faith & Spirituality"],
            ["anime", "Anime & Asian Art"],
            ["icons", "Icons & Legends"],
            ["street", "Streetwear & Graphics"],
          ];
          window.DSMODE = { mode: "mixed", first: "anime" };
          window.dsgCat = function (x) {
            var c = x && x.dcat;
            return window.DSCATS.some(function (k) {
              return k[0] === c;
            })
              ? c
              : "anime";
          };
          /* mixed = random mix of all four types (same mix while the page is open); group = chosen type first, then each other type in a block */
          window.dsgOrder = function () {
            var A = window.DSG || [];
            if (!A.length) return;
            var by = {},
              cnt = {},
              keys = window.DSCATS.map(function (k) {
                return k[0];
              }),
              out = [];
            keys.forEach(function (k) {
              by[k] = [];
            });
            A.forEach(function (x) {
              by[window.dsgCat(x)].push(x);
            });
            keys.forEach(function (k) {
              cnt[k] = by[k].length;
            });
            window.DSCOUNT = cnt;
            if (window.DSMODE.mode === "group") {
              var st = Math.max(0, keys.indexOf(window.DSMODE.first));
              for (var g = 0; g < 4; g++) out = out.concat(by[keys[(st + g) % 4]]);
            } else {
              var sd = window.DSSEED || (window.DSSEED = Math.floor(Math.random() * 4294967296)),
                rnd = function () {
                  sd = (sd + 0x6d2b79f5) | 0;
                  var t = Math.imul(sd ^ (sd >>> 15), 1 | sd);
                  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
                  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
                },
                sh = function (a) {
                  for (var i = a.length - 1; i > 0; i--) {
                    var j = Math.floor(rnd() * (i + 1)),
                      t = a[i];
                    a[i] = a[j];
                    a[j] = t;
                  }
                  return a;
                },
                left = true;
              sd = window.DSSEED;
              keys.forEach(function (k) {
                sh(by[k]);
              });
              while (left) {
                left = false;
                sh(keys.slice()).forEach(function (k) {
                  if (by[k].length) {
                    out.push(by[k].shift());
                    left = true;
                  }
                });
              }
            }
            window.DSG = out;
          };
        }
        window.dsgOrder();
        renderProducts();
      }
      function subProducts() {
        if (!db) return;
        var q = db.collection("products").orderBy("ts", "desc");
        var A4 = [],
          AH = [];
        function merge() {
          var seen = {},
            A = [];
          A4.concat(AH).forEach(function (x) {
            if (!seen[x.id]) {
              seen[x.id] = 1;
              A.push(x);
            }
          });
          if (A.length) applyDocs(A, true, true);
        }
        /* SPEED: paint instantly from the saved copy; skipped if live data already arrived */
        var C4 = [],
          CH = [];
        function mergeC() {
          if (SHOWN || FULL) return;
          var seen = {},
            A = [];
          C4.concat(CH).forEach(function (x) {
            if (!seen[x.id]) {
              seen[x.id] = 1;
              A.push(x);
            }
          });
          if (A.length) applyDocs(A, true, true);
        }
        Promise.resolve(window.__Q4C)
          .then(function (s) {
            if (s && s.docs && s.docs.length) C4 = mapDocs(s);
          })
          .catch(function () {})
          .then(function () {
            return Promise.resolve(window.__QHC);
          })
          .then(function (s) {
            if (s && s.docs && s.docs.length) CH = mapDocs(s);
            mergeC();
          })
          .catch(function () {});
        /* each quick request paints the page the moment it arrives */
        var p4 = Promise.resolve(window.__Q4 || q.limit(4).get())
          .then(function (s) {
            if (s) A4 = mapDocs(s);
            merge();
          })
          .catch(function () {});
        var pH = Promise.resolve(
          window.__QH ||
            db.collection("products").where("kind", "==", "hero").get(),
        )
          .then(function (s) {
            if (s) AH = mapDocs(s);
            merge();
          })
          .catch(function () {});
        Promise.all([p4, pH]).then(function () {
          /* the full live listener starts only now, so it no longer competes with the first screen */
          q.onSnapshot(
            { includeMetadataChanges: true },
            function (s) {
              applyDocs(mapDocs(s), false);
            },
            function () {},
          );
        });
      }
      renderProducts();

      /* controls */
      $("sizes").innerHTML = ["S", "M", "L", "XL", "XXL"]
        .map(function (s) {
          return '<b data-s="' + s + '">' + s + "</b>";
        })
        .join("");
      function sync() {
        [].forEach.call($("sizes").children, function (e) {
          e.classList.toggle("on", e.dataset.s === S.size);
        });
        draw();
      }
      $("sizes").onclick = function (e) {
        if (e.target.dataset.s) {
          S.size = e.target.dataset.s;
          sync();
        }
      };
      ["qty"].forEach(function (i) {
        $(i).oninput = draw;
      });

      /* ===== Photo flow: add photo, keep or remove the background, pick a shape, preview, use ===== */
      var PICFIXED = false;
      var PIC = {
          orig: null,
          type: "",
          cut: null,
          cutSrc: null,
          mode: "keep",
          mask: "full",
          zoom: 1,
          ox: 0,
          oy: 0,
          tok: 0,
          pv: null,
        },
        BGLIB = null,
        MASKS = [
          ["full", "Rectangle"],
          ["square", "Square"],
          ["round", "Rounded"],
          ["circle", "Circle"],
          ["oval", "Oval"],
          ["triangle", "Triangle"],
          ["diamond", "Diamond"],
          ["pent", "Pentagon"],
          ["hex", "Hexagon"],
          ["oct", "Octagon"],
          ["star5", "Star"],
          ["star6", "6-point star"],
          ["burst", "Burst"],
          ["heart", "Heart"],
          ["plus", "Plus"],
        ],
        /* Personalized Instant Design ONLY: 4 basics + 8 modern masks. Design Studio keeps the old MASKS list. */
        PZMASKS = [
          ["full", "Rectangle"],
          ["square", "Square"],
          ["circle", "Circle"],
          ["oval", "Oval"],
          ["pzArch", "Arch"],
          ["pzPill", "Pill"],
          ["pzSquircle", "Squircle"],
          ["pzLeaf", "Leaf"],
          ["pzBlob", "Blob"],
          ["pzScallop", "Scallop"],
          ["pzSparkle", "Sparkle"],
          ["pzCut", "Cut corner"],
        ],
        PZAR = {
          pzArch: function () { return 0.78; },
          pzPill: function () { return 0.6; },
          pzCut: function (a) { return Math.max(0.8, Math.min(1.25, a)); },
        },
        PZP = (function () {
          function polar(g, w, h, f, N) {
            for (var i = 0; i < N; i++) {
              var t = (i / N) * Math.PI * 2 - Math.PI / 2,
                q = f(t);
              g[i ? "lineTo" : "moveTo"](
                w / 2 + (w / 2) * q * Math.cos(t),
                h / 2 + (h / 2) * q * Math.sin(t),
              );
            }
            g.closePath();
          }
          return {
            /* tall arch window */
            pzArch: function (g, w, h) {
              var r = w / 2;
              g.moveTo(0, h);
              g.lineTo(0, r);
              g.arc(w / 2, r, r, Math.PI, 0);
              g.lineTo(w, h);
              g.closePath();
            },
            /* tall capsule */
            pzPill: function (g, w, h) {
              var r = w / 2;
              g.moveTo(0, r);
              g.arc(w / 2, r, r, Math.PI, 0);
              g.lineTo(w, h - r);
              g.arc(w / 2, h - r, r, 0, Math.PI);
              g.closePath();
            },
            /* soft superellipse (app-icon curve) */
            pzSquircle: function (g, w, h) {
              for (var i = 0; i < 160; i++) {
                var t = (i / 160) * Math.PI * 2,
                  c = Math.cos(t),
                  s = Math.sin(t);
                g[i ? "lineTo" : "moveTo"](
                  w / 2 + (w / 2) * (c < 0 ? -1 : 1) * Math.sqrt(Math.abs(c)),
                  h / 2 + (h / 2) * (s < 0 ? -1 : 1) * Math.sqrt(Math.abs(s)),
                );
              }
              g.closePath();
            },
            /* two big opposite corners, two small ones */
            pzLeaf: function (g, w, h) {
              var R = Math.min(w, h) * 0.5,
                r = Math.min(w, h) * 0.06;
              g.moveTo(R, 0);
              g.lineTo(w - r, 0);
              g.arcTo(w, 0, w, r, r);
              g.lineTo(w, h - R);
              g.arcTo(w, h, w - R, h, R);
              g.lineTo(r, h);
              g.arcTo(0, h, 0, h - r, r);
              g.lineTo(0, R);
              g.arcTo(0, 0, R, 0, R);
              g.closePath();
            },
            /* organic blob */
            pzBlob: function (g, w, h) {
              polar(g, w, h, function (t) {
                return (
                  0.8 +
                  0.07 * Math.cos(3 * t + 0.6) +
                  0.06 * Math.cos(2 * t + 1.9) +
                  0.04 * Math.cos(5 * t + 0.2)
                );
              }, 240);
            },
            /* scalloped / cookie edge */
            pzScallop: function (g, w, h) {
              polar(g, w, h, function (t) {
                return 0.84 + 0.16 * Math.abs(Math.cos(4 * t));
              }, 480);
            },
            /* 4-point sparkle */
            pzSparkle: function (g, w, h) {
              var cx = w / 2,
                cy = h / 2,
                k = 0.16;
              g.moveTo(cx, 0);
              g.quadraticCurveTo(cx + w * k, cy - h * k, w, cy);
              g.quadraticCurveTo(cx + w * k, cy + h * k, cx, h);
              g.quadraticCurveTo(cx - w * k, cy + h * k, 0, cy);
              g.quadraticCurveTo(cx - w * k, cy - h * k, cx, 0);
              g.closePath();
            },
            /* two opposite corners cut at an angle */
            pzCut: function (g, w, h) {
              var c = Math.min(w, h) * 0.22;
              g.moveTo(0, 0);
              g.lineTo(w - c, 0);
              g.lineTo(w, c);
              g.lineTo(w, h);
              g.lineTo(c, h);
              g.lineTo(0, h - c);
              g.closePath();
            },
          };
        })();
      function maskAR(k, a) {
        if (PZAR[k]) return PZAR[k](a);
        return k === "full" || k === "round" ? a : k === "oval" ? 0.75 : 1;
      }
      function maskPath(g, k, w, h) {
        var i,
          n,
          R,
          r,
          a,
          p,
          hx = k === "hex" || k === "pent" || k === "oct";
        g.beginPath();
        if (PZP[k]) {
          PZP[k](g, w, h);
          return;
        }
        if (k === "full" || k === "square") g.rect(0, 0, w, h);
        else if (k === "triangle") {
          g.moveTo(w / 2, 0);
          g.lineTo(w, h);
          g.lineTo(0, h);
          g.closePath();
        } else if (k === "diamond") {
          g.moveTo(w / 2, 0);
          g.lineTo(w, h / 2);
          g.lineTo(w / 2, h);
          g.lineTo(0, h / 2);
          g.closePath();
        } else if (k === "plus") {
          var u = w / 3,
            v = h / 3;
          g.moveTo(u, 0);
          g.lineTo(2 * u, 0);
          g.lineTo(2 * u, v);
          g.lineTo(w, v);
          g.lineTo(w, 2 * v);
          g.lineTo(2 * u, 2 * v);
          g.lineTo(2 * u, h);
          g.lineTo(u, h);
          g.lineTo(u, 2 * v);
          g.lineTo(0, 2 * v);
          g.lineTo(0, v);
          g.lineTo(u, v);
          g.closePath();
        } else if (k === "round") {
          r = Math.min(w, h) * 0.14;
          g.moveTo(r, 0);
          g.arcTo(w, 0, w, h, r);
          g.arcTo(w, h, 0, h, r);
          g.arcTo(0, h, 0, 0, r);
          g.arcTo(0, 0, w, 0, r);
          g.closePath();
        } else if (k === "oval" || k === "circle")
          g.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, 7);
        else if (k === "heart") {
          var X = function (v) {
              return (v * w) / 100;
            },
            Y = function (v) {
              return (v * h) / 100;
            };
          g.moveTo(X(50), Y(92));
          g.bezierCurveTo(X(6), Y(62), X(-2), Y(32), X(14), Y(14));
          g.bezierCurveTo(X(28), Y(2), X(45), Y(8), X(50), Y(24));
          g.bezierCurveTo(X(55), Y(8), X(72), Y(2), X(86), Y(14));
          g.bezierCurveTo(X(102), Y(32), X(94), Y(62), X(50), Y(92));
          g.closePath();
        } else {
          n = { star5: 5, star6: 6, burst: 14, hex: 6, pent: 5, oct: 8 }[k];
          r = { star5: 0.42, star6: 0.55, burst: 0.84, hex: 1 }[k];
          R = Math.min(w, h) / 2;
          for (i = 0; i < (hx ? n : n * 2); i++) {
            a = -Math.PI / 2 + (i * Math.PI) / (hx ? n / 2 : n);
            p = hx || i % 2 === 0 ? R : R * r;
            g[i ? "lineTo" : "moveTo"](
              w / 2 + p * Math.cos(a),
              h / 2 + p * Math.sin(a),
            );
          }
          g.closePath();
        }
      }
      function renderMask(s, k, out, zoom, ox, oy) {
        var ar = maskAR(k, s.width / s.height),
          bw = ar >= 1 ? out : out * ar,
          bh = ar >= 1 ? out / ar : out,
          c = document.createElement("canvas");
        bw = Math.round(bw);
        bh = Math.round(bh);
        c.width = bw;
        c.height = bh;
        var g = c.getContext("2d");
        g.imageSmoothingQuality = "high";
        maskPath(g, k, bw, bh);
        g.save();
        g.clip();
        var f = Math.max(bw / s.width, bh / s.height) * zoom,
          dw = s.width * f,
          dh = s.height * f,
          mx = (dw - bw) / 2,
          my = (dh - bh) / 2,
          px = Math.max(-mx, Math.min(mx, ox * bw)),
          py = Math.max(-my, Math.min(my, oy * bh));
        g.drawImage(s, (bw - dw) / 2 + px, (bh - dh) / 2 + py, dw, dh);
        g.restore();
        c._ox = px / bw;
        c._oy = py / bh;
        return c;
      }
      function trim(c) {
        var g = c.getContext("2d"),
          w = c.width,
          h = c.height,
          d = g.getImageData(0, 0, w, h).data,
          x0 = w,
          y0 = h,
          x1 = -1,
          y1 = -1,
          x,
          y;
        for (y = 0; y < h; y++)
          for (x = 0; x < w; x++)
            if (d[(y * w + x) * 4 + 3] > 8) {
              if (x < x0) x0 = x;
              if (x > x1) x1 = x;
              if (y < y0) y0 = y;
              if (y > y1) y1 = y;
            }
        if (x1 < 0) return c;
        var o = document.createElement("canvas");
        o.width = x1 - x0 + 1;
        o.height = y1 - y0 + 1;
        o.getContext("2d").drawImage(
          c,
          x0,
          y0,
          o.width,
          o.height,
          0,
          0,
          o.width,
          o.height,
        );
        return o;
      }
      function blob2c(b) {
        return new Promise(function (res, rej) {
          var u = URL.createObjectURL(b),
            im = new Image();
          im.onload = function () {
            var c = document.createElement("canvas");
            c.width = im.width;
            c.height = im.height;
            c.getContext("2d").drawImage(im, 0, 0);
            URL.revokeObjectURL(u);
            res(c);
          };
          im.onerror = rej;
          im.src = u;
        });
      }
      /* background remover: transformers.js with the MODNet model, runs in the browser (code and WASM from jsDelivr, model from Hugging Face) */
      var HFSRC = [
          "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2",
          "https://esm.sh/@huggingface/transformers@4.3.2",
        ],
        SEG = null;
      function pfProg(p) {
        var b = $("pfBar"),
          s = $("pfSt");
        if (!b || !p) return;
        if (p.status === "progress") {
          b.style.width = Math.round(p.progress || 0) + "%";
          s.textContent = "Downloading the cut-out tool (first time only)";
        } else if (p.status === "run") {
          b.style.width = "100%";
          s.textContent = "Finding the edges of your subject";
        }
      }
      function getSeg() {
        if (SEG) return SEG;
        SEG = HFSRC.reduce(function (p, u) {
          return p.catch(function () {
            return import(u);
          });
        }, Promise.reject())
          .then(function (m) {
            return m
              .pipeline("background-removal", "Xenova/modnet", {
                progress_callback: pfProg,
              })
              .then(function (s) {
                return { m: m, s: s };
              });
          })
          .catch(function (e) {
            SEG = null;
            throw e;
          });
        return SEG;
      }
      function doRemove() {
        var t = ++PIC.tok;
        PIC.mode = "rem";
        PIC.err = "";
        if (PIC.cut && PIC.cutSrc === PIC.orig) {
          pfView("cut");
          return;
        }
        pfView("work");
        getSeg()
          .then(function (g) {
            if (t !== PIC.tok) throw 0;
            pfProg({ status: "run" });
            return g.s(g.m.RawImage.fromCanvas(PIC.orig));
          })
          .then(function (o) {
            if (t !== PIC.tok) return;
            var c = document.createElement("canvas");
            c.width = o.width;
            c.height = o.height;
            c.getContext("2d").putImageData(
              new ImageData(new Uint8ClampedArray(o.data), o.width, o.height),
              0,
              0,
            );
            PIC.cut = trim(c);
            PIC.cutSrc = PIC.orig;
            pfView("cut");
          })
          .catch(function (e) {
            if (t !== PIC.tok) return;
            console.error("cut-out", e);
            PIC.err = String((e && e.message) || e).slice(0, 400);
            pfView("fail");
          });
      }
      function pfDraw() {
        var c = renderMask(PIC.orig, PIC.mask, 640, PIC.zoom, PIC.ox, PIC.oy),
          v = PIC.pv;
        PIC.ox = c._ox;
        PIC.oy = c._oy;
        v.width = c.width;
        v.height = c.height;
        v.getContext("2d").drawImage(c, 0, 0);
      }
      function pfView(v) {
        var B = $("picB"),
          h,
          P;
        PIC.view = v;
        var sub = function (s) {
            return (
              '<p class="mut" style="font-size:14px;margin:0 0 12px">' +
              s +
              "</p>"
            );
          },
          two = function (a, b) {
            return '<div class="pf-two">' + a + b + "</div>";
          },
          bt = function (a, l, g) {
            return (
              '<button class="btn' +
              (g ? " g" : "") +
              '" type="button" data-a="' +
              a +
              '">' +
              l +
              "</button>"
            );
          };
        if (v === "bg")
          h =
            "<h3>What about the background?</h3>" +
            sub("Keep it as it is, or cut your subject out of the photo.") +
            '<div class="pf-prev" id="pfP"></div>' +
            two(
              bt("keep", "Keep background", 1),
              bt("rem", "Remove background"),
            ) +
            '<p style="margin:12px 0 0"><button class="lnk" type="button" data-a="new">Choose a different photo</button></p>';
        else if (v === "work")
          h =
            "<h3>Removing the background</h3>" +
            sub(
              "The first photo takes longer while the tool downloads (about 30 MB). After that it is quick. Works best on photos of people.",
            ) +
            '<div style="display:flex;justify-content:center;margin:22px 0"><div class="spin"></div></div><div class="pbar"><i id="pfBar"></i></div><p class="mut" id="pfSt" style="font-size:14px">Getting started</p><button class="lnk" type="button" data-a="bg">Cancel</button>';
        else if (v === "cut")
          h =
            "<h3>Background removed</h3>" +
            sub(
              "The checkerboard is where the shirt shows through. Check the edges.",
            ) +
            '<div class="pf-prev" id="pfP"></div>' +
            two(bt("bg", "Back", 1), bt("use", "Use this picture"));
        else if (v === "fail")
          h =
            "<h3>Could not remove the background</h3>" +
            sub(
              "The cut-out tool did not start. Check your connection and try again, or keep the background.",
            ) +
            '<p class="mut" style="font-size:12px;word-break:break-word;margin:0">Details: ' +
            esc(PIC.err || "unknown") +
            "</p>" +
            two(bt("rem", "Try again", 1), bt("keep", "Keep background"));
        else
          h =
            "<h3>Pick a shape</h3>" +
            sub("Drag the photo to move it. Slide to zoom.") +
            '<div class="pf-prev" id="pfP"></div><label style="margin:12px 0 4px">Zoom</label><input type="range" id="pfZ" min="100" max="300" value="' +
            Math.round(PIC.zoom * 100) +
            '"><div class="mk" id="pfM"></div>' +
            two(bt("bg", "Back", 1), bt("use", "Use this picture"));
        B.innerHTML = h;
        P = $("pfP");
        if (v === "bg") P.appendChild(PIC.orig);
        else if (v === "cut") P.appendChild(PIC.cut);
        else if (v === "mask") {
          var pv = (PIC.pv = document.createElement("canvas"));
          P.appendChild(pv);
          pfDraw();
          (window.__pzMasks && window.__pzMasks() ? PZMASKS : MASKS).forEach(function (m) {
            var b = document.createElement("button"),
              c = renderMask(PIC.orig, m[0], 116, 1, 0, 0);
            b.type = "button";
            b.className = "mkb";
            b.dataset.m = m[0];
            b.setAttribute("aria-pressed", m[0] === PIC.mask);
            b.appendChild(c);
            b.appendChild(document.createTextNode(m[1]));
            $("pfM").appendChild(b);
          });
          var sx,
            sy,
            so,
            sp,
            dn = 0;
          pv.onpointerdown = function (e) {
            dn = 1;
            sx = e.clientX;
            sy = e.clientY;
            so = PIC.ox;
            sp = PIC.oy;
            pv.setPointerCapture(e.pointerId);
          };
          pv.onpointermove = function (e) {
            if (!dn) return;
            var r = pv.getBoundingClientRect();
            PIC.ox = so + (e.clientX - sx) / r.width;
            PIC.oy = sp + (e.clientY - sy) / r.height;
            pfDraw();
          };
          pv.onpointerup = pv.onpointercancel = function () {
            dn = 0;
          };
        }
        var f = B.querySelector(".btn");
        if (f) f.focus();
      }
      function openPic(v) {
        PIC.tok++;
        $("picM").hidden = false;
        pfView(v);
      }
      function closePic() {
        PIC.tok++;
        $("picM").hidden = true;
      }
      function usePic(c, opaque) {
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
        var b = new Image();
        b.onload = function () {
          S.bimg = b;
          S.img = d;
          sel = "i";
          chips();
          editor();
          draw();
          setTimeout(function () {
            goTo($("picEd"));
          }, 350);
        };
        b.src = d;
      }
      function useIt() {
        var c,
          op = false;
        PICFIXED = false;
        if (PIC.mode === "rem") c = trim(PIC.cut);
        else {
          c = renderMask(PIC.orig, PIC.mask, 1000, PIC.zoom, PIC.ox, PIC.oy);
          op = PIC.mask === "full" && !/png|webp|gif/.test(PIC.type);
          if (!op) c = trim(c);
        }
        closePic();
        usePic(c, op);
      }
      $("picB").onclick = function (e) {
        var a = e.target.closest("[data-a]"),
          m = e.target.closest("[data-m]");
        if (m) {
          PIC.mask = m.dataset.m;
          PIC.ox = PIC.oy = 0;
          [].forEach.call($("pfM").children, function (b) {
            b.setAttribute("aria-pressed", b === m);
          });
          pfDraw();
          return;
        }
        if (!a) return;
        a = a.dataset.a;
        if (a === "keep") {
          PIC.tok++;
          PIC.mode = "keep";
          pfView("mask");
        } else if (a === "rem") doRemove();
        else if (a === "bg") {
          PIC.tok++;
          pfView("bg");
        } else if (a === "use") useIt();
        else if (a === "new") {
          closePic();
          $("file").click();
        }
      };
      $("picB").oninput = function (e) {
        if (e.target.id === "pfZ") {
          PIC.zoom = e.target.value / 100;
          pfDraw();
        }
      };
      $("picX").onclick = closePic;
      $("picM").onclick = function (e) {
        if (e.target === this) closePic();
      };
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !$("picM").hidden) closePic();
      });
      $("file").onchange = function () {
        var f = this.files[0];
        this.value = "";
        if (!f) return;
        if (!/^image\//.test(f.type)) {
          toast("Please choose a photo or image file");
          return;
        }
        var u = URL.createObjectURL(f),
          im = new Image();
        im.onload = function () {
          var m = Math.min(1, 1600 / Math.max(im.width, im.height)),
            c = document.createElement("canvas");
          c.width = Math.round(im.width * m);
          c.height = Math.round(im.height * m);
          c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          URL.revokeObjectURL(u);
          PIC.orig = c;
          PIC.type = f.type;
          PIC.cut = null;
          PIC.mask = "full";
          PIC.zoom = 1;
          PIC.ox = PIC.oy = 0;
          if (window.picAfterFile) picAfterFile(f);
          else openPic("bg");
        };
        im.onerror = function () {
          URL.revokeObjectURL(u);
          toast("Cannot open that file. Try a JPG or PNG photo.");
        };
        im.src = u;
      };

      /* orders (shared database) */
      var db = null,
        unsub = null;
      claude
        .use("db")
        .then(function (d) {
          db = d;
          subProducts();
        })
        .catch(function () {});
      /* ===== NEW: unique Order ID + Thank-you screen ===== */
      function newOrderNo() {
        var A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
          r = new Uint32Array(6),
          i,
          t = "",
          d = new Date();
        try {
          crypto.getRandomValues(r);
        } catch (e) {
          for (i = 0; i < 6; i++) r[i] = Math.floor(Math.random() * 4294967296);
        }
        for (i = 0; i < 6; i++) t += A[r[i] % A.length];
        return (
          "CZ-" +
          String(d.getFullYear()).slice(2) +
          String(d.getMonth() + 1).padStart(2, "0") +
          String(d.getDate()).padStart(2, "0") +
          "-" +
          t
        );
      }
      function showThanks(list, dl) {
        var m = document.getElementById("thxM");
        if (!m) {
          m = document.createElement("div");
          m.id = "thxM";
          m.className = "coM";
          m.innerHTML =
            '<div class="coBox" role="dialog" aria-modal="true" aria-label="Order placed"><div id="thxB"></div></div>';
          document.body.appendChild(m);
          m.addEventListener("click", function (e) {
            var t = e.target,
              c = t.getAttribute && t.getAttribute("data-t");
            if (t === m || c === "close") {
              m.hidden = true;
              document.documentElement.style.overflow = "";
            } else if (c === "orders") {
              m.hidden = true;
              document.documentElement.style.overflow = "";
              location.hash = "#orders";
              if (typeof renderAcct === "function") renderAcct();
            } else if (c === "copy") {
              var v = t.getAttribute("data-v"),
                done = function () {
                  var o = t.textContent;
                  t.textContent = "Copied ✓";
                  setTimeout(function () {
                    t.textContent = o;
                  }, 1500);
                };
              try {
                navigator.clipboard.writeText(v).then(done);
              } catch (er) {}
            }
          });
        }
        var tot = list.reduce(function (a, x) {
          return a + (x.total || 0);
        }, 0);
        document.getElementById("thxB").innerHTML =
          '<div style="text-align:center;padding:8px 0 4px"><div style="font-size:44px;line-height:1">🎉</div><h2 style="margin:8px 0 4px">Thank you for ordering, ' +
          esc(dl.name || "") +
          '!</h2><div class="mut">Your order is placed. We will verify your payment and confirm shortly.</div></div>' +
          list
            .map(function (x) {
              return (
                '<div class="coCard" style="margin-top:12px"><div style="display:flex;gap:12px;flex-wrap:wrap">' +
                '<img src="' +
                (x.preview || "") +
                '" alt="" style="width:110px;border-radius:8px;background:#ddd;align-self:flex-start">' +
                '<div style="flex:1;min-width:200px;font-size:14px;line-height:1.55">' +
                '<div class="mut" style="font-size:12px">YOUR ORDER ID</div><div style="font-size:22px;font-weight:800;letter-spacing:.5px;word-break:break-all">' +
                esc(x.orderNo) +
                "</div>" +
                '<button type="button" class="btn g sm" data-t="copy" data-v="' +
                esc(x.orderNo) +
                '" style="margin:4px 0 8px">Copy ID</button><br>' +
                "<b>" +
                esc(x.pname || "Tee") +
                "</b> " +
                esc(x.color || "") +
                " · " +
                esc(x.shirt || "black") +
                " " +
                catN(x.cat) +
                "<br>Size " +
                esc(x.size) +
                " · Qty " +
                x.qty +
                " · <b>" +
                money(x.total) +
                "</b><br>" +
                tlines(x) +
                '<br><span class="tag">' +
                esc(x.status || "New") +
                "</span> " +
                new Date(x.ts).toLocaleString() +
                "</div></div></div>"
              );
            })
            .join("") +
          '<div class="coCard" style="margin-top:12px;font-size:14px;line-height:1.55"><b>Deliver to</b><br>' +
          esc(dl.name || "") +
          ", " +
          esc(dl.phone || "") +
          (dl.altPhone ? " / " + esc(dl.altPhone) : "") +
          "<br>" +
          esc(dl.address || "") +
          (list[0] && list[0].payment
            ? "<br><br><b>Payment</b><br>UPI · UTR " +
              esc(list[0].payment.utr) +
              " · Total paid " +
              money(tot)
            : "") +
          "</div>" +
          '<button type="button" class="btn coBtn" data-t="orders" style="margin-top:12px;width:100%">View in My orders</button>' +
          '<button type="button" class="coBack" data-t="close">Continue shopping</button>';
        m.hidden = false;
        document.documentElement.style.overflow = "hidden";
        var b = m.querySelector(".coBox");
        if (b) b.scrollTop = 0;
      }

      /* ===== Login, cart and my orders (Firebase Auth + Firestore) ===== */
      var USER = null,
        PROF = {},
        CART = [],
        MYO = [],
        uCart = null,
        uOrd = null,
        AMODE = "in";
      /* guest checkout: a guest gets a hidden anonymous session that is used ONLY to place the order.
         The site still treats that visitor as logged out (USER stays null). */
      var GU = null,
        uOrdE = null,
        MYO_U = [],
        MYO_E = [],
        OK_U = false,
        OK_E = false,
        LK = 0;
      var AUTH_OK = new Promise(function (r) {
        window.__authOK = r;
      });
      var DIRN = ["Horizontal", "Vertical (turned)", "Vertical (stacked)"];
      function money(n) {
        return "₹" + (+n || 0).toLocaleString("en-IN");
      }
      function aerr(e) {
        var c = (e && e.code) || "",
          m = {
            "auth/invalid-credential": "Wrong email or password.",
            "auth/wrong-password": "Wrong email or password.",
            "auth/user-not-found": "No account with this email.",
            "auth/email-already-in-use":
              "This email already has an account. Log in instead.",
            "auth/weak-password": "Password must be at least 6 characters.",
            "auth/invalid-email": "That email does not look right.",
            "auth/too-many-requests":
              "Too many tries. Wait a minute and try again.",
            "auth/network-request-failed": "No internet connection.",
            "auth/popup-closed-by-user": "Google sign-in was closed.",
            "auth/operation-not-allowed":
              "This sign-in method is not turned on in Firebase yet.",
            "auth/unauthorized-domain":
              "Add this website address in Firebase > Authentication > Settings > Authorized domains.",
          };
        return m[c] || (e && e.message) || "Something went wrong.";
      }

      /* ---- login window ---- */
      function setMode(m) {
        AMODE = m;
        $("authT").textContent = m === "up" ? "Create account" : "Log in";
        $("nmW").hidden = m !== "up";
        $("aGo").textContent = m === "up" ? "Create account" : "Log in";
        $("aSw").textContent =
          m === "up"
            ? "Have an account? Log in"
            : "New here? Create an account";
        $("ap").autocomplete = m === "up" ? "new-password" : "current-password";
      }
      function openAuth(msg) {
        setMode("in");
        $("authS").textContent = msg || "";
        $("aMsg").textContent = "";
        $("authM").hidden = false;
        if (!(window.matchMedia && matchMedia("(pointer:coarse)").matches))
          setTimeout(function () {
            $("ae").focus();
          }, 50);
      }
      function closeAuth() {
        $("authM").hidden = true;
      }
      function needLogin(msg) {
        if (USER) return false;
        openAuth(msg);
        return true;
      }
      $("authX").onclick = closeAuth;
      $("authM").onclick = function (e) {
        if (e.target === this) closeAuth();
      };
      $("aSw").onclick = function () {
        setMode(AMODE === "up" ? "in" : "up");
      };
      $("aGo").onclick = async function () {
        var em = $("ae").value.trim(),
          pw = $("ap").value,
          nm = $("an").value.trim(),
          b = this,
          m = $("aMsg");
        if (!em || !pw) {
          m.textContent = "Enter your email and password.";
          return;
        }
        if (AMODE === "up" && !nm) {
          m.textContent = "Enter your name.";
          return;
        }
        b.disabled = true;
        m.textContent = "";
        try {
          if (AMODE === "up") {
            var c = await AUTH.createUserWithEmailAndPassword(em, pw);
            await c.user.updateProfile({ displayName: nm });
            await FS.collection("users")
              .doc(c.user.uid)
              .set(
                { name: nm, email: em, created: Date.now() },
                { merge: true },
              );
            PROF.name = nm;
            try {
              c.user.sendEmailVerification().catch(function () {});
            } catch (e2) {}
          } else await AUTH.signInWithEmailAndPassword(em, pw);
          closeAuth();
          toast("Welcome!");
        } catch (e) {
          m.textContent = aerr(e);
        }
        b.disabled = false;
      };
      $("aG").onclick = async function () {
        try {
          await AUTH.signInWithPopup(new firebase.auth.GoogleAuthProvider());
          closeAuth();
          toast("Welcome!");
        } catch (e) {
          $("aMsg").textContent = aerr(e);
        }
      };
      $("aFg").onclick = async function () {
        var em = $("ae").value.trim();
        if (!em) {
          $("aMsg").textContent = "Type your email above first.";
          return;
        }
        try {
          await AUTH.sendPasswordResetEmail(em);
          $("aMsg").textContent =
            "Password reset email sent. Check your inbox.";
        } catch (e) {
          $("aMsg").textContent = aerr(e);
        }
      };
      $("authBtn").onclick = function () {
        if (USER)
          AUTH.signOut().then(function () {
            toast("Logged out");
            if (VIEW === "acct") location.hash = "";
          });
        else openAuth();
      };
      function bar() {
        $("cartN").textContent = CART.length;
        $("cartN").hidden = !CART.length;
        $("cartN2").textContent = CART.length;
        $("cartN2").hidden = !CART.length;
        $("authBtn").textContent = USER ? "Log out" : "Log in";
        $("authBtn").title = USER ? USER.email || "" : "";
      }
      function fillDelivery() {
        if (!USER) return;
        var n = $("nm"),
          p = $("ph"),
          a = $("ad");
        if (n && !n.value) n.value = PROF.name || USER.displayName || "";
        if (p && !p.value) p.value = PROF.phone || "";
        if (a && !a.value) a.value = PROF.address || "";
      }

      /* ---- orders shown in "My orders": the ones placed by this account + the ones placed as a guest with the same VERIFIED email ---- */
      function mergeOrders() {
        var seen = {},
          all = [];
        MYO_U.concat(MYO_E).forEach(function (x) {
          if (!seen[x.id]) {
            seen[x.id] = 1;
            all.push(x);
          }
        });
        MYO = all.sort(function (a, b) {
          return b.ts - a.ts;
        });
        window.MYO_OK = OK_U && OK_E;
        if (VIEW === "acct") renderAcct();
      }
      async function linkByEmail(u) {
        var my = ++LK;
        if (uOrdE) {
          uOrdE();
          uOrdE = null;
        }
        MYO_E = [];
        var em = String(u.email || "")
          .trim()
          .toLowerCase();
        try {
          /* picks up an email that was verified in another tab / app, and refreshes the sign-in token so the server sees it */
          if (em && !u.emailVerified) {
            await u.reload();
            if (u.emailVerified) await u.getIdToken(true);
          }
        } catch (e) {}
        if (my !== LK || USER !== u) return;
        if (!em || !u.emailVerified) {
          OK_E = true;
          mergeOrders();
          return;
        }
        uOrdE = FS.collection("orders")
          .where("email", "==", em)
          .onSnapshot(
            function (s) {
              MYO_E = s.docs.map(function (d) {
                var x = d.data();
                x.id = d.id;
                return x;
              });
              OK_E = true;
              mergeOrders();
            },
            function () {
              MYO_E = [];
              OK_E = true;
              mergeOrders();
            },
          );
      }
      function vfyNote() {
        if (!USER || !USER.email || USER.emailVerified) return "";
        return (
          '<div class="note"><b>Verify your email</b><p class="mut">We sent a link to ' +
          esc(USER.email) +
          ". Open it to also see the orders you placed as a guest with this email.</p>" +
          '<button class="btn sm" id="vfy">I have verified</button> <button class="btn sm g" id="vfr">Send the email again</button>' +
          '<p id="vmsg" class="mut" style="font-size:14px"></p></div>'
        );
      }
      async function verifyNow(b) {
        var m = $("vmsg");
        b.disabled = true;
        try {
          await linkByEmail(USER);
          if (USER && USER.emailVerified) {
            toast("Email verified");
            renderAcct();
          } else if (m)
            m.textContent =
              "Not verified yet. Open the link in the email we sent, then tap this button again.";
        } catch (e) {
          if (m) m.textContent = aerr(e);
        }
        b.disabled = false;
      }
      async function resendVerify(b) {
        var m = $("vmsg");
        b.disabled = true;
        try {
          await USER.sendEmailVerification();
          if (m)
            m.textContent =
              "Verification email sent to " +
              USER.email +
              ". Check your inbox (and spam).";
        } catch (e) {
          if (m) m.textContent = aerr(e);
        }
        b.disabled = false;
      }
      document.addEventListener("visibilitychange", function () {
        if (
          !document.hidden &&
          VIEW === "acct" &&
          USER &&
          USER.email &&
          !USER.emailVerified
        )
          linkByEmail(USER).then(function () {
            if (VIEW === "acct") renderAcct();
          });
      });
      /* the account that an order is placed under: the logged-in user, else a guest (anonymous) session */
      async function orderUser() {
        await Promise.race([
          AUTH_OK,
          new Promise(function (r) {
            setTimeout(r, 4000);
          }),
        ]);
        if (USER) return USER;
        if (GU) return GU;
        try {
          var c = await AUTH.signInAnonymously();
          GU = c.user;
          return GU;
        } catch (e) {
          throw new Error(
            e && e.code === "auth/operation-not-allowed"
              ? "Guest checkout is not available right now. Please log in to place your order."
              : aerr(e),
          );
        }
      }

      AUTH.onAuthStateChanged(function (u) {
        GU = u && u.isAnonymous ? u : null;
        if (GU) u = null;
        USER = u;
        LK++;
        if (uCart) {
          uCart();
          uCart = null;
        }
        if (uOrd) {
          uOrd();
          uOrd = null;
        }
        if (uOrdE) {
          uOrdE();
          uOrdE = null;
        }
        CART = [];
        MYO = [];
        MYO_U = [];
        MYO_E = [];
        OK_U = false;
        OK_E = false;
        window.MYO_OK = false;
        PROF = {};
        if (u) {
          FS.collection("users")
            .doc(u.uid)
            .get()
            .then(function (d) {
              PROF = d.exists ? d.data() : {};
              fillDelivery();
              if (VIEW === "acct") renderAcct();
            })
            .catch(function () {});
          uCart = FS.collection("users")
            .doc(u.uid)
            .collection("cart")
            .onSnapshot(
              function (s) {
                CART = s.docs
                  .map(function (d) {
                    var x = d.data();
                    x.id = d.id;
                    return x;
                  })
                  .sort(function (a, b) {
                    return b.ts - a.ts;
                  });
                bar();
                if (VIEW === "acct") renderAcct();
              },
              function (e) {
                toast("Cart error: " + e.message);
              },
            );
          uOrd = FS.collection("orders")
            .where("uid", "==", u.uid)
            .onSnapshot(
              function (s) {
                MYO_U = s.docs.map(function (d) {
                  var x = d.data();
                  x.id = d.id;
                  return x;
                });
                OK_U = true;
                mergeOrders();
              },
              function (e) {
                toast("Orders error: " + e.message);
              },
            );
          linkByEmail(u);
        } else if (GU) {
          /* guest: the cart lives under the hidden guest session */
          uCart = FS.collection("users")
            .doc(GU.uid)
            .collection("cart")
            .onSnapshot(
              function (s) {
                CART = s.docs
                  .map(function (d) {
                    var x = d.data();
                    x.id = d.id;
                    return x;
                  })
                  .sort(function (a, b) {
                    return b.ts - a.ts;
                  });
                bar();
                if (VIEW === "acct") renderAcct();
              },
              function (e) {
                toast("Cart error: " + e.message);
              },
            );
        }
        if (window.__authOK) window.__authOK();
        bar();
        if (VIEW === "acct") renderAcct();
      });

      /* ---- everything about the design that gets saved with the cart item / order ---- */
      function designData() {
        var tx = T.filter(function (t) {
          return t.txt.trim();
        }).map(function (t) {
          return {
            raw: t.raw == null ? t.txt : t.raw,
            txt: t.txt,
            lang: LANG,
            langName: LANGS[LANG],
            font: FONTS[t.font][0],
            color: colOf(t),
            size: t.size,
            border: t.bw || 0,
            borderColor: t.bw ? (t.bc === "b" ? "black" : "white") : null,
            x: Math.round(t.px),
            y: Math.round(t.py),
            direction: DIRN[t.o || 0],
            curve: t.cv || 0,
            front: !!t.front,
            rotation: t.rot ? Math.round(t.rot) : 0,
            signature: !!t.sig,
          };
        });
        return {
          shirt: SHIRT,
          cat: S.cat || "tee",
          lang: LANG,
          langName: LANGS[LANG],
          textCount: tx.length,
          texts: tx,
          hasPicture: !!S.bimg,
          picture: S.bimg
            ? {
                size: Math.round(I.size),
                x: Math.round(I.px),
                y: Math.round(I.py),
                rotation: I.rot ? Math.round(I.rot) : 0,
              }
            : null,
        };
      }
      function printSafe(max) {
        var K = 4,
          d;
        do {
          d = printFile(K);
          K -= 0.4;
        } while (d.length > max && K > 0.7);
        return d;
      }
      function buildItem() {
        var q = Math.max(1, Math.min(20, Math.floor(+$("qty").value) || 1)),
          u = Math.floor(S.price || PRICE);
        return Object.assign(
          {
            ts: Date.now(),
            pid: S.pid,
            pname: S.pname || "",
            color: S.pcolor || "",
            size: S.size,
            qty: q,
            unit: u,
            total: u * q,
            preview: previewJpg(),
            design: printSafe(640000),
          },
          designData(),
        );
      }
      function cartRef() {
        return FS.collection("users").doc((USER || GU).uid).collection("cart");
      }
      function rid(p) {
        return (
          p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
        );
      }

      /* ---- add to cart ---- */
      $("addCart").onclick = async function () {
        if (!S.pid || !layout().n) {
          toast("Add some text or a picture first");
          return;
        }
        if (CART.length >= 8) {
          toast("Cart is full (8 designs). Place an order or remove one.");
          return;
        }
        var b = this;
        b.disabled = true;
        try {
          await orderUser();
          await cartRef().doc(rid("c_")).set(buildItem());
          toast("Added to your cart");
        } catch (e) {
          toast("Could not add to cart: " + (e.message || e.code));
        }
        draw();
      };

      /* ---- place order(s): one order per design, design image saved with it ---- */
      async function placeOrders(items, dl, fromCart) {
        var batch = FS.batch(),
          gid = rid("g_"),
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
          Object.assign(d, {
            uid: USER.uid,
            email: USER.email || "",
            ts: Date.now(),
            name: dl.name,
            phone: dl.phone,
            address: dl.address,
            status: "New",
            groupId: gid,
            orderNo: newOrderNo(),
          });
          made.push(Object.assign({ id: id }, d));
          batch.set(FS.collection("orders").doc(id), d);
          batch.set(
            FS.collection("orders").doc(id).collection("files").doc("design"),
            { png: png, ts: d.ts },
          );
          if (fromCart) batch.delete(cartRef().doc(it.id));
        });
        batch.set(
          FS.collection("users").doc(USER.uid),
          {
            name: dl.name,
            phone: dl.phone,
            address: dl.address,
            email: USER.email || "",
            updated: Date.now(),
          },
          { merge: true },
        );
        await batch.commit();
        PROF.name = dl.name;
        PROF.phone = dl.phone;
        PROF.address = dl.address;
        return made;
      }

      /* ---- buy now ---- */
      $("place").onclick = async function () {
        var nm = $("nm").value.trim(),
          ph = $("ph").value.trim(),
          ad = $("ad").value.trim();
        if (!nm || !ph || !ad) {
          $("msg").textContent = "Please fill in name, phone and address.";
          showTab("shirt");
          setTimeout(function () {
            var q = !nm ? $("nm") : !ph ? $("ph") : $("ad");
            q.scrollIntoView({ block: "center", behavior: "smooth" });
            q.focus();
          }, 80);
          return;
        }
        if (
          needLogin(
            "Log in to place your order. Your design stays on this page.",
          )
        )
          return;
        var b = this;
        b.disabled = true;
        $("msg").textContent = "Saving your design and placing the order…";
        try {
          var made = await placeOrders(
            [buildItem()],
            { name: nm, phone: ph, address: ad },
            false,
          );
          $("msg").textContent = "";
          showThanks(made, { name: nm, phone: ph, address: ad });
        } catch (e) {
          $("msg").textContent =
            "Could not place order: " + (e.message || e.code);
        }
        draw();
      };

      /* ---- cart + my orders pages ---- */
      function tlines(x) {
        var t = x.texts || [],
          n = x.textCount != null ? x.textCount : t.length,
          ln = x.langName || LANGS[x.lang] || "English";
        return (
          "<b>" +
          n +
          " text" +
          (n === 1 ? "" : "s") +
          "</b> · prints in " +
          esc(ln) +
          (x.hasPicture ? " · + 1 picture" : "") +
          t
            .map(function (y, k) {
              return (
                "<br>Text " +
                (k + 1) +
                ": typed “" +
                esc(y.raw) +
                "”" +
                (y.raw !== y.txt ? " → printed <b>" + esc(y.txt) + "</b>" : "")
              );
            })
            .join("")
        );
      }
      /* design summary used by the cart and the checkout (chips + text rows) */
      function dsg(x) {
        var t = x.texts || [],
          ln = x.langName || LANGS[x.lang] || "English";
        var chips =
          '<div class="dsChips"><span class="dsC"><i style="background:' +
          (x.shirt === "white" ? "#fff" : "#111") +
          '"></i>' +
          esc(x.shirt || "black") +
          " " +
          esc(catN(x.cat)) +
          '</span><span class="dsC">Size <b>' +
          esc(x.size) +
          '</b></span><span class="dsC">' +
          esc(ln) +
          "</span>" +
          (x.hasPicture ? '<span class="dsC">+ Picture</span>' : "") +
          "</div>";
        var rows = t
          .map(function (y, k) {
            return (
              '<div class="dsT"><em>' +
              (k + 1) +
              "</em>" +
              (y.raw !== y.txt
                ? '<span class="dsR">' +
                  esc(y.raw) +
                  '</span><span class="dsA">\u2192</span>'
                : "") +
              '<b class="dsP">' +
              esc(y.txt) +
              "</b></div>"
            );
          })
          .join("");
        return (
          chips +
          (rows
            ? '<div class="dsBox"><div class="dsH">Your design text</div>' +
              rows +
              "</div>"
            : "")
        );
      }
      function cartHtml() {
        if (!CART.length)
          return '<div class="note">Your cart is empty. <a href="#custom" style="color:var(--fg)">Design a tee</a></div>';
        var tot = 0,
          h = CART.map(function (x) {
            tot += x.total || 0;
            return (
              '<div class="ck"><img src="' +
              x.preview +
              '" alt=""><div class="ckB"><div class="ckT">' +
              esc(x.pname || "Tee") +
              "</div>" +
              dsg(x) +
              '<div class="ckF"><div class="ckQ"><span>Qty</span><span class="ckS"><button type="button" class="ckSb" data-qs="-1" data-qid="' +
              x.id +
              '" aria-label="Decrease quantity"' +
              (x.qty <= 1 ? " disabled" : "") +
              '>\u2212</button><b class="ckN">' +
              x.qty +
              '</b><button type="button" class="ckSb" data-qs="1" data-qid="' +
              x.id +
              '" aria-label="Increase quantity"' +
              (x.qty >= 20 ? " disabled" : "") +
              '>+</button></span></div><b class="ckP">' +
              money(x.total) +
              '</b></div><button class="btn sm g ckR" data-rm="' +
              x.id +
              '">Remove</button></div></div>'
            );
          }).join("");
        return (
          h +
          '<div class="note"><b>Your bill</b><div class="bl"><span>Subtotal (' +
          CART.length +
          (CART.length === 1 ? " design" : " designs") +
          ")</span><span>" +
          money(tot) +
          '</span></div><div class="bl"><span>Delivery</span><span><b style="color:#16a34a">FREE \u20b90</b></span></div><div class="bl tot"><span>Total</span><span>' +
          money(tot) +
          '</span></div><button class="btn" id="co" style="width:100%;margin-top:10px">Checkout \u00b7 ' +
          money(tot) +
          '</button><p id="cmsg" class="mut" style="font-size:14px"></p></div>'
        );
      }
      function ordersHtml() {
        if (!MYO.length)
          return '<div class="note">No orders yet. <a href="#custom" style="color:var(--fg)">Design your first tee</a></div>';
        return MYO.map(function (x) {
          return (
            '<div class="ci"><img src="' +
            (x.preview || "") +
            '" alt=""><div class="m"><span class="tag">' +
            esc(x.status || "New") +
            "</span> " +
            new Date(x.ts).toLocaleString() +
            " · <b>#" +
            esc(x.orderNo || x.id.slice(-6).toUpperCase()) +
            "</b><br><b>" +
            esc(x.pname || "Tee") +
            "</b> " +
            esc(x.color || "") +
            " · " +
            esc(x.shirt || "black") +
            " " +
            catN(x.cat) +
            " · size " +
            esc(x.size) +
            " · ×" +
            x.qty +
            " · <b>" +
            money(x.total) +
            "</b><br>" +
            tlines(x) +
            "<br>Deliver to: " +
            esc(x.name) +
            ", " +
            esc(x.phone) +
            (x.altPhone ? " / " + esc(x.altPhone) : "") +
            ", " +
            esc(x.address) +
            (x.payment
              ? "<br>Payment: UPI \u00b7 UTR " +
                esc(x.payment.utr) +
                " \u00b7 <b>" +
                esc(x.payStatus || "Pending verification") +
                "</b>"
              : "") +
            "</div></div>"
          );
        }).join("");
      }
      function renderAcct() {
        var v = location.hash === "#orders" ? "orders" : "cart",
          box = $("acctBody"),
          a = $("cn");
        if (a) {
          PROF.name = a.value;
          PROF.phone = $("cp").value;
          PROF.address = $("ca").value;
        }
        $("acctT").textContent = v === "orders" ? "My orders" : "Your cart";
        $("tabC").classList.toggle("on", v === "cart");
        $("tabO").classList.toggle("on", v === "orders");
        if (!USER && v === "orders") {
          box.innerHTML =
            '<div class="note"><b>Please log in</b><p class="mut">Log in to see your cart and your orders. Everything you design is saved to your account.</p><button class="btn" id="ali">Log in / Sign up</button></div>';
          return;
        }
        box.innerHTML = v === "orders" ? vfyNote() + ordersHtml() : cartHtml();
      }
      async function dlDesign(id, btn) {
        btn.disabled = true;
        try {
          var d = await FS.collection("orders")
            .doc(id)
            .collection("files")
            .doc("design")
            .get();
          if (!d.exists) throw new Error("file not found");
          var a = document.createElement("a");
          a.href = d.data().png;
          a.download = "design-" + id + ".png";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (e) {
          toast("Could not download: " + (e.message || e.code));
        }
        btn.disabled = false;
      }
      $("acctBody").onclick = function (e) {
        var sb = e.target.closest && e.target.closest("[data-qs]");
        if (sb && (USER || GU)) {
          var sx = CART.filter(function (c) {
            return c.id === sb.dataset.qid;
          })[0];
          if (sx) {
            var sq = Math.max(1, Math.min(20, (+sx.qty || 1) + (+sb.dataset.qs || 0)));
            if (sq !== sx.qty)
              cartRef()
                .doc(sx.id)
                .update({ qty: sq, total: (sx.unit || PRICE) * sq })
                .catch(function (er) {
                  toast(er.message);
                });
          }
          return;
        }
        var t = e.target,
          d = t.dataset || {};
        if (t.id === "ali") openAuth("Log in to see your cart and orders");
        else if (t.id === "vfy") verifyNow(t);
        else if (t.id === "vfr") resendVerify(t);
        else if (d.rm && (USER || GU))
          cartRef()
            .doc(d.rm)
            .delete()
            .catch(function (er) {
              toast(er.message);
            });
        else if (d.dl) dlDesign(d.dl, t);
        else if (t.id === "co") checkout();
      };
      $("acctBody").onchange = function (e) {
        var d = e.target.dataset;
        if (!d || !d.q || !(USER || GU)) return;
        var q = Math.max(1, Math.min(20, Math.floor(+e.target.value) || 1)),
          x = CART.filter(function (c) {
            return c.id === d.q;
          })[0];
        if (!x) return;
        cartRef()
          .doc(d.q)
          .update({ qty: q, total: (x.unit || PRICE) * q })
          .catch(function (er) {
            toast(er.message);
          });
      };
      function checkout() {
        if (!(USER || GU) || !CART.length) return;
        window.openCheckout(CART.slice(0, 8), true);
      }

      /* sliders on touch screens: a tap on the bar does nothing (so scrolling past never changes a value); you must grab the round handle and drag */
      (function () {
        var G = null,
          tm = 0;
        document.addEventListener(
          "pointerdown",
          function (e) {
            var t = e.target;
            clearTimeout(tm);
            if (!t || t.type !== "range" || e.pointerType === "mouse") {
              G = null;
              return;
            }
            var r = t.getBoundingClientRect(),
              mn = +t.min || 0,
              mx = +t.max || 100,
              f = (t.value - mn) / (mx - mn || 1),
              cx = r.left + 13 + (r.width - 26) * f;
            G = { el: t, v: t.value, ok: Math.abs(e.clientX - cx) <= 30 };
          },
          true,
        );
        function end() {
          clearTimeout(tm);
          tm = setTimeout(function () {
            G = null;
          }, 500);
        }
        document.addEventListener("pointerup", end, true);
        document.addEventListener("pointercancel", end, true);
        function block(e) {
          if (G && !G.ok && e.target === G.el) {
            e.target.value = G.v;
            e.stopImmediatePropagation();
            e.stopPropagation();
          }
        }
        document.addEventListener("input", block, true);
        document.addEventListener("change", block, true);
      })();

      /* routing */
      function scrollCol() {
        var c = $("colSec"),
          hd = document.querySelector("header");
        if (!c || c.hidden) return;
        window.scrollTo({
          top: Math.max(
            0,
            c.getBoundingClientRect().top +
              window.pageYOffset -
              (hd ? hd.offsetHeight : 0),
          ),
          behavior: "smooth",
        });
      }
      function route() {
        var h = location.hash;
        VIEW = viewOf(h);
        var hp = hashPid();
        if (
          hp &&
          P.some(function (q) {
            return q.id === hp;
          })
        )
          pickP(hp);
        applyView();
        if (VIEW !== "home") {
          window.scrollTo(0, 0);
          if (VIEW === "acct") renderAcct();
          if (VIEW === "product") {
            showTab("text");
            clearTimeout(SCT);
            SCT = setTimeout(function () {
              goTo($("stepText"));
            }, 500);
          }
          return;
        }
        setTimeout(function () {
          if (h === "#collections" || h === "#products" || h === "#fresh")
            scrollCol();
          else window.scrollTo(0, 0);
        }, 50);
      }
      document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest("#nC");
        if (!a) return;
        var h = "#collections";
        e.preventDefault();
        if (location.hash === h) route();
        else location.hash = h;
      });

      window.addEventListener("hashchange", route);
      route();
      sync();
      bar();
    
