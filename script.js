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
  if (typeof SECRETS === "undefined") return list;

  // 端と端に寄りすぎないよう、前半と後半に1問ずつ散らす
  const half = Math.ceil(list.length / 2);
  const slots = [
    1 + Math.floor(Math.random() * (half - 1)),
    half + 1 + Math.floor(Math.random() * (list.length - half - 1)),
  ];
  const picks = SECRETS.map((x) => x.question).sort(() => Math.random() - 0.5);

  const out = list.slice();
  out.splice(slots[1], 0, picks[1]);
  out.splice(slots[0], 0, picks[0]);
  return out;
}

let QUIZ = buildQuiz();
const answers = new Array(QUESTIONS.length).fill(null); // 0〜5（0=A強, 5=B強）
let currentPage = 0;
const totalPages = Math.ceil(QUIZ.length / QUESTIONS_PER_PAGE);

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
   系統ごとに帯を作り、それぞれの淡色を敷く */
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
  const end = Math.min(start + QUESTIONS_PER_PAGE, QUIZ.length);

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
  const pageEnd = Math.min(pageStart + QUESTIONS_PER_PAGE, QUIZ.length);

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
  const end = Math.min(start + QUESTIONS_PER_PAGE, QUIZ.length);
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
  const list = [
    { label: "息が合う相手",     code: flipAxis(code, 2), why: "計画の立て方が逆どうし。抜けを補い合えます" },
    { label: "刺激をくれる相手", code: flipAxis(code, 0), why: "登り方は近いのに、山に求めるものが違います" },
  ];

  if (secret) {
    // シークレットのときは3人目に同じタイプの通常の姿が出る
    list.push({
      label: "相性は文句なし",
      code: code,
      why: "同じ山を選び、同じ場所で足を止めます",
      normal: true,
    });
  } else {
    // 目的と仲間の両方が逆の相手。相手から見てもあなたが出る
    const opposite = flipAxis(flipAxis(code, 0), 1);
    list.push({
      label: "山の見方が正反対の相手",
      code: opposite,
      why: (typeof OPPOSITE_WHY !== "undefined" && OPPOSITE_WHY[code]) || "",
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
function showResult() {
  const { code, detail } = calcResult();
  const type = TYPES[code] || { name: "未知のタイプ", desc: "" };

  const g = groupOf(code);
  const plate = $("#result-code");
  plate.textContent = code;
  plate.style.background = g.deep;
  $("#result-hero").style.background = g.band;
  const grp = $("#result-group");
  grp.textContent = g.name;
  grp.style.color = g.deep;
  const ch = CHARACTERS[code];
  const secret = findSecret(code);

  $("#result-char").innerHTML = secret
    ? secretSVG(secret.id, "char char-lg")
    : characterSVG(code, "char char-lg");
  $("#result-animal").textContent = secret ? secret.animal : (ch ? ch.animal : type.name);
  $("#result-name").textContent = secret ? secret.typeName : type.name;
  $("#secret-badge").hidden = !secret;
  $("#secret-note").hidden = !secret;
  if (secret) $("#secret-note").textContent = secret.note;
  document.querySelector(".result").classList.toggle("is-secret", !!secret);
  const item = secret ? SECRET_CHARACTERS[secret.id].item : (ch ? ch.item : "");
  $("#result-item").innerHTML = item ? `<b>持ちもの</b>${item}` : "";
  $("#result-copy").textContent = "「" + (secret ? secret.copy : type.copy) + "」";
  $("#result-features").textContent = secret ? secret.features : type.features;
  $("#result-caution").textContent = secret ? secret.caution : type.caution;

  // 4軸のタグ（Pピークハント / G系統 …）
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
      <div class="match">
        <a class="match-char" href="types.html#${m.code}" aria-label="${t.name}の紹介を見る">
          ${characterSVG(m.code, "char char-sm")}
        </a>
        <div class="match-body">
          <p class="match-label">${m.label}</p>
          <p class="match-name">
            <span class="match-code" style="background:${groupOf(m.code).deep}">${m.code}</span>
            <a class="match-link" href="types.html#${m.code}">${mc ? mc.animal : t.name}</a>
          </p>
          <p class="match-type">${t.name}</p>
          <p class="match-why">${m.why}</p>
        </div>
      </div>`;
    })
    .join("");

  $("#result-axes").innerHTML = detail
    .map((d) => {
      const winPct = d.aWins ? d.aPct : d.bPct;
      const winName = d.aWins ? d.aName : d.bName;
      const winChar = d.aWins ? d.a : d.b;
      return `
      <div class="axis">
        <div class="axis-labels">
          <span class="${d.aWins ? "" : "lose"}">${d.a} ${d.aName}</span>
          <span class="${d.aWins ? "lose" : ""}">${d.bName} ${d.b}</span>
        </div>
        <div class="axis-track">
          <div class="axis-bar ${d.aWins ? "side-a" : "side-b"}" style="width:${winPct}%"></div>
        </div>
        <p class="axis-pct">${winChar}（${winName}）<b>${winPct}%</b></p>
      </div>`;
    })
    .join("");

  const text = `私の登山タイプは【${code}：${type.name}】でした！ ${SHARE_HASHTAG}`;
  $("#btn-share").href =
    "https://twitter.com/intent/tweet?text=" +
    encodeURIComponent(text) +
    "&url=" +
    encodeURIComponent(SITE_URL);

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
