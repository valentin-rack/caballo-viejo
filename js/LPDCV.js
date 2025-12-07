const phases = [
  { name: "Pantano", seconds: 30, sound: "pantano.mp3" },
  { name: "Relámpago", seconds: 60, sound: "relampago.mp3" },
  { name: "Estrella", seconds: 90, sound: "estrella.mp3" }
];

let currentPhase = 0;
let timeLeft = phases[0].seconds;
let cvInterval = null;

const cvPhase = document.getElementById("cvPhase");
const cvDisplay = document.getElementById("cvDisplay");
const cvStart = document.getElementById("cvStart");

function renderCV() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  cvDisplay.textContent = `${m}:${String(s).padStart(2, "0")}`;
  cvPhase.textContent = phases[currentPhase].name;
}

function playSound(src) {
  new Audio(`/sounds/${src}`).play();
}

function nextPhase() {
  currentPhase++;
  if (currentPhase < phases.length) {
    timeLeft = phases[currentPhase].seconds;
    playSound(phases[currentPhase].sound);
  } else {
    clearInterval(cvInterval);
    cvInterval = null;
    currentPhase = 0;
    timeLeft = phases[0].seconds;
    renderCV();
    return;
  }
}

cvStart.addEventListener("click", () => {
  if (cvInterval) return;

  playSound(phases[0].sound);

  cvInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      renderCV();
    } else {
      nextPhase();
    }
  }, 1000);
});

renderCV();