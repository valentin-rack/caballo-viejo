function updateCountdown() {
  const targetDate = new Date("2026-10-22T00:00:00");
  const now = new Date();
  const diff = targetDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("daysCount").innerHTML = `
    <span class="text-6xl opacity-75">${days}d</span>
    <span class="text-4xl opacity-50">${hours}h</span>
    <span class="text-3xl opacity-35">${minutes}m</span>
    <span class="text-2xl opacity-25">${seconds}s</span>
  `;
}

updateCountdown();
setInterval(updateCountdown, 1000);