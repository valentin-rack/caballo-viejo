let pomoSeconds = 60 * 60; // 60 minutos
let pomoInterval = null;

const pomoDisplay = document.getElementById("pomoDisplay");
const pomoStart = document.getElementById("pomoStart");
const pomoPause = document.getElementById("pomoPause");
const pomoReset = document.getElementById("pomoReset");

function renderPomodoro() {
  const m = Math.floor(pomoSeconds / 60);
  const s = pomoSeconds % 60;
  pomoDisplay.textContent = `${m}:${String(s).padStart(2, "0")}`;
}

// start
pomoStart.addEventListener("click", () => {
  if (pomoInterval) return; // evita múltiples timers

  pomoInterval = setInterval(() => {
    if (pomoSeconds > 0) {
      pomoSeconds--;
      renderPomodoro();
    }
  }, 1000);
});

// pause
pomoPause.addEventListener("click", () => {
  clearInterval(pomoInterval);
  pomoInterval = null;
});

// reset
pomoReset.addEventListener("click", () => {
  clearInterval(pomoInterval);
  pomoInterval = null;
  pomoSeconds = 60 * 60;
  renderPomodoro();
});

// render inicial
renderPomodoro();
