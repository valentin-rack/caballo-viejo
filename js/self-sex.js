// ===== GAME FREE STREAK =====

const STREAK_KEY = "gameFreeStreakStart";

// elements
const streakDisplay = document.getElementById("streakDisplay");
const streakStartBtn = document.getElementById("streakStart");
const streakResetBtn = document.getElementById("streakReset");

// state
let streakStartEpoch = null;
let intervalId = null;

// utils
function formatStreak(ms) {
  const totalHours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  const dd = String(days).padStart(2, "0");
  const hh = String(hours).padStart(2, "0");

  return `
    <span class="text-6xl opacity-50">${dd}d</span>
    <span class="text-5xl opacity-30">${hh}h</span>
  `;
}

function renderStreak() {
  if (!streakStartEpoch) return;

  const now = Date.now();
  const elapsed = now - streakStartEpoch;
  streakDisplay.innerHTML = formatStreak(elapsed);
}

// actions
function startStreak() {
  if (streakStartEpoch !== null) return;

  streakStartEpoch = Date.now();
  localStorage.setItem(STREAK_KEY, streakStartEpoch.toString());

  renderStreak();
  intervalId = setInterval(renderStreak, 60 * 1000); // cada minuto
}

function resetStreak() {
  streakStartEpoch = null;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  localStorage.removeItem(STREAK_KEY);

  streakDisplay.innerHTML = `
    <span class="text-6xl">0</span>
    <span class="text-3xl opacity-50">días</span>
    <span class="text-5xl ml-2">0</span>
    <span class="text-2xl opacity-40">h</span>
  `;
}

// listeners
streakStartBtn.addEventListener("click", startStreak);
streakResetBtn.addEventListener("click", resetStreak);

// init
(function initStreak() {
  const saved = localStorage.getItem(STREAK_KEY);

  if (saved) {
    streakStartEpoch = parseInt(saved, 10);
    renderStreak();
    intervalId = setInterval(renderStreak, 60 * 1000);
  }
})();
