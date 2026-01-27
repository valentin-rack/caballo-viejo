// ===============================
// STOPWATCH FACTORY
// ===============================

function createStopwatch({
  storageKey,
  displayId,
  toggleId,
  resetId,
  targetHours
}) {
  const display = document.getElementById(displayId);
  const toggleBtn = document.getElementById(toggleId);
  const resetBtn = document.getElementById(resetId);

  let running = false;
  let startTs = 0;
  let elapsedMs = 0;
  let rafId = null;

  // ---------- persistence ----------
  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify({
      elapsedMs,
      running,
      lastStartEpoch: running ? Date.now() : null
    }));
  }

  function loadState() {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }

  // ---------- ui helpers ----------
  function updateToggleIcon() {
    toggleBtn.textContent = running ? "⏸" : "▶";
  }

  function formatTime(ms) {
    const totalTenths = Math.floor(ms / 100);
    const totalHours = totalTenths / 36000;

    const h = Math.floor(totalTenths / 36000);
    const m = Math.floor((totalTenths % 36000) / 600);
    const s = Math.floor((totalTenths % 600) / 10);
    const t = totalTenths % 10;

    const greenClass = totalHours >= targetHours ? "text-green-500" : "";

    return `
      <span class="text-6xl opacity-50 ${greenClass}">
        ${String(h).padStart(2, "0")}h
      </span>
      <span class="text-5xl opacity-30 ${greenClass}">
        ${String(m).padStart(2, "0")}m
      </span>
      <span class="text-4xl opacity-20 ${greenClass}">
        ${String(s).padStart(2, "0")}.${t}s
      </span>
    `;
  }

  // ---------- render loop ----------
  function render() {
    const now = performance.now();
    const current = running
      ? elapsedMs + (now - startTs)
      : elapsedMs;

    display.innerHTML = formatTime(current);

    if (running) {
      rafId = requestAnimationFrame(render);
    }
  }

  // ---------- actions ----------
  function toggle() {
    if (running) {
      // pause
      running = false;
      elapsedMs += performance.now() - startTs;
      cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      // start
      running = true;
      startTs = performance.now();
      rafId = requestAnimationFrame(render);
    }

    updateToggleIcon();
    saveState();
    display.innerHTML = formatTime(elapsedMs);
  }

  function reset() {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = null;

    elapsedMs = 0;
    startTs = 0;

    localStorage.removeItem(storageKey);
    updateToggleIcon();
    display.innerHTML = formatTime(0);
  }

  // ---------- events ----------
  toggleBtn.addEventListener("click", toggle);
  resetBtn.addEventListener("click", reset);

  // ---------- init ----------
  const saved = loadState();

  if (saved) {
    elapsedMs = saved.elapsedMs || 0;
    running = saved.running || false;

    if (running && saved.lastStartEpoch) {
      elapsedMs += Date.now() - saved.lastStartEpoch;
      startTs = performance.now();
      rafId = requestAnimationFrame(render);
    }
  }

  updateToggleIcon();
  display.innerHTML = formatTime(elapsedMs);
}

// ===============================
// INIT BOTH STOPWATCHES
// ===============================

createStopwatch({
  storageKey: "workTimerState",
  displayId: "timerDisplay-work",
  toggleId: "timerToggle-work",
  resetId: "timerReset-work",
  targetHours: 6
});

createStopwatch({
  storageKey: "uniTimerState",
  displayId: "timerDisplay-uni",
  toggleId: "timerToggle-uni",
  resetId: "timerReset-uni",
  targetHours: 4
});
