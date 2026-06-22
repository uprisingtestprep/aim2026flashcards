/* AI in Medicine 2026 — Flashcard App */

let allCards    = [];
let activeCards = [];
let current     = 0;
let isFlipped   = false;

const card        = document.getElementById("flashcard");
const qEl         = document.getElementById("card-question");
const aEl         = document.getElementById("card-answer");
const chEl        = document.getElementById("card-chapter");
const chBackEl    = document.getElementById("card-chapter-back");
const counterEl   = document.getElementById("card-counter");
const progressEl  = document.getElementById("progress-text");
const filterEl    = document.getElementById("chapter-filter");
const btnPrev     = document.getElementById("btn-prev");
const btnNext     = document.getElementById("btn-next");
const btnShuffle  = document.getElementById("btn-shuffle");
const btnReset    = document.getElementById("btn-reset");

async function init() {
  try {
    const res  = await fetch("flashcards.json");
    allCards   = await res.json();
    activeCards = [...allCards];
    buildChapterFilter();
    render();
  } catch (e) {
    qEl.textContent = "Error loading flashcards. Please refresh.";
    console.error(e);
  }
}

function buildChapterFilter() {
  const chapters = [...new Set(allCards.map(c => c.chapter))].sort((a, b) => a - b);
  chapters.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = `Chapter ${ch}`;
    filterEl.appendChild(opt);
  });
}

function render() {
  if (!activeCards.length) return;
  const c = activeCards[current];

  isFlipped = false;
  card.classList.remove("flipped");

  qEl.textContent   = c.front;
  aEl.textContent   = c.back;

  const chLabel = `Ch. ${c.chapter}`;
  chEl.textContent     = chLabel;
  chBackEl.textContent = chLabel;

  counterEl.textContent  = `${current + 1} / ${activeCards.length}`;
  progressEl.textContent = `${current + 1} of ${activeCards.length} cards`;

  btnPrev.disabled = current === 0;
  btnNext.disabled = current === activeCards.length - 1;
}

function flip() {
  isFlipped = !isFlipped;
  card.classList.toggle("flipped", isFlipped);
}

function goNext() {
  if (current < activeCards.length - 1) { current++; render(); }
}

function goPrev() {
  if (current > 0) { current--; render(); }
}

function shuffle() {
  const a = [...activeCards];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  activeCards = a;
  current = 0;
  render();
}

function resetOrder() {
  const ch = filterEl.value;
  activeCards = ch === "all" ? [...allCards] : allCards.filter(c => String(c.chapter) === ch);
  current = 0;
  render();
}

// ── Events ────────────────────────────────────────────────────────────────────
card.addEventListener("click", flip);
btnNext.addEventListener("click", goNext);
btnPrev.addEventListener("click", goPrev);
btnShuffle.addEventListener("click", shuffle);
btnReset.addEventListener("click", resetOrder);

filterEl.addEventListener("change", () => {
  resetOrder();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goNext();
  if (e.key === "ArrowLeft")  goPrev();
  if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); flip(); }
});

init();
