const STORAGE_KEY = "workTimerState";

function saveTimerState() {
  const data = {
    elapsedMs,
    running: timerRunning,
    lastStartEpoch: timerRunning ? Date.now() : null
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadTimerState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}


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
    <span class="text-6xl opacity-50">${hh}h</span>
    <span class="text-5xl opacity-30">${mm}m</span>
    <span class="text-4xl opacity-20">${ss}.${tenths}s</span>
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
  saveTimerState();

  rafId = requestAnimationFrame(render);
}

function pauseTimer() {
  if (!timerRunning) return;

  timerRunning = false;
  elapsedMs += performance.now() - startTs;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  saveTimerState();
  timerDisplay.innerHTML = formatTime(elapsedMs);
}

function resetTimer() {
  timerRunning = false;

  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  elapsedMs = 0;
  startTs = 0;

  localStorage.removeItem(STORAGE_KEY);
  timerDisplay.innerHTML = formatTime(0);
}

timerStartBtn.addEventListener("click", startTimer);
timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);

// init
function initTimer() {
  const saved = loadTimerState();

  if (saved) {
    elapsedMs = saved.elapsedMs || 0;
    timerRunning = saved.running || false;

    if (timerRunning && saved.lastStartEpoch) {
      const delta = Date.now() - saved.lastStartEpoch;
      elapsedMs += delta;
      startTs = performance.now();
      rafId = requestAnimationFrame(render);
    } else {
      timerDisplay.innerHTML = formatTime(elapsedMs);
    }
  } else {
    resetTimer();
  }
}

initTimer();
