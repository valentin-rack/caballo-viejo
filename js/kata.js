const katas = [
  { name: "heian nidan", score: 8 },
  { name: "heian sandan", score: 9 },
  { name: "heian yondan", score: 8 },
  { name: "heian godan", score: 10 },
  { name: "tekki shodan", score: 10 },
  { name: "jion", score: 7.5 },
  { name: "bassai-dai", score: 8 },
  { name: "kanku-dai", score: 9 },
  { name: "enpi", score: 6 },
  { name: "hangetsu", score: 8 },
  { name: "gankaku", score: 10 },
];

// cargar storage si existe
const saved = JSON.parse(localStorage.getItem("kataScores"));
if (saved) {
  katas.forEach((k, i) => k.score = saved[i] ?? k.score);
}

const kataList = document.getElementById("kataList");


function renderKata(kata, index) {
  const row = document.createElement("div");
  row.className = "flex items-center gap-5";

  // nombre
  const name = document.createElement("span");
  name.className = "text-[12px] opacity-35 min-w-[90px]";
  name.textContent = kata.name;

  // contenedor de celdas
  const bars = document.createElement("div");
  bars.className = "flex gap-[2px] flex-1 max-w-[750px]";

  // generar 20 barritas
  for (let i = 1; i <= 20; i++) {
    const cell = document.createElement("div");
    cell.className = "kata-cell";

    if (kata.score * 2 >= i) cell.classList.add("on"); // score está en pasos de 0.5

    cell.addEventListener("click", () => {
      const cellIndex = i; // 1–20
      const isActive = cell.classList.contains("on");
      const totalActive = Math.round(kata.score * 2); // cantidad actual de celdas ON

      // 👉 REGLA 1: sólo modificar la última consecutiva
      if (isActive && cellIndex !== totalActive) return;
      if (!isActive && cellIndex !== totalActive + 1) return;
      cell.classList.toggle("on");
      kata.score = isActive ? kata.score - 0.5 : kata.score + 0.5;

      // 👉 REGLA 2: formateo elegante
      score.textContent = kata.score === 10 ? "10" : kata.score.toFixed(1);
      localStorage.setItem("kataScores", JSON.stringify(katas.map(k => k.score)));
    });

    bars.appendChild(cell);
  }

  // puntaje visual
  const score = document.createElement("span");
  score.className = "text-[12px] opacity-35 w-8 text-left";

  const initialTotalActive = Math.round(kata.score * 2);
  score.textContent = initialTotalActive === 20
    ? "10"
    : (initialTotalActive / 2).toFixed(1);
    
  row.appendChild(name);
  row.appendChild(bars);
  row.appendChild(score);

  return row;
}


function rerenderKatas() {
  kataList.innerHTML = "";
  katas.forEach((k, i) => kataList.appendChild(renderKata(k, i)));
}

rerenderKatas();
