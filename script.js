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
  track("quiz_start");
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
    track("quiz_page", { page: currentPage + 1 });
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
/* ---------- 計測（Google Analytics） ----------
   gtag が読み込めていない環境でも落ちないようにする */
function track(name, params) {
  if (typeof gtag === "function") gtag("event", name, params || {});
}

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

  // 共有先は、そのタイプの紹介ページ（診断していない人が開いても意味が通る）
  const shareUrl = `${SITE_URL}/types.html?g=${code.slice(0, 2)}#${code}`;

  // 大きなシェアボタン。背景は生息エリアのdeep色に連動させる。押すとモーダルが開く
  const cta = $("#btn-cta");
  if (cta) {
    cta.style.background = g.deep;
    $("#cta-char").innerHTML = secret
      ? secretSVG(secret.id, "char")            // シークレットは情景ごと（円あり）
      : characterSVG(code, "char", true);       // 通常は背景円なし
  }

  // シェア用モーダルの中身も、この結果に合わせて用意しておく
  fillShareModal({ code, g, secret, detail, animal: shareAnimal, typeName: shareType,
                   copy: shareCopy, text, shareUrl });

  track("diagnosis_complete", {
    type_code: code,
    animal: shareAnimal,
    type_name: shareType,
    area: g.name,
    is_secret: secret ? "yes" : "no",
    secret_id: secret ? secret.id : "",
  });

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
  track("quiz_retry");
  answers.fill(null);
  currentPage = 0;
  QUIZ = buildQuiz(); // 順番を引き直す
  showScreen("start");
});


/* =========================================================
   シェア用モーダル（ボトムシート）
   ========================================================= */

/* =========================================================
   シェア用画像（縦長 9:16・確定デザイン）
   モーダルのプレビューとPNG生成の両方でこのSVGを使う
   ========================================================= */
const SHARE_GOLD = "#A5761F";
const SHARE_SUN = "#D99A2E";
const SHARE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

/* キャラクターSVGの中身だけ取り出す（外側のsvgタグを剥がす） */
function svgInner(markup) {
  return markup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
}

function shareImageSVG(d) {
  const g = d.g;
  const deep = g.deep;

  const header = `
    <text x="180" y="32" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="500"
          font-size="9.5" letter-spacing="2.4" fill="${deep}" opacity=".75">16 TYPES OF HIKERS</text>
    <text x="180" y="74" text-anchor="middle" font-family="'Zen Maru Gothic',sans-serif"
          font-size="13.5" font-weight="700" fill="${deep}">あなたの登山タイプは</text>`;

  const ridge = `
    <path d="M0 552 L70 506 L140 546 L215 492 L290 538 L360 508 L360 640 L0 640 Z" fill="${deep}" opacity=".14"/>
    <path d="M0 588 L80 548 L160 582 L240 540 L320 578 L360 562 L360 640 L0 640 Z" fill="${deep}" opacity=".22"/>`;

  const charPart = d.secret
    ? `<g transform="translate(100,84) scale(1.0)">${svgInner(secretSVG(d.secret.id, ""))}</g>`
    : `<g transform="translate(100,84) scale(1.0)">${svgInner(characterSVG(d.code, "", false))}</g>`;

  /* シークレット演出：金の粒とSECRET！リボンだけ */
  const sparkles = d.secret ? [
    [54, 106, 2.6], [302, 98, 2.2], [40, 198, 2.0], [318, 186, 2.6], [180, 92, 1.8],
    [72, 256, 1.8], [294, 250, 2.2], [108, 98, 1.6], [254, 94, 1.6],
  ].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#E4BE6A"/>`).join("") : "";

  const ribbon = d.secret ? `
    <g transform="translate(240 102) rotate(9)">
      <rect x="0" y="0" width="72" height="23" rx="11.5" fill="${SHARE_GOLD}"/>
      <text x="36" y="16" text-anchor="middle" font-family="Outfit,sans-serif"
            font-size="12" font-weight="700" letter-spacing="1.5" fill="#FFF6E2">SECRET！</text>
    </g>` : "";

  const namePart = `
    <text x="180" y="272" text-anchor="middle" font-family="'Zen Maru Gothic',sans-serif"
          font-size="${d.secret ? 24 : 27}" font-weight="900" fill="#1E3A31">${d.animal}</text>
    <text x="180" y="299" text-anchor="middle" font-family="'Zen Maru Gothic',sans-serif"
          font-size="15" font-weight="700" fill="${deep}">${d.typeName}</text>
    <text x="180" y="323" text-anchor="middle" font-family="'Zen Maru Gothic',sans-serif"
          font-size="11" fill="#3d4d46">「${d.copy}」</text>`;

  const chip = `
    <rect x="103" y="336" width="76" height="23" rx="11.5" fill="${deep}"/>
    <text x="141" y="352" text-anchor="middle" font-family="Outfit,sans-serif" font-size="12.5"
          font-weight="700" letter-spacing="2" fill="#fff">${d.code}</text>
    <text x="187" y="352" font-family="'Zen Maru Gothic',sans-serif" font-size="11"
          font-weight="700" fill="${deep}">生息エリア：${g.name}</text>`;

  /* 4軸バー：detailの実%で描く。勝ち側の文字はオーカー、負け側は薄く */
  const bars = d.detail.map((ax, i) => {
    const y = 384 + i * 20;
    const pct = ax.aWins ? ax.aPct : ax.bPct;
    const wFill = 180 * pct / 100;
    return `
      <text x="58" y="${y + 3.5}" text-anchor="end" font-family="'Zen Maru Gothic',sans-serif" font-size="7.6"
            font-weight="${ax.aWins ? 900 : 500}" fill="${ax.aWins ? "#1E3A31" : "#AFBDB6"}">${ax.aName}</text>
      <text x="69" y="${y + 4}" text-anchor="middle" font-family="Outfit,sans-serif" font-size="10.5"
            font-weight="700" fill="${ax.aWins ? SHARE_SUN : "#C6D0CA"}">${ax.a}</text>
      <rect x="80" y="${y - 2.75}" width="180" height="5.5" rx="2.75" fill="#FFFFFF" opacity=".65"/>
      <rect x="${ax.aWins ? 80 : 80 + 180 - wFill}" y="${y - 2.75}" width="${wFill}" height="5.5" rx="2.75"
            fill="${ax.aWins ? "#1E3A31" : "#46708F"}"/>
      <text x="271" y="${y + 4}" text-anchor="middle" font-family="Outfit,sans-serif" font-size="10.5"
            font-weight="700" fill="${ax.aWins ? "#C6D0CA" : SHARE_SUN}">${ax.b}</text>
      <text x="282" y="${y + 3.5}" font-family="'Zen Maru Gothic',sans-serif" font-size="7.6"
            font-weight="${ax.aWins ? 500 : 900}" fill="${ax.aWins ? "#AFBDB6" : "#1E3A31"}">${ax.bName}</text>`;
  }).join("");

  /* 一緒に登ると面白い相手：結果画面と同じ相手を画像＋名前だけで */
  const matchCells = findMatches(d.code, d.secret).map((m, i) => {
    const cx = 76 + i * 104;
    const mc = CHARACTERS[m.code];
    return `
      <circle cx="${cx}" cy="536" r="34" fill="#FFFFFF" opacity=".85"/>
      <g transform="translate(${cx - 27},509) scale(.3375)">${svgInner(characterSVG(m.code, "", false))}</g>
      <text x="${cx}" y="586" text-anchor="middle" font-family="'Zen Maru Gothic',sans-serif"
            font-size="10.5" font-weight="700" fill="#1E3A31">${mc ? mc.animal : m.code}</text>`;
  }).join("");
  const matches = `
    <text x="180" y="490" text-anchor="middle" font-family="'Zen Maru Gothic',sans-serif"
          font-size="12.5" font-weight="900" fill="#1E3A31">一緒に登ると面白い相手</text>
    ${matchCells}`;

  const footer = `
    <text x="180" y="606" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="500"
          font-size="10.5" letter-spacing="1" fill="${deep}">${SHARE_DOMAIN}</text>
    <text x="180" y="622" text-anchor="middle" font-family="'Zen Maru Gothic',sans-serif"
          font-size="9.5" fill="${deep}" opacity=".8">${SHARE_HASHTAG}</text>`;

  return `<svg viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="シェア用画像">
    <rect width="360" height="640" fill="${g.circle}"/>
    ${ridge}${header}${sparkles}${charPart}${ribbon}${namePart}${chip}${bars}${matches}${footer}
  </svg>`;
}

/* =========================================================
   シェア用画像のPNG生成（1080×1920）
   SVGにWebフォントを埋め込んでからcanvasに描く。
   日本語フォントは使う文字だけをGoogle Fontsから取り寄せる（text=）。
   取り寄せに失敗しても、代替フォントでPNG自体は作れるようにする。
   ========================================================= */
let sharePngCache = null;   // { key, blob }

/* 画像内で使う文字を集める（フォントのサブセット指定用） */
function collectShareChars(d) {
  const parts = [
    "16 TYPES OF HIKERS", "あなたの登山タイプは", "SECRET！",
    d.animal, d.typeName, "「" + d.copy + "」", d.code, "生息エリア：" + d.g.name,
    "一緒に登ると面白い相手", SHARE_DOMAIN, SHARE_HASHTAG,
  ];
  d.detail.forEach((ax) => parts.push(ax.aName, ax.bName, ax.a, ax.b));
  findMatches(d.code, d.secret).forEach((m) => {
    const mc = CHARACTERS[m.code];
    parts.push(mc ? mc.animal : m.code);
  });
  return [...new Set(parts.join("").split(""))].join("");
}

/* Google Fontsから、使う文字だけのフォントを取り寄せてCSSにする */
async function buildShareFontCSS(d) {
  const text = encodeURIComponent(collectShareChars(d));
  const cssUrl =
    "https://fonts.googleapis.com/css2" +
    "?family=Zen+Maru+Gothic:wght@400;500;700;900" +
    "&family=Outfit:wght@500;700" +
    `&text=${text}&display=swap`;
  let css = await (await fetch(cssUrl)).text();

  // CSS内のフォントURLを、中身ごと埋め込んだdata:URLに置き換える
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]))];
  for (const u of urls) {
    const buf = await (await fetch(u)).arrayBuffer();
    let bin = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    css = css.split(u).join(`data:font/woff2;base64,${btoa(bin)}`);
  }
  return css;
}

/* SVG → 1080×1920 のPNG Blob */
async function makeSharePNG(d) {
  let fontCSS = "";
  try {
    fontCSS = await buildShareFontCSS(d);
  } catch (e) {
    fontCSS = "";   // フォントが取れなくても代替フォントで続行する
  }

  let svg = shareImageSVG(d);
  svg = svg.replace(
    "<svg ",
    `<svg width="1080" height="1920" `
  );
  if (fontCSS) {
    svg = svg.replace(/(<svg[^>]*>)/, `$1<style>${fontCSS.replace(/</g, "")}</style>`);
  }

  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise((ok, ng) => {
      img.onload = ok;
      img.onerror = () => ng(new Error("svg load error"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    canvas.getContext("2d").drawImage(img, 0, 0, 1080, 1920);
    return await new Promise((ok, ng) =>
      canvas.toBlob((b) => (b ? ok(b) : ng(new Error("png error"))), "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* 生成結果は結果ごとに1回だけ作って使い回す */
async function getSharePNG(d) {
  const key = d.code + (d.secret ? ":" + d.secret.id : "");
  if (sharePngCache && sharePngCache.key === key) return sharePngCache.blob;
  const blob = await makeSharePNG(d);
  sharePngCache = { key, blob };
  return blob;
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* 結果に合わせてモーダルの中身を用意する（showResultから呼ばれる） */
let shareData = null;   // いまの結果。PNG生成やボタンから参照する
function fillShareModal(d) {
  shareData = d;
  sharePngCache = null;   // 結果が変わったら作り直す
  const pv = $("#smodal-pv");
  if (!pv) return;
  pv.innerHTML = shareImageSVG(d);
  $("#sm-x").href =
    "https://twitter.com/intent/tweet?text=" +
    encodeURIComponent(d.text) + "&url=" + encodeURIComponent(d.shareUrl);
  $("#sm-line").href =
    "https://social-plugins.line.me/lineit/share?url=" +
    encodeURIComponent(d.shareUrl) + "&text=" + encodeURIComponent(d.text);
  $("#sm-copy").dataset.url = d.shareUrl;
}

/* 開閉 */
const smodal = document.getElementById("smodal");
function openShareModal() {
  if (!smodal) return;
  smodal.hidden = false;
  // hidden解除の直後だとtransitionが飛ぶので、描画を1フレーム待つ
  requestAnimationFrame(() => requestAnimationFrame(() => smodal.classList.add("open")));
  document.body.style.overflow = "hidden";
  track("share_open", {});
}
function closeShareModal() {
  if (!smodal) return;
  smodal.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => { smodal.hidden = true; }, 260);
}
if (smodal) {
  document.getElementById("btn-cta").addEventListener("click", openShareModal);
  document.getElementById("smodal-veil").addEventListener("click", closeShareModal);
  document.getElementById("smodal-close").addEventListener("click", closeShareModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !smodal.hidden) closeShareModal();
  });
}

/* トースト */
let toastTimer = null;
function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* リンクをコピー */
const smCopy = document.getElementById("sm-copy");
if (smCopy) smCopy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(smCopy.dataset.url || SITE_URL);
    toast("リンクをコピーしました");
  } catch {
    toast("コピーできませんでした");
  }
  track("share_click", { channel: "copy", placement: "modal" });
});

/* 画像をダウンロード */
let shareBusy = false;   // 生成中の連打よけ
async function saveShareImage() {
  if (!shareData || shareBusy) return false;
  shareBusy = true;
  toast("画像を作成しています…");
  try {
    const blob = await getSharePNG(shareData);
    const name = `yamatype_${shareData.code}${shareData.secret ? "_secret" : ""}.png`;
    downloadBlob(blob, name);
    return true;
  } catch (e) {
    toast("画像を作成できませんでした");
    return false;
  } finally {
    shareBusy = false;
  }
}

const smDl = document.getElementById("sm-dl");
if (smDl) smDl.addEventListener("click", async () => {
  if (await saveShareImage()) toast("画像を保存しました");
  track("share_click", { channel: "download", placement: "modal" });
});

/* Instagram：直接投稿はできないので、画像を保存してからアプリを開く */
const smIg = document.getElementById("sm-ig");
if (smIg) smIg.addEventListener("click", async () => {
  const ok = await saveShareImage();
  if (ok) {
    const mobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    if (mobile) {
      toast("画像を保存しました。Instagramを開きます");
      setTimeout(() => { location.href = "instagram://story-camera"; }, 900);
    } else {
      toast("画像を保存しました。Instagramアプリから投稿してください");
    }
  }
  track("share_click", { channel: "instagram", placement: "modal" });
});

/* シェアが押されたときの計測（大ボタンはshare_openで計測） */
[
  ["sm-x", "x", "modal"],
  ["sm-line", "line", "modal"],
].forEach(([id, channel, placement]) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", () => {
    track("share_click", { channel, placement });
  });
});
