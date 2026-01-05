const tasks = ["5 AM", "VISION", "CYBER", "LPCV", "SABANA", "SEXLESS", "FLOW?"];
const daysToShow = 300; // 300 days

const checkGrid = document.getElementById("checkGrid");
const checkDays = document.getElementById("checkDays");
const checkTasks = document.getElementById("checkTasks");

// obtener storage o crear matriz vacía
let checks = JSON.parse(localStorage.getItem("cvChecks")) || [];

// asegurar estructura
for (let r = 0; r < tasks.length; r++) {
  if (!checks[r]) checks[r] = Array(daysToShow).fill(false);
}

// generar header con días
// limpiar header por las dudas
checkDays.innerHTML = "";

// agregar primera celda vacía para alinear
const emptyTh = document.createElement("th");
emptyTh.className = "w-8"; // ancho similar al nombre de tareas
checkDays.appendChild(emptyTh);

// generar header con días
for (let d = 0; d < daysToShow; d++) {
  const th = document.createElement("th");
  th.className = "text-[10px] opacity-25 text-center";
  th.textContent = daysToShow - d; // 318 → 1
  checkDays.appendChild(th);
}

// generar filas
tasks.forEach((task, r) => {
  const tr = document.createElement("tr");

  // nombre tarea
  const tdTask = document.createElement("td");
  // ---------- estilos tareas ----------
  tdTask.className = "pr-1.5 text-[18px] opacity-50 text-red-500 whitespace-nowrap";
  tdTask.textContent = task;
  tr.appendChild(tdTask);

  // casillas
  for (let d = 0; d < daysToShow; d++) {
    const td = document.createElement("td");
    // ---------- gap de las celdas ----------
    td.className = "p-[2px]"; 

    const cell = document.createElement("div");
    cell.className = "check-cell";
    if (checks[r][d]) cell.classList.add("on");

    cell.addEventListener("click", () => {
      checks[r][d] = !checks[r][d];
      cell.classList.toggle("on");
      localStorage.setItem("cvChecks", JSON.stringify(checks));
    });

    td.appendChild(cell);
    tr.appendChild(td);
  }

  checkTasks.appendChild(tr);
});


// scroll horizontal con rueda del mouse en desktop
const grid = document.getElementById("checkGrid");
let targetScroll = 0;
let isScrolling = false;

// inicializar target
targetScroll = grid.scrollLeft;

function smoothScroll() {
  const diff = targetScroll - grid.scrollLeft;
  if (Math.abs(diff) > 0.5) {
    grid.scrollLeft += diff * 0.2; // factor suavizado
    requestAnimationFrame(smoothScroll);
  } else {
    isScrolling = false;
  }
}

grid.addEventListener("wheel", (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    // invertir dirección → scroll hacia derecha cuando subís la rueda
    targetScroll -= e.deltaY * 0.6; // ajustá *2 para sensibilidad
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(smoothScroll);
    }
  }
}, { passive: false });
