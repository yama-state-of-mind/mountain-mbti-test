/* =========================================================
   YAMA TYPE — アプリのロジック
   質問やタイプの文章は data.js、キャラクターは characters.js にあります。
   読み込み順は data.js → characters.js → script.js です。
   ========================================================= */

/* =========================================================
   ここから下はアプリ本体のロジック
   ========================================================= */

/* ---------- 出題順のシャッフル ----------
   同じ軸の質問が隣り合わないように並べ替える */
function shuffleQuestions(list) {
  if (!SHUFFLE) return list.slice();
  const spreadOut = (arr) => arr.every((q, i) => i === 0 || q.axis !== arr[i - 1].axis);

  for (let attempt = 0; attempt < 200; attempt++) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (spreadOut(a)) return a;
  }
  return list.slice(); // 条件を満たす並びが見つからなかった場合
}

/* ---------- 出題リストの組み立て ----------
   軸を持つ12問をシャッフルし、そこへ軸なしのシークレット専用2問を混ぜる。
   専用2問は判定に使わないので、同じ軸が隣り合わない制約の対象外 */
function buildQuiz() {
  const list = shuffleQuestions(QUESTIONS);
  if (typeof SECRETS === "undefined" || !SECRETS.length) return list;

  // シークレット専用の問題は、毎回どちらか1問だけを混ぜる
  const pick = SECRETS[Math.floor(Math.random() * SECRETS.length)].question;
  const slot = 1 + Math.floor(Math.random() * (list.length - 1));

  const out = list.slice();
  out.splice(slot, 0, pick);
  return out;
}

let QUIZ = buildQuiz();
const answers = new Array(QUESTIONS.length).fill(null); // 0〜5（0=A強, 5=B強）
let currentPage = 0;
const totalPages = 2;   // 1ページ目6問、2ページ目は残り全部

const $ = (sel) => document.querySelector(sel);
const screens = {
  start: $("#screen-start"),
  quiz: $("#screen-quiz"),
  result: $("#screen-result"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("is-active"));
  screens[name].classList.add("is-active");
  window.scrollTo({ top: 0 });
}


/* ---------- スタート画面のキャラクター配置 ----------
   山のイラストの上に孤峰・稜線（高山）、ページ下部に静林・陽だまり（森）。
   生息エリアごとに帯を作り、それぞれの淡色を敷く */
/* 問題数は QUIZ から取るので、問題を増減しても表示が自動で追従する */
(() => {
  ["progress-total", "lead-count", "note-count"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = QUIZ.length;
  });
})();

function renderCast() {
  if (typeof characterSVG !== "function") return;
  const codes = Object.keys(TYPES);

  let base = 0;
  const fill = (id, keys) => {
    const box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = keys.map((key, gi) => {
      const g = GROUPS[key];
      const list = codes.filter((c) => c.slice(0, 2) === key);
      return `<div class="cast-group" style="background:${g.band}">
        ${list.map((c, i) => {
          // 帯ごと・1体ごとに少しずつ遅らせて、順番に現れるようにする
          const n = base + gi * 4 + i;
          const delay = n * 0.055;              // 順番に現れるための遅れ
          const cycle = 4.6 + (n % 5) * 0.36;   // 1体ずつ周期を変えて動きを揃えない
          return characterSVG(c, "char").replace(
            "<svg ", `<svg style="--d:${delay.toFixed(2)}s;--fd:${cycle.toFixed(2)}s" `);
        }).join("")}
      </div>`;
    }).join("");
  };
  fill("cast-top", ["PS", "PG"]);
  base = 8;
  fill("cast-bottom", ["ES", "EG"]);
}
renderCast();

/* ---------- 質問ページの描画 ---------- */
function renderPage() {
  const page = $("#quiz-page");
  page.innerHTML = "";
  page.classList.remove("page-in");
  void page.offsetWidth;
  page.classList.add("page-in");

  const start = currentPage * QUESTIONS_PER_PAGE;
  const end = currentPage === totalPages - 1 ? QUIZ.length : Math.min(start + QUESTIONS_PER_PAGE, QUIZ.length);

  for (let i = start; i < end; i++) {
    const q = QUIZ[i];
    const card = document.createElement("div");
    card.className = "q-card";
    card.dataset.index = i;

    const strength = ["とてもAに近い", "Aに近い", "やや A", "やや B", "Bに近い", "とてもBに近い"];
    const dots = [0, 1, 2, 3, 4, 5].map((v) => {
      const sel = answers[i] === v ? " selected" : "";
      return `<button type="button" class="dot${sel}" data-v="${v}"
        aria-label="${strength[v]}"></button>`;
    }).join("");

    card.innerHTML = `
      <span class="q-num">Q${i + 1}</span>
      <p class="q-text">${q.text}</p>
      <div class="opt-label opt-a">A. ${q.a}</div>
      <div class="opt-label opt-b">B. ${q.b}</div>
      <div class="scale">
        <div class="dots">${dots}</div>
        <div class="scale-notes">
          <span>Aに近い</span>
          <span>Bに近い</span>
        </div>
      </div>
    `;
    page.appendChild(card);
  }

  $("#btn-back").style.visibility = "visible";
  $("#btn-next").textContent = currentPage === totalPages - 1 ? "結果を見る" : "つぎへ";
  updateProgress();
}

/* ---------- ドット選択 ---------- */
$("#quiz-page").addEventListener("click", (e) => {
  const dot = e.target.closest(".dot");
  if (!dot) return;
  const card = dot.closest(".q-card");
  const idx = Number(card.dataset.index);
  answers[idx] = Number(dot.dataset.v);

  card.querySelectorAll(".dot").forEach((d) => d.classList.remove("selected"));
  dot.classList.add("selected");
  card.classList.remove("needs-answer");
  updateProgress();
  scrollToNext(idx);
});

/* ---------- 回答したら次の質問へ送る ----------
   まだ答えていないカードを優先し、なければページ末のボタンへ送る */
function scrollToNext(fromIndex) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const pageStart = currentPage * QUESTIONS_PER_PAGE;
  const pageEnd = currentPage === totalPages - 1 ? QUIZ.length : Math.min(pageStart + QUESTIONS_PER_PAGE, QUIZ.length);

  let target = null;
  for (let i = fromIndex + 1; i < pageEnd; i++) {
    if (answers[i] === null) { target = i; break; }
  }
  if (target === null && fromIndex + 1 < pageEnd) target = fromIndex + 1;

  setTimeout(() => {
    if (target !== null) {
      const next = document.querySelector(`.q-card[data-index="${target}"]`);
      if (next) next.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // ページ最後の質問に答えたら「つぎへ」ボタンを見せる
      $("#btn-next").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 260);
}

/* ---------- 登山道プログレス ----------
   左端が登山口、右端が山頂。歩いた分だけ道に色がつき、現在地の丸が進む */
let routeLength = 0;

function updateProgress() {
  const done = answers.filter((a) => a !== null).length;
  const ratio = QUIZ.length ? done / QUIZ.length : 0;
  const route = document.getElementById("climb-path");
  const walked = document.getElementById("climb-progress");
  const marker = document.getElementById("climb-marker");

  if (route && walked) {
    if (!routeLength) {
      try {
        routeLength = route.getTotalLength();
        walked.style.strokeDasharray = routeLength;
      } catch (e) { routeLength = 0; }
    }
    if (routeLength) {
      walked.style.strokeDashoffset = routeLength * (1 - ratio);
      try {
        const p = route.getPointAtLength(routeLength * ratio);
        marker.setAttribute("cx", p.x);
        marker.setAttribute("cy", p.y);
      } catch (e) {}
    }
  }

  document.getElementById("sign-mid").classList.toggle("passed", ratio >= 0.5);
  document.getElementById("sign-peak").classList.toggle("passed", done === QUIZ.length);
  $("#progress-count").textContent = done;
  $("#progress-bar-wrap").setAttribute("aria-valuenow", done);
}

/* ---------- ページ移動 ---------- */
$("#btn-start").addEventListener("click", () => {
  currentPage = 0;
  showScreen("quiz");
  renderPage();
});

$("#btn-back").addEventListener("click", () => {
  if (currentPage === 0) {
    showScreen("start");
  } else {
    currentPage--;
    renderPage();
  }
});

$("#btn-next").addEventListener("click", () => {
  const start = currentPage * QUESTIONS_PER_PAGE;
  const end = currentPage === totalPages - 1 ? QUIZ.length : Math.min(start + QUESTIONS_PER_PAGE, QUIZ.length);
  for (let i = start; i < end; i++) {
    if (answers[i] === null) {
      const card = document.querySelector(`.q-card[data-index="${i}"]`);
      card.classList.add("needs-answer");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showResult();
  }
});


/* ---------- 相性のいいタイプ ----------
   息が合う相手  : 計画軸だけが逆のタイプ（感覚派と計画派で補完し合う）
   刺激をくれる相手: 目的軸だけが逆のタイプ（同じ登り方で、山の楽しみ方が違う） */
function flipAxis(code, axisIndex) {
  const ax = AXES[axisIndex];
  const chars = code.split("");
  chars[axisIndex] = chars[axisIndex] === ax.a ? ax.b : ax.a;
  return chars.join("");
}

function findMatches(code, secret) {
  const w = (typeof MATCH_WHY !== "undefined" && MATCH_WHY[code]) || {};
  const list = [
    { label: "補い合える相手",     code: flipAxis(code, 2), why: w.calm || "" },
    { label: "歩き方が似ている相手", code: flipAxis(code, 0), why: w.spark || "" },
  ];

  if (secret) {
    // シークレットのときは3人目に同じタイプの通常の姿が出る
    list.push({
      label: "相性は文句なし",
      code: code,
      why: typeof SECRET_MATCH_WHY !== "undefined" ? SECRET_MATCH_WHY : "",
    });
  } else {
    // 目的と仲間の両方が逆の相手。相手から見てもあなたが出る
    list.push({
      label: "刺激をくれる相手",
      code: flipAxis(flipAxis(code, 0), 1),
      why: w.opp || "",
    });
  }
  return list;
}

/* ---------- 判定ロジック ----------
   6段階の回答を「1文字目側に何%寄っているか」に変換して平均する。
     v=0 → 100%  v=1 → 80%  v=2 → 60%
     v=3 →  40%  v=4 → 20%  v=5 →  0%
   rev が true の質問は、選択肢Aが2文字目側を指すため向きを反転させる。
   こうすると「どちらかといえばA」を3回選んでも60%にとどまり、
   100%は3問すべてで端を選んだときにだけ出る。 */
function calcResult() {
  const share = {};
  AXES.forEach((ax) => (share[ax.id] = []));

  QUIZ.forEach((q, i) => {
    if (!q.axis) return;                            // シークレット専用の問題は判定に使わない
    const v = answers[i];
    const towardOptionA = ((5 - v) / 5) * 100;      // 選択肢Aへの寄り
    const towardFirstLetter = q.rev ? 100 - towardOptionA : towardOptionA;
    share[q.axis].push(towardFirstLetter);
  });

  let code = "";
  const detail = [];
  AXES.forEach((ax) => {
    const list = share[ax.id];
    const aPct = list.length
      ? Math.round(list.reduce((sum, x) => sum + x, 0) / list.length)
      : 50;
    const aWins = aPct >= 50;                        // 同点は1文字目側に倒す
    code += aWins ? ax.a : ax.b;
    detail.push({ ...ax, aPct, bPct: 100 - aPct, aWins });
  });
  return { code, detail };
}

/* ---------- シークレットの判定 ----------
   専用問題でAの端（いちばん強い回答）を選び、
   かつ結果が code と完全一致したときだけ成立する */
function findSecret(code) {
  if (typeof SECRETS === "undefined") return null;

  for (let i = 0; i < QUIZ.length; i++) {
    const id = QUIZ[i].secret;
    if (!id) continue;
    const sec = SECRETS.find((x) => x.id === id);
    if (!sec || code !== sec.code) continue;
    if (answers[i] === 0) return sec;               // 選択肢A側のいちばん端
  }
  return null;
}

/* ---------- 結果表示 ---------- */
let shareData = null;

function showResult() {
  const { code, detail } = calcResult();
  const type = TYPES[code] || { name: "未知のタイプ", desc: "" };

  const g = groupOf(code);
  const plate = $("#result-code");
  plate.textContent = code;
  plate.style.background = g.deep;
  $("#result-hero").style.background = g.band;
  const grp = $("#result-group");
  grp.textContent = "生息エリア：" + g.name;
  grp.style.color = g.deep;
  const ch = CHARACTERS[code];
  const secret = findSecret(code);

  $("#result-char").innerHTML = secret
    ? secretSVG(secret.id, "char char-lg")
    : characterSVG(code, "char char-lg");
  $("#result-animal").textContent = secret ? secret.animal : (ch ? ch.animal : type.name);
  $("#result-name").textContent = secret ? secret.typeName : type.name;
  $("#secret-badge").hidden = !secret;
  $("#secret-lead").hidden = !secret;
  $("#secret-spark").hidden = !secret;
  $("#secret-note").hidden = !secret;
  if (secret) $("#secret-note").textContent = secret.note;
  document.querySelector(".result").classList.toggle("is-secret", !!secret);
  const item = secret ? SECRET_CHARACTERS[secret.id].item : (ch ? ch.item : "");
  $("#result-item").innerHTML = item ? `<b>持ちもの</b>${item}` : "";
  $("#result-copy").textContent = "「" + (secret ? secret.copy : type.copy) + "」";
  $("#result-features").textContent = secret ? secret.features : type.features;
  $("#result-caution").textContent = secret ? secret.caution : type.caution;

  // 4軸のタグ（Pピークハント / G生息エリア …）
  $("#result-axtags").innerHTML = code.split("").map((ch, i) => {
    const ax = AXES[i];
    const isFirst = ch === ax.a;
    return `<span class="axtag ${isFirst ? "s-a" : "s-b"}">
      <b>${ch}</b>${isFirst ? ax.aName : ax.bName}</span>`;
  }).join("");

  $("#result-match").innerHTML = findMatches(code, secret)
    .map((m) => {
      const t = TYPES[m.code] || { name: "—" };
      const mc = CHARACTERS[m.code];
      return `
      <a class="match" href="types.html#${m.code}" style="background:${groupOf(m.code).band}">
        <span class="match-label">${m.label}</span>
        ${characterSVG(m.code, "char char-sm")}
        <span class="match-code" style="background:${groupOf(m.code).deep}">${m.code}</span>
        <span class="match-name">${mc ? mc.animal : t.name}</span>
        <span class="match-type">${t.name}</span>
        <span class="match-why">${m.why}</span>
      </a>`;
    })
    .join("");

  /* おすすめの山（結果画面のみ。シークレットは専用の3座） */
  const mts = secret
    ? (typeof SECRET_MOUNTAINS !== "undefined" ? SECRET_MOUNTAINS[secret.id] : null)
    : (typeof MOUNTAINS !== "undefined" ? MOUNTAINS[code] : null);

  if (mts && mts.length) {
    $("#result-mountains").innerHTML = mts
      .map((m) => `
        <div class="mt">
          <p class="mt-name">${m.name}${m.note ? '<span class="mt-flag">要注意</span>' : ""}</p>
          ${m.pref ? `<p class="mt-pref">（${m.pref}）</p>` : ""}
          <p class="mt-why">${m.why}</p>
        </div>`)
      .join("");
    const hasNote = mts.some((m) => m.note);
    const noteEl = $("#result-mt-note");
    noteEl.hidden = !hasNote;
    if (hasNote) noteEl.textContent = typeof MOUNTAIN_NOTE !== "undefined" ? MOUNTAIN_NOTE : "";
  }

  $("#result-axes").innerHTML = detail
    .map((d) => {
      const winPct = d.aWins ? d.aPct : d.bPct;
      return `
      <div class="axis">
        <div class="axis-labels">
          <span class="${d.aWins ? "win" : "lose"}">
            ${d.a} ${d.aName}<b>${d.aPct}%</b>
          </span>
          <span class="${d.aWins ? "lose" : "win"}">
            <b>${d.bPct}%</b>${d.bName} ${d.b}
          </span>
        </div>
        <div class="axis-track">
          <div class="axis-bar ${d.aWins ? "side-a" : "side-b"}" style="width:${winPct}%"></div>
        </div>
      </div>`;
    })
    .join("");

  /* ---------- シェア用の文言 ---------- */
  const shareAnimal = secret ? secret.animal : (ch ? ch.animal : type.name);
  const shareType = secret ? secret.typeName : type.name;
  const shareCopy = secret ? secret.copy : type.copy;
  const head = secret ? "【シークレット】" : "";
  const text =
    `${head}私の登山タイプは【${shareAnimal}｜${shareType}】でした！\n` +
    `「${shareCopy}」\n${SHARE_HASHTAG}`;

  $("#btn-share").href =
    "https://twitter.com/intent/tweet?text=" +
    encodeURIComponent(text) + "&url=" + encodeURIComponent(SITE_URL);

  $("#btn-line").href =
    "https://social-plugins.line.me/lineit/share?url=" +
    encodeURIComponent(SITE_URL) + "&text=" + encodeURIComponent(text);

  /* 画像として保存するときに使う情報を控えておく */
  shareData = {
    animal: shareAnimal,
    typeName: shareType,
    copy: shareCopy,
    code,
    secret: !!secret,
    area: g.name,
    item: secret ? SECRET_CHARACTERS[secret.id].item : (ch ? ch.item : ""),
    tags: detail.map((d) => (d.aWins
      ? { l: d.a, n: d.aName } : { l: d.b, n: d.bName })),
    band: g.band,
    deep: secret ? "#A5761F" : g.deep,
    svg: secret ? secretSVG(secret.id, "char") : characterSVG(code, "char"),
  };

  showScreen("result");
  revealResult();

  requestAnimationFrame(() => {
    document.querySelectorAll(".axis-bar").forEach((bar) => {
      const w = bar.style.width;
      bar.style.width = "0%";
      requestAnimationFrame(() => (bar.style.width = w));
    });
  });
}

/* ---------- 結果を順番に見せる ----------
   上から順に少しずつ遅らせて現れるようにする */
function revealResult() {
  const box = document.querySelector(".result");
  if (!box) return;

  const items = [];
  Array.from(box.children).forEach((el) => {
    if (el.id === "result-hero") {
      Array.from(el.children).forEach((h) => {
        if (!h.classList.contains("wave")) items.push(h);
      });
    } else {
      items.push(el);
    }
  });

  box.classList.remove("reveal");
  items.forEach((el, i) => el.style.setProperty("--i", i));
  void box.offsetWidth;   // アニメーションをやり直させる
  box.classList.add("reveal");
}

/* ---------- もう一度 ---------- */
$("#btn-retry").addEventListener("click", () => {
  answers.fill(null);
  currentPage = 0;
  QUIZ = buildQuiz(); // 順番を引き直す
  showScreen("start");
});

/* =========================================================
   結果を画像として保存する
   キャラクターのSVGをそのまま canvas に描くので、
   外部のライブラリは使わない
   ========================================================= */
function drawShareImage() {
  return new Promise((resolve, reject) => {
    if (!shareData) return reject(new Error("結果がありません"));

    const cv = document.getElementById("share-canvas");
    const W = cv.width, H = cv.height;
    const g = cv.getContext("2d");

    g.fillStyle = shareData.band;
    g.fillRect(0, 0, W, H);

    const svg = shareData.svg.replace(
      "<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" '
    );
    const img = new Image();
    img.onload = () => {
      let y = 90;

      // シークレットのときだけ、金色の粒を散らす
      if (shareData.secret) {
        const dots = [
          [90, 150, 26], [990, 120, 20], [140, 620, 22], [960, 560, 26],
          [540, 60, 18], [250, 900, 20], [830, 880, 24], [60, 420, 16], [1020, 360, 18],
        ];
        dots.forEach(([dx, dy, r]) => {
          const gr = g.createRadialGradient(dx, dy, 0, dx, dy, r);
          gr.addColorStop(0, "rgba(240,200,96,.95)");
          gr.addColorStop(1, "rgba(240,200,96,0)");
          g.fillStyle = gr;
          g.beginPath();
          g.arc(dx, dy, r, 0, Math.PI * 2);
          g.fill();
        });
        // 中央から広がる淡い光
        const glow = g.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, W * 0.72);
        glow.addColorStop(0, "rgba(224,163,59,0)");
        glow.addColorStop(1, "rgba(224,163,59,.20)");
        g.fillStyle = glow;
        g.fillRect(0, 0, W, H);
      }

      if (shareData.secret) {
        pill(g, W / 2, y, "SECRET！", 30, "#C98F22", "#4A3410", 26, 700, "Outfit");
        y += 62;
      }
      g.textAlign = "center";
      g.fillStyle = "#7C8A83";
      g.font = '500 26px "Zen Maru Gothic", sans-serif';
      g.fillText("あなたの登山タイプは", W / 2, y + 20);

      // キャラクターと名前を横に並べる
      const top = y + 60;
      g.drawImage(img, 70, top, 420, 420);
      g.textAlign = "left";
      g.fillStyle = "#1E3A31";
      g.font = '900 58px "Zen Maru Gothic", sans-serif';
      g.fillText(shareData.animal, 530, top + 170);
      g.fillStyle = "#7C8A83";
      g.font = '700 27px "Zen Maru Gothic", sans-serif';
      g.fillText(shareData.typeName, 530, top + 216);
      g.fillStyle = "#46708F";
      g.font = '700 30px "Zen Maru Gothic", sans-serif';
      g.fillText("「" + shareData.copy + "」", 530, top + 276);

      // コードと生息エリア
      g.textAlign = "center";
      let cy = top + 470;
      const codeW = shareData.code.length * 24 + 34;
      round(g, W / 2 - codeW - 100, cy - 26, codeW, 46, 10, shareData.deep);
      g.fillStyle = "#fff";
      g.font = '700 24px "Outfit", sans-serif';
      g.fillText(shareData.code, W / 2 - codeW / 2 - 100, cy + 6);
      g.textAlign = "left";
      g.fillStyle = shareData.deep;
      g.font = '900 25px "Zen Maru Gothic", sans-serif';
      g.fillText("生息エリア：" + shareData.area, W / 2 - 80, cy + 6);

      // 4軸タグ
      cy += 82;
      const tags = shareData.tags.map((t) => t.l + " " + t.n);
      let tw = tags.map((t) => t.length * 19 + 46);
      let total = tw.reduce((a, b) => a + b, 0) + 12 * 3;
      let x = (W - total) / 2;
      tags.forEach((t, i) => {
        round(g, x, cy - 26, tw[i], 50, 25, "rgba(255,255,255,.8)");
        g.fillStyle = "#1E3A31";
        g.font = '700 22px "Zen Maru Gothic", sans-serif';
        g.textAlign = "center";
        g.fillText(t, x + tw[i] / 2, cy + 6);
        x += tw[i] + 12;
      });

      // 持ちもの
      cy += 74;
      const it = "持ちもの　" + shareData.item;
      const iw = it.length * 21 + 50;
      round(g, (W - iw) / 2, cy - 26, iw, 50, 25, "rgba(255,255,255,.8)");
      g.fillStyle = "#3d4d46";
      g.font = '700 22px "Zen Maru Gothic", sans-serif';
      g.textAlign = "center";
      g.fillText(it, W / 2, cy + 6);

      g.fillStyle = "#1E3A31";
      g.font = '900 28px "Zen Maru Gothic", sans-serif';
      g.fillText("登山タイプ診断", W / 2, H - 66);
      g.fillStyle = "#9AA8A1";
      g.font = '500 23px "Outfit", sans-serif';
      g.fillText(SITE_URL.replace("https://", ""), W / 2, H - 30);

      resolve(cv);
    };
    img.onerror = () => reject(new Error("画像にできませんでした"));
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

/* 角丸の四角を描く */
function round(g, x, y, w, h, r, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
  g.fill();
}

/* 中央そろえのピル型ラベル */
function pill(g, cx, y, text, h, bg, color, size, weight, family) {
  g.font = `${weight} ${size}px "${family}", sans-serif`;
  const w = g.measureText(text).width + 44;
  round(g, cx - w / 2, y - h / 2, w, h + 12, (h + 12) / 2, bg);
  g.fillStyle = color;
  g.textAlign = "center";
  g.fillText(text, cx, y + 11);
}

document.getElementById("btn-save").addEventListener("click", async () => {
  const btn = document.getElementById("btn-save");
  const label = btn.querySelector("span");
  const before = label.textContent;
  label.textContent = "作成中…";
  try {
    const cv = await drawShareImage();
    const url = cv.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `yamatype_${shareData.code}.png`;
    a.click();
    label.textContent = "保存しました";
  } catch (e) {
    label.textContent = "保存できません";
  }
  setTimeout(() => (label.textContent = before), 2200);
});
