// ===== STOPWATCH =====
const timerDisplay = document.getElementById("timerDisplay");
const timerStartBtn = document.getElementById("timerStart");
const timerPauseBtn = document.getElementById("timerPause");
const timerResetBtn = document.getElementById("timerReset");

let timerRunning = false;
let startTs = 0;     // performance.now() cuando arranca
let elapsedMs = 0;   // acumulado cuando está pausado
let rafId = null;

function formatTime(ms) {
  const totalTenths = Math.floor(ms / 100);

  const hours = Math.floor(totalTenths / 36000); // 60*60*10
  const minutes = Math.floor((totalTenths % 36000) / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `
    <span class="text-4xl opacity-50">${hh}h</span>
    <span class="text-3xl opacity-30">${mm}m</span>
    <span class="text-2xl opacity-20">${ss}.${tenths}s</span>
  `;
}

function render() {
  const now = performance.now();
  const current = timerRunning ? elapsedMs + (now - startTs) : elapsedMs;

  timerDisplay.innerHTML = formatTime(current);

  if (timerRunning) rafId = requestAnimationFrame(render);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  startTs = performance.now();
  rafId = requestAnimationFrame(render);
}

function pauseTimer() {
  if (!timerRunning) return;
  timerRunning = false;
  elapsedMs += performance.now() - startTs;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  timerDisplay.innerHTML = formatTime(elapsedMs);
}

function resetTimer() {
  timerRunning = false;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  elapsedMs = 0;
  startTs = 0;

  timerDisplay.innerHTML = formatTime(0);
}

timerStartBtn.addEventListener("click", startTimer);
timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);

// init
resetTimer();
