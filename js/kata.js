const STAR_PATH_D =
  "M28.358 0.690967C28.6574 -0.230344 29.9608 -0.230344 30.2601 0.690967L36.4935 19.8754C36.6274 20.2874 37.0114 20.5664 37.4446 20.5664H57.6163C58.585 20.5664 58.9878 21.806 58.204 22.3754L41.8848 34.232C41.5343 34.4866 41.3877 34.938 41.5215 35.35L47.7549 54.5344C48.0543 55.4557 46.9998 56.2219 46.2161 55.6525L29.8969 43.7958C29.5464 43.5412 29.0718 43.5412 28.7213 43.7958L12.4021 55.6525C11.6184 56.2219 10.5639 55.4557 10.8632 54.5344L17.0966 35.35C17.2305 34.938 17.0838 34.4866 16.7333 34.232L0.414115 22.3754C-0.369598 21.806 0.0331769 20.5664 1.0019 20.5664H21.1736C21.6068 20.5664 21.9908 20.2874 22.1246 19.8754L28.358 0.690967Z";

const katas = [
  { name: "heian nidan", score: 0},
  { name: "heian sandan", score: 0},
  { name: "heian yondan", score: 0},
  { name: "heian godan", score: 0},
  { name: "tekki shodan", score: 0},
  { name: "jion", score: 0},
  { name: "bassai-dai", score: 0},
  { name: "kanku-dai", score: 0},
  { name: "enpi", score: 0},
  { name: "hangetsu", score: 0},
  { name: "gankaku", score: 0},
];

// cargar storage si existe
const saved = JSON.parse(localStorage.getItem("kataScores"));
if (saved) {
  katas.forEach((k, i) => (k.score = saved[i] ?? k.score));
}

const kataList = document.getElementById("kataList");

function makeStarSvg(extraClass) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 59 56");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("kata-star");
  if (extraClass) svg.classList.add(extraClass);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", STAR_PATH_D);
  path.setAttribute("fill", "currentColor");

  svg.appendChild(path);
  return svg;
}

function setStarVisualState(starWrap, score, starIndex) {
  // score: 0..10 en pasos de 0.5
  const fullStars = Math.floor(score); // ej 7.5 => 7
  const hasHalf = score % 1 !== 0;

  starWrap.classList.remove("full", "half", "empty");

  if (starIndex <= fullStars) starWrap.classList.add("full");
  else if (starIndex === fullStars + 1 && hasHalf) starWrap.classList.add("half");
  else starWrap.classList.add("empty");
}

function renderKata(kata) {
  const row = document.createElement("div");
  row.className = "grid grid-cols-[140px_1fr_35px] items-baseline gap-x-5";

  // nombre
  const name = document.createElement("span");
  name.className = "text-[16px] opacity-35 uppercase truncate";
  name.textContent = kata.name;

  // contenedor de estrellas
  const bars = document.createElement("div");
  bars.className = "flex gap-[7px] justify-center";

  // puntaje visual (derecha)
  // --- SCORE (display + input) ---
  const scoreWrap = document.createElement("div");
  scoreWrap.className = "relative w-[48px]"; // un poco más ancho para input

  const scoreDisplay = document.createElement("span");
  scoreDisplay.className =
    "text-[18px] opacity-35 text-left cursor-pointer select-none inline-block w-full";
  scoreDisplay.textContent = kata.score === 10 ? "10" : kata.score.toFixed(1);

  // input inline (tipo wallet)
  const scoreInput = document.createElement("input");
  scoreInput.type = "number";
  scoreInput.step = "0.5";
  scoreInput.min = "0";
  scoreInput.max = "10";
  scoreInput.className =
    "hidden bg-transparent border border-white/10 px-1 py-[2px] rounded text-left text-[18px] w-full outline-none";
  scoreInput.value = kata.score;

  // helper: render número como vos querés
  const formatScore = (v) => (v === 10 ? "10" : v.toFixed(1));

  // helper: clamp + redondeo a 0.5
  function normalizeScore(v) {
    if (Number.isNaN(v)) return kata.score;
    v = Math.max(0, Math.min(10, v));
    // redondear a pasos de 0.5
    v = Math.round(v * 2) / 2;
    return v;
  }

  function updateRowVisual() {
    scoreDisplay.textContent = formatScore(kata.score);
    scoreInput.value = kata.score;

    // actualizar estrellas (sin rerender total)
    for (let j = 1; j <= 10; j++) {
      const wrap = bars.children[j - 1];
      setStarVisualState(wrap, kata.score, j);
    }
  }

  function saveScoreFromInput() {
    const value = normalizeScore(Number(scoreInput.value));
    kata.score = value;

    // persistir
    localStorage.setItem("kataScores", JSON.stringify(katas.map(k => k.score)));

    // cerrar input + actualizar
    scoreInput.classList.add("hidden");
    scoreDisplay.classList.remove("hidden");
    updateRowVisual();
  }

  function openScoreEdit() {
    scoreDisplay.classList.add("hidden");
    scoreInput.classList.remove("hidden");
    scoreInput.value = kata.score;
    scoreInput.focus();
    scoreInput.select();
  }

  // abrir edición al click (igual que wallet)
  scoreDisplay.addEventListener("click", openScoreEdit);

  // guardar al blur o Enter (igual que wallet)
  scoreInput.addEventListener("blur", saveScoreFromInput);
  scoreInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") saveScoreFromInput();
  });

  // opcional: Esc cancela
  scoreInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      scoreInput.classList.add("hidden");
      scoreDisplay.classList.remove("hidden");
    }
  });

  scoreWrap.appendChild(scoreDisplay);
  scoreWrap.appendChild(scoreInput);






  // 10 estrellas
  for (let i = 1; i <= 10; i++) {
    const starWrap = document.createElement("div");
    starWrap.className = "kata-star-wrap";

    // fondo (apagada) + overlay (encendida)
    const emptySvg = makeStarSvg("is-empty");
    const fillSvg = makeStarSvg("is-fill");

    starWrap.appendChild(emptySvg);
    starWrap.appendChild(fillSvg);

    setStarVisualState(starWrap, kata.score, i);

    starWrap.addEventListener("click", () => {
      // trabajamos en steps para mantener tu regla del "borde"
      // steps: 0..20 (0.5 => 1 step)
      const steps = Math.round(kata.score * 2);

      const halfStep = i * 2 - 1; // estrella i al 50% (ej i=8 => 15)
      const fullStep = i * 2;     // estrella i full   (ej i=8 => 16)

      const isFull = steps >= fullStep;
      const isHalf = steps === halfStep;

      // SOLO tocar el borde:
      // - si full: solo la última full (steps == fullStep)
      // - si half: solo esa (steps == halfStep)
      // - si empty: solo la próxima a activar (steps == halfStep-1)
      if (isFull && steps !== fullStep) return;
      if (isHalf && steps !== halfStep) return;
      if (!isFull && !isHalf && steps !== halfStep - 1) return;

      // toggle 0.5:
      if (isFull) kata.score -= 0.5; // full -> half
      else kata.score += 0.5;        // empty->half o half->full

      // clamp seguridad
      if (kata.score < 0) kata.score = 0;
      if (kata.score > 10) kata.score = 10;

      // actualizar número
      updateRowVisual();

      // persistir
      localStorage.setItem("kataScores", JSON.stringify(katas.map(k => k.score)));

      // actualizar visual sin rerender total
      // (solo esta fila)
      for (let j = 1; j <= 10; j++) {
        const wrap = bars.children[j - 1];
        setStarVisualState(wrap, kata.score, j);
      }
    });

    bars.appendChild(starWrap);
  }

  row.appendChild(name);
  row.appendChild(bars);
  row.appendChild(scoreWrap);

  return row;
}

function rerenderKatas() {
  kataList.innerHTML = "";
  katas.forEach(k => kataList.appendChild(renderKata(k)));
}

rerenderKatas();
