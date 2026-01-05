// objeto que guarda la info de cada timer
const timers = {
  10: { seconds: 10 * 60, interval: null, el: document.getElementById("timer10") },
  20: { seconds: 20 * 60, interval: null, el: document.getElementById("timer20") },
  30: { seconds: 30 * 60, interval: null, el: document.getElementById("timer30") }
};

function renderTimer(minutes) {
  const t = timers[minutes];
  const m = Math.floor(t.seconds / 60);
  const s = t.seconds % 60;
  t.el.textContent = `${m}:${String(s).padStart(2, "0")}`;
}

// start
document.querySelectorAll(".timer-start").forEach(btn => {
  btn.addEventListener("click", () => {
    const minutes = btn.dataset.minutes;
    const t = timers[minutes];

    if (t.interval) return; // evita dobles timers

    t.interval = setInterval(() => {
      if (t.seconds > 0) {
        t.seconds--;
        renderTimer(minutes);
      }
    }, 1000);
  });
});

// pause
document.querySelectorAll(".timer-pause").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const minutes = [10, 20, 30][i];
    clearInterval(timers[minutes].interval);
    timers[minutes].interval = null;
  });
});

// reset
document.querySelectorAll(".timer-reset").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const minutes = [10, 20, 30][i];
    clearInterval(timers[minutes].interval);
    timers[minutes].interval = null;
    timers[minutes].seconds = minutes * 60;
    renderTimer(minutes);
  });
});

// render inicial
renderTimer(10);
renderTimer(20);
renderTimer(30);
